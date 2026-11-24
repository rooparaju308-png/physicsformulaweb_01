import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Award,
  BookOpenCheck,
  CheckCircle2,
  Flame,
  Radar as RadarIcon,
  RotateCcw,
  ShieldAlert,
  Trash2,
  XCircle,
} from 'lucide-react';
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { ChecklistItem, MistakeEntry, MistakeErrorType } from '../types/physics';
import { FORMULAS } from '../data/formulas';

interface MistakeNotebookPanelProps {
  mistakes: MistakeEntry[];
  knownIds: string[];
  checklist: ChecklistItem[];
  onUpdateErrorType: (id: string, errorType: MistakeErrorType) => void;
  onToggleResolved: (id: string) => void;
  onDeleteMistake: (id: string) => void;
  onJumpToFormula: (formulaId: string) => void;
  onReviewCard?: (formulaId: string, known: boolean) => void;
}

const ERROR_TYPE_META: {
  id: MistakeErrorType;
  label: string;
  shortLabel: string;
  badgeClass: string;
}[] = [
  {
    id: 'formula-forgotten',
    label: 'Formula Forgotten',
    shortLabel: 'Formula',
    badgeClass: 'border-violet-500/35 bg-violet-500/10 text-violet-700 dark:text-violet-300',
  },
  {
    id: 'sign-trap',
    label: 'Sign / Vector Trap',
    shortLabel: 'Sign Trap',
    badgeClass: 'border-amber-500/35 bg-amber-500/10 text-amber-700 dark:text-amber-300',
  },
  {
    id: 'calculation-slip',
    label: 'Calculation Slip',
    shortLabel: 'Calc Slip',
    badgeClass: 'border-cyan-500/35 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300',
  },
  {
    id: 'concept-gap',
    label: 'Concept Gap',
    shortLabel: 'Concept',
    badgeClass: 'border-rose-500/35 bg-rose-500/10 text-rose-700 dark:text-rose-300',
  },
];

const RADAR_BUCKETS: { id: string; label: string; chapters: string[] }[] = [
  { id: 'elec', label: 'Electrostatics', chapters: ['electrostatics', 'line-arc-ring', 'master-map'] },
  { id: 'curr', label: 'Current & RC', chapters: ['current'] },
  { id: 'mag', label: 'Mag & EMI', chapters: ['magnetism', 'emi'] },
  { id: 'ac', label: 'AC & EM', chapters: ['ac', 'em-waves'] },
  { id: 'opt', label: 'Optics', chapters: ['ray-optics', 'wave-optics'] },
  { id: 'mod', label: 'Modern & Semi', chapters: ['modern-physics', 'semiconductors', 'experimental-skills'] },
  {
    id: 'mech',
    label: 'Class 11 Mech/Therm',
    chapters: [
      'c11-units-and-measurement',
      'c11-motion-in-a-straight-line',
      'c11-motion-in-a-plane',
      'c11-laws-of-motion',
      'c11-work-energy-and-power',
      'c11-system-of-particles-and-rotational-motion',
      'c11-gravitation',
      'c11-mechanical-properties-of-solids',
      'c11-mechanical-properties-of-fluids',
      'c11-thermal-properties-of-matter',
      'c11-thermodynamics',
      'c11-kinetic-theory',
      'c11-oscillations',
      'c11-waves',
    ],
  },
];

function chapterMatchesBucket(ch: string, bucket: (typeof RADAR_BUCKETS)[number]): boolean {
  const lc = ch.toLowerCase();
  if (bucket.chapters.includes(lc)) return true;
  if (bucket.id === 'elec' && (lc.includes('electro') || lc.includes('capacit'))) return true;
  if (bucket.id === 'curr' && lc.includes('current')) return true;
  if (bucket.id === 'mag' && (lc.includes('magnet') || lc.includes('emi') || lc.includes('induc'))) return true;
  if (bucket.id === 'ac' && (lc.includes('alternating') || lc.includes('em wave'))) return true;
  if (bucket.id === 'opt' && lc.includes('optic')) return true;
  if (bucket.id === 'mod' && (lc.includes('modern') || lc.includes('atom') || lc.includes('nucle') || lc.includes('semi') || lc.includes('dual'))) return true;
  if (bucket.id === 'mech' && (lc.startsWith('c11-') || lc.includes('rotat') || lc.includes('thermo') || lc.includes('grav') || lc.includes('fluid') || lc.includes('wave') || lc.includes('shm'))) return true;
  return false;
}

