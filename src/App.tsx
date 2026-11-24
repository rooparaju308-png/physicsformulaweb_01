import React, { useEffect, useState } from 'react';
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
  MoreHorizontal,
  Network,
  Search,
  Settings,
  Sparkles,
  Users,
  WifiOff,
  X,
  Zap,
} from 'lucide-react';
import { AppTab, DoubtCommunityDraft, Formula } from './types/physics';
import { useAppStore } from './store/useAppStore';
import { useOnlineStatus } from './hooks/usePWAInstall';
import { ErrorBoundary } from './components/ErrorBoundary';
import { FirebaseProvider } from './contexts/FirebaseContext';
import { PWAInstallButton } from './components/PWAInstallButton';
import { Physics3DScene } from './components/Physics3DScene';
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

  const navigateTo = (tab: AppTab) => {
    setActiveTab(tab);
    setMobileMoreOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          <div className="relative min-h-dvh bg-slate-50 dark:bg-[#060913] text-slate-900 dark:text-slate-100 physics-grid-bg transition-colors duration-200 flex flex-col">
            <Physics3DScene
              variant="backdrop"
              preset={state.settings.background3dPreset ?? 'em-field'}
              enabled={state.settings.background3dEnabled ?? true}
              isDark={resolvedDark}
              accent={state.settings.accent}
            />
        {/* Top Bar (Compact 52px on mobile, clean 3-zone on desktop) */}
        <header className="sticky top-0 z-30 h-14 border-b border-slate-200/85 dark:border-slate-800/85 bg-white/92 dark:bg-[#060913]/92">
          <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="text-base sm:text-lg font-bold tracking-tight bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent whitespace-nowrap shrink-0"
            >
              JEE physics Web - by Kushal
            </button>

            <nav className="hidden lg:flex items-center gap-2.5 xl:gap-3.5 text-xs xl:text-sm font-medium">
              {DESKTOP_NAV.map((item) => {
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigateTo(item.id)}
                    className={`min-h-[40px] px-1 whitespace-nowrap shrink-0 transition-colors border-b-2 ${
                      active
                        ? 'border-cyan-400 text-cyan-600 dark:text-cyan-300 font-semibold'
                        : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setCommandPaletteOpen(true)}
                aria-label="Open Quick Jump (Ctrl+K)"
                className="min-h-[36px] px-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-100/80 dark:bg-slate-900/80 hover:border-cyan-400 text-xs font-medium text-slate-600 dark:text-slate-300 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Search className="h-3.5 w-3.5 text-cyan-500" />
                <span className="hidden xl:inline">Jump</span>
                <kbd className="hidden sm:inline px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">
                  ⌘K
                </kbd>
              </button>
              <PWAInstallButton />
              <button
                type="button"
                onClick={() => navigateTo('settings')}
                aria-label="Open Settings"
                className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60"
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Scrollable Content */}
        <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 pt-4 pb-24 lg:pb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.16 }}
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
        </main>

        {/* Offline Connectivity Toast */}
        {!isOnline && (
          <div className="fixed bottom-20 lg:bottom-4 left-4 z-40 flex items-center gap-2 rounded-xl bg-amber-500 px-3 py-2 text-xs font-semibold text-slate-950 shadow-lg">
            <WifiOff className="h-4 w-4" />
            <span>Offline Mode — Cached formulas & labs active</span>
          </div>
        )}

        {/* Mobile Bottom Sheet for Study Tools (Flashcards, Checklist, Timer, Settings) */}
        {mobileMoreOpen && (
          <div
            className="lg:hidden fixed inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-end"
            onClick={() => setMobileMoreOpen(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-h-[82dvh] overflow-y-auto rounded-t-3xl border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 pb-8 space-y-2"
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
                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => navigateTo(tool.id)}
                    className={`w-full min-h-[52px] px-4 rounded-2xl flex items-center gap-3 text-sm font-semibold transition-colors ${
                      active
                        ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30'
                        : 'bg-slate-100 dark:bg-slate-800/70 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span>{tool.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Mobile Thumb-Friendly Fixed Bottom Tab Bar (5 tabs, <= 64px height) */}
        <nav
          aria-label="Primary mobile navigation"
          className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-[#060913]/95 pb-safe"
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
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => navigateTo(tab.id)}
                  className={`min-h-[48px] flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors ${
                    active
                      ? 'text-cyan-600 dark:text-cyan-300 font-semibold'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setMobileMoreOpen((o) => !o)}
              className={`min-h-[48px] flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors ${
                isMoreTabActive || mobileMoreOpen
                  ? 'text-cyan-600 dark:text-cyan-300 font-semibold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
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
      </div>
        </MotionConfig>
      </FirebaseProvider>
    </ErrorBoundary>
  );
}
