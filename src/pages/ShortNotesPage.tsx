import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowUpRight,
  Award,
  Ban,
  BookOpen,
  Box,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Flag,
  Flame,
  FlaskConical,
  GraduationCap,
  Printer,
  RotateCcw,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { CLASS_11_CHAPTERS, Class11ChapterMeta } from '../data/class11NotesData';
import {
  NTA_SYLLABUS_REMOVALS,
  SHORT_NOTES,
  ShortNoteChapter,
  ShortNoteSection,
} from '../data/shortNotes';
import {
  AppSettings,
  Background3DPreset,
  Formula,
  MistakeErrorType,
  MistakeSource,
} from '../types/physics';
import { MathBlock } from '../components/MathBlock';
import { FormattedMathText } from '../components/FormattedMathText';
import { Class11MarkdownRenderer } from '../components/Class11MarkdownRenderer';
import { getClass12ReadingTime } from '../utils/readingTime';

const REVISED_STORAGE_KEY = 'jee_revised_class11_chapters';

interface ShortNotesPageProps {
  onJumpToFormula: (formulaId: string) => void;
  onOpenGraph: (graphId: string, formulaId: string) => void;
  onOpenLab: (labId: NonNullable<Formula['labId']>, formulaId: string) => void;
  background3dEnabled?: boolean;
  background3dPreset?: Background3DPreset;
  onUpdateSettings?: (patch: Partial<AppSettings>) => void;
  onFlagMistake?: (entry: {
    source: MistakeSource;
    chapter: string;
    title: string;
    prompt: string;
    formulaId?: string;
    errorType?: MistakeErrorType;
    explanation?: string;
  }) => void;
  externalTarget?: { cls: 'class11' | 'class12'; chapterId: string } | null;
  onConsumeTarget?: () => void;
}

