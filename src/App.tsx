import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MotionConfig, motion, AnimatePresence } from 'motion/react';
import {
  Award,
  BookMarked,
  BookOpen,
  CheckSquare,
  Clock,
  FlaskConical,
  HelpCircle,
  Home,
  Layers,
  LineChart,
  Monitor,
  Moon,
  MoreHorizontal,
  Network,
  Search,
  Settings,
  Sparkles,
  Sun,
  Users,
  WifiOff,
  X,
  Zap,
} from 'lucide-react';
import { AppTab, ChecklistStage, DoubtCommunityDraft, Formula, ThemeMode } from './types/physics';
import { useAppStore } from './store/useAppStore';
import { useOnlineStatus } from './hooks/usePWAInstall';
import { ErrorBoundary } from './components/ErrorBoundary';
import { FirebaseProvider } from './contexts/FirebaseContext';
import { PWAInstallButton } from './components/PWAInstallButton';
import { Physics3DScene } from './components/Physics3DScene';
import { ThemeTransitionLayer, THEME_TRANSITION } from './components/ThemeTransitionLayer';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { AIMentorDrawer } from './components/AIMentorDrawer';
import { HomePage } from './pages/HomePage';
import { WebPage } from './pages/WebPage';
import { LabsPage, LabId } from './pages/LabsPage';
import { ShortNotesPage } from './pages/ShortNotesPage';
import { GraphsPage } from './pages/GraphsPage';
import { QuizPage, QuizSubMode } from './pages/QuizPage';
import { FlashcardsPage } from './pages/FlashcardsPage';
import { ChecklistPage } from './pages/ChecklistPage';
import { TimerPage } from './pages/TimerPage';
import { DoubtSolverPage } from './pages/DoubtSolverPage';
import { GlossaryPage } from './pages/GlossaryPage';
import { CommunityPage, CommunitySubTab } from './pages/CommunityPage';
import { SettingsPage } from './pages/SettingsPage';
import { AuditPage } from './pages/AuditPage';
import { TestSeriesPage } from './pages/TestSeriesPage';
import { AboutPage } from './pages/AboutPage';

const DESKTOP_NAV: { id: AppTab; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'web', label: 'Web' },
  { id: 'labs', label: 'Sims' },
  { id: 'notes', label: 'Short Notes' },
  { id: 'glossary', label: 'Glossary' },
  { id: 'graphs', label: 'Graphs' },
  { id: 'quiz', label: 'Sprint' },
  { id: 'flashcards', label: 'Flashcards' },
  { id: 'checklist', label: 'Checklist' },
  { id: 'timer', label: 'Timer' },
  { id: 'doubt-solver', label: 'Doubt Solver' },
  { id: 'test-series', label: 'Test Series' },
  { id: 'community', label: 'Community' },
  { id: 'about', label: 'About' },
  { id: 'settings', label: 'Settings' },
];

const MOBILE_SWIPE_TABS: AppTab[] = ['home', 'web', 'labs', 'community'];
const ALL_SWIPE_TABS: AppTab[] = DESKTOP_NAV.map((item) => item.id);

function shouldIgnoreSwipeTarget(target: EventTarget | null, boundary: HTMLElement | null): boolean {
  let node = target instanceof HTMLElement ? target : null;
  while (node && node !== boundary) {
    const tag = node.tagName;
    if (
      tag === 'INPUT' ||
      tag === 'TEXTAREA' ||
      tag === 'SELECT' ||
      tag === 'CANVAS' ||
      node.dataset.noSwipe === 'true' ||
      node.getAttribute('role') === 'slider' ||
      node.classList.contains('katex-display') ||
      node.classList.contains('recharts-wrapper')
    ) {
      return true;
    }
    const style = window.getComputedStyle(node);
    if (
      (style.overflowX === 'auto' || style.overflowX === 'scroll') &&
      node.scrollWidth > node.clientWidth + 4
    ) {
      return true;
    }
    node = node.parentElement;
  }
  return false;
}

const TAB_SPRING = {
  type: 'spring' as const,
  stiffness: 420,
  damping: 32,
  mass: 0.85,
};

const SWIPE_DRAG_SPRING = {
  type: 'spring' as const,
  stiffness: 480,
  damping: 34,
  mass: 0.7,
};