export const MistakeNotebookPanel: React.FC<MistakeNotebookPanelProps> = ({
  mistakes,
  knownIds,
  checklist,
  onUpdateErrorType,
  onToggleResolved,
  onDeleteMistake,
  onJumpToFormula,
  onReviewCard,
}) => {
  const [errorFilter, setErrorFilter] = useState<'all' | MistakeErrorType>('all');
  const [statusFilter, setStatusFilter] = useState<'open' | 'resolved' | 'all'>('open');

  // Clear Backlog Micro-Quiz state
  const [quizDeck, setQuizDeck] = useState<MistakeEntry[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizActive, setQuizActive] = useState(false);
  const [chosenOpt, setChosenOpt] = useState<number | null>(null);
  const [clearedCount, setClearedCount] = useState(0);

  const openMistakes = useMemo(() => mistakes.filter((m) => !m.resolved), [mistakes]);
  const resolvedMistakes = useMemo(() => mistakes.filter((m) => m.resolved), [mistakes]);
  const mcqBacklog = useMemo(
    () => openMistakes.filter((m) => m.options && m.options.length > 0 && m.correctIndex !== undefined),
    [openMistakes]
  );

  const filteredMistakes = useMemo(() => {
    return mistakes.filter((m) => {
      if (statusFilter === 'open' && m.resolved) return false;
      if (statusFilter === 'resolved' && !m.resolved) return false;
      if (errorFilter !== 'all' && m.errorType !== errorFilter) return false;
      return true;
    });
  }, [mistakes, statusFilter, errorFilter]);

  // Weak-Topic Radar data (combines open mistake density + unmastered formula gap)
  const radarData = useMemo(() => {
    return RADAR_BUCKETS.map((b) => {
      const bucketFormulas = FORMULAS.filter((f) => b.chapters.includes(f.chapter));
      const unknownRatio =
        bucketFormulas.length > 0
          ? bucketFormulas.filter((f) => !knownIds.includes(f.id)).length / bucketFormulas.length
          : 0.5;
      const bucketOpenMistakes = openMistakes.filter((m) => chapterMatchesBucket(m.chapter, b));
      const missWeight = bucketOpenMistakes.reduce((s, m) => s + m.missCount, 0);
      const bucketChecklist = checklist.filter((c) => b.chapters.includes(String(c.chapter)));
      const incompleteRatio =
        bucketChecklist.length > 0
          ? bucketChecklist.filter((c) => !c.stages.pyqsSolved).length / bucketChecklist.length
          : 0.4;

      const weaknessScore = Math.min(
        100,
        Math.round(unknownRatio * 40 + incompleteRatio * 25 + Math.min(35, missWeight * 12))
      );
      return {
        domain: b.label,
        weakness: weaknessScore,
        openMistakes: bucketOpenMistakes.length,
      };
    });
  }, [knownIds, openMistakes, checklist]);

  const weakestDomain = useMemo(() => {
    return [...radarData].sort((a, b) => b.weakness - a.weakness)[0];
  }, [radarData]);

  const startBacklogQuiz = () => {
    if (mcqBacklog.length === 0) return;
    setQuizDeck(mcqBacklog.slice(0, 10));
    setQuizIndex(0);
    setChosenOpt(null);
    setClearedCount(0);
    setQuizActive(true);
  };

  const currentQuizItem = quizDeck[quizIndex];

  const handleChooseQuizOpt = (optIdx: number) => {
    if (!currentQuizItem || chosenOpt !== null) return;
    setChosenOpt(optIdx);
    const isCorrect = optIdx === currentQuizItem.correctIndex;
    if (currentQuizItem.formulaId && onReviewCard) {
      onReviewCard(currentQuizItem.formulaId, isCorrect);
    }
    if (isCorrect) {
      setClearedCount((c) => c + 1);
      if (!currentQuizItem.resolved) {
        onToggleResolved(currentQuizItem.id);
      }
    }
  };

  if (quizActive) {
    const done = quizIndex >= quizDeck.length;
    if (done) {
      return (
        <div className="rounded-2xl border studio-surface p-6 max-w-2xl mx-auto space-y-4 text-center">
          <Award className="h-10 w-10 text-emerald-500 mx-auto" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Backlog Sprint Complete
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            You resolved <strong className="text-emerald-500">{clearedCount}</strong> out of{' '}
            <strong>{quizDeck.length}</strong> tricky mistakes and synced them to spaced repetition.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setQuizActive(false)}
              className="min-h-[42px] px-5 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold"
            >
              Return to Mistake Notebook
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-200 tabular-nums">
            Backlog Retake {quizIndex + 1} / {quizDeck.length}
          </span>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-emerald-600 dark:text-emerald-300 tabular-nums">
              Cleared: {clearedCount}
            </span>
            <button
              type="button"
              onClick={() => setQuizActive(false)}
              className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 font-semibold"
            >
              Exit
            </button>
          </div>
        </div>

        <div className="rounded-2xl border studio-surface p-5 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-rose-500">
              Missed {currentQuizItem.missCount}× · {currentQuizItem.chapter}
            </span>
            <span>{ERROR_TYPE_META.find((e) => e.id === currentQuizItem.errorType)?.label}</span>
          </div>

          <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">
            {currentQuizItem.prompt}
          </h3>

          <div className="space-y-2">
            {currentQuizItem.options?.map((opt, oi) => {
              const answered = chosenOpt !== null;
              const isChosen = chosenOpt === oi;
              const isRight = oi === currentQuizItem.correctIndex;
              let cls =
                'border-slate-200 dark:border-slate-800 studio-surface-subtle text-slate-800 dark:text-slate-200 hover:border-cyan-400';
              if (answered) {
                if (isRight) {
                  cls = 'border-emerald-500 bg-emerald-500/15 text-emerald-800 dark:text-emerald-200 font-semibold';
                } else if (isChosen) {
                  cls = 'border-rose-500 bg-rose-500/15 text-rose-800 dark:text-rose-200';
                } else {
                  cls = 'border-slate-200/60 dark:border-slate-800/60 opacity-55';
                }
              }
              return (
                <button
                  key={oi}
                  type="button"
                  disabled={answered}
                  onClick={() => handleChooseQuizOpt(oi)}
                  className={`w-full min-h-[46px] px-4 py-2.5 rounded-xl border text-left text-xs sm:text-sm flex items-center justify-between gap-2 transition-colors ${cls}`}
                >
                  <span>
                    <span className="font-mono mr-2 text-slate-400">{String.fromCharCode(65 + oi)}.</span>
                    {opt}
                  </span>
                  {answered && isRight && <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />}
                  {answered && isChosen && !isRight && <XCircle className="h-4 w-4 text-rose-500 shrink-0" />}
                </button>
              );
            })}
          </div>

          {chosenOpt !== null && (
            <div className="rounded-xl studio-surface-subtle border p-3.5 space-y-2.5">
              {currentQuizItem.explanation && (
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                  <strong>Explanation:</strong> {currentQuizItem.explanation}
                </p>
              )}
              <div className="flex flex-wrap items-center justify-between gap-2">
                {currentQuizItem.formulaId ? (
                  <button
                    type="button"
                    onClick={() => onJumpToFormula(currentQuizItem.formulaId!)}
                    className="min-h-[38px] px-3 rounded-lg border border-cyan-500/35 bg-cyan-500/10 text-xs font-semibold text-cyan-700 dark:text-cyan-300"
                  >
                    Inspect Linked Formula
                  </button>
                ) : (
                  <span />
                )}
                <button
                  type="button"
                  onClick={() => {
                    setQuizIndex((i) => i + 1);
                    setChosenOpt(null);
                  }}
                  className="min-h-[40px] px-4 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <span>{quizIndex + 1 >= quizDeck.length ? 'Finish Retake' : 'Next Mistake'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Top Overview + Weak-Topic Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Weak-Topic Radar Chart */}
        <div className="lg:col-span-6 rounded-2xl border studio-surface p-4 sm:p-5 flex flex-col justify-between space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-600 dark:text-cyan-300">
                <RadarIcon className="h-4 w-4" />
                <span>Weak-Topic Radar (Mistakes + Mastery Gaps)</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {weakestDomain ? `Priority Area: ${weakestDomain.domain}` : 'Physics Domain Risk'}
              </h3>
            </div>
            {weakestDomain && (
              <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-300 tabular-nums">
                Risk {weakestDomain.weakness}%
              </span>
            )}
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="72%" data={radarData}>
                <PolarGrid stroke="#475569" strokeOpacity={0.35} />
                <PolarAngleAxis dataKey="domain" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Weakness Index"
                  dataKey="weakness"
                  stroke="#f43f5e"
                  fill="#f43f5e"
                  fillOpacity={0.28}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Stats & Clear Backlog CTA */}
        <div className="lg:col-span-6 rounded-2xl border studio-surface p-4 sm:p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-300">
              <ShieldAlert className="h-4 w-4" />
              <span>Smart Mistake Notebook</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Turn Wrong Answers Into Free Marks
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Wrong answers from Rapid Sprint and Mock Tests land here automatically. Flag tricky formulas anywhere in the app, classify why you missed them, and drill them down to zero.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="rounded-xl studio-surface-subtle border p-3">
              <div className="text-xl font-bold font-mono text-rose-500 tabular-nums">{openMistakes.length}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Open Backlog</div>
            </div>
            <div className="rounded-xl studio-surface-subtle border p-3">
              <div className="text-xl font-bold font-mono text-emerald-500 tabular-nums">{resolvedMistakes.length}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Resolved</div>
            </div>
            <div className="rounded-xl studio-surface-subtle border p-3">
              <div className="text-xl font-bold font-mono text-amber-500 tabular-nums">
                {mistakes.reduce((s, m) => s + m.missCount, 0)}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Total Misses</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={mcqBacklog.length === 0}
              onClick={startBacklogQuiz}
              className="min-h-[44px] px-5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-slate-950 text-xs font-bold inline-flex items-center gap-2 disabled:opacity-40 cursor-pointer"
            >
              <Flame className="h-4 w-4" />
              <span>Clear Backlog Micro-Quiz ({mcqBacklog.length} Qs)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border studio-surface p-3.5 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-1.5">
          {([
            { id: 'open', label: `Open (${openMistakes.length})` },
            { id: 'resolved', label: `Resolved (${resolvedMistakes.length})` },
            { id: 'all', label: `All (${mistakes.length})` },
          ] as const).map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setStatusFilter(s.id)}
              className={`min-h-[36px] px-3 rounded-xl text-xs font-semibold border transition-colors ${
                statusFilter === s.id
                  ? 'border-cyan-400 bg-cyan-500/15 text-cyan-700 dark:text-cyan-200'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setErrorFilter('all')}
            className={`min-h-[36px] px-3 rounded-xl text-xs font-medium border transition-colors ${
              errorFilter === 'all'
                ? 'border-violet-400 bg-violet-500/15 text-violet-700 dark:text-violet-200'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            All Error Types
          </button>
          {ERROR_TYPE_META.map((et) => (
            <button
              key={et.id}
              type="button"
              onClick={() => setErrorFilter(et.id)}
              className={`min-h-[36px] px-3 rounded-xl text-xs font-medium border transition-colors ${
                errorFilter === et.id
                  ? et.badgeClass
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {et.shortLabel}
            </button>
          ))}
        </div>
      </div>

      {/* Entries List */}
      {filteredMistakes.length === 0 ? (
        <div className="rounded-2xl border border-dashed studio-surface p-8 text-center space-y-2">
          <BookOpenCheck className="h-8 w-8 text-emerald-500 mx-auto" />
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {mistakes.length === 0
              ? 'No mistakes logged yet!'
              : 'No mistakes match the selected filter.'}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Attempt a Rapid-Fire Sprint, Mock Test, or click the Flag button on any Formula Card to track weak spots here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMistakes.map((entry) => {
            const errMeta = ERROR_TYPE_META.find((e) => e.id === entry.errorType) ?? ERROR_TYPE_META[3];
            return (
              <div
                key={entry.id}
                className={`rounded-2xl border p-4 space-y-3 ${
                  entry.resolved
                    ? 'border-emerald-500/25 studio-surface opacity-80'
                    : 'studio-surface'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-[11px]">
                      <span className="px-2 py-0.5 rounded-md font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {entry.source.toUpperCase()} · {entry.chapter}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md font-semibold border ${errMeta.badgeClass}`}>
                        {errMeta.label}
                      </span>
                      <span className="font-mono text-rose-500 font-bold tabular-nums">
                        Missed {entry.missCount}×
                      </span>
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                      {entry.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {entry.prompt}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <select
                      aria-label="Classify error type"
                      value={entry.errorType}
                      onChange={(e) =>
                        onUpdateErrorType(entry.id, e.target.value as MistakeErrorType)
                      }
                      className="min-h-[36px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 text-xs font-medium text-slate-700 dark:text-slate-200"
                    >
                      {ERROR_TYPE_META.map((et) => (
                        <option key={et.id} value={et.id}>
                          {et.label}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => onToggleResolved(entry.id)}
                      className={`min-h-[36px] px-3 rounded-xl text-xs font-semibold inline-flex items-center gap-1 border transition-colors ${
                        entry.resolved
                          ? 'border-emerald-500/35 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-emerald-400'
                      }`}
                    >
                      {entry.resolved ? (
                        <>
                          <RotateCcw className="h-3.5 w-3.5" />
                          <span>Reopen</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Resolve</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteMistake(entry.id)}
                      aria-label="Delete mistake entry"
                      className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {entry.explanation && (
                  <div className="rounded-xl studio-surface-subtle border px-3 py-2 text-xs text-slate-600 dark:text-slate-300">
                    <strong>Fix / Safe rule:</strong> {entry.explanation}
                  </div>
                )}

                {entry.formulaId && (
                  <button
                    type="button"
                    onClick={() => onJumpToFormula(entry.formulaId!)}
                    className="text-xs font-semibold text-cyan-600 dark:text-cyan-300 hover:underline inline-flex items-center gap-1"
                  >
                    <span>Inspect Linked Formula Card</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
