import React from 'react';
import {
  ArrowRight,
  Atom,
  Award,
  BookOpen,
  Bot,
  Brain,
  CheckCircle2,
  Code2,
  Compass,
  Cpu,
  Eye,
  EyeOff,
  Flame,
  FlaskConical,
  Globe,
  Heart,
  Layers,
  Lightbulb,
  Mail,
  Network,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from 'lucide-react';
import { AppTab } from '../types/physics';

interface AboutPageProps {
  onNavigate: (tab: AppTab) => void;
  onOpenMentor?: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onNavigate,
  onOpenMentor,
}) => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Hero Manifesto */}
      <section className="relative overflow-hidden rounded-3xl border border-cyan-500/35 bg-gradient-to-br from-slate-900/90 via-[#070e20]/95 to-slate-950/90 p-6 sm:p-10 backdrop-blur-xl shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-gradient-to-br from-cyan-500/20 via-violet-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-gradient-to-tr from-emerald-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/35 bg-cyan-500/10 text-cyan-400 text-xs font-semibold tracking-wide">
            <Sparkles className="h-3.5 w-3.5" />
            <span>India&apos;s #1 Physics Revision Web</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Built by a JEE Aspirant, <br />
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-violet-400 bg-clip-text text-transparent">
              Engineered for JEE Aspirants.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            <strong>JEE Physics Web</strong> is a distraction-free, high-performance revision ecosystem designed to bridge the gap between abstract textbook mathematics and true physical intuition. Everything is interlinked, visually alive, and optimized for maximum rank retention.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('web')}
              className="min-h-[44px] px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400 text-slate-950 font-bold text-xs sm:text-sm inline-flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <Network className="h-4 w-4" />
              <span>Explore Formula Web</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            {onOpenMentor && (
              <button
                type="button"
                onClick={onOpenMentor}
                className="min-h-[44px] px-4 rounded-xl border border-violet-500/40 bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 font-semibold text-xs sm:text-sm inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Bot className="h-4 w-4 text-violet-400" />
                <span>Talk to Mini Gemini</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onNavigate('labs')}
              className="min-h-[44px] px-4 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-200 font-semibold text-xs sm:text-sm inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              <FlaskConical className="h-4 w-4 text-emerald-400" />
              <span>Interactive 3D Sims</span>
            </button>
          </div>
        </div>
      </section>

      {/* App Philosophy */}
      <section className="rounded-3xl border border-slate-200 dark:border-slate-800/80 bg-white/85 dark:bg-[#080e1c]/85 p-6 sm:p-8 backdrop-blur-md space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold text-xs uppercase tracking-wider">
            <Compass className="h-4 w-4" />
            <span>Core Values</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
            The App Philosophy
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
            Most physics preparation platforms are cluttered with ads, uncurated question banks, and passive video playlists that create an illusion of competence. We built this platform on five uncompromising tenets:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Pillar 1 */}
          <div className="rounded-2xl border border-cyan-500/25 bg-gradient-to-b from-cyan-500/10 to-transparent p-5 space-y-2.5">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Network className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              1. The Interlinked Mindmap
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Physics is not 29 isolated chapters—it is a single unified tapestry. Coulomb&apos;s Law connects to Newton&apos;s Gravitation by inverse-square analogy, and Biot-Savart mirrors Electrostatic line charges. We reveal the connective tissue so concepts never fade.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="rounded-2xl border border-violet-500/25 bg-gradient-to-b from-violet-500/10 to-transparent p-5 space-y-2.5">
            <div className="h-10 w-10 rounded-xl bg-violet-500/20 border border-violet-500/40 flex items-center justify-center text-violet-400">
              <Atom className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              2. 3D Visual Intuition
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Formulas like Lorentz force <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-cyan-600 dark:text-cyan-300 font-mono">F = q(v × B)</code> and Bohr de Broglie standing waves are difficult to appreciate on flat 2D paper. Real-time 3D Three.js visualizers allow you to drag angles, toggle field probes, and develop physical gut instinct.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="rounded-2xl border border-emerald-500/25 bg-gradient-to-b from-emerald-500/10 to-transparent p-5 space-y-2.5">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Brain className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              3. Active Recall &amp; SRS
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Passive reading creates zero memory retention under exam pressure. With our 5-Box Leitner Spaced Repetition system, Mistake Notebook, and Formula Blur Recall Mode ($E = ???$), your brain is actively challenged to reconstruct equations.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="rounded-2xl border border-amber-500/25 bg-gradient-to-b from-amber-500/10 to-transparent p-5 space-y-2.5">
            <div className="h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              4. Zero Distraction Sanctuary
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              No sponsored banners, no promotional popups, no recommendation rabbit holes. Just pure, dark-mode glassmorphic focus built for 3-hour deep work sprints with integrated Pomodoro timers and offline-ready PWA service workers.
            </p>
          </div>

          {/* Pillar 5 */}
          <div className="rounded-2xl border border-pink-500/25 bg-gradient-to-b from-pink-500/10 to-transparent p-5 space-y-2.5">
            <div className="h-10 w-10 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400">
              <Bot className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              5. Hybrid Mini Gemini AI
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              A companion that acts as your personal JEE Physics tutor. Ask doubts via voice or text, get structured daily timetables saved directly to your checklist, and if internet drops, the Built-in Offline Engine answers calculations seamlessly.
            </p>
          </div>

          {/* Pillar 6 */}
          <div className="rounded-2xl border border-indigo-500/25 bg-gradient-to-b from-indigo-500/10 to-transparent p-5 space-y-2.5">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Flame className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              6. Exam Trap Awareness
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              In JEE Main, 40% of marks are lost to negative marking—sign traps, radius vs diameter, series vs parallel slip-ups, and dimensional inversions. Every formula card and note highlights the exact trap verified in past 5-year PYQs.
            </p>
          </div>
        </div>
      </section>

      {/* What is Here? (The Core Feature Arsenal) */}
      <section className="rounded-3xl border border-slate-200 dark:border-slate-800/80 bg-white/85 dark:bg-[#080e1c]/85 p-6 sm:p-8 backdrop-blur-md space-y-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold text-xs uppercase tracking-wider">
            <Zap className="h-4 w-4" />
            <span>Platform Arsenal</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            What Makes JEE Physics Web Unique
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            An overview of all modules engineered into this all-in-one revision station:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Card 1 */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                <Network className="h-4 w-4 text-cyan-500" />
                Interlinked Formula Mindmap
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-300">
                29 Chapters
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Interactive node graph linking derivations, conditions, variable meanings in SI units, analog equations (e.g. Mass $\leftrightarrow$ Inductance), and direct jumps to 3D sims.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                <FlaskConical className="h-4 w-4 text-emerald-500" />
                Interactive 3D Simulations &amp; Labs
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
                10+ Simulators
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              True 3D vector cross-product viewer, Biot-Savart loops, Bohr standing waves, RLC resonance phasors, and cavity superposition allowing live parameter sliders.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-violet-500" />
                Short Notes with Blur-Recall Mode
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-300">
                Units 1–20
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              High-yield only filters, exam traps, and the revolutionary <strong>Formula Blur Mode</strong> that masks right-hand equations ($E = ???$) for instant active recall testing.
            </p>
          </div>

          {/* Card 4 */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                <Layers className="h-4 w-4 text-amber-500" />
                Leitner SRS Flashcards &amp; Mistake Radar
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-300">
                5-Box Algorithm
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Automated spaced repetition tracking formula retention across days. Mistake notebook categorizes errors into sign-traps, formula-slips, or concept-gaps.
            </p>
          </div>

          {/* Card 5 */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                <Bot className="h-4 w-4 text-cyan-400" />
                Mini Gemini Voice &amp; Text AI Mentor
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-300">
                Voice + Text
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Global floating drawer accessible from any screen (`Ctrl+Shift+M`). Answers numericals with LaTeX steps, reads aloud with Web Speech synthesis, and auto-generates study timetables.
            </p>
          </div>

          {/* Card 6 */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                <Award className="h-4 w-4 text-rose-500" />
                Rapid Sprint &amp; JEE Mock Test Series
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-300">
                Timed Drills
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Real-time countdown formula sprints, chapter checklists, dimensional sanity traps, and full mock tests reflecting official April 2026/2025 question distributions.
            </p>
          </div>
        </div>
      </section>

      {/* Developer Attribution Card */}
      <section className="rounded-3xl border border-cyan-500/35 bg-gradient-to-br from-cyan-500/10 via-slate-900/80 to-violet-500/10 p-6 sm:p-8 backdrop-blur-md relative overflow-hidden space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-violet-500/30 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shadow-md">
              <Code2 className="h-6 w-6" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                Architect &amp; Developer
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                Kushal
              </h3>
            </div>
          </div>

          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-emerald-700 dark:text-emerald-300 inline-flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" />
            <span>Official Author · Verified in Backend</span>
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
          &quot;I am in <strong>Class 12</strong> and currently preparing for <strong>IIT-JEE</strong>. Like thousands of aspirants, I was frustrated by scattered PDFs, unorganized formula sheets, and passive coaching videos. I created <strong>JEE Physics Web</strong> to give aspirants a single, interlinked, high-performance command center where physics feels visual, connected, and unforgettable.&quot;
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href="mailto:kushalkj2009@gmail.com"
            className="min-h-[40px] px-4 rounded-xl border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-200 text-xs font-semibold inline-flex items-center gap-2 transition-colors"
          >
            <Mail className="h-4 w-4" />
            <span>kushalkj2009@gmail.com</span>
          </a>

          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 ml-auto">
            <span>Crafted with</span>
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
            <span>for future IITians across India.</span>
          </div>
        </div>
      </section>
    </div>
  );
};
