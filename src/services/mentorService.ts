import { FORMULAS } from '../data/formulas';
import { MentorMessage, MentorStudyPlan, Formula } from '../types/physics';
import { getCustomGeminiKey } from '../utils/aiKeyStorage';
import { MentorStudyContext, runLocalMentorEngine } from '../utils/localMentorEngine';

export type MentorEnginePreference = 'smart' | 'local';

export interface MentorServerStatus {
  aiAvailable: boolean;
  customKeyActive: boolean;
  serverKeyAvailable: boolean;
  checkedAt: number;
}

export interface MentorTurnResult {
  reply: string;
  engine: 'ai' | 'local';
  fallbackUsed?: boolean;
  transientUnavailable?: boolean;
  keySource?: 'custom' | 'server' | 'local';
  customKeyError?: string;
  formulaIds?: string[];
  labId?: Formula['labId'];
  studyPlan?: MentorStudyPlan;
}

function buildMentorHeaders(
  base?: Record<string, string>,
  overrideKey?: string
): Record<string, string> {
  const headers: Record<string, string> = { ...(base || {}) };
  const key = (overrideKey ?? getCustomGeminiKey()).trim();
  if (key) {
    headers['x-custom-gemini-key'] = key;
  }
  return headers;
}

export async function fetchMentorServerStatus(): Promise<MentorServerStatus> {
  const hasCustom = Boolean(getCustomGeminiKey());
  try {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 3500);
    const res = await fetch('/api/mentor/status', {
      signal: controller.signal,
      headers: buildMentorHeaders(),
    });
    window.clearTimeout(timer);
    if (!res.ok) {
      return {
        aiAvailable: false,
        customKeyActive: hasCustom,
        serverKeyAvailable: false,
        checkedAt: Date.now(),
      };
    }
    const data = (await res.json()) as {
      aiAvailable?: boolean;
      customKeyActive?: boolean;
      serverKeyAvailable?: boolean;
    };
    return {
      aiAvailable: Boolean(data.aiAvailable),
      customKeyActive: Boolean(data.customKeyActive ?? hasCustom),
      serverKeyAvailable: Boolean(data.serverKeyAvailable),
      checkedAt: Date.now(),
    };
  } catch {
    return {
      aiAvailable: false,
      customKeyActive: hasCustom,
      serverKeyAvailable: false,
      checkedAt: Date.now(),
    };
  }
}

export async function verifyCustomGeminiKey(
  candidateKey: string
): Promise<{ valid: boolean; note?: string; error?: string }> {
  const trimmed = candidateKey.trim();
  if (!trimmed) {
    return { valid: false, error: 'Please enter a Gemini API key first.' };
  }
  try {
    const res = await fetch('/api/mentor/verify-key', {
      method: 'POST',
      headers: buildMentorHeaders({ 'Content-Type': 'application/json' }, trimmed),
    });
    const data = (await res.json()) as { valid?: boolean; note?: string; error?: string };
    if (!res.ok || !data.valid) {
      return {
        valid: false,
        error: data.error || 'Key verification failed. Check the key and quota.',
      };
    }
    return { valid: true, note: data.note };
  } catch {
    return {
      valid: false,
      error: 'Unable to reach verification server. Check your internet connection.',
    };
  }
}

function matchRelevantFormulasFromText(query: string, replyText: string): {
  formulaIds?: string[];
  labId?: Formula['labId'];
} {
  const combined = `${query} ${replyText}`.toLowerCase();
  const scored: Array<{ id: string; score: number; labId?: Formula['labId'] }> = [];
  const words = Array.from(
    new Set(
      combined
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length >= 4)
    )
  ).slice(0, 30);

  if (words.length === 0) return {};

  for (const f of FORMULAS) {
    const hay = `${f.title} ${f.subtopic} ${f.tags.join(' ')}`.toLowerCase();
    let score = 0;
    for (const w of words) {
      if (hay.includes(w)) score += 1;
    }
    if (score >= 2) {
      scored.push({ id: f.id, score, labId: f.labId });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, 2);
  if (top.length === 0) return {};
  return {
    formulaIds: top.map((t) => t.id),
    labId: top.find((t) => t.labId)?.labId,
  };
}

