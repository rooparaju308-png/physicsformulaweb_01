import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Bot,
  CalendarPlus,
  Check,
  Copy,
  Database,
  EyeOff,
  FlaskConical,
  KeyRound,
  Lightbulb,
  Mic,
  MicOff,
  Network,
  RotateCcw,
  Send,
  ShieldCheck,
  Sparkles,
  Square,
  Trash2,
  Volume2,
  VolumeX,
  WifiOff,
  X,
} from 'lucide-react';
import { CHAPTERS, FORMULAS } from '../data/formulas';
import {
  AccentPalette,
  AppSettings,
  AppTab,
  FlashcardProgress,
  Formula,
  MentorMessage,
  MistakeEntry,
} from '../types/physics';
import {
  cleanTextForBrowserSpeech,
  fetchMentorServerStatus,
  MentorEnginePreference,
  requestMentorSpeechAudio,
  sendMentorTurn,
  transcribeRecordedAudio,
} from '../services/mentorService';
import { hasCustomGeminiKey, subscribeCustomGeminiKey } from '../utils/aiKeyStorage';
import { MentorStudyContext } from '../utils/localMentorEngine';
import { MentorMessageContent } from './MentorMessageContent';

interface AIMentorDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  settings: AppSettings;
  activeTab: AppTab;
  examDate: string;
  streakDays: number;
  todayStudySeconds: number;
  knownIds: string[];
  flashcards: Record<string, FlashcardProgress>;
  mistakes: MistakeEntry[];
  lastVisitedFormulaId: string;
  persistedMessages: MentorMessage[];
  onAppendPersistedMessages: (msgs: MentorMessage[]) => void;
  onMarkPersistedPlanApplied: (messageId: string) => void;
  onClearPersistedMessages: () => void;
  onSaveTimetableTasks: (taskLabels: string[]) => void;
  onJumpToFormula: (formulaId: string) => void;
  onOpenLab: (labId: NonNullable<Formula['labId']>, formulaId: string) => void;
  onOpenSettings?: () => void;
}

const STARTER_PROMPTS = [
  'Give me 3 personalized study tips for today',
  'Build my 3-hour study timetable today',
  'Review my weak topics and open mistakes',
  'Electron accelerated by 400 V find de broglie wavelength',
];

const FOLLOW_UP_CHIPS = [
  'Summarize in 2 crisp lines',
  'Common JEE traps on this?',
  'Give 1 quick practice numerical',
  'Turn into today’s study plan',
];

const SPEECH_RATES = [0.9, 1.0, 1.15, 1.3] as const;

interface BrowserSpeechRecognitionAlternative {
  transcript: string;
}

interface BrowserSpeechRecognitionResult {
  isFinal?: boolean;
  length: number;
  [index: number]: BrowserSpeechRecognitionAlternative;
}

interface BrowserSpeechRecognitionEvent {
  resultIndex?: number;
  results: ArrayLike<BrowserSpeechRecognitionResult>;
}

