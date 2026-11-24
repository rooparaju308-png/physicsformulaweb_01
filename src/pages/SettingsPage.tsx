import React, { useEffect, useState } from 'react';
import {
  Bot,
  CheckCircle2,
  ClipboardCheck,
  Cloud,
  Code2,
  Download,
  Eye,
  EyeOff,
  KeyRound,
  LogOut,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  Users,
} from 'lucide-react';
import { AccentPalette, AppSettings, AppTab, Background3DPreset, ThemeMode } from '../types/physics';
import { PWAInstallButton } from '../components/PWAInstallButton';
import { AboutDeveloperCard } from '../components/AboutDeveloperCard';
import { useFirebase } from '../contexts/FirebaseContext';
import {
  clearCustomGeminiKey,
  getCustomGeminiKey,
  maskGeminiKey,
  saveCustomGeminiKey,
  subscribeCustomGeminiKey,
} from '../utils/aiKeyStorage';
import { verifyCustomGeminiKey } from '../services/mentorService';

interface SettingsPageProps {
  settings: AppSettings;
  onUpdateSettings: (patch: Partial<AppSettings>) => void;
  onExportJson: () => string;
  onImportJson: (text: string) => boolean;
  onResetAll: () => void;
  onNavigate: (tab: AppTab) => void;
  onOpenMentor?: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  onUpdateSettings,
  onExportJson,
  onImportJson,
  onResetAll,
  onNavigate,
  onOpenMentor,
}) => {
  const {
    user,
    profile,
    actionLoading,
    syncStatus,
    joinAsGuest,
    signInWithGmail,
    upgradeGuestToGmail,
    signOutKeepData,
  } = useFirebase();
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  // Local-only Custom Gemini API Key state (never synced to cloud or JSON exports)
  const [savedApiKey, setSavedApiKey] = useState<string>(() => getCustomGeminiKey());
  const [apiKeyInput, setApiKeyInput] = useState<string>(() => getCustomGeminiKey());
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeyNotice, setApiKeyNotice] = useState<{
    tone: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);
  const [verifyingKey, setVerifyingKey] = useState(false);

  useEffect(() => {
    return subscribeCustomGeminiKey(() => {
      const current = getCustomGeminiKey();
      setSavedApiKey(current);
      setApiKeyInput(current);
    });
  }, []);

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = apiKeyInput.trim();
    if (!trimmed) {
      clearCustomGeminiKey();
      setSavedApiKey('');
      setApiKeyNotice({
        tone: 'info',
        text: 'Custom key cleared. Physics Mentor reverted to default mode.',
      });
      return;
    }
    if (trimmed.length < 20 || /\s/.test(trimmed)) {
      setApiKeyNotice({
        tone: 'error',
        text: 'Invalid format. Gemini API keys should be at least 20 characters with no spaces.',
      });
      return;
    }
    const ok = saveCustomGeminiKey(trimmed);
    if (ok) {
      setSavedApiKey(trimmed);
      setApiKeyNotice({
        tone: 'success',
        text: 'Custom Gemini API key saved locally in this browser. AIMentorDrawer will now use it automatically.',
      });
    } else {
      setApiKeyNotice({
        tone: 'error',
        text: 'Could not access browser localStorage to save key.',
      });
    }
  };

  const handleVerifyApiKey = async () => {
    const candidate = apiKeyInput.trim() || savedApiKey.trim();
    if (!candidate) {
      setApiKeyNotice({
        tone: 'error',
        text: 'Paste a Gemini API key first before testing.',
      });
      return;
    }
    setVerifyingKey(true);
    setApiKeyNotice(null);
    const result = await verifyCustomGeminiKey(candidate);
    setVerifyingKey(false);
    if (result.valid) {
      saveCustomGeminiKey(candidate);
      setSavedApiKey(candidate);
      setApiKeyNotice({
        tone: result.note ? 'info' : 'success',
        text:
          result.note ||
          'Verified and saved! Your custom key is active for Physics Mentor.',
      });
    } else {
      setApiKeyNotice({
        tone: 'error',
        text: result.error || 'Verification failed. Check that your Gemini API key is active.',
      });
    }
  };

  const handleClearApiKey = () => {
    clearCustomGeminiKey();
    setSavedApiKey('');
    setApiKeyInput('');
    setShowApiKey(false);
    setApiKeyNotice({
      tone: 'info',
      text: 'Custom key removed. Physics Mentor now uses the default mode.',
    });
  };

  const handleDownloadJson = () => {
    const data = onExportJson();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jee-physics-web-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusMsg('Progress JSON exported.');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const ok = onImportJson(String(reader.result || ''));
      setStatusMsg(ok ? 'Progress restored from JSON backup.' : 'Invalid JSON backup file.');
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
          Settings & Backup
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Customize theme, accent colors, font scale, offline installation, and JSON backup.
        </p>
      </div>

      {/* Account & Non-Erasing Cloud Sync */}
      <section className="rounded-2xl border border-cyan-500/35 studio-surface p-5 space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Cloud className="h-4 w-4 text-cyan-500" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Cloud Sync &amp; Account (Non-Erasing)
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-300">
            {user
              ? syncStatus === 'syncing'
                ? 'Syncing...'
                : 'Local + Cloud Merged & Preserved'
              : 'Local Storage Active'}
          </span>
        </div>

        {user && profile ? (
          <div className="space-y-3">
            <div className="rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <div className="font-bold text-slate-900 dark:text-slate-100">
                  {profile.displayName}{' '}
                  <span className="font-mono text-cyan-600 dark:text-cyan-300">
                    ({profile.guestCode})
                  </span>
                </div>
                <div className="text-slate-500 dark:text-slate-400">
                  {profile.authType === 'gmail'
                    ? `Gmail linked (${user.email || 'verified'}) — cloud backup never erased on sign-out`
                    : 'Guest ID session active — link Gmail anytime to permanently back up across devices'}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {profile.authType === 'guest' && (
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={upgradeGuestToGmail}
                    className="min-h-[38px] px-3 rounded-lg bg-gradient-to-r from-violet-500 to-cyan-500 text-slate-950 font-bold inline-flex items-center gap-1.5"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Link Gmail</span>
                  </button>
                )}
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={signOutKeepData}
                  className="min-h-[38px] px-3 rounded-lg border border-slate-300 dark:border-slate-700 font-semibold inline-flex items-center gap-1.5"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sign in with a no-account Guest ID or your Gmail account. Local progress and existing Gmail cloud backups are merged automatically and never erased.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => joinAsGuest()}
                className="min-h-[42px] px-4 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold inline-flex items-center gap-1.5"
              >
                <Users className="h-4 w-4" />
                <span>Join with Guest ID</span>
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={signInWithGmail}
                className="min-h-[42px] px-4 rounded-xl bg-violet-500 text-white text-xs font-bold inline-flex items-center gap-1.5"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Sign In with Gmail</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* AI Configuration (Browser-Only Custom Gemini Key) */}
      <section className="rounded-2xl border border-violet-500/35 studio-surface p-5 space-y-3.5">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-violet-500" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              AI Configuration
            </h3>
          </div>
          <span
            className={`text-[11px] font-semibold inline-flex items-center gap-1 ${
              savedApiKey
                ? 'text-emerald-600 dark:text-emerald-300'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {savedApiKey ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Custom Key Active ({maskGeminiKey(savedApiKey)})</span>
              </>
            ) : (
              <span>Default Mode Active</span>
            )}
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Optionally connect your own Gemini API key for the <strong>Physics Mentor</strong> assistant. Your key stays strictly in this browser&apos;s <code className="font-mono text-[11px]">localStorage</code> (never synced to Firebase cloud or JSON backups). If left blank, the mentor falls back automatically to the default server/local mode.
        </p>

        <form onSubmit={handleSaveApiKey} className="space-y-2.5">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="Paste your Gemini API key (AIza...)"
                aria-label="Custom Gemini API key"
                autoComplete="off"
                spellCheck={false}
                className="w-full min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 pl-3 pr-11 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-violet-400"
              />
              <button
                type="button"
                onClick={() => setShowApiKey((v) => !v)}
                aria-label={showApiKey ? 'Hide API key' : 'Show API key'}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 w-9 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <button
              type="submit"
              className="min-h-[44px] px-4 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-slate-950 text-xs font-bold inline-flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
            >
              <KeyRound className="h-3.5 w-3.5" />
              <span>Save Key</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={verifyingKey}
              onClick={handleVerifyApiKey}
              className="min-h-[38px] px-3.5 rounded-xl border border-cyan-500/35 bg-cyan-500/10 text-cyan-700 dark:text-cyan-200 text-xs font-semibold inline-flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{verifyingKey ? 'Testing Key...' : 'Test & Save Key'}</span>
            </button>

            {savedApiKey && (
              <button
                type="button"
                onClick={handleClearApiKey}
                className="min-h-[38px] px-3.5 rounded-xl border border-rose-500/35 text-rose-600 dark:text-rose-300 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear Key</span>
              </button>
            )}

            {onOpenMentor && (
              <button
                type="button"
                onClick={onOpenMentor}
                className="min-h-[38px] px-3.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer sm:ml-auto"
              >
                <Bot className="h-3.5 w-3.5 text-cyan-500" />
                <span>Open Physics Mentor</span>
              </button>
            )}
          </div>
        </form>

        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Security note: Keys are sent directly over HTTPS to this app&apos;s <code className="font-mono">/api/mentor/*</code> backend routes per request. Avoid saving personal API keys on shared or public devices.
        </p>

        {apiKeyNotice && (
          <div
            className={`text-xs font-medium rounded-xl px-3 py-2 border ${
              apiKeyNotice.tone === 'success'
                ? 'border-emerald-500/35 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                : apiKeyNotice.tone === 'error'
                  ? 'border-rose-500/35 bg-rose-500/10 text-rose-700 dark:text-rose-300'
                  : 'border-slate-300 dark:border-slate-700 bg-slate-100/80 dark:bg-slate-900/70 text-slate-700 dark:text-slate-300'
            }`}
          >
            {apiKeyNotice.text}
          </div>
        )}
      </section>

      {/* About & App Creator Attribution */}
      <section className="rounded-2xl border border-cyan-500/35 studio-surface p-5 space-y-3.5">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-cyan-500" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              About &amp; App Creator
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-300">
            Official Author Secured in Backend
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          JEE Physics Web and Mini Gemini were designed and developed by <strong className="text-slate-900 dark:text-slate-100">Kushal</strong> (Class 12 JEE Aspirant &amp; Full-Stack Creator). Developer attribution and contact info are securely locked in the backend so authentic credit is always preserved.
        </p>

        <div className="rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 p-4 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">Kushal</span>
            <span className="font-mono text-[11px] text-cyan-600 dark:text-cyan-400">kushalkj2009@gmail.com</span>
          </div>
          <div className="text-slate-600 dark:text-slate-300">
            Class 12 JEE Aspirant &amp; Full-Stack Creator building high-performance study web apps.
          </div>

          <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between gap-2 flex-wrap">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              India&apos;s #1 Interlinked Physics Revision Hub
            </span>
            <button
              type="button"
              onClick={() => onNavigate('about')}
              className="min-h-[36px] px-3.5 rounded-xl border border-cyan-500/35 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-200 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-cyan-500" />
              <span>Read Full App Philosophy</span>
            </button>
          </div>
        </div>
      </section>

      {/* Appearance */}
      <section className="rounded-2xl border studio-surface p-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Appearance</h3>

        <div className="space-y-2">
          <div className="text-xs text-slate-500 dark:text-slate-400">Theme Mode</div>
          <div className="grid grid-cols-3 gap-2">
            {(['dark', 'light', 'auto'] as ThemeMode[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => onUpdateSettings({ theme: t })}
                className={`min-h-[44px] rounded-xl text-xs font-semibold capitalize border transition-colors ${
                  settings.theme === t
                    ? 'border-cyan-400 bg-cyan-500/15 text-cyan-700 dark:text-cyan-200'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs text-slate-500 dark:text-slate-400">Accent Palette</div>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { id: 'cyan-violet', label: 'Cyan · Violet' },
                { id: 'emerald-teal', label: 'Emerald · Teal' },
                { id: 'amber-rose', label: 'Amber · Rose' },
              ] as { id: AccentPalette; label: string }[]
            ).map((acc) => (
              <button
                key={acc.id}
                type="button"
                onClick={() => onUpdateSettings({ accent: acc.id })}
                className={`min-h-[44px] rounded-xl text-xs font-semibold border transition-colors ${
                  settings.accent === acc.id
                    ? 'border-cyan-400 bg-cyan-500/15 text-cyan-700 dark:text-cyan-200'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {acc.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs text-slate-500 dark:text-slate-400">Typography Scale</div>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { id: 'sm', label: 'Compact' },
                { id: 'md', label: 'Standard' },
                { id: 'lg', label: 'Large' },
              ] as const
            ).map((fs) => (
              <button
                key={fs.id}
                type="button"
                onClick={() => onUpdateSettings({ fontSize: fs.id })}
                className={`min-h-[44px] rounded-xl text-xs font-semibold border transition-colors ${
                  settings.fontSize === fs.id
                    ? 'border-cyan-400 bg-cyan-500/15 text-cyan-700 dark:text-cyan-200'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {fs.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3D Physics Backdrop & Motion Controls */}
        <div className="pt-2 border-t border-slate-200/70 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-cyan-500" />
                <span>3D Physics Backdrop</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Interactive WebGL background &amp; Home Hero 3D stage (auto-pauses with Reduced Motion).
              </p>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950/80 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0">
              {([
                { val: true, label: 'On' },
                { val: false, label: 'Off' },
              ] as const).map((opt) => {
                const isActive = (settings.background3dEnabled ?? true) === opt.val;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => onUpdateSettings({ background3dEnabled: opt.val })}
                    className={`min-h-[34px] px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="text-xs text-slate-500 dark:text-slate-400">3D Scene Preset</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(
                [
                  {
                    id: 'em-field',
                    title: 'EM Field & Particles',
                    desc: '3D dipole tubes & flowing charged particles',
                  },
                  {
                    id: 'quantum-wave',
                    title: 'Quantum Wave & Orbitals',
                    desc: 'Undulating wave-function mesh & orbital rings',
                  },
                ] as { id: Background3DPreset; title: string; desc: string }[]
              ).map((preset) => {
                const active = (settings.background3dPreset ?? 'em-field') === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() =>
                      onUpdateSettings({
                        background3dPreset: preset.id,
                        background3dEnabled: true,
                      })
                    }
                    className={`min-h-[54px] p-3 rounded-xl text-left border transition-colors cursor-pointer ${
                      active
                        ? 'border-cyan-400 bg-cyan-500/12 text-cyan-800 dark:text-cyan-200'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-cyan-500/40'
                    }`}
                  >
                    <div className="text-xs font-bold">{preset.title}</div>
                    <div className="text-[11px] opacity-75">{preset.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Study Target */}
      <section className="rounded-2xl border studio-surface p-5 space-y-3">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Exam & Daily Goal</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-slate-500 dark:text-slate-400 mb-1">JEE Main Exam Date</label>
            <input
              type="date"
              value={settings.examDate}
              onChange={(e) => onUpdateSettings({ examDate: e.target.value, examDateConfigured: true })}
              className="w-full min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 px-3 text-slate-900 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="block text-slate-500 dark:text-slate-400 mb-1">Daily Study Goal (minutes)</label>
            <input
              type="number"
              min={15}
              max={600}
              step={15}
              value={settings.dailyGoalMinutes}
              onChange={(e) => onUpdateSettings({ dailyGoalMinutes: Math.max(15, Number(e.target.value)) })}
              className="w-full min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 px-3 text-slate-900 dark:text-slate-100 tabular-nums"
            />
          </div>
        </div>
      </section>

      {/* PWA Install & Offline Data */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/85 dark:bg-slate-900/65 p-5 space-y-3">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Offline PWA & Progress Data
        </h3>
        <div className="flex flex-wrap items-center gap-2.5">
          <PWAInstallButton />

          <button
            type="button"
            onClick={handleDownloadJson}
            className="min-h-[44px] px-4 rounded-xl border border-cyan-500/35 bg-cyan-500/10 text-cyan-700 dark:text-cyan-200 text-xs font-semibold inline-flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            <span>Export JSON</span>
          </button>

          <label className="min-h-[44px] px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold inline-flex items-center gap-2 cursor-pointer">
            <Upload className="h-4 w-4" />
            <span>Import JSON</span>
            <input type="file" accept=".json,application/json" onChange={handleImportFile} className="hidden" />
          </label>

          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="min-h-[44px] px-4 rounded-xl border border-rose-500/35 text-rose-600 dark:text-rose-300 text-xs font-semibold inline-flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset Progress</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onResetAll();
                  setConfirmReset(false);
                  setStatusMsg('All progress reset to defaults.');
                }}
                className="min-h-[44px] px-4 rounded-xl bg-rose-500 text-white text-xs font-semibold"
              >
                Confirm Reset
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="min-h-[44px] px-3 rounded-xl border border-slate-300 dark:border-slate-700 text-xs"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {statusMsg && (
          <div className="text-xs font-medium text-emerald-600 dark:text-emerald-300">{statusMsg}</div>
        )}
      </section>

      {/* Formula Completeness Audit Access */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/85 dark:bg-slate-900/65 p-4 flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Formula Completeness Audit
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Verify chapter formula counts, graph coverage & link integrity against Part A.
          </div>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('audit')}
          className="min-h-[44px] px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 inline-flex items-center gap-1.5 whitespace-nowrap"
        >
          <ClipboardCheck className="h-4 w-4" />
          <span>Open Audit</span>
        </button>
      </section>
    </div>
  );
};