const TAB_SLIDE_VARIANTS = {
  enter: (dir: number) => ({
    opacity: 0,
    x: dir === 0 ? 0 : dir > 0 ? 36 : -36,
    y: dir === 0 ? 10 : 0,
    scale: 0.985,
  }),
  center: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      x: TAB_SPRING,
      y: TAB_SPRING,
      scale: TAB_SPRING,
      opacity: { duration: 0.16, ease: 'easeOut' as const },
    },
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir === 0 ? 0 : dir > 0 ? -24 : 24,
    y: dir === 0 ? -6 : 0,
    scale: 0.99,
    transition: {
      duration: 0.12,
      ease: [0.32, 0, 0.67, 0] as const,
    },
  }),
};

export default function App() {
  const {
    state,
    todayReviewCount,
    todayStudySeconds,
    totalFocusXp,
    updateSettings,
    toggleKnown,
    toggleBookmark,
    setLastVisitedFormula,
    reviewFlashcard,
    toggleChecklistStage,
    addChecklistItem,
    editChecklistItem,
    deleteChecklistItem,
    reorderChecklistItem,
    addStudySession,
    logMistake,
    updateMistakeErrorType,
    toggleMistakeResolved,
    deleteMistake,
    appendMentorMessages,
    markMentorPlanApplied,
    clearMentorMessages,
    addDailyTasksBatch,
    mergeCloudState,
    exportProgressJson,
    importProgressJson,
    resetAllProgress,
  } = useAppStore();

  const isOnline = useOnlineStatus();
  const [activeTab, setActiveTab] = useState<AppTab>(() => {
    if (typeof window !== 'undefined') {
      const h = window.location.hash;
      if (h === '#audit') return 'audit';
      if (h === '#about' || h.startsWith('#/about')) return 'about';
      if (h.startsWith('#/notes') || h.startsWith('#notes') || /^#(?:c11|0[2-9]|1[0-5])/.test(h)) {
        return 'notes';
      }
    }
    return 'home';
  });
  const [focusedFormulaId, setFocusedFormulaId] = useState<string | null>(null);
  const [focusedGraphId, setFocusedGraphId] = useState<string | null>(null);
  const [activeLab, setActiveLab] = useState<LabId>('arc-wire');
  const [quizSubMode, setQuizSubMode] = useState<QuizSubMode>('sprint');
  const [shortNotesTarget, setShortNotesTarget] = useState<{
    cls: 'class11' | 'class12';
    chapterId: string;
  } | null>(null);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [mentorDrawerOpen, setMentorDrawerOpen] = useState(false);
  const [communitySubTab, setCommunitySubTab] = useState<CommunitySubTab>('rooms');
  const [pendingDoubtDraft, setPendingDoubtDraft] = useState<DoubtCommunityDraft | null>(null);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [tabTransitionDir, setTabTransitionDir] = useState(0);
  const [swipeDragX, setSwipeDragX] = useState(0);
  const mainSwipeRef = useRef<HTMLElement | null>(null);
  const swipeTouchRef = useRef<{
    x: number;
    y: number;
    time: number;
    ignored: boolean;
    lockedHorizontal: boolean;
  } | null>(null);
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return true;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemPrefersDark(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setSystemPrefersDark(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const resolvedDark =
    state.settings.theme === 'auto' ? systemPrefersDark : state.settings.theme === 'dark';

  const sectionProgressMap = useMemo(() => {
    const items = state.checklist || [];
    const totalItems = items.length;
    const stages: ChecklistStage[] = [
      'formulasLearnt',
      'graphsUnderstood',
      'flashcardsDone',
      'pyqsSolved',
      'revisedX2',
    ];

    const stageStats = (stage: ChecklistStage, label: string) => {
      const done = items.filter((item) => item.stages[stage]).length;
      const pct = totalItems > 0 ? Math.round((done / totalItems) * 100) : 0;
      return { pct, done, total: totalItems, label };
    };

    const totalStageSlots = totalItems * stages.length;
    const doneStageSlots = items.reduce(
      (sum, item) => sum + stages.filter((s) => item.stages[s]).length,
      0
    );
    const overallPct = totalStageSlots > 0 ? Math.round((doneStageSlots / totalStageSlots) * 100) : 0;
    const overall = {
      pct: overallPct,
      done: doneStageSlots,
      total: totalStageSlots,
      label: 'Overall Checklist',
    };

    const formulas = stageStats('formulasLearnt', 'Formulas Learnt');
    const graphs = stageStats('graphsUnderstood', 'Graphs Understood');
    const flashcards = stageStats('flashcardsDone', 'Flashcards Done');
    const pyqs = stageStats('pyqsSolved', 'PYQs Solved');
    const revised = stageStats('revisedX2', 'Revised ×2');

    const map: Partial<Record<AppTab, { pct: number; done: number; total: number; label: string }>> = {
      home: overall,
      web: formulas,
      notes: revised,
      graphs,
      quiz: pyqs,
      flashcards,
      checklist: overall,
      'test-series': pyqs,
    };
    return map;
  }, [state.checklist]);

  const cycleThemeMode = () => {
    const order: ThemeMode[] = ['dark', 'light', 'auto'];
    const currentIdx = order.indexOf(state.settings.theme);
    const nextTheme = order[(currentIdx + 1) % order.length];
    updateSettings({ theme: nextTheme });
  };

  useEffect(() => {
    const onHash = () => {
      const h = window.location.hash;
      if (h === '#audit') {
        setActiveTab('audit');
      } else if (h === '#about' || h.startsWith('#/about')) {
        setActiveTab('about');
      } else if (h.startsWith('#/notes') || h.startsWith('#notes') || /^#(?:c11|0[2-9]|1[0-5])/.test(h)) {
        setActiveTab('notes');
      }
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigateTo = (tab: AppTab, direction?: number) => {
    let resolvedDir = direction ?? 0;
    if (direction === undefined && tab !== activeTab) {
      const fromIdx = ALL_SWIPE_TABS.indexOf(activeTab);
      const toIdx = ALL_SWIPE_TABS.indexOf(tab);
      if (fromIdx !== -1 && toIdx !== -1) {
        resolvedDir = toIdx > fromIdx ? 1 : -1;
      }
    }
    setTabTransitionDir(resolvedDir);
    setActiveTab(tab);
    setMobileMoreOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMainTouchStart = (e: React.TouchEvent<HTMLElement>) => {
    if (
      typeof window === 'undefined' ||
      window.innerWidth >= 1024 ||
      e.touches.length !== 1 ||
      commandPaletteOpen ||
      mentorDrawerOpen ||
      mobileMoreOpen
    ) {
      swipeTouchRef.current = null;
      return;
    }
    const touch = e.touches[0];
    const ignored = shouldIgnoreSwipeTarget(e.target, mainSwipeRef.current);
    swipeTouchRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
      ignored,
      lockedHorizontal: false,
    };
  };

  const handleMainTouchMove = (e: React.TouchEvent<HTMLElement>) => {
    const start = swipeTouchRef.current;
    if (!start || start.ignored || e.touches.length !== 1) {
      if (swipeDragX !== 0) setSwipeDragX(0);
      return;
    }
    const touch = e.touches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;

    if (!start.lockedHorizontal) {
      if (Math.abs(dy) > 16 && Math.abs(dy) >= Math.abs(dx)) {
        start.ignored = true;
        if (swipeDragX !== 0) setSwipeDragX(0);
        return;
      }
      if (Math.abs(dx) > 18 && Math.abs(dx) > Math.abs(dy) * 1.4) {
        start.lockedHorizontal = true;
      }
    }

    if (start.lockedHorizontal) {
      const clamped = Math.max(-28, Math.min(28, dx * 0.25));
      setSwipeDragX(clamped);
    }
  };

  const handleMainTouchEnd = (e: React.TouchEvent<HTMLElement>) => {
    const start = swipeTouchRef.current;
    swipeTouchRef.current = null;
    setSwipeDragX(0);

    if (!start || start.ignored || e.changedTouches.length === 0) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    const elapsed = Date.now() - start.time;

    const isHorizontalSwipe =
      Math.abs(dx) >= 64 &&
      Math.abs(dx) > Math.abs(dy) * 1.5 &&
      (elapsed < 700 || Math.abs(dx) >= 96);

    if (!isHorizontalSwipe) return;

    const tabSequence = MOBILE_SWIPE_TABS.includes(activeTab)
      ? MOBILE_SWIPE_TABS
      : ALL_SWIPE_TABS;
    const currentIdx = tabSequence.indexOf(activeTab);
    if (currentIdx === -1) return;

    // Swipe left (dx < 0) -> next tab; Swipe right (dx > 0) -> previous tab
    const step = dx < 0 ? 1 : -1;
    const nextIdx = currentIdx + step;
    if (nextIdx < 0 || nextIdx >= tabSequence.length) return;

    navigateTo(tabSequence[nextIdx], step);
  };

  const handleMainTouchCancel = () => {
    swipeTouchRef.current = null;
    setSwipeDragX(0);
  };

  const handleJumpToFormula = (formulaId: string) => {
    setLastVisitedFormula(formulaId);
    setFocusedFormulaId(formulaId);
    setActiveTab('web');
    setMobileMoreOpen(false);
  };

  const handleOpenGraph = (graphId: string, formulaId: string) => {
    setLastVisitedFormula(formulaId);
    setFocusedGraphId(graphId);
    setActiveTab('graphs');
  };

  const handleOpenLab = (labId: NonNullable<Formula['labId']>, formulaId: string) => {
    setLastVisitedFormula(formulaId);
    setActiveLab(labId);
    setActiveTab('labs');
  };

  const isMoreTabActive =
    activeTab === 'notes' ||
    activeTab === 'graphs' ||
    activeTab === 'quiz' ||
    activeTab === 'flashcards' ||
    activeTab === 'checklist' ||
    activeTab === 'timer' ||
    activeTab === 'doubt-solver' ||
    activeTab === 'glossary' ||
    activeTab === 'test-series' ||
    activeTab === 'settings' ||
    activeTab === 'about' ||
    activeTab === 'audit';

  return (
    <ErrorBoundary>
      <FirebaseProvider studyState={state} onMergeCloudState={mergeCloudState}>
        <MotionConfig reducedMotion="user">
          <motion.div
            initial={false}
            animate={{
              backgroundColor: resolvedDark ? '#060913' : '#f8fafc',
              color: resolvedDark ? '#f1f5f9' : '#0f172a',
            }}
            transition={THEME_TRANSITION}
            className="relative min-h-dvh physics-grid-bg flex flex-col"
          >
            <ThemeTransitionLayer
              resolvedDark={resolvedDark}
              accent={state.settings.accent}
            />
            <Physics3DScene
              variant="backdrop"
              preset={state.settings.background3dPreset ?? 'em-field'}
              enabled={state.settings.background3dEnabled ?? true}
              isDark={resolvedDark}
              accent={state.settings.accent}
            />
        {/* Top Bar (Responsive full width, compact flex-1 navigation, permanent Settings & About access) */}
        <header className="print:hidden sticky top-0 z-30 h-14 border-b border-slate-200/85 dark:border-slate-800/85 bg-white/92 dark:bg-[#060913]/92 backdrop-blur-md theme-surface-transition">
          <div className="w-full max-w-[1920px] mx-auto h-full px-3 sm:px-4 xl:px-6 flex items-center justify-between gap-2 xl:gap-3">
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="text-base sm:text-lg font-bold tracking-tight bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent whitespace-nowrap shrink-0"
            >
              JEE physics Web - by Kushal
            </button>

            <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 2xl:gap-2 text-xs font-medium overflow-x-auto scrollbar-none flex-1 justify-center min-w-0 px-2 py-1">
              {DESKTOP_NAV.map((item) => {
                const active = activeTab === item.id;
                const progress = sectionProgressMap[item.id];
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigateTo(item.id)}
                    title={
                      progress
                        ? `${item.label} · ${progress.label}: ${progress.pct}% (${progress.done}/${progress.total})`
                        : item.label
                    }
                    aria-label={
                      progress
                        ? `${item.label}, ${progress.pct}% complete`
                        : item.label
                    }
                    className={`relative min-h-[34px] px-2 xl:px-2.5 py-1 rounded-lg whitespace-nowrap shrink-0 transition-colors text-xs cursor-pointer inline-flex items-center gap-1.5 ${
                      active
                        ? 'text-cyan-600 dark:text-cyan-300 font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="desktop-nav-active-pill"
                        transition={TAB_SPRING}
                        className="absolute inset-0 rounded-lg bg-cyan-500/15 border border-cyan-500/35 pointer-events-none"
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                    {progress && (
                      <span
                        className={`relative z-10 font-mono tabular-nums text-[10px] leading-none ${
                          progress.pct === 100
                            ? 'text-emerald-600 dark:text-emerald-300 font-semibold'
                            : active
                              ? 'text-cyan-700 dark:text-cyan-200'
                              : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        {progress.pct}%
                      </span>
                    )}
                    {progress && (
                      <span
                        aria-hidden="true"
                        className="absolute bottom-[2px] left-1.5 right-1.5 h-[2px] rounded-full bg-slate-200/75 dark:bg-slate-800/80 overflow-hidden pointer-events-none"
                      >
                        <motion.span
                          initial={false}
                          animate={{ width: `${progress.pct}%` }}
                          transition={TAB_SPRING}
                          className={`block h-full rounded-full ${
                            progress.pct === 100
                              ? 'bg-emerald-500 dark:bg-emerald-400'
                              : 'bg-cyan-500/85 dark:bg-cyan-400/85'
                          }`}
                        />
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setCommandPaletteOpen(true)}
                aria-label="Open Quick Jump (Ctrl+K)"
                className="min-h-[34px] px-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-100/80 dark:bg-slate-900/80 hover:border-cyan-400 text-xs font-medium text-slate-600 dark:text-slate-300 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Search className="h-3.5 w-3.5 text-cyan-500" />
                <span className="hidden xl:inline">Jump</span>
                <kbd className="hidden sm:inline px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">
                  ⌘K
                </kbd>
              </button>

              {/* Dedicated About Button - Always visible on desktop & tablets */}
              <button
                type="button"
                onClick={() => navigateTo('about')}
                aria-label="About & Philosophy"
                title="About JEE Physics Web & App Philosophy"
                className={`min-h-[34px] px-2.5 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'about'
                    ? 'border-cyan-500 bg-cyan-500/20 text-cyan-600 dark:text-cyan-300'
                    : 'border-slate-200 dark:border-slate-700/80 bg-slate-100/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:border-cyan-400'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5 text-cyan-500" />
                <span className="hidden md:inline">About</span>
              </button>

              <PWAInstallButton />

              {/* Quick Theme Cross-Fade Toggle */}
              <button
                type="button"
                onClick={cycleThemeMode}
                aria-label={`Switch theme (current: ${state.settings.theme})`}
                title={`Theme: ${state.settings.theme === 'auto' ? 'Auto' : state.settings.theme === 'dark' ? 'Dark' : 'Light'} (click to switch)`}
                className="min-h-[34px] min-w-[34px] px-2 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-100/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:border-cyan-400 inline-flex items-center justify-center theme-surface-transition cursor-pointer overflow-hidden"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={state.settings.theme}
                    initial={{ opacity: 0, rotate: -25, scale: 0.8 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 25, scale: 0.8 }}
                    transition={{ duration: 0.18, ease: THEME_TRANSITION.ease }}
                    className="inline-flex items-center justify-center"
                  >
                    {state.settings.theme === 'light' ? (
                      <Sun className="h-4 w-4 text-amber-500" />
                    ) : state.settings.theme === 'auto' ? (
                      <Monitor className="h-4 w-4 text-cyan-500" />
                    ) : (
                      <Moon className="h-4 w-4 text-violet-400" />
                    )}
                  </motion.span>
                </AnimatePresence>
              </button>

              {/* Dedicated Settings Button - Visible across ALL screen sizes & zoom levels */}
              <button
                type="button"
                onClick={() => navigateTo('settings')}
                aria-label="Open Settings"
                title="Settings & Cloud Backup"
                className={`min-h-[34px] px-2.5 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 theme-surface-transition cursor-pointer ${
                  activeTab === 'settings'
                    ? 'border-cyan-500 bg-cyan-500/20 text-cyan-600 dark:text-cyan-300'
                    : 'border-slate-200 dark:border-slate-700/80 bg-slate-100/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:border-cyan-400'
                }`}
              >
                <Settings className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                <span className="hidden md:inline">Settings</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Scrollable Content (supports mobile swipe-to-navigate between tabs) */}
        <main
          ref={mainSwipeRef}
          onTouchStart={handleMainTouchStart}
          onTouchMove={handleMainTouchMove}
          onTouchEnd={handleMainTouchEnd}
          onTouchCancel={handleMainTouchCancel}
          className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 pt-4 pb-24 lg:pb-10 touch-pan-y"
        >
          <motion.div
            animate={{ x: swipeDragX }}
            transition={swipeDragX === 0 ? SWIPE_DRAG_SPRING : { duration: 0 }}
          >
            <AnimatePresence mode="wait" custom={tabTransitionDir}>
              <motion.div
                key={activeTab}
                custom={tabTransitionDir}
                variants={TAB_SLIDE_VARIANTS}
                initial="enter"
                animate="center"
                exit="exit"
              >
              {activeTab === 'home' && (
                <HomePage
                  settings={state.settings}
                  isDark={resolvedDark}
                  knownIds={state.knownIds}
                  bookmarkedIds={state.bookmarkedIds}
                  checklist={state.checklist}
                  flashcards={state.flashcards}
                  mistakes={state.mistakes || []}
                  sessions={state.sessions}
                  streakDays={state.streakDays}
                  todayReviewCount={todayReviewCount}
                  todayStudySeconds={todayStudySeconds}
                  totalFocusXp={totalFocusXp}
                  lastVisitedFormulaId={state.lastVisitedFormulaId}
                  onUpdateSettings={updateSettings}
                  onNavigate={navigateTo}
                  onJumpToFormula={handleJumpToFormula}
                  onOpenQuizMode={(mode) => {
                    setQuizSubMode(mode);
                    navigateTo('quiz');
                  }}
                  onOpenMentor={() => setMentorDrawerOpen(true)}
                />
              )}

              {activeTab === 'web' && (
                <WebPage
                  knownIds={state.knownIds}
                  bookmarkedIds={state.bookmarkedIds}
                  mistakes={state.mistakes || []}
                  focusedFormulaId={focusedFormulaId}
                  onToggleKnown={toggleKnown}
                  onToggleBookmark={toggleBookmark}
                  onJumpToFormula={handleJumpToFormula}
                  onOpenGraph={handleOpenGraph}
                  onOpenLab={handleOpenLab}
                  onFlagMistake={logMistake}
                />
              )}

              {activeTab === 'labs' && (
                <LabsPage
                  activeLab={activeLab}
                  onSelectLab={setActiveLab}
                  knownIds={state.knownIds}
                  bookmarkedIds={state.bookmarkedIds}
                  onToggleKnown={toggleKnown}
                  onToggleBookmark={toggleBookmark}
                  onJumpToFormula={handleJumpToFormula}
                  onFlagMistake={logMistake}
                />
              )}

              {activeTab === 'notes' && (
                <ShortNotesPage
                  onJumpToFormula={handleJumpToFormula}
                  onOpenGraph={handleOpenGraph}
                  onOpenLab={handleOpenLab}
                  background3dEnabled={state.settings.background3dEnabled ?? true}
                  background3dPreset={state.settings.background3dPreset ?? 'em-field'}
                  onUpdateSettings={updateSettings}
                  onFlagMistake={logMistake}
                  externalTarget={shortNotesTarget}
                  onConsumeTarget={() => setShortNotesTarget(null)}
                />
              )}

              {activeTab === 'graphs' && (
                <GraphsPage
                  focusedGraphId={focusedGraphId}
                  onJumpToFormula={handleJumpToFormula}
                />
              )}

              {activeTab === 'quiz' && (
                <QuizPage
                  initialMode={quizSubMode}
                  onModeChange={setQuizSubMode}
                  mistakes={state.mistakes || []}
                  knownIds={state.knownIds}
                  checklist={state.checklist}
                  onJumpToFormula={handleJumpToFormula}
                  onReviewCard={reviewFlashcard}
                  onLogMistake={logMistake}
                  onUpdateMistakeErrorType={updateMistakeErrorType}
                  onToggleMistakeResolved={toggleMistakeResolved}
                  onDeleteMistake={deleteMistake}
                />
              )}

              {activeTab === 'flashcards' && (
                <FlashcardsPage
                  flashcards={state.flashcards}
                  todayReviewCount={todayReviewCount}
                  onReviewCard={reviewFlashcard}
                />
              )}

              {activeTab === 'checklist' && (
                <ChecklistPage
                  items={state.checklist}
                  onToggleStage={toggleChecklistStage}
                  onAddItem={addChecklistItem}
                  onEditItem={editChecklistItem}
                  onDeleteItem={deleteChecklistItem}
                  onReorderItem={reorderChecklistItem}
                />
              )}

              {activeTab === 'timer' && (
                <TimerPage
                  settings={state.settings}
                  sessions={state.sessions}
                  streakDays={state.streakDays}
                  onUpdateSettings={updateSettings}
                  onAddSession={addStudySession}
                  onOpenSharedRooms={() => {
                    setCommunitySubTab('study-rooms');
                    navigateTo('community');
                  }}
                />
              )}

              {activeTab === 'doubt-solver' && (
                <DoubtSolverPage
                  onJumpToFormula={handleJumpToFormula}
                  onOpenLab={handleOpenLab}
                  onOpenMentor={() => setMentorDrawerOpen(true)}
                  onPostDoubtToCommunity={(draft) => {
                    setPendingDoubtDraft(draft);
                    setCommunitySubTab('rooms');
                    navigateTo('community');
                  }}
                />
              )}

              {activeTab === 'glossary' && (
                <GlossaryPage
                  onJumpToFormula={handleJumpToFormula}
                  onOpenLab={handleOpenLab}
                />
              )}

              {activeTab === 'test-series' && (
                <TestSeriesPage
                  onJumpToFormula={handleJumpToFormula}
                  onLogMistake={logMistake}
                  onOpenMistakeNotebook={() => {
                    setQuizSubMode('mistakes');
                    navigateTo('quiz');
                  }}
                />
              )}

              {activeTab === 'community' && (
                <CommunityPage
                  onJumpToFormula={handleJumpToFormula}
                  onAddSession={addStudySession}
                  initialSubTab={communitySubTab}
                  pendingDoubtDraft={pendingDoubtDraft}
                  onConsumeDoubtDraft={() => setPendingDoubtDraft(null)}
                />
              )}

              {activeTab === 'settings' && (
                <SettingsPage
                  settings={state.settings}
                  onUpdateSettings={updateSettings}
                  onExportJson={exportProgressJson}
                  onImportJson={importProgressJson}
                  onResetAll={resetAllProgress}
                  onNavigate={navigateTo}
                  onOpenMentor={() => setMentorDrawerOpen(true)}
                />
              )}

              {activeTab === 'about' && (
                <AboutPage
                  onNavigate={navigateTo}
                  onOpenMentor={() => setMentorDrawerOpen(true)}
                />
              )}

              {activeTab === 'audit' && (
                <AuditPage
                  onNavigate={navigateTo}
                  onJumpToFormula={handleJumpToFormula}
                />
              )}
            </motion.div>
          </AnimatePresence>
          </motion.div>
        </main>

        {/* Offline Connectivity Toast */}
        {!isOnline && (
          <div className="print:hidden fixed bottom-20 lg:bottom-4 left-4 z-40 flex items-center gap-2 rounded-xl bg-amber-500 px-3 py-2 text-xs font-semibold text-slate-950 shadow-lg">
            <WifiOff className="h-4 w-4" />
            <span>Offline Mode — Cached formulas & labs active</span>
          </div>
        )}

        {/* Mobile Bottom Sheet for Study Tools (Flashcards, Checklist, Timer, Settings) */}
        {mobileMoreOpen && (
          <div
            className="print:hidden lg:hidden fixed inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-end"
            onClick={() => setMobileMoreOpen(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-h-[82dvh] overflow-y-auto rounded-t-3xl border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 pb-8 space-y-2 theme-surface-transition"
            >
              <div className="flex items-center justify-between px-2 pb-2">
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Study Tools
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMoreOpen(false)}
                  aria-label="Close tools menu"
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {(
                [
                  { id: 'doubt-solver', label: 'Instant Doubt Solver (Zero-API)', icon: HelpCircle },
                  { id: 'test-series', label: 'JEE Mock Test Series', icon: Award },
                  { id: 'notes', label: 'Short Notes (Units 11–20)', icon: BookOpen },
                  { id: 'glossary', label: 'Physics Glossary (A–Z)', icon: BookMarked },
                  { id: 'graphs', label: 'Interactive Physics Graphs', icon: LineChart },
                  { id: 'quiz', label: 'Rapid-Fire Formula Sprint', icon: Zap },
                  { id: 'flashcards', label: 'Flashcards (Leitner SRS)', icon: Layers },
                  { id: 'checklist', label: 'Chapter Checklist', icon: CheckSquare },
                  { id: 'timer', label: 'Pomodoro & Study Timer', icon: Clock },
                  { id: 'about', label: 'About & App Philosophy', icon: Sparkles },
                  { id: 'settings', label: 'Settings & Cloud Backup', icon: Settings },
                ] as const
              ).map((tool) => {
                const Icon = tool.icon;
                const active = activeTab === tool.id;
                const progress = sectionProgressMap[tool.id];
                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => navigateTo(tool.id)}
                    className={`w-full min-h-[52px] px-4 rounded-2xl flex items-center justify-between gap-3 text-sm font-semibold transition-colors ${
                      active
                        ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30'
                        : 'bg-slate-100 dark:bg-slate-800/70 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <Icon className="h-5 w-5 shrink-0" />
                      <span className="truncate">{tool.label}</span>
                    </span>
                    {progress && (
                      <span className="flex items-center gap-2 shrink-0">
                        <span className="w-14 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <span
                            className={`block h-full rounded-full transition-all duration-300 ${
                              progress.pct === 100
                                ? 'bg-emerald-500'
                                : 'bg-cyan-500 dark:bg-cyan-400'
                            }`}
                            style={{ width: `${progress.pct}%` }}
                          />
                        </span>
                        <span className="font-mono tabular-nums text-[11px] text-slate-500 dark:text-slate-400 w-8 text-right">
                          {progress.pct}%
                        </span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Mobile Thumb-Friendly Fixed Bottom Tab Bar (5 tabs, <= 64px height) */}
        <nav
          aria-label="Primary mobile navigation"
          className="print:hidden lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-[#060913]/95 pb-safe theme-surface-transition"
        >
          <div className="grid grid-cols-5 h-16 items-center">
            {(
              [
                { id: 'home', label: 'Home', icon: Home },
                { id: 'web', label: 'Web', icon: Network },
                { id: 'labs', label: 'Sims', icon: FlaskConical },
                { id: 'community', label: 'Community', icon: Users },
              ] as const
            ).map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              const progress = sectionProgressMap[tab.id];
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => navigateTo(tab.id)}
                  aria-label={progress ? `${tab.label}, ${progress.pct}% complete` : tab.label}
                  className={`relative min-h-[48px] flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors ${
                    active
                      ? 'text-cyan-600 dark:text-cyan-300 font-semibold'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="mobile-nav-active-bar"
                      transition={TAB_SPRING}
                      className="absolute top-0 left-3 right-3 h-0.5 rounded-full bg-cyan-500 dark:bg-cyan-400"
                    />
                  )}
                  <Icon className="h-5 w-5" />
                  <span className="inline-flex items-center gap-1 whitespace-nowrap">
                    <span>{tab.label}</span>
                    {progress && (
                      <span className="font-mono tabular-nums text-[9px] opacity-75">
                        {progress.pct}%
                      </span>
                    )}
                  </span>
                  {progress && (
                    <span
                      aria-hidden="true"
                      className="w-10 h-[2px] rounded-full bg-slate-200/80 dark:bg-slate-800 overflow-hidden"
                    >
                      <span
                        className={`block h-full rounded-full transition-all duration-300 ${
                          progress.pct === 100
                            ? 'bg-emerald-500'
                            : 'bg-cyan-500 dark:bg-cyan-400'
                        }`}
                        style={{ width: `${progress.pct}%` }}
                      />
                    </span>
                  )}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setMobileMoreOpen((o) => !o)}
              className={`relative min-h-[48px] flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors ${
                isMoreTabActive || mobileMoreOpen
                  ? 'text-cyan-600 dark:text-cyan-300 font-semibold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {(isMoreTabActive || mobileMoreOpen) && (
                <motion.span
                  layoutId="mobile-nav-active-bar"
                  transition={TAB_SPRING}
                  className="absolute top-0 left-3 right-3 h-0.5 rounded-full bg-cyan-500 dark:bg-cyan-400"
                />
              )}
              <MoreHorizontal className="h-5 w-5" />
              <span>Tools</span>
            </button>
          </div>
        </nav>
        {/* Global Command Palette (Ctrl+K / Cmd+K) */}
        <CommandPaletteModal
          isOpen={commandPaletteOpen}
          onClose={() => setCommandPaletteOpen(false)}
          onJumpToFormula={handleJumpToFormula}
          onOpenLab={(labId) => {
            setActiveLab(labId);
            navigateTo('labs');
          }}
          onOpenNote={(cls, chapterId) => {
            setShortNotesTarget({ cls, chapterId });
            navigateTo('notes');
          }}
          onOpenGlossary={() => navigateTo('glossary')}
          onOpenAbout={() => navigateTo('about')}
        />
        {/* Global Floating AI Voice & Text JEE Physics Mentor Drawer */}
        <AIMentorDrawer
          isOpen={mentorDrawerOpen}
          onOpenChange={setMentorDrawerOpen}
          settings={state.settings}
          activeTab={activeTab}
          examDate={state.settings.examDate}
          streakDays={state.streakDays}
          todayStudySeconds={todayStudySeconds}
          knownIds={state.knownIds}
          flashcards={state.flashcards}
          mistakes={state.mistakes || []}
          lastVisitedFormulaId={state.lastVisitedFormulaId}
          persistedMessages={state.mentorMessages || []}
          onAppendPersistedMessages={appendMentorMessages}
          onMarkPersistedPlanApplied={markMentorPlanApplied}
          onClearPersistedMessages={clearMentorMessages}
          onSaveTimetableTasks={addDailyTasksBatch}
          onJumpToFormula={handleJumpToFormula}
          onOpenLab={handleOpenLab}
          onOpenSettings={() => navigateTo('settings')}
        />
      </motion.div>
        </MotionConfig>
      </FirebaseProvider>
    </ErrorBoundary>
  );
}