export const ShortNotesPage: React.FC<ShortNotesPageProps> = ({
  onJumpToFormula,
  onOpenGraph: _onOpenGraph,
  onOpenLab,
  background3dEnabled = true,
  background3dPreset = 'em-field',
  onUpdateSettings,
  onFlagMistake,
  externalTarget,
  onConsumeTarget,
}) => {
  const [activeClass, setActiveClass] = useState<'class11' | 'class12'>('class11');
  const [selectedClass11Id, setSelectedClass11Id] = useState<string>(
    CLASS_11_CHAPTERS[0].id
  );
  const [selectedClass12Id, setSelectedClass12Id] = useState<string>(SHORT_NOTES[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllMatchingSections, setShowAllMatchingSections] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [showNtaBanner, setShowNtaBanner] = useState(false);
  const [highYieldOnly, setHighYieldOnly] = useState(false);
  const [blurEquations, setBlurEquations] = useState(false);
  const [blurEpoch, setBlurEpoch] = useState(0);
  const [revealedEqKeys, setRevealedEqKeys] = useState<Record<string, boolean>>({});
  const [flaggedSectionKey, setFlaggedSectionKey] = useState<string | null>(null);

  // Load and sanitize revised chapter IDs from localStorage (pruning legacy/stale IDs)
  const [revisedChapterIds, setRevisedChapterIds] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(REVISED_STORAGE_KEY);
      if (!raw) return new Set();
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const validIds = new Set(CLASS_11_CHAPTERS.map((c) => c.id));
        const sanitized = parsed.filter((id) => validIds.has(id));
        return new Set(sanitized);
      }
    } catch {
      // Ignore JSON parse errors
    }
    return new Set();
  });

  // Sync hash routing on mount and hash changes
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (!hash) return;

      // Class 12 check
      const cleanHash = hash.replace(/^#\/?(?:notes\/)?/, '');
      const match12 = SHORT_NOTES.find(
        (sn) =>
          cleanHash === sn.id.toLowerCase() ||
          cleanHash === `ch${sn.number}` ||
          cleanHash === `chapter-${sn.number}` ||
          hash.includes(sn.id.toLowerCase())
      );
      if (match12 || hash.includes('class12') || hash.includes('unit-')) {
        setActiveClass('class12');
        if (match12) setSelectedClass12Id(match12.id);
        return;
      }

      // Class 11 check
      const match11 = CLASS_11_CHAPTERS.find(
        (ch) =>
          cleanHash === ch.id ||
          cleanHash === ch.prefix ||
          cleanHash === `c11-${ch.id}` ||
          cleanHash === ch.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      );

      if (match11) {
        setActiveClass('class11');
        setSelectedClass11Id(match11.id);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  useEffect(() => {
    if (!externalTarget) return;
    setActiveClass(externalTarget.cls);
    if (externalTarget.cls === 'class11') {
      setSelectedClass11Id(externalTarget.chapterId);
    } else {
      setSelectedClass12Id(externalTarget.chapterId);
    }
    onConsumeTarget?.();
  }, [externalTarget, onConsumeTarget]);

  useEffect(() => {
    setRevealedEqKeys({});
  }, [blurEquations, blurEpoch, selectedClass12Id]);

  const toggleRevisedChapter = (chapterId: string) => {
    setRevisedChapterIds((prev) => {
      const next = new Set(prev);
      if (next.has(chapterId)) {
        next.delete(chapterId);
      } else {
        next.add(chapterId);
      }
      try {
        localStorage.setItem(REVISED_STORAGE_KEY, JSON.stringify(Array.from(next)));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  };

  const handleSelectClass11Chapter = (chapterId: string) => {
    setSelectedClass11Id(chapterId);
    setMobileDropdownOpen(false);
    window.location.hash = `#/notes/${chapterId}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const queryTokens = useMemo(
    () =>
      searchQuery
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean),
    [searchQuery]
  );

  // Precomputed searchable text per Class 11 chapter (title, metadata & full markdown content)
  const class11SearchIndex = useMemo(
    () =>
      CLASS_11_CHAPTERS.map((ch) => ({
        chapter: ch,
        haystack: `${ch.title} ${ch.prefix} chapter ${ch.number} ch ${ch.number} ${ch.weightage} ${ch.rawMarkdown}`.toLowerCase(),
      })),
    []
  );

  // Filtered Class 11 chapters based on real-time title + keyword content search
  const filteredClass11Chapters = useMemo(() => {
    if (queryTokens.length === 0) return CLASS_11_CHAPTERS;
    return class11SearchIndex
      .filter(({ haystack }) => queryTokens.every((tok) => haystack.includes(tok)))
      .map(({ chapter }) => chapter);
  }, [class11SearchIndex, queryTokens]);

  // Auto-switch to first matching Class 11 chapter if current selection is filtered out
  useEffect(() => {
    if (
      filteredClass11Chapters.length > 0 &&
      !filteredClass11Chapters.some((ch) => ch.id === selectedClass11Id)
    ) {
      setSelectedClass11Id(filteredClass11Chapters[0].id);
    }
  }, [filteredClass11Chapters, selectedClass11Id]);

  // Active Class 11 chapter metadata & navigation indices
  const currentClass11Index = useMemo(
    () => CLASS_11_CHAPTERS.findIndex((c) => c.id === selectedClass11Id),
    [selectedClass11Id]
  );
  const activeClass11Chapter: Class11ChapterMeta =
    CLASS_11_CHAPTERS[currentClass11Index >= 0 ? currentClass11Index : 0];

  const prevClass11 =
    currentClass11Index > 0 ? CLASS_11_CHAPTERS[currentClass11Index - 1] : undefined;
  const nextClass11 =
    currentClass11Index < CLASS_11_CHAPTERS.length - 1
      ? CLASS_11_CHAPTERS[currentClass11Index + 1]
      : undefined;

  // Filtered Class 12 chapters based on real-time title + keyword content search
  const filteredClass12Chapters = useMemo(() => {
    if (queryTokens.length === 0) return SHORT_NOTES;
    return SHORT_NOTES.filter((ch) => chapterMatchesTokens(ch, queryTokens));
  }, [queryTokens]);

  // Auto-switch to first matching Class 12 chapter if current selection is filtered out
  useEffect(() => {
    if (
      filteredClass12Chapters.length > 0 &&
      !filteredClass12Chapters.some((ch) => ch.id === selectedClass12Id)
    ) {
      setSelectedClass12Id(filteredClass12Chapters[0].id);
    }
  }, [filteredClass12Chapters, selectedClass12Id]);

  // Active Class 12 chapter & prev/next navigation
  const activeClass12Index = useMemo(
    () => SHORT_NOTES.findIndex((c) => c.id === selectedClass12Id),
    [selectedClass12Id]
  );
  const activeClass12Chapter =
    SHORT_NOTES[activeClass12Index >= 0 ? activeClass12Index : 0];
  const prevClass12 =
    activeClass12Index > 0 ? SHORT_NOTES[activeClass12Index - 1] : undefined;
  const nextClass12 =
    activeClass12Index < SHORT_NOTES.length - 1
      ? SHORT_NOTES[activeClass12Index + 1]
      : undefined;
  const firstFormulaId12 =
    activeClass12Chapter.sections[0]?.formulaId ??
    activeClass12Chapter.sections[0]?.items[0]?.formulaId ??
    '';
  const activeClass12ReadingTime = useMemo(
    () => getClass12ReadingTime(activeClass12Chapter),
    [activeClass12Chapter]
  );

  const handleSelectClass12Chapter = (chapterId: string) => {
    setSelectedClass12Id(chapterId);
    setShowAllMatchingSections(false);
    window.location.hash = `#/notes/${chapterId}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sections to display for active Class 12 chapter when searching
  const visibleClass12Sections = useMemo(() => {
    if (queryTokens.length === 0 || showAllMatchingSections) {
      return activeClass12Chapter.sections;
    }
    const headerText = `${activeClass12Chapter.title} ${activeClass12Chapter.shortTitle} chapter ${activeClass12Chapter.number} ch ${activeClass12Chapter.number} ${activeClass12Chapter.weightage}`.toLowerCase();
    const headerMatched = queryTokens.every((tok) => headerText.includes(tok));
    if (headerMatched) return activeClass12Chapter.sections;
    const matching = activeClass12Chapter.sections.filter((sec) =>
      sectionMatchesTokens(sec, queryTokens)
    );
    return matching.length > 0 ? matching : activeClass12Chapter.sections;
  }, [activeClass12Chapter, queryTokens, showAllMatchingSections]);

  const isSectionFiltered =
    queryTokens.length > 0 &&
    !showAllMatchingSections &&
    visibleClass12Sections.length < activeClass12Chapter.sections.length;

  const revisedCount = revisedChapterIds.size;
  const revisedPercent = Math.round((revisedCount / CLASS_11_CHAPTERS.length) * 100);

  return (
    <div className="space-y-4">
      {/* Page Header, Class Switcher & Real-Time Search Bar */}
      <header className="rounded-2xl border studio-surface p-4 sm:p-5 space-y-4 print:hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
                <GraduationCap className="h-5 w-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                JEE Physics Revision Short Notes
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {activeClass === 'class11'
                ? 'Complete 14 Class 11 Chapters (Units 02 to 15) with formula tables, JEE Main Focus boxes & April 2026 PYQs.'
                : 'Complete 15 Class 12 Chapters (Electric Charges → Optics → Modern Physics → Semiconductors → Communication) with interactive simulations.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Compact 3D Backdrop Switcher */}
            {onUpdateSettings && (
              <div
                className="inline-flex items-center gap-1 rounded-xl border studio-surface-subtle p-1"
                role="group"
                aria-label="3D background controls"
              >
                <span className="px-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400 inline-flex items-center gap-1">
                  <Box className="h-3.5 w-3.5 text-cyan-500" />
                  <span className="hidden sm:inline">3D</span>
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateSettings({ background3dEnabled: true, background3dPreset: 'em-field' })
                  }
                  className={`min-h-[32px] px-2.5 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                    background3dEnabled && background3dPreset === 'em-field'
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800/70'
                  }`}
                >
                  EM Field
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateSettings({ background3dEnabled: true, background3dPreset: 'quantum-wave' })
                  }
                  className={`min-h-[32px] px-2.5 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                    background3dEnabled && background3dPreset === 'quantum-wave'
                      ? 'bg-violet-500 text-white font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800/70'
                  }`}
                >
                  Quantum
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ background3dEnabled: !background3dEnabled })}
                  className={`min-h-[32px] px-2.5 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                    !background3dEnabled
                      ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 font-bold'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800/70'
                  }`}
                >
                  {background3dEnabled ? 'Off' : 'Paused'}
                </button>
              </div>
            )}

            {/* Class 11 vs Class 12 Switcher Tabs */}
            <div className="flex items-center gap-2 shrink-0 studio-surface-subtle p-1.5 rounded-2xl border">
              <button
                type="button"
                onClick={() => setActiveClass('class11')}
                className={`min-h-[40px] px-3.5 sm:px-4 rounded-xl text-xs font-bold inline-flex items-center gap-2 transition-all cursor-pointer ${
                  activeClass === 'class11'
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <BookOpen className="h-4 w-4" />
                <span>Class 11 (14 Ch)</span>
                {revisedCount > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-950/20 text-slate-950 font-black">
                    {revisedCount}/14
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveClass('class12')}
                className={`min-h-[40px] px-3.5 sm:px-4 rounded-xl text-xs font-bold inline-flex items-center gap-2 transition-all cursor-pointer ${
                  activeClass === 'class12'
                    ? 'bg-violet-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Sparkles className="h-4 w-4" />
                <span>Class 12 (15 Ch)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Real-Time Chapter Title & Keyword Content Search Bar */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowAllMatchingSections(false);
              }}
              placeholder="Real-time search across chapter titles & note keywords (e.g., Gauss, Friction, Doppler, Transformer)..."
              aria-label="Search chapters by title or keyword content"
              className="w-full min-h-[44px] pl-10 pr-24 rounded-xl text-xs sm:text-sm studio-surface-subtle border text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setShowAllMatchingSections(false);
                }}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2 py-1 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-200/70 dark:hover:bg-slate-800 inline-flex items-center gap-1 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
                <span>Clear</span>
              </button>
            )}
          </div>

          {queryTokens.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs px-1">
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                {activeClass === 'class11'
                  ? `Showing ${filteredClass11Chapters.length} of ${CLASS_11_CHAPTERS.length} Class 11 chapters matching "${searchQuery.trim()}"`
                  : `Showing ${filteredClass12Chapters.length} of ${SHORT_NOTES.length} Class 12 chapters matching "${searchQuery.trim()}"`}
              </span>

              {activeClass === 'class11' && filteredClass12Chapters.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveClass('class12')}
                  className="font-semibold text-violet-600 dark:text-violet-300 hover:underline cursor-pointer"
                >
                  {filteredClass12Chapters.length} match{filteredClass12Chapters.length === 1 ? '' : 'es'} in Class 12 →
                </button>
              )}

              {activeClass === 'class12' && filteredClass11Chapters.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveClass('class11')}
                  className="font-semibold text-cyan-600 dark:text-cyan-300 hover:underline cursor-pointer"
                >
                  {filteredClass11Chapters.length} match{filteredClass11Chapters.length === 1 ? '' : 'es'} in Class 11 →
                </button>
              )}
            </div>
          )}

          {/* 7-Day Exam Sprint Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setHighYieldOnly((h) => !h)}
                className={`min-h-[36px] px-3 rounded-xl text-xs font-bold border inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                  highYieldOnly
                    ? 'border-amber-400 bg-amber-500/15 text-amber-700 dark:text-amber-200'
                    : 'studio-surface-subtle text-slate-600 dark:text-slate-300 hover:border-amber-400/50'
                }`}
              >
                <Flame className="h-3.5 w-3.5 text-amber-500" />
                <span>7-Day Sprint: High-Yield Only</span>
              </button>

              <button
                type="button"
                onClick={() => setBlurEquations((b) => !b)}
                className={`min-h-[36px] px-3 rounded-xl text-xs font-bold border inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                  blurEquations
                    ? 'border-violet-400 bg-violet-500/15 text-violet-700 dark:text-violet-200'
                    : 'studio-surface-subtle text-slate-600 dark:text-slate-300 hover:border-violet-400/50'
                }`}
              >
                <Eye className="h-3.5 w-3.5 text-violet-500" />
                <span>Blur Equations (Active Recall)</span>
              </button>

              {blurEquations && (
                <button
                  type="button"
                  onClick={() => setBlurEpoch((e) => e + 1)}
                  className="min-h-[36px] px-2.5 rounded-xl text-xs font-semibold studio-surface-subtle border text-slate-600 dark:text-slate-300 hover:border-cyan-400 inline-flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset Blur</span>
                </button>
              )}
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">
              Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px]">Ctrl+K</kbd> anytime to jump
            </span>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* CLASS 11 VIEW (14 Chapters Markdown Notes with Sidebar & Focus Boxes)     */}
      {/* ========================================================================= */}
      {activeClass === 'class11' && (
        filteredClass11Chapters.length === 0 ? (
          <div className="rounded-2xl border border-dashed studio-surface p-8 text-center space-y-3">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              No Class 11 chapters match &ldquo;{searchQuery.trim()}&rdquo;
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="min-h-[38px] px-4 rounded-xl bg-cyan-500/15 border border-cyan-500/35 text-xs font-semibold text-cyan-700 dark:text-cyan-300 hover:bg-cyan-500/25 cursor-pointer"
              >
                Clear search filter
              </button>
              {filteredClass12Chapters.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveClass('class12')}
                  className="min-h-[38px] px-4 rounded-xl bg-violet-500/15 border border-violet-500/35 text-xs font-semibold text-violet-700 dark:text-violet-300 hover:bg-violet-500/25 cursor-pointer"
                >
                  View {filteredClass12Chapters.length} Class 12 match{filteredClass12Chapters.length === 1 ? '' : 'es'}
                </button>
              )}
            </div>
          </div>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Mobile Chapter Selector (Visible on small screens) */}
          <div className="lg:hidden col-span-1 print:hidden">
            <button
              type="button"
              onClick={() => setMobileDropdownOpen((o) => !o)}
              className="w-full min-h-[48px] px-4 rounded-2xl studio-surface border border-cyan-500/40 text-left flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2.5 truncate">
                <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-cyan-500/15 text-cyan-600 dark:text-cyan-300">
                  Ch {activeClass11Chapter.number}
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                  {activeClass11Chapter.title}
                </span>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-slate-400 transition-transform ${
                  mobileDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {mobileDropdownOpen && (
              <div className="mt-2 rounded-2xl border studio-surface p-2 shadow-xl space-y-1 max-h-80 overflow-y-auto">
                {filteredClass11Chapters.map((ch) => {
                  const isCurrent = ch.id === activeClass11Chapter.id;
                  const isRev = revisedChapterIds.has(ch.id);
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => handleSelectClass11Chapter(ch.id)}
                      className={`w-full min-h-[42px] px-3 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors ${
                        isCurrent
                          ? 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="truncate">
                        {ch.prefix}. {ch.title}
                      </span>
                      {isRev && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Desktop Sidebar (lg:col-span-4 xl:col-span-3) */}
          <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 space-y-3 sticky top-20 print:hidden">
            <div className="rounded-2xl border studio-surface p-3.5 space-y-3.5">
              {/* Revision Progress Header */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Revision Progress</span>
                  </span>
                  <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                    {revisedCount} / {CLASS_11_CHAPTERS.length} ({revisedPercent}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
                    style={{ width: `${revisedPercent}%` }}
                  />
                </div>
              </div>

              {/* Chapters List */}
              <div className="space-y-1 max-h-[calc(100vh-240px)] overflow-y-auto pr-1">
                {filteredClass11Chapters.map((ch) => {
                    const isCurrent = ch.id === activeClass11Chapter.id;
                    const isRev = revisedChapterIds.has(ch.id);
                    return (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => handleSelectClass11Chapter(ch.id)}
                        className={`w-full min-h-[44px] p-2.5 rounded-xl text-left text-xs transition-all flex items-center justify-between gap-2 border cursor-pointer ${
                          isCurrent
                            ? 'bg-cyan-500/15 border-cyan-400/80 text-cyan-900 dark:text-cyan-200 font-bold shadow-xs'
                            : 'bg-transparent border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span
                            className={`font-mono text-[11px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ${
                              isCurrent
                                ? 'bg-cyan-500 text-slate-950'
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {ch.prefix}
                          </span>
                          <span className="truncate">{ch.title}</span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {ch.weightage === 'Very high' && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-300 border border-rose-500/20">
                              V. High
                            </span>
                          )}
                          {isRev && (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 fill-emerald-500/20" />
                          )}
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
          </aside>

          {/* Main Markdown Content Area (lg:col-span-8 xl:col-span-9) */}
          <main className="col-span-1 lg:col-span-8 xl:col-span-9">
            <Class11MarkdownRenderer
              chapter={activeClass11Chapter}
              isRevised={revisedChapterIds.has(activeClass11Chapter.id)}
              onToggleRevised={() => toggleRevisedChapter(activeClass11Chapter.id)}
              onNavigatePrev={
                prevClass11 ? () => handleSelectClass11Chapter(prevClass11.id) : undefined
              }
              onNavigateNext={
                nextClass11 ? () => handleSelectClass11Chapter(nextClass11.id) : undefined
              }
              prevChapterTitle={prevClass11 ? `${prevClass11.prefix}. ${prevClass11.title}` : undefined}
              nextChapterTitle={nextClass11 ? `${nextClass11.prefix}. ${nextClass11.title}` : undefined}
              searchQuery={searchQuery}
              highYieldOnly={highYieldOnly}
              blurEquations={blurEquations}
              blurEpoch={blurEpoch}
              onFlagMistake={onFlagMistake}
            />
          </main>
        </div>
        )
      )}

      {/* ========================================================================= */}
      {/* CLASS 12 VIEW (15 Chapters Structured Notes & Interactive Simulations)    */}
      {/* ========================================================================= */}
      {activeClass === 'class12' && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 print:hidden">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                Class 12 Chapter-Wise Short Notes (Chapters 1–15)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Electric Charges → Capacitance → Current → Magnetism → EMI &amp; AC → Optics → Modern Physics → Semiconductors → Communication.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowNtaBanner((s) => !s)}
                className={`min-h-[42px] px-3.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 border whitespace-nowrap transition-colors cursor-pointer ${
                  showNtaBanner
                    ? 'border-rose-400 bg-rose-500/15 text-rose-700 dark:text-rose-200'
                    : 'studio-surface-subtle text-slate-700 dark:text-slate-300'
                }`}
              >
                <Ban className="h-4 w-4 text-rose-500" />
                <span>NTA Removed Topics</span>
              </button>
            </div>
          </div>

          {/* Collapsible Global NTA Removed Topics Summary */}
          {showNtaBanner && (
            <section className="rounded-2xl border border-rose-500/35 bg-rose-500/5 dark:bg-rose-950/20 p-4 space-y-2.5 print:hidden">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-rose-700 dark:text-rose-300">
                <Ban className="h-4 w-4 shrink-0" />
                <span>What NTA Removed (Marked as Reference in Chapters)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {NTA_SYLLABUS_REMOVALS.map((item) => (
                  <div
                    key={item.unit}
                    className="rounded-xl studio-surface-subtle border border-rose-500/20 p-3 space-y-1"
                  >
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {item.unit}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.topics}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Class 12 Chapter Switcher Strip */}
          {filteredClass12Chapters.length === 0 ? (
            <div className="rounded-2xl border border-dashed studio-surface p-6 text-center space-y-3">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                No Class 12 chapters match &ldquo;{searchQuery.trim()}&rdquo;
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="min-h-[36px] px-3.5 rounded-xl bg-violet-500/15 border border-violet-500/35 text-xs font-semibold text-violet-700 dark:text-violet-300 hover:bg-violet-500/25 cursor-pointer"
                >
                  Clear search filter
                </button>
                {filteredClass11Chapters.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveClass('class11')}
                    className="min-h-[36px] px-3.5 rounded-xl bg-cyan-500/15 border border-cyan-500/35 text-xs font-semibold text-cyan-700 dark:text-cyan-300 hover:bg-cyan-500/25 cursor-pointer"
                  >
                    View {filteredClass11Chapters.length} Class 11 match{filteredClass11Chapters.length === 1 ? '' : 'es'}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 print:hidden">
                {filteredClass12Chapters.map((note) => {
                  const active = note.id === activeClass12Chapter.id;
                  return (
                    <button
                      key={note.id}
                      type="button"
                      onClick={() => handleSelectClass12Chapter(note.id)}
                      className={`min-h-[44px] px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 border transition-colors flex items-center gap-2 cursor-pointer ${
                        active
                          ? 'border-violet-400 bg-violet-500/15 text-violet-700 dark:text-violet-200 font-bold'
                          : 'studio-surface-subtle text-slate-600 dark:text-slate-300 hover:border-violet-500/40'
                      }`}
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: note.accentColor }}
                      />
                      <span>{note.shortTitle}</span>
                    </button>
                  );
                })}
              </div>

              {/* Class 12 Chapter Overview Banner (Chapter Number, Title, Weightage, Key Concepts) */}
              <div className="rounded-2xl border studio-surface p-4 sm:p-5 space-y-4">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-violet-500/15 text-violet-700 dark:text-violet-300 border border-violet-500/30">
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>Class 12</span>
                      </span>

                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        <span>Chapter {activeClass12Chapter.number}</span>
                      </span>

                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                          activeClass12Chapter.isReferenceOnly
                            ? 'border-rose-500/35 bg-rose-500/10 text-rose-700 dark:text-rose-300'
                            : activeClass12Chapter.weightage === 'Very High Weightage'
                            ? 'border-emerald-500/35 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                            : 'border-amber-500/35 bg-amber-500/10 text-amber-700 dark:text-amber-300'
                        }`}
                      >
                        <Award className="h-3.5 w-3.5" />
                        <span>{activeClass12Chapter.weightage}</span>
                      </span>

                      <span
                        title={`Estimated from ${activeClass12ReadingTime.words.toLocaleString()} words`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/25"
                      >
                        <Clock className="h-3.5 w-3.5" />
                        <span>{activeClass12ReadingTime.label}</span>
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                      Chapter {activeClass12Chapter.number}: {activeClass12Chapter.title}
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0 print:hidden">
                    {activeClass12Chapter.labId && activeClass12Chapter.simTitle && (
                      <button
                        type="button"
                        onClick={() => onOpenLab(activeClass12Chapter.labId!, firstFormulaId12)}
                        className="min-h-[42px] px-4 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-slate-950 text-xs font-bold inline-flex items-center justify-center gap-2 whitespace-nowrap hover:opacity-95 transition-opacity cursor-pointer"
                      >
                        <FlaskConical className="h-4 w-4" />
                        <span>Launch {activeClass12Chapter.simTitle}</span>
                      </button>
                    )}

                    {(activeClass12Chapter.chapterId === 'magnetism' ||
                      activeClass12Chapter.chapterId === 'emi') && (
                      <button
                        type="button"
                        onClick={() => onOpenLab('lorentz-3d', 'mag-lorentz')}
                        className="min-h-[42px] px-3.5 rounded-xl bg-cyan-500/15 border border-cyan-500/35 text-cyan-700 dark:text-cyan-200 text-xs font-bold inline-flex items-center gap-1.5 hover:bg-cyan-500/25 cursor-pointer"
                      >
                        <Box className="h-4 w-4" />
                        <span>3D Lorentz / Biot-Savart Lab</span>
                      </button>
                    )}

                    {activeClass12Chapter.chapterId === 'modern-physics' && (
                      <button
                        type="button"
                        onClick={() => onOpenLab('bohr-orbitals-3d', 'mod-bohr-quantization')}
                        className="min-h-[42px] px-3.5 rounded-xl bg-violet-500/15 border border-violet-500/35 text-violet-700 dark:text-violet-200 text-xs font-bold inline-flex items-center gap-1.5 hover:bg-violet-500/25 cursor-pointer"
                      >
                        <Box className="h-4 w-4" />
                        <span>3D Bohr Orbitals Lab</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="min-h-[42px] px-3.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200/80 dark:hover:bg-slate-700 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                      title="Print or Save as PDF"
                    >
                      <Printer className="h-4 w-4" />
                      <span>Print / PDF</span>
                    </button>
                  </div>
                </div>

                {/* Key Concepts Overview Chips */}
                <div className="space-y-1.5 pt-1 border-t border-slate-200/70 dark:border-slate-800">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Key Concepts in This Chapter
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeClass12Chapter.keyConcepts.map((concept, idx) => (
                      <button
                        key={concept}
                        type="button"
                        onClick={() => {
                          setShowAllMatchingSections(true);
                          setTimeout(() => {
                            document
                              .getElementById(`c12-concept-${activeClass12Chapter.number}-${idx}`)
                              ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }, 40);
                        }}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 hover:border-violet-400 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                      >
                        <FormattedMathText text={concept} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {isSectionFiltered && (
                <div className="rounded-xl border border-violet-500/30 bg-violet-500/5 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-violet-700 dark:text-violet-300 font-medium">
                    Showing {visibleClass12Sections.length} of{' '}
                    {activeClass12Chapter.sections.length} key concepts matching &ldquo;
                    {searchQuery.trim()}&rdquo;
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAllMatchingSections(true)}
                    className="font-bold text-violet-600 dark:text-violet-300 hover:underline cursor-pointer"
                  >
                    Show all concepts in Ch {activeClass12Chapter.number}
                  </button>
                </div>
              )}

              {/* Key Concepts & Bullet-Point Summary Sections */}
              <div className="space-y-4">
                {visibleClass12Sections.map((sec, sIdx) => {
                  const originalIdx = activeClass12Chapter.sections.indexOf(sec);
                  const anchorIdx = originalIdx >= 0 ? originalIdx : sIdx;
                  const secKey = `${activeClass12Chapter.id}-${anchorIdx}`;
                  const visibleBullets = highYieldOnly
                    ? sec.bullets.filter(
                        (b) =>
                          (b.equations && b.equations.length > 0) ||
                          Boolean(b.formulaId) ||
                          /trap|always|never|jee|pyq|special|limit/i.test(b.text)
                      )
                    : sec.bullets;
                  if (highYieldOnly && visibleBullets.length === 0 && (!sec.tables || sec.tables.length === 0)) {
                    return null;
                  }

                  return (
                    <section
                      key={sec.title}
                      id={`c12-concept-${activeClass12Chapter.number}-${anchorIdx}`}
                      className="rounded-2xl border studio-surface p-4 sm:p-5 space-y-3.5 scroll-mt-24"
                    >
                      <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200/80 dark:border-slate-800">
                        <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: activeClass12Chapter.accentColor }}
                          />
                          <FormattedMathText text={sec.title} />
                        </h4>

                        <div className="flex items-center gap-2 shrink-0 print:hidden">
                          {onFlagMistake && (
                            <button
                              type="button"
                              onClick={() => {
                                onFlagMistake({
                                  source: 'notes',
                                  chapter: activeClass12Chapter.chapterId,
                                  title: `${activeClass12Chapter.shortTitle} · ${sec.title}`,
                                  prompt: `Revise high-yield concept & formulas for ${sec.title}`,
                                  formulaId: sec.formulaId,
                                  errorType: 'concept-gap',
                                  explanation: sec.bullets[0]?.text,
                                });
                                setFlaggedSectionKey(secKey);
                                window.setTimeout(() => setFlaggedSectionKey(null), 1800);
                              }}
                              className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg border transition-colors cursor-pointer ${
                                flaggedSectionKey === secKey
                                  ? 'border-rose-400 bg-rose-500/15 text-rose-500'
                                  : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:text-rose-500'
                              }`}
                            >
                              <Flag className="h-3 w-3" />
                              <span>{flaggedSectionKey === secKey ? 'Saved' : 'Flag'}</span>
                            </button>
                          )}

                          {sec.formulaId && (
                            <button
                              type="button"
                              onClick={() => onJumpToFormula(sec.formulaId!)}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-violet-600 dark:text-violet-300 hover:underline whitespace-nowrap shrink-0 cursor-pointer"
                            >
                              <span>Formula Card</span>
                              <ArrowUpRight className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Bullet-Point Summary */}
                      <ul className="space-y-3">
                        {visibleBullets.map((bullet, bIdx) => (
                          <li
                            key={bIdx}
                            className="rounded-xl studio-surface-subtle border p-3.5 space-y-2.5"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed flex-1 min-w-0">
                                <span className="text-violet-500 font-bold shrink-0 mt-0.5">
                                  •
                                </span>
                                <div className="flex-1 min-w-0">
                                  <FormattedMathText text={bullet.text} />
                                </div>
                              </div>

                              {bullet.formulaId && (
                                <button
                                  type="button"
                                  onClick={() => onJumpToFormula(bullet.formulaId!)}
                                  className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-cyan-600 dark:text-cyan-300 hover:underline whitespace-nowrap shrink-0 cursor-pointer print:hidden"
                                >
                                  <span>Card</span>
                                  <ArrowUpRight className="h-3 w-3" />
                                </button>
                              )}
                            </div>

                            {bullet.equations && bullet.equations.length > 0 && (
                              <div className="space-y-2 pl-4">
                                {bullet.equations.map((eq, eqIdx) => {
                                  const eqKey = `${secKey}-b${bIdx}-e${eqIdx}`;
                                  const isMasked = blurEquations && !revealedEqKeys[eqKey];
                                  return (
                                    <div
                                      key={eqIdx}
                                      className="relative rounded-xl border studio-surface px-3 py-2 overflow-x-auto text-slate-950 dark:text-cyan-50"
                                    >
                                      <div className={isMasked ? 'blur-md select-none opacity-45 transition-all' : 'transition-all'}>
                                        <MathBlock latex={eq} displayMode />
                                      </div>
                                      {isMasked && (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            setRevealedEqKeys((prev) => ({ ...prev, [eqKey]: true }))
                                          }
                                          className="absolute inset-0 flex items-center justify-center gap-1.5 bg-slate-950/20 dark:bg-slate-950/45 text-xs font-bold text-violet-700 dark:text-violet-200 cursor-pointer"
                                        >
                                          <Eye className="h-4 w-4" />
                                          <span>Tap to reveal equation</span>
                                        </button>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {bullet.subBullets && bullet.subBullets.length > 0 && (
                              <ul className="space-y-1.5 pl-5 border-l-2 border-slate-200 dark:border-slate-800 ml-1">
                                {bullet.subBullets.map((sub, subIdx) => (
                                  <li
                                    key={subIdx}
                                    className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed"
                                  >
                                    <span className="text-cyan-500 shrink-0 mt-0.5">◦</span>
                                    <div className="flex-1 min-w-0">
                                      <FormattedMathText text={sub} />
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        ))}
                      </ul>

                      {/* Concept Tables (if present in this section) */}
                      {sec.tables &&
                        sec.tables.map((tbl, tIdx) => (
                          <div
                            key={tIdx}
                            className="rounded-xl border studio-surface-subtle overflow-hidden"
                          >
                            {tbl.title && (
                              <div className="px-3.5 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/75 text-xs font-bold text-slate-700 dark:text-slate-200">
                                <FormattedMathText text={tbl.title} />
                              </div>
                            )}
                            <div className="overflow-x-auto">
                              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                                <thead>
                                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 text-slate-600 dark:text-slate-300">
                                    {tbl.headers.map((h) => (
                                      <th key={h} className="py-2.5 px-3.5 font-semibold whitespace-nowrap">
                                        <FormattedMathText text={h} />
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {tbl.rows.map((row, rIdx) => (
                                    <tr
                                      key={rIdx}
                                      className="border-b border-slate-100 dark:border-slate-800/60 last:border-b-0"
                                    >
                                      {row.map((cell, cIdx) => (
                                        <td
                                          key={cIdx}
                                          className={`py-2.5 px-3.5 ${
                                            cIdx === 0
                                              ? 'font-semibold text-violet-700 dark:text-violet-300'
                                              : 'text-slate-700 dark:text-slate-200'
                                          }`}
                                        >
                                          <FormattedMathText text={cell} />
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ))}
                    </section>
                  );
                })}
              </div>

              {/* Prev / Next Class 12 Chapter Navigation Footer */}
              <footer className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
                {prevClass12 ? (
                  <button
                    type="button"
                    onClick={() => handleSelectClass12Chapter(prevClass12.id)}
                    className="w-full sm:w-auto min-h-[44px] px-4 rounded-xl border studio-surface text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-violet-500/40 inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4 shrink-0" />
                    <span className="truncate">
                      Prev: Ch {prevClass12.number} · {prevClass12.title}
                    </span>
                  </button>
                ) : (
                  <div />
                )}

                {nextClass12 ? (
                  <button
                    type="button"
                    onClick={() => handleSelectClass12Chapter(nextClass12.id)}
                    className="w-full sm:w-auto min-h-[44px] px-4 rounded-xl border studio-surface text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-violet-500/40 inline-flex items-center justify-end gap-1.5 cursor-pointer"
                  >
                    <span className="truncate">
                      Next: Ch {nextClass12.number} · {nextClass12.title}
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0" />
                  </button>
                ) : (
                  <div />
                )}
              </footer>
            </>
          )}
        </div>
      )}
    </div>
  );
};

function sectionHaystack(sec: ShortNoteSection): string {
  const parts: string[] = [sec.title];
  for (const b of sec.bullets) {
    parts.push(b.text);
    if (b.subBullets) parts.push(...b.subBullets);
    if (b.equations) parts.push(...b.equations);
  }
  if (sec.tables) {
    for (const t of sec.tables) {
      if (t.title) parts.push(t.title);
      parts.push(...t.headers);
      for (const r of t.rows) parts.push(...r);
    }
  }
  for (const item of sec.items) {
    parts.push(item.label, item.latex);
  }
  return parts.join(' ').toLowerCase();
}

function sectionMatchesTokens(sec: ShortNoteSection, tokens: string[]): boolean {
  const haystack = sectionHaystack(sec);
  return tokens.every((tok) => haystack.includes(tok));
}

function chapterMatchesTokens(ch: ShortNoteChapter, tokens: string[]): boolean {
  const parts: string[] = [
    ch.title,
    ch.shortTitle,
    ch.weightage,
    `chapter ${ch.number}`,
    `ch ${ch.number}`,
    String(ch.number),
    ...ch.keyConcepts,
    ...ch.sections.map(sectionHaystack),
  ];
  const fullHaystack = parts.join(' ').toLowerCase();
  return tokens.every((tok) => fullHaystack.includes(tok));
}