export async function sendMentorTurn(params: {
  message: string;
  history: MentorMessage[];
  studyContext: MentorStudyContext | null;
  enginePreference: MentorEnginePreference;
}): Promise<MentorTurnResult> {
  const customKeyPresent = Boolean(getCustomGeminiKey());
  const shouldTryAI =
    params.enginePreference === 'smart' &&
    (typeof navigator === 'undefined' || navigator.onLine !== false);

  if (!shouldTryAI) {
    const local = runLocalMentorEngine(params.message, params.studyContext);
    return {
      ...local,
      engine: 'local',
      keySource: 'local',
    };
  }

  try {
    const res = await fetch('/api/mentor/chat', {
      method: 'POST',
      headers: buildMentorHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        message: params.message,
        history: params.history.slice(-10).map((m) => ({
          role: m.role === 'mentor' ? 'model' : 'user',
          text: m.text,
        })),
        studyContext: params.studyContext,
      }),
    });

    const data = (await res.json()) as {
      reply?: string;
      studyPlan?: MentorStudyPlan | null;
      fallbackRecommended?: boolean;
      transientUnavailable?: boolean;
      keySource?: 'custom' | 'server';
      keyRejected?: boolean;
      error?: string;
    };

    if (!res.ok || !data.reply) {
      const local = runLocalMentorEngine(params.message, params.studyContext);
      const isTransient = Boolean(data.transientUnavailable || res.status === 503);
      return {
        ...local,
        engine: 'local',
        keySource: 'local',
        fallbackUsed: true,
        transientUnavailable: isTransient,
        customKeyError:
          !isTransient && data.keyRejected
            ? data.error || 'Custom Gemini API key was rejected.'
            : undefined,
      };
    }

    const links = matchRelevantFormulasFromText(params.message, data.reply);
    return {
      reply: data.reply,
      engine: 'ai',
      keySource: data.keySource || (customKeyPresent ? 'custom' : 'server'),
      studyPlan: data.studyPlan || undefined,
      formulaIds: links.formulaIds,
      labId: links.labId,
    };
  } catch {
    const local = runLocalMentorEngine(params.message, params.studyContext);
    return {
      ...local,
      engine: 'local',
      keySource: 'local',
      fallbackUsed: true,
    };
  }
}

export async function transcribeRecordedAudio(
  blob: Blob
): Promise<{ text: string; fallbackToBrowser?: boolean }> {
  const mimeType = blob.type || 'audio/webm';
  const buffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  const audioBase64 = btoa(binary);

  try {
    const res = await fetch('/api/mentor/transcribe', {
      method: 'POST',
      headers: buildMentorHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ audioBase64, mimeType }),
    });
    if (!res.ok) {
      return { text: '', fallbackToBrowser: true };
    }
    const data = (await res.json()) as { text?: string };
    return { text: (data.text || '').trim() };
  } catch {
    return { text: '', fallbackToBrowser: true };
  }
}

export function cleanTextForBrowserSpeech(raw: string): string {
  return raw
    .replace(/\$\$([\s\S]*?)\$\$/g, ', $1, ')
    .replace(/\$([^$]+)\$/g, ' $1 ')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1 over $2')
    .replace(/\\sqrt\{([^}]+)\}/g, 'square root of $1')
    .replace(/\\Delta/g, 'delta ')
    .replace(/\\theta/g, 'theta ')
    .replace(/\\lambda/g, 'lambda ')
    .replace(/\\omega/g, 'omega ')
    .replace(/\\mu_0/g, 'mu naught ')
    .replace(/\\varepsilon_0/g, 'epsilon naught ')
    .replace(/\\epsilon_0/g, 'epsilon naught ')
    .replace(/\\pi/g, 'pi ')
    .replace(/\\times/g, ' times ')
    .replace(/\\cdot/g, ' dot ')
    .replace(/\^2\b/g, ' squared')
    .replace(/\^3\b/g, ' cubed')
    .replace(/\^\{?(-?\d+)\}?/g, ' to the power $1')
    .replace(/_0\b/g, ' naught')
    .replace(/\\[a-zA-Z]+/g, ' ')
    .replace(/[*_`#>{}\[\]]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function requestMentorSpeechAudio(
  text: string,
  preferAI: boolean
): Promise<{ audioDataUrl?: string; browserSpeechText?: string }> {
  const clean = cleanTextForBrowserSpeech(text).slice(0, 900);
  if (!clean) return {};

  if (!preferAI || (typeof navigator !== 'undefined' && !navigator.onLine)) {
    return { browserSpeechText: clean };
  }

  try {
    const res = await fetch('/api/mentor/speak', {
      method: 'POST',
      headers: buildMentorHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ text, voiceName: 'Kore' }),
    });
    if (!res.ok) {
      return { browserSpeechText: clean };
    }
    const data = (await res.json()) as { audioBase64?: string; mimeType?: string };
    if (data.audioBase64) {
      return {
        audioDataUrl: `data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`,
      };
    }
    return { browserSpeechText: clean };
  } catch {
    return { browserSpeechText: clean };
  }
}
