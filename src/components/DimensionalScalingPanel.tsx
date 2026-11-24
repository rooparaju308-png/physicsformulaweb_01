import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Clock,
  Lightbulb,
  RotateCcw,
  Sliders,
  Timer,
  XCircle,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  DIMENSIONAL_DRILLS,
  SCALING_SANDBOX_PRESETS,
} from '../data/dimensionalAndScaling';
import { MathBlock } from './MathBlock';

interface DimensionalScalingPanelProps {
  onJumpToFormula: (formulaId: string) => void;
  onLogDimensionalMistake?: (drillId: string, prompt: string, explanation: string, formulaId: string, topic: string, options: string[], correctIndex: number) => void;
}

export const DimensionalScalingPanel: React.FC<DimensionalScalingPanelProps> = ({
  onJumpToFormula,
  onLogDimensionalMistake,
}) => {
  const [subMode, setSubMode] = useState<'dimensional' | 'scaling'>('dimensional');

  // Dimensional Drill State
  const [drillIdx, setDrillIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [timedMode, setTimedMode] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [attempted, setAttempted] = useState(0);

  const currentDrill = DIMENSIONAL_DRILLS[drillIdx % DIMENSIONAL_DRILLS.length];

  useEffect(() => {
    if (subMode !== 'dimensional' || !timedMode || selectedOpt !== null) return;
    if (secondsLeft <= 0) return;
    const id = window.setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [subMode, timedMode, selectedOpt, secondsLeft]);

  const handleAnswerDrill = (optIdx: number) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(optIdx);
    setAttempted((a) => a + 1);
    const isCorrect = optIdx === currentDrill.correctIndex;
    if (isCorrect) {
      setScore((s) => s + 1);
    } else if (onLogDimensionalMistake) {
      onLogDimensionalMistake(
        currentDrill.id,
        currentDrill.prompt,
        `${currentDrill.dimensionBreakdown} ${currentDrill.explanation}`,
        currentDrill.formulaId,
        currentDrill.topic,
        currentDrill.options,
        currentDrill.correctIndex
      );
    }
  };

  const handleNextDrill = () => {
    setDrillIdx((i) => (i + 1) % DIMENSIONAL_DRILLS.length);
    setSelectedOpt(null);
    setSecondsLeft(30);
  };

  // Scaling Sandbox State
  const [selectedPresetId, setSelectedPresetId] = useState(SCALING_SANDBOX_PRESETS[0].id);
  const activePreset = useMemo(
    () =>
      SCALING_SANDBOX_PRESETS.find((p) => p.id === selectedPresetId) ??
      SCALING_SANDBOX_PRESETS[0],
    [selectedPresetId]
  );

  const [multValues, setMultValues] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    for (const p of SCALING_SANDBOX_PRESETS[0].params) {
      init[p.id] = p.defaultMult;
    }
    return init;
  });

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const preset = SCALING_SANDBOX_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      const next: Record<string, number> = {};
      for (const p of preset.params) {
        next[p.id] = p.defaultMult;
      }
      setMultValues(next);
    }
  };

  const resetScaling = () => {
    const next: Record<string, number> = {};
    for (const p of activePreset.params) {
      next[p.id] = 1;
    }
    setMultValues(next);
  };

  const ratioResult = useMemo(() => {
    if (activePreset.customRatio) {
      return activePreset.customRatio(multValues);
    }
    let ratio = 1;
    for (const p of activePreset.params) {
      const v = multValues[p.id] ?? p.defaultMult;
      ratio *= Math.pow(v, p.power);
    }
    return ratio;
  }, [activePreset, multValues]);

  const pctChange = (ratioResult - 1) * 100;
  const chartData = [
    { label: 'Original (1×)', value: 1 },
    { label: 'New Scaled', value: Number(ratioResult.toFixed(3)) },
  ];

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* Sub-mode switcher */}
      <div className="rounded-2xl border studio-surface p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="inline-flex rounded-xl studio-surface-subtle border p-1 gap-1 self-start">
          <button
            type="button"
            onClick={() => setSubMode('dimensional')}
            className={`min-h-[38px] px-3.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-colors ${
              subMode === 'dimensional'
                ? 'bg-cyan-500 text-slate-950'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Timer className="h-4 w-4" />
            <span>Dimensional Analysis Drills ({DIMENSIONAL_DRILLS.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setSubMode('scaling')}
            className={`min-h-[38px] px-3.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-colors ${
              subMode === 'scaling'
                ? 'bg-violet-500 text-white'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Sliders className="h-4 w-4" />
            <span>Proportionality &amp; Scaling Sandbox ({SCALING_SANDBOX_PRESETS.length})</span>
          </button>
        </div>

        {subMode === 'dimensional' && (
          <div className="flex items-center gap-3 text-xs tabular-nums">
            <span className="font-semibold text-emerald-600 dark:text-emerald-300">
              Score: {score} / {attempted}
            </span>
            <button
              type="button"
              onClick={() => {
                setTimedMode((t) => !t);
                setSecondsLeft(30);
              }}
              className={`min-h-[34px] px-3 rounded-lg border font-semibold inline-flex items-center gap-1.5 ${
                timedMode
                  ? 'border-amber-400 bg-amber-500/15 text-amber-700 dark:text-amber-300'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              <span>{timedMode ? `30s Timer: ${secondsLeft}s` : 'Untimed Mode'}</span>
            </button>
          </div>
        )}
      </div>

      {subMode === 'dimensional' ? (
        <div className="rounded-2xl border studio-surface p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 font-semibold">
              Drill {(drillIdx % DIMENSIONAL_DRILLS.length) + 1} / {DIMENSIONAL_DRILLS.length} · {currentDrill.topic}
            </span>
            {timedMode && secondsLeft === 0 && selectedOpt === null && (
              <span className="font-bold text-rose-500">Time up! Pick an option to reveal dimensions.</span>
            )}
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
            {currentDrill.prompt}
          </h3>

          <div className="space-y-2">
            {currentDrill.options.map((opt, oi) => {
              const answered = selectedOpt !== null;
              const isChosen = selectedOpt === oi;
              const isRight = oi === currentDrill.correctIndex;
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
                  onClick={() => handleAnswerDrill(oi)}
                  className={`w-full min-h-[46px] px-4 py-2.5 rounded-xl border text-left text-xs sm:text-sm font-mono flex items-center justify-between gap-2 transition-colors ${cls}`}
                >
                  <span>
                    <span className="mr-2 text-slate-400">{String.fromCharCode(65 + oi)}.</span>
                    {opt}
                  </span>
                  {answered && isRight && <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />}
                  {answered && isChosen && !isRight && <XCircle className="h-4 w-4 text-rose-500 shrink-0" />}
                </button>
              );
            })}
          </div>

          {selectedOpt !== null && (
            <div className="rounded-xl studio-surface-subtle border p-4 space-y-2.5">
              <div className="text-xs font-mono font-semibold text-cyan-700 dark:text-cyan-300">
                [M L T A] Check: {currentDrill.dimensionBreakdown}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                {currentDrill.explanation}
              </p>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onJumpToFormula(currentDrill.formulaId)}
                  className="min-h-[38px] px-3 rounded-lg border border-cyan-500/35 bg-cyan-500/10 text-xs font-semibold text-cyan-700 dark:text-cyan-300"
                >
                  Inspect Linked Formula
                </button>
                <button
                  type="button"
                  onClick={handleNextDrill}
                  className="min-h-[42px] px-5 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <span>Next Dimensional Drill</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Preset selector chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {SCALING_SANDBOX_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset.id)}
                className={`min-h-[40px] px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 border transition-colors ${
                  activePreset.id === preset.id
                    ? 'border-violet-400 bg-violet-500/15 text-violet-700 dark:text-violet-200'
                    : 'studio-surface-subtle text-slate-600 dark:text-slate-300 hover:border-violet-400/50'
                }`}
              >
                {preset.title}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
            {/* Sliders & Formula */}
            <div className="lg:col-span-7 rounded-2xl border studio-surface p-5 space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] font-bold text-violet-600 dark:text-violet-300">
                    {activePreset.chapter}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                    {activePreset.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {activePreset.description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={resetScaling}
                  className="min-h-[34px] px-3 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 inline-flex items-center gap-1"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset 1×</span>
                </button>
              </div>

              <div className="rounded-xl studio-surface-subtle border px-3.5 py-2.5 overflow-x-auto">
                <MathBlock latex={activePreset.formulaLatex} displayMode />
              </div>

              <div className="space-y-3">
                {activePreset.params.map((param) => {
                  const val = multValues[param.id] ?? param.defaultMult;
                  return (
                    <div key={param.id}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-medium text-slate-700 dark:text-slate-200">
                          {param.label} ({param.symbol})
                        </span>
                        <span className="font-mono font-bold text-cyan-600 dark:text-cyan-300 tabular-nums">
                          {val.toFixed(2)}×
                        </span>
                      </div>
                      <input
                        type="range"
                        min={param.minMult}
                        max={param.maxMult}
                        step={param.step}
                        value={val}
                        onChange={(e) =>
                          setMultValues((prev) => ({
                            ...prev,
                            [param.id]: Number(e.target.value),
                          }))
                        }
                        className="w-full"
                      />
                    </div>
                  );
                })}
              </div>

              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2.5 text-xs text-amber-900 dark:text-amber-100 flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  <strong>JEE Trap Tip:</strong> {activePreset.jeeTip}
                </span>
              </div>
            </div>

            {/* Live % Change & Recharts Comparison */}
            <div className="lg:col-span-5 rounded-2xl border studio-surface p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Live Output Impact ({activePreset.outputSymbol})
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="rounded-xl studio-surface-subtle border p-3">
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">New Ratio</div>
                    <div className="text-xl font-bold font-mono text-cyan-600 dark:text-cyan-300 tabular-nums">
                      {ratioResult.toFixed(3)}×
                    </div>
                  </div>
                  <div className="rounded-xl studio-surface-subtle border p-3">
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">% Change</div>
                    <div
                      className={`text-xl font-bold font-mono tabular-nums ${
                        pctChange > 0.05
                          ? 'text-emerald-500'
                          : pctChange < -0.05
                          ? 'text-rose-500'
                          : 'text-slate-500'
                      }`}
                    >
                      {pctChange >= 0 ? '+' : ''}
                      {pctChange.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                    <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        color: '#f8fafc',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} name="Relative Factor">
                      <Cell fill="#64748b" />
                      <Cell fill={pctChange >= 0 ? '#22d3ee' : '#f43f5e'} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <button
                type="button"
                onClick={() => onJumpToFormula(activePreset.formulaId)}
                className="min-h-[42px] w-full px-4 rounded-xl bg-violet-500/15 border border-violet-500/35 text-violet-700 dark:text-violet-200 text-xs font-bold inline-flex items-center justify-center gap-1.5 hover:bg-violet-500/25"
              >
                <Award className="h-4 w-4" />
                <span>Inspect Base Formula Card</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