interface BrowserSpeechRecognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((ev: BrowserSpeechRecognitionEvent) => void) | null;
  onerror: ((ev: { error?: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

function getSpeechRecognitionCtor(): (new () => BrowserSpeechRecognition) | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => BrowserSpeechRecognition;
    webkitSpeechRecognition?: new () => BrowserSpeechRecognition;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

function splitIntoSpeechChunks(text: string, maxLen = 200): string[] {
  const clean = cleanTextForBrowserSpeech(text);
  if (!clean) return [];
  const sentences = clean.split(/(?<=[.!?])\s+/);
  const chunks: string[] = [];
  let current = '';

  for (const sentence of sentences) {
    if (!sentence) continue;
    if ((current + ' ' + sentence).trim().length <= maxLen) {
      current = (current + ' ' + sentence).trim();
    } else {
      if (current) chunks.push(current);
      if (sentence.length <= maxLen) {
        current = sentence;
      } else {
        // Hard-wrap overly long clauses on word boundaries
        const words = sentence.split(/\s+/);
        let buf = '';
        for (const w of words) {
          if ((buf + ' ' + w).trim().length <= maxLen) {
            buf = (buf + ' ' + w).trim();
          } else {
            if (buf) chunks.push(buf);
            buf = w;
          }
        }
        current = buf;
      }
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

const FORMULA_BY_ID = new Map(FORMULAS.map((f) => [f.id, f]));
const CHAPTER_TITLE_BY_ID = new Map<string, string>(CHAPTERS.map((c) => [c.id, c.shortTitle]));

export const AIMentorDrawer: React.FC<AIMentorDrawerProps> = ({
  isOpen,
  onOpenChange,
  activeTab,
  examDate,
  streakDays,
  todayStudySeconds,
  knownIds,
  flashcards,
  mistakes,
  lastVisitedFormulaId,
  persistedMessages,
  onAppendPersistedMessages,
  onMarkPersistedPlanApplied,
  onClearPersistedMessages,
  onSaveTimetableTasks,
  onJumpToFormula,
  onOpenLab,
  onOpenSettings,
  settings,
}) => {
  const [enginePreference, setEnginePreference] = useState<MentorEnginePreference>('smart');
  const [serverAiAvailable, setServerAiAvailable] = useState<boolean | null>(null);
  const [customKeyActive, setCustomKeyActive] = useState<boolean>(() => hasCustomGeminiKey());
  const [voiceReplyEnabled, setVoiceReplyEnabled] = useState(true);
  const [speechRate, setSpeechRate] = useState<number>(1.05);
  const [useStudioVoice, setUseStudioVoice] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceUri, setSelectedVoiceUri] = useState<string>('');
  const [sessionOnlyMode, setSessionOnlyMode] = useState(false);
  const [useStudyContext, setUseStudyContext] = useState(true);

  const [sessionMessages, setSessionMessages] = useState<MentorMessage[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [statusNote, setStatusNote] = useState<string | null>(null);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  // Voice capture state (Web Speech Recognition primary + MediaRecorder fallback)
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSource, setRecordingSource] = useState<'speech-rec' | 'audio-rec' | null>(null);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [recordingSec, setRecordingSec] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  // Spoken playback state
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const speechRecRef = useRef<BrowserSpeechRecognition | null>(null);
  const interimTranscriptRef = useRef<string>('');
  const speechSessionCancelledRef = useRef<boolean>(false);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const messages = sessionOnlyMode ? sessionMessages : persistedMessages;
  const speechSynthesisSupported =
    typeof window !== 'undefined' && 'speechSynthesis' in window;
  const speechRecSupported = Boolean(getSpeechRecognitionCtor());

  // Populate Web Speech API voices smoothly
  useEffect(() => {
    if (!speechSynthesisSupported) return;
    const loadVoices = () => {
      const voices = window.speechSynthesis
        .getVoices()
        .filter((v) => v.lang.toLowerCase().startsWith('en'));
      setAvailableVoices(voices);
      if (voices.length > 0 && !selectedVoiceUri) {
        const preferred =
          voices.find((v) => v.lang.toLowerCase().includes('en-in')) ||
          voices.find((v) => /natural|google|samantha|aria|jenny/i.test(v.name)) ||
          voices[0];
        if (preferred) {
          setSelectedVoiceUri(preferred.voiceURI);
        }
      }
    };
    loadVoices();
    window.speechSynthesis.addEventListener?.('voiceschanged', loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener?.('voiceschanged', loadVoices);
    };
  }, [speechSynthesisSupported, selectedVoiceUri]);

  // Sync custom Gemini API key status saved via SettingsPage -> localStorage
  useEffect(() => {
    return subscribeCustomGeminiKey(() => {
      setCustomKeyActive(hasCustomGeminiKey());
    });
  }, []);

  // Check server AI capability when drawer opens or custom key changes
  useEffect(() => {
    if (!isOpen) return;
    let active = true;
    fetchMentorServerStatus().then((status) => {
      if (active) {
        setServerAiAvailable(status.aiAvailable);
        setCustomKeyActive(status.customKeyActive);
      }
    });
    return () => {
      active = false;
    };
  }, [isOpen, customKeyActive]);

  const aiReady = customKeyActive || serverAiAvailable !== false;

  // Global Ctrl+Shift+M / Cmd+Shift+M shortcut
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        onOpenChange(!isOpen);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onOpenChange]);

  // Scroll to newest message smoothly
  useEffect(() => {
    if (!isOpen) return;
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isOpen, isSending]);

  // Recording elapsed timer
  useEffect(() => {
    if (!isRecording) {
      setRecordingSec(0);
      return;
    }
    const timer = window.setInterval(() => {
      setRecordingSec((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isRecording]);

  const stopAllSpeech = useCallback(() => {
    speechSessionCancelledRef.current = true;
    if (audioElRef.current) {
      audioElRef.current.pause();
      audioElRef.current.currentTime = 0;
      audioElRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingMsgId(null);
  }, []);

  // Stop playback and active mic if drawer closes
  useEffect(() => {
    if (!isOpen) {
      stopAllSpeech();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      if (speechRecRef.current) {
        try {
          speechRecRef.current.stop();
        } catch {
          // Ignore stop error
        }
      }
    }
  }, [isOpen, stopAllSpeech]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllSpeech();
      mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [stopAllSpeech]);

  // Build sanitized study context from live user progress
  const studyContext = useMemo<MentorStudyContext>(() => {
    const daysLeft = Math.max(
      0,
      Math.ceil((new Date(examDate).getTime() - Date.now()) / 86400000)
    );
    const now = Date.now();
    const dueFlashcards = Object.values(flashcards).filter(
      (c) => c.nextReviewAt <= now
    ).length;

    const unresolved = (mistakes || []).filter((m) => !m.resolved);
    const chapterMissCounts = new Map<string, number>();
    for (const m of unresolved) {
      chapterMissCounts.set(m.chapter, (chapterMissCounts.get(m.chapter) || 0) + m.missCount);
    }
    for (const f of FORMULAS) {
      if (!knownIds.includes(f.id)) {
        const chName = CHAPTER_TITLE_BY_ID.get(f.chapter) || f.chapter;
        chapterMissCounts.set(chName, (chapterMissCounts.get(chName) || 0) + 0.25);
      }
    }
    const weakChapters = Array.from(chapterMissCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([name]) => name);

    const lastFormula = FORMULA_BY_ID.get(lastVisitedFormulaId);

    return {
      daysLeft,
      knownCount: knownIds.length,
      totalFormulas: FORMULAS.length,
      dueFlashcards,
      todayStudyMinutes: Math.round(todayStudySeconds / 60),
      streakDays,
      activeTab,
      currentTopic: lastFormula
        ? `${lastFormula.title} (${CHAPTER_TITLE_BY_ID.get(lastFormula.chapter) || lastFormula.chapter})`
        : undefined,
      weakChapters,
      unresolvedMistakes: unresolved.slice(0, 5).map((m) => ({
        chapter: m.chapter,
        title: m.title,
        errorType: m.errorType,
        missCount: m.missCount,
      })),
      developerName: settings.developerName,
      developerBio: settings.developerBio,
      developerPortfolio: settings.developerPortfolio,
      developerEmail: settings.developerEmail,
    };
  }, [
    examDate,
    flashcards,
    mistakes,
    knownIds,
    todayStudySeconds,
    streakDays,
    activeTab,
    lastVisitedFormulaId,
    settings.developerName,
    settings.developerBio,
    settings.developerPortfolio,
    settings.developerEmail,
  ]);

  const speakWithWebSpeech = useCallback(
    (msgId: string, text: string) => {
      if (!speechSynthesisSupported) {
        setSpeakingMsgId(null);
        setVoiceError('Browser SpeechSynthesis is not supported in this browser.');
        return;
      }

      const chunks = splitIntoSpeechChunks(text, 200);
      if (chunks.length === 0) {
        setSpeakingMsgId(null);
        return;
      }

      window.speechSynthesis.cancel();
      speechSessionCancelledRef.current = false;
      setSpeakingMsgId(msgId);

      const chosenVoice = availableVoices.find((v) => v.voiceURI === selectedVoiceUri);
      let idx = 0;

      const speakNext = () => {
        if (speechSessionCancelledRef.current || idx >= chunks.length) {
          setSpeakingMsgId(null);
          return;
        }
        const utter = new SpeechSynthesisUtterance(chunks[idx]);
        if (chosenVoice) {
          utter.voice = chosenVoice;
        }
        utter.lang = chosenVoice?.lang || 'en-IN';
        utter.rate = speechRate;
        utter.pitch = 1.0;

        utter.onend = () => {
          idx += 1;
          speakNext();
        };
        utter.onerror = () => {
          setSpeakingMsgId(null);
        };

        window.speechSynthesis.speak(utter);
      };

      speakNext();
    },
    [speechSynthesisSupported, availableVoices, selectedVoiceUri, speechRate]
  );

  const speakMessage = useCallback(
    async (msgId: string, text: string) => {
      stopAllSpeech();
      setVoiceError(null);

      // Optional Studio Gemini TTS mode if explicitly selected & online
      if (useStudioVoice && enginePreference === 'smart' && (customKeyActive || serverAiAvailable)) {
        setSpeakingMsgId(msgId);
        const result = await requestMentorSpeechAudio(text, true);
        if (result.audioDataUrl) {
          const audio = new Audio(result.audioDataUrl);
          audio.playbackRate = speechRate;
          audioElRef.current = audio;
          audio.onended = () => setSpeakingMsgId(null);
          audio.onerror = () => {
            speakWithWebSpeech(msgId, text);
          };
          try {
            await audio.play();
            return;
          } catch {
            // Fall through smoothly to Web Speech API
          }
        }
      }

      // Primary instant Web Speech API (SpeechSynthesis) playback
      speakWithWebSpeech(msgId, text);
    },
    [
      stopAllSpeech,
      useStudioVoice,
      enginePreference,
      customKeyActive,
      serverAiAvailable,
      speechRate,
      speakWithWebSpeech,
    ]
  );

  const handleSendText = useCallback(
    async (rawText?: string) => {
      const prompt = (rawText ?? input).trim();
      if (!prompt || isSending) return;

      setInput('');
      setInterimTranscript('');
      setVoiceError(null);
      setStatusNote(null);

      const userMsg: MentorMessage = {
        id: `usr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        role: 'user',
        text: prompt,
        engine: 'local',
        createdAtMs: Date.now(),
      };

      const prevHistory = sessionOnlyMode ? sessionMessages : persistedMessages;

      if (sessionOnlyMode) {
        setSessionMessages((prev) => [...prev, userMsg].slice(-60));
      } else {
        onAppendPersistedMessages([userMsg]);
      }

      setIsSending(true);
      try {
        const effectivePref: MentorEnginePreference =
          enginePreference === 'smart' && aiReady ? 'smart' : 'local';

        const result = await sendMentorTurn({
          message: prompt,
          history: prevHistory,
          studyContext: useStudyContext ? studyContext : null,
          enginePreference: effectivePref,
        });

        if (result.customKeyError) {
          setStatusNote(
            `Custom API key issue (${result.customKeyError}) — answered with Built-in Local Physics Engine. Check Settings → AI Configuration.`
          );
        } else if (result.transientUnavailable) {
          setStatusNote(
            'Gemini AI is temporarily under high demand (503) — answered seamlessly with Built-in Local Physics Engine. Try Smart AI again in a moment.'
          );
        } else if (result.fallbackUsed) {
          setStatusNote(
            'AI service unavailable right now — answered seamlessly with Built-in Local Physics Engine.'
          );
        }

        const mentorMsg: MentorMessage = {
          id: `mnt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          role: 'mentor',
          text: result.reply,
          engine: result.engine,
          createdAtMs: Date.now(),
          formulaIds: result.formulaIds,
          labId: result.labId,
          studyPlan: result.studyPlan,
          planApplied: false,
        };

        if (sessionOnlyMode) {
          setSessionMessages((prev) => [...prev, mentorMsg].slice(-60));
        } else {
          onAppendPersistedMessages([mentorMsg]);
        }

        if (voiceReplyEnabled) {
          void speakMessage(mentorMsg.id, mentorMsg.text);
        }
      } finally {
        setIsSending(false);
      }
    },
    [
      input,
      isSending,
      sessionOnlyMode,
      sessionMessages,
      persistedMessages,
      onAppendPersistedMessages,
      enginePreference,
      aiReady,
      useStudyContext,
      studyContext,
      voiceReplyEnabled,
      speakMessage,
    ]
  );

  const startAudioRecorderFallback = useCallback(async () => {
    if (
      enginePreference !== 'smart' ||
      (!customKeyActive && !serverAiAvailable) ||
      typeof MediaRecorder === 'undefined' ||
      !navigator.mediaDevices?.getUserMedia
    ) {
      setVoiceError(
        'Live speech recognition is unavailable in this browser. Type your physics doubt below.'
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      audioChunksRef.current = [];

      const preferredMime = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/mp4')
          ? 'audio/mp4'
          : '';
      const recorder = preferredMime
        ? new MediaRecorder(stream, { mimeType: preferredMime })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) {
          audioChunksRef.current.push(ev.data);
        }
      };

      recorder.onstop = async () => {
        setIsRecording(false);
        setRecordingSource(null);
        mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;

        const blob = new Blob(audioChunksRef.current, {
          type: recorder.mimeType || 'audio/webm',
        });
        audioChunksRef.current = [];

        if (blob.size < 400) return;
        if (blob.size > 4_500_000) {
          setVoiceError('Voice clip exceeded 4.5 MB limit. Please record a shorter doubt.');
          return;
        }

        setIsTranscribing(true);
        try {
          const res = await transcribeRecordedAudio(blob);
          if (res.text) {
            await handleSendText(res.text);
          } else {
            setVoiceError('Could not transcribe audio. Please try speaking again.');
          }
        } finally {
          setIsTranscribing(false);
        }
      };

      recorder.start();
      setIsRecording(true);
      setRecordingSource('audio-rec');
    } catch {
      setIsRecording(false);
      setRecordingSource(null);
      setVoiceError('Microphone permission denied. Allow mic access or type below.');
    }
  }, [enginePreference, serverAiAvailable, handleSendText]);

  const handleToggleVoiceCapture = useCallback(async () => {
    setVoiceError(null);
    stopAllSpeech();

    if (isRecording) {
      if (recordingSource === 'audio-rec' && mediaRecorderRef.current?.state !== 'inactive') {
        mediaRecorderRef.current?.stop();
      }
      if (recordingSource === 'speech-rec' && speechRecRef.current) {
        try {
          speechRecRef.current.stop();
        } catch {
          // Ignore
        }
      }
      setIsRecording(false);
      setRecordingSource(null);
      return;
    }

    const RecognitionCtor = getSpeechRecognitionCtor();
    if (!RecognitionCtor) {
      await startAudioRecorderFallback();
      return;
    }

    const rec = new RecognitionCtor();
    rec.lang = 'en-IN';
    rec.continuous = false;
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    speechRecRef.current = rec;
    interimTranscriptRef.current = '';
    setInterimTranscript('');
    setIsRecording(true);
    setRecordingSource('speech-rec');

    let submitted = false;

    rec.onresult = (ev) => {
      let finalChunk = '';
      let interimChunk = '';
      for (let i = 0; i < ev.results.length; i += 1) {
        const res = ev.results[i];
        const txt = res?.[0]?.transcript || '';
        if (res?.isFinal) {
          finalChunk += txt + ' ';
        } else {
          interimChunk += txt;
        }
      }

      const combined = (finalChunk + interimChunk).trim();
      interimTranscriptRef.current = combined;
      setInterimTranscript(combined);

      if (finalChunk.trim() && !submitted) {
        submitted = true;
        setIsRecording(false);
        setRecordingSource(null);
        speechRecRef.current = null;
        void handleSendText(finalChunk.trim());
      }
    };

    rec.onerror = (ev) => {
      const errCode = ev.error || '';
      setIsRecording(false);
      setRecordingSource(null);
      speechRecRef.current = null;

      if (errCode === 'aborted' || errCode === 'no-speech') {
        if (errCode === 'no-speech') {
          setVoiceError('No speech detected — tap the mic and speak clearly.');
        }
        return;
      }

      if (
        (errCode === 'network' || errCode === 'service-not-allowed') &&
        enginePreference === 'smart' &&
        serverAiAvailable
      ) {
        void startAudioRecorderFallback();
        return;
      }

      setVoiceError('Microphone access denied or speech recognition interrupted.');
    };

    rec.onend = () => {
      setIsRecording(false);
      setRecordingSource(null);
      speechRecRef.current = null;
      const leftover = interimTranscriptRef.current.trim();
      if (leftover && !submitted) {
        submitted = true;
        void handleSendText(leftover);
      }
    };

    try {
      rec.start();
    } catch {
      setIsRecording(false);
      setRecordingSource(null);
      await startAudioRecorderFallback();
    }
  }, [
    isRecording,
    recordingSource,
    stopAllSpeech,
    enginePreference,
    serverAiAvailable,
    startAudioRecorderFallback,
    handleSendText,
  ]);

  const handleApplyPlan = (msg: MentorMessage) => {
    if (!msg.studyPlan || sessionOnlyMode) return;
    const labels = msg.studyPlan.tasks.map((t) => `${t.timeSlot}: ${t.title}`);
    onSaveTimetableTasks(labels);
    onMarkPersistedPlanApplied(msg.id);
  };

  const handleCopyMessage = async (msgId: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMsgId(msgId);
      window.setTimeout(() => setCopiedMsgId((cur) => (cur === msgId ? null : cur)), 1600);
    } catch {
      // Ignore clipboard restrictions
    }
  };

  const handleClearChat = () => {
    stopAllSpeech();
    if (sessionOnlyMode) {
      setSessionMessages([]);
    } else {
      onClearPersistedMessages();
    }
  };

  const handleSpeakDailyTips = () => {
    void handleSendText(
      'Give me 3 crisp JEE Physics study tips based on my mistakes, weak topics, and days left.'
    );
  };

  const cycleSpeechRate = () => {
    const curIdx = SPEECH_RATES.findIndex((r) => Math.abs(r - speechRate) < 0.05);
    const nextRate = SPEECH_RATES[(curIdx + 1) % SPEECH_RATES.length];
    setSpeechRate(nextRate);
  };

  const unresolvedCount = useMemo(
    () => (mistakes || []).filter((m) => !m.resolved).length,
    [mistakes]
  );

  return (
    <>
      {/* Global Floating Launcher Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => onOpenChange(true)}
          aria-label="Open Mini Gemini Physics Mentor Drawer (Ctrl+Shift+M)"
          className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-40 min-h-[46px] px-4 rounded-2xl border border-cyan-500/45 bg-white/92 dark:bg-[#0b1324]/92 backdrop-blur-md shadow-xl hover:border-cyan-400 text-slate-900 dark:text-slate-100 inline-flex items-center gap-2.5 transition-transform active:scale-95 cursor-pointer"
        >
          <Sparkles className="h-4.5 w-4.5 text-cyan-500 shrink-0" />
          <span className="text-xs sm:text-sm font-bold whitespace-nowrap">
            Physics Mentor
          </span>
          <span className="hidden sm:inline text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Voice · Tips
          </span>
        </button>
      )}

      {/* Translucent Slide-Over Mini Gemini Mentor Drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/35 backdrop-blur-[2px] flex justify-end"
          onClick={() => onOpenChange(false)}
        >
          <aside
            onClick={(e) => e.stopPropagation()}
            aria-label="Mini Gemini JEE Physics AI Voice & Text Mentor"
            className="w-full sm:w-[460px] h-full bg-white/96 dark:bg-[#080e1c]/96 backdrop-blur-xl border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="px-4 pt-3.5 pb-3 border-b border-slate-200/85 dark:border-slate-800/85 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/35 flex items-center justify-center shrink-0">
                    <Bot className="h-5 w-5 text-cyan-500" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                      Mini Gemini · Physics Mentor
                    </h2>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {enginePreference === 'smart' && customKeyActive
                        ? 'Custom Key Active · Gemini AI + Web Speech'
                        : enginePreference === 'smart' && serverAiAvailable
                          ? 'Default AI + Web Speech · Built-in Offline Ready'
                          : 'Built-in Physics Engine · Web Speech Voice'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {onOpenSettings && (
                    <button
                      type="button"
                      onClick={() => {
                        onOpenChange(false);
                        onOpenSettings();
                      }}
                      title={
                        customKeyActive
                          ? 'Custom API Key active — manage in Settings'
                          : 'Configure your own Gemini API key in Settings'
                      }
                      aria-label="Open AI Configuration in Settings"
                      className={`min-h-[34px] px-2 rounded-xl border text-[11px] font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer ${
                        customKeyActive
                          ? 'border-violet-500/45 bg-violet-500/12 text-violet-700 dark:text-violet-200'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-cyan-400'
                      }`}
                    >
                      <KeyRound className="h-3.5 w-3.5" />
                      <span className="hidden xs:inline">{customKeyActive ? 'My Key' : 'API Key'}</span>
                    </button>
                  )}
                  {speakingMsgId && (
                    <button
                      type="button"
                      onClick={stopAllSpeech}
                      title="Stop speaking"
                      aria-label="Stop speaking aloud"
                      className="min-h-[34px] px-2.5 rounded-xl bg-rose-500/12 border border-rose-500/35 text-rose-600 dark:text-rose-300 text-[11px] font-bold inline-flex items-center gap-1"
                    >
                      <Square className="h-3 w-3" />
                      <span>Stop</span>
                    </button>
                  )}
                  {messages.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearChat}
                      title="Clear conversation"
                      aria-label="Clear conversation"
                      className="min-h-[36px] min-w-[36px] rounded-xl text-slate-500 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onOpenChange(false)}
                    aria-label="Close Physics Mentor Drawer"
                    className="min-h-[36px] min-w-[36px] rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors"
                  >
                    <X className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>

              {/* Primary Control Bar */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    const next = !voiceReplyEnabled;
                    setVoiceReplyEnabled(next);
                    if (!next) stopAllSpeech();
                  }}
                  className={`min-h-[32px] px-2.5 rounded-lg border text-[11px] font-semibold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    voiceReplyEnabled
                      ? 'border-violet-500/45 bg-violet-500/12 text-violet-700 dark:text-violet-200'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {voiceReplyEnabled ? (
                    <Volume2 className="h-3.5 w-3.5" />
                  ) : (
                    <VolumeX className="h-3.5 w-3.5" />
                  )}
                  <span>Voice Reply: {voiceReplyEnabled ? 'On' : 'Off'}</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setEnginePreference((prev) => (prev === 'smart' ? 'local' : 'smart'))
                  }
                  className={`min-h-[32px] px-2.5 rounded-lg border text-[11px] font-semibold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    enginePreference === 'smart' && aiReady
                      ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {enginePreference === 'smart' && aiReady ? (
                    <Sparkles className="h-3.5 w-3.5" />
                  ) : (
                    <WifiOff className="h-3.5 w-3.5" />
                  )}
                  <span>
                    {enginePreference === 'smart' && aiReady
                      ? customKeyActive
                        ? 'Smart AI (Custom)'
                        : 'Smart AI'
                      : 'Local Offline'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setUseStudyContext((v) => !v)}
                  className={`min-h-[32px] px-2.5 rounded-lg border text-[11px] font-semibold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    useStudyContext
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>{useStudyContext ? 'Progress On' : 'No Context'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSessionOnlyMode((v) => !v)}
                  className={`min-h-[32px] px-2.5 rounded-lg border text-[11px] font-semibold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    sessionOnlyMode
                      ? 'border-amber-500/45 bg-amber-500/12 text-amber-700 dark:text-amber-300'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {sessionOnlyMode ? (
                    <EyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <Database className="h-3.5 w-3.5" />
                  )}
                  <span>{sessionOnlyMode ? 'Session-Only' : 'Synced'}</span>
                </button>
              </div>

              {/* SpeechSynthesis Voice & Rate Controls when Voice Reply is enabled */}
              {voiceReplyEnabled && (
                <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                  {availableVoices.length > 0 && !useStudioVoice && (
                    <select
                      value={selectedVoiceUri}
                      onChange={(e) => setSelectedVoiceUri(e.target.value)}
                      aria-label="Select spoken reply voice"
                      className="flex-1 min-w-[140px] max-w-[230px] h-7 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-2 text-[11px] text-slate-700 dark:text-slate-200 truncate"
                    >
                      {availableVoices.slice(0, 12).map((v) => (
                        <option key={v.voiceURI} value={v.voiceURI}>
                          {v.name} ({v.lang})
                        </option>
                      ))}
                    </select>
                  )}

                  <button
                    type="button"
                    onClick={cycleSpeechRate}
                    title="Adjust speaking speed"
                    className="h-7 px-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-mono text-[11px] text-slate-700 dark:text-slate-200 tabular-nums cursor-pointer"
                  >
                    {speechRate}x
                  </button>

                  {enginePreference === 'smart' && (customKeyActive || serverAiAvailable) && (
                    <button
                      type="button"
                      onClick={() => setUseStudioVoice((v) => !v)}
                      className="h-7 px-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-[11px] text-slate-600 dark:text-slate-300 cursor-pointer"
                    >
                      {useStudioVoice ? 'Voice: Gemini' : 'Voice: Web Speech'}
                    </button>
                  )}
                </div>
              )}

              {/* Context / Privacy Line */}
              {sessionOnlyMode ? (
                <div className="text-[11px] text-amber-700 dark:text-amber-300 leading-snug">
                  Session-Only Mode: Advice stays in temporary memory and will not modify saved tasks or cloud chat history.
                </div>
              ) : (
                useStudyContext && (
                  <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span>{studyContext.daysLeft}d to JEE</span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {studyContext.knownCount}/{studyContext.totalFormulas} mastered
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{unresolvedCount} open mistakes</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleSpeakDailyTips}
                      disabled={isSending}
                      className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-300 hover:underline inline-flex items-center gap-1 shrink-0 cursor-pointer disabled:opacity-50"
                    >
                      <Lightbulb className="h-3 w-3" />
                      <span>Daily Tips</span>
                    </button>
                  </div>
                )
              )}
            </div>

            {/* Conversation Stream */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.length === 0 ? (
                <div className="space-y-4 pt-2">
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 p-4 space-y-1.5">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      Your Mini Gemini Physics Companion
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Tap the microphone for live speech recognition, type any JEE doubt, or ask for daily study tips &amp; timetables. Toggle <strong>Voice Reply</strong> above to have explanations read aloud via Web Speech API.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      Quick prompts to try:
                    </div>
                    <div className="space-y-1.5">
                      {STARTER_PROMPTS.map((starter) => (
                        <button
                          key={starter}
                          type="button"
                          onClick={() => void handleSendText(starter)}
                          className="w-full min-h-[40px] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/75 hover:border-cyan-400 text-left text-xs font-medium text-slate-700 dark:text-slate-200 flex items-center justify-between gap-2 transition-colors cursor-pointer"
                        >
                          <span>{starter}</span>
                          <ArrowRight className="h-3.5 w-3.5 text-cyan-500 shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                messages.map((msg, msgIdx) => {
                  const isUser = msg.role === 'user';
                  const isPlayingThis = speakingMsgId === msg.id;
                  const isLatestMentor =
                    !isUser && msgIdx === messages.length - 1 && !isSending;

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[92%] rounded-2xl px-3.5 py-2.5 space-y-2.5 ${
                          isUser
                            ? 'bg-cyan-600 text-white text-[13.5px] leading-relaxed'
                            : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 text-slate-800 dark:text-slate-100'
                        }`}
                      >
                        {isUser ? (
                          <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                        ) : (
                          <>
                            <MentorMessageContent text={msg.text} />

                            {/* Structured Timetable Plan Card */}
                            {msg.studyPlan && (
                              <div className="rounded-xl border border-cyan-500/35 bg-cyan-500/5 p-3 space-y-2.5">
                                <div>
                                  <div className="text-xs font-bold text-cyan-700 dark:text-cyan-300">
                                    {msg.studyPlan.planTitle}
                                  </div>
                                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                                    {msg.studyPlan.summary}
                                  </p>
                                </div>

                                <div className="space-y-1.5">
                                  {msg.studyPlan.tasks.map((task, idx) => (
                                    <div
                                      key={idx}
                                      className="rounded-lg border border-slate-200/80 dark:border-slate-800 bg-white/85 dark:bg-slate-950/75 px-2.5 py-2 text-xs space-y-0.5"
                                    >
                                      <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                                        <span className="font-semibold text-cyan-600 dark:text-cyan-300">
                                          {task.timeSlot}
                                        </span>
                                        <span>
                                          {task.chapter} · {task.durationMinutes} min
                                        </span>
                                      </div>
                                      <div className="font-semibold text-slate-800 dark:text-slate-100">
                                        {task.title}
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                <button
                                  type="button"
                                  disabled={sessionOnlyMode || Boolean(msg.planApplied)}
                                  onClick={() => handleApplyPlan(msg)}
                                  className={`w-full min-h-[38px] px-3 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors ${
                                    msg.planApplied
                                      ? 'bg-emerald-500/15 border border-emerald-500/35 text-emerald-700 dark:text-emerald-300'
                                      : sessionOnlyMode
                                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                                        : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 cursor-pointer'
                                  }`}
                                >
                                  {msg.planApplied ? (
                                    <>
                                      <Check className="h-3.5 w-3.5" />
                                      <span>Saved to Today&apos;s Tasks</span>
                                    </>
                                  ) : (
                                    <>
                                      <CalendarPlus className="h-3.5 w-3.5" />
                                      <span>
                                        {sessionOnlyMode
                                          ? 'Preview Only (Session-Only Mode)'
                                          : "Save to Today's Tasks"}
                                      </span>
                                    </>
                                  )}
                                </button>
                              </div>
                            )}

                            {/* Jump to Linked Formula or Interactive Sim */}
                            {((msg.formulaIds && msg.formulaIds.length > 0) || msg.labId) && (
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {(msg.formulaIds || []).slice(0, 2).map((fId) => {
                                  const f = FORMULA_BY_ID.get(fId);
                                  if (!f) return null;
                                  return (
                                    <button
                                      key={fId}
                                      type="button"
                                      onClick={() => {
                                        onJumpToFormula(fId);
                                        onOpenChange(false);
                                      }}
                                      className="min-h-[32px] px-2.5 rounded-lg border border-cyan-500/35 bg-cyan-500/10 text-[11px] font-semibold text-cyan-700 dark:text-cyan-300 hover:bg-cyan-500/20 inline-flex items-center gap-1 cursor-pointer"
                                    >
                                      <Network className="h-3 w-3 shrink-0" />
                                      <span className="truncate max-w-[190px]">{f.title}</span>
                                    </button>
                                  );
                                })}

                                {msg.labId && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const fId =
                                        msg.formulaIds?.[0] ||
                                        FORMULAS.find((f) => f.labId === msg.labId)?.id ||
                                        lastVisitedFormulaId;
                                      onOpenLab(msg.labId!, fId);
                                      onOpenChange(false);
                                    }}
                                    className="min-h-[32px] px-2.5 rounded-lg border border-emerald-500/35 bg-emerald-500/10 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 inline-flex items-center gap-1 cursor-pointer"
                                  >
                                    <FlaskConical className="h-3 w-3 shrink-0" />
                                    <span>Open Sim</span>
                                  </button>
                                )}
                              </div>
                            )}

                            {/* Per-message audio, copy & engine metadata */}
                            <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400">
                              <span>
                                {msg.engine === 'ai' ? 'Gemini AI Mentor' : 'Offline Physics Engine'}
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => void handleCopyMessage(msg.id, msg.text)}
                                  className="min-h-[28px] px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 inline-flex items-center gap-1 transition-colors cursor-pointer"
                                >
                                  {copiedMsgId === msg.id ? (
                                    <>
                                      <Check className="h-3 w-3 text-emerald-500" />
                                      <span>Copied</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-3 w-3" />
                                      <span>Copy</span>
                                    </>
                                  )}
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    isPlayingThis
                                      ? stopAllSpeech()
                                      : void speakMessage(msg.id, msg.text)
                                  }
                                  className="min-h-[28px] px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 inline-flex items-center gap-1 transition-colors cursor-pointer"
                                >
                                  {isPlayingThis ? (
                                    <>
                                      <Square className="h-3 w-3 text-rose-500" />
                                      <span>Stop</span>
                                    </>
                                  ) : (
                                    <>
                                      <Volume2 className="h-3 w-3" />
                                      <span>Read Aloud</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Mini Gemini Follow-up Action Chips on Latest Mentor Reply */}
                      {isLatestMentor && (
                        <div className="flex flex-wrap gap-1.5 mt-2 max-w-[92%]">
                          {FOLLOW_UP_CHIPS.map((chip) => (
                            <button
                              key={chip}
                              type="button"
                              onClick={() => void handleSendText(chip)}
                              className="min-h-[30px] px-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/75 hover:border-cyan-400 text-[11px] font-medium text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                            >
                              {chip}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}

              {isSending && (
                <div className="flex items-start">
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 px-4 py-3 text-xs text-slate-500 dark:text-slate-400 inline-flex items-center gap-2">
                    <RotateCcw className="h-3.5 w-3.5 animate-spin text-cyan-500" />
                    <span>Thinking through physics steps...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Inline Status / Live Speech Transcript / Voice Feedback Banners */}
            {(statusNote || voiceError || isRecording || isTranscribing || speakingMsgId) && (
              <div className="px-4 py-2 border-t border-slate-200/70 dark:border-slate-800/80 bg-slate-50/90 dark:bg-slate-900/80 text-xs space-y-1">
                {isRecording && (
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 font-semibold tabular-nums">
                      <span>
                        {recordingSource === 'speech-rec'
                          ? `Listening live (${recordingSec}s) · Speak clearly`
                          : `Recording audio (${recordingSec}s) · Tap mic to send`}
                      </span>
                    </div>
                    {interimTranscript && (
                      <div className="text-slate-700 dark:text-slate-200 italic truncate">
                        &ldquo;{interimTranscript}&rdquo;
                      </div>
                    )}
                  </div>
                )}
                {isTranscribing && (
                  <div className="text-cyan-600 dark:text-cyan-300 font-semibold">
                    Transcribing your voice question...
                  </div>
                )}
                {speakingMsgId && !isRecording && (
                  <div className="flex items-center justify-between text-violet-600 dark:text-violet-300 font-semibold">
                    <span>Reading aloud via {useStudioVoice ? 'Gemini Voice' : 'Web Speech'}...</span>
                    <button
                      type="button"
                      onClick={stopAllSpeech}
                      className="underline cursor-pointer"
                    >
                      Stop
                    </button>
                  </div>
                )}
                {voiceError && (
                  <div className="text-rose-600 dark:text-rose-400">{voiceError}</div>
                )}
                {statusNote && (
                  <div className="text-slate-600 dark:text-slate-300">{statusNote}</div>
                )}
              </div>
            )}

            {/* Composer Footer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void handleSendText();
              }}
              className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#080e1c]/95 flex items-end gap-2"
            >
              <button
                type="button"
                onClick={() => void handleToggleVoiceCapture()}
                disabled={isSending || isTranscribing}
                title={
                  speechRecSupported
                    ? 'Speak using Web Speech Recognition'
                    : 'Record voice doubt'
                }
                aria-label={isRecording ? 'Stop speech recognition' : 'Start speech recognition'}
                className={`min-h-[44px] min-w-[44px] rounded-xl border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                  isRecording
                    ? 'border-rose-500 bg-rose-500 text-white'
                    : 'border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-cyan-400'
                } disabled:opacity-50`}
              >
                {isRecording ? <MicOff className="h-4.5 w-4.5" /> : <Mic className="h-4.5 w-4.5" />}
              </button>

              <textarea
                rows={1}
                value={isRecording && interimTranscript ? interimTranscript : input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    void handleSendText();
                  }
                }}
                placeholder="Ask Mini Gemini: doubt, study tip, or timetable..."
                aria-label="Type your physics doubt or mentoring question"
                className="flex-1 min-h-[44px] max-h-[120px] py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-slate-100 resize-none focus:outline-none focus:border-cyan-400"
              />

              <button
                type="submit"
                disabled={!input.trim() || isSending || isTranscribing}
                aria-label="Send message to Physics Mentor"
                className="min-h-[44px] min-w-[44px] rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center shrink-0 transition-colors disabled:opacity-40 cursor-pointer"
              >
                <Send className="h-4.5 w-4.5" />
              </button>
            </form>
          </aside>
        </div>
      )}
    </>
  );
};
