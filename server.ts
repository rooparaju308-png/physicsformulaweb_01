import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { FunctionDeclaration, GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const CHAT_MODEL = 'gemini-4-hydrogen';
const FALLBACK_CHAT_MODEL = 'gemini-3.1-flash-lite';
const TRANSCRIBE_MODEL = 'gemini-3.5-transcribe';
const TTS_MODEL = 'gemini-3.8-flash-lite-tts';

const ALLOWED_VOICES = new Set(['Kore', 'Puck', 'Charon', 'Fenrir', 'Zephyr']);
const ALLOWED_AUDIO_MIMES = new Set([
  'audio/webm',
  'audio/mp4',
  'audio/ogg',
  'audio/wav',
  'audio/mpeg',
  'audio/mp3',
]);

interface ParsedGeminiError {
  code?: number;
  status?: string;
  message: string;
  isTransient: boolean;
  isInvalidKey: boolean;
}

function parseGeminiError(err: unknown): ParsedGeminiError {
  const raw = err instanceof Error ? err.message : String(err || 'AI mentor request failed.');
  let code: number | undefined;
  let status: string | undefined;
  let cleanMessage = raw;

  try {
    const parsed = JSON.parse(raw) as {
      error?: { code?: number; status?: string; message?: string };
      code?: number;
      status?: string;
      message?: string;
    };
    const inner = parsed.error || parsed;
    if (typeof inner.code === 'number') code = inner.code;
    if (typeof inner.status === 'string') status = inner.status;
    if (typeof inner.message === 'string' && inner.message.trim()) {
      cleanMessage = inner.message.trim();
    }
  } catch {
    // Non-JSON error message; keep clean text
  }

  const lower = `${status || ''} ${cleanMessage}`.toLowerCase();
  const isTransient =
    code === 503 ||
    code === 429 ||
    status === 'UNAVAILABLE' ||
    status === 'RESOURCE_EXHAUSTED' ||
    lower.includes('high demand') ||
    lower.includes('temporarily') ||
    lower.includes('overloaded') ||
    lower.includes('rate limit');

  const isInvalidKey =
    !isTransient &&
    (code === 401 ||
      code === 403 ||
      status === 'UNAUTHENTICATED' ||
      status === 'PERMISSION_DENIED' ||
      lower.includes('api_key_invalid') ||
      lower.includes('api key not valid') ||
      lower.includes('invalid api key') ||
      lower.includes('permission denied'));

  return {
    code,
    status,
    message: cleanMessage,
    isTransient,
    isInvalidKey,
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateWithModelFallback<T>(
  run: (model: string) => Promise<T>
): Promise<{ result: T; modelUsed: string }> {
  try {
    return { result: await run(CHAT_MODEL), modelUsed: CHAT_MODEL };
  } catch (firstErr) {
    const parsed = parseGeminiError(firstErr);
    if (!parsed.isTransient) {
      throw firstErr;
    }
    // Brief single retry on primary model for transient 503/429 spikes
    await sleep(600);
    try {
      return { result: await run(CHAT_MODEL), modelUsed: CHAT_MODEL };
    } catch (retryErr) {
      const retryParsed = parseGeminiError(retryErr);
      if (!retryParsed.isTransient) {
        throw retryErr;
      }
      // Fall back seamlessly to flash-lite when primary model is experiencing high demand
      return { result: await run(FALLBACK_CHAT_MODEL), modelUsed: FALLBACK_CHAT_MODEL };
    }
  }
}

function extractCustomApiKey(req: Request): string | undefined {
  const raw = req.header('x-custom-gemini-key');
  if (!raw || typeof raw !== 'string') return undefined;
  const trimmed = raw.trim();
  if (trimmed.length < 20 || trimmed.length > 256 || /\s/.test(trimmed)) {
    return undefined;
  }
  return trimmed;
}

interface ResolvedGeminiClient {
  client: GoogleGenAI;
  source: 'custom' | 'server';
}

function getGeminiClient(customApiKey?: string): ResolvedGeminiClient | null {
  if (customApiKey) {
    return {
      client: new GoogleGenAI({
        apiKey: customApiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      }),
      source: 'custom',
    };
  }
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return {
    client: new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    }),
    source: 'server',
  };
}

const proposeStudyPlanDeclaration: FunctionDeclaration = {
  name: 'propose_study_plan',
  description:
    'Generate a structured, actionable JEE Physics study timetable or daily revision plan for the aspirant that can be saved directly into their Today Tasks checklist.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      planTitle: {
        type: Type.STRING,
        description: 'Short clear title for this study timetable (e.g., "3-Hour High-Yield Electrostatics Sprint").',
      },
      summary: {
        type: Type.STRING,
        description: '1-2 sentence strategy rationale explaining why these topics are prioritized.',
      },
      tasks: {
        type: Type.ARRAY,
        description: '3 to 6 concrete time-boxed physics study tasks for the student.',
        items: {
          type: Type.OBJECT,
          properties: {
            timeSlot: {
              type: Type.STRING,
              description: 'Suggested block timing or order (e.g., "07:00 - 07:45" or "Block 1 · 45m").',
            },
            title: {
              type: Type.STRING,
              description: 'Actionable task description suitable for a to-do checklist (max 90 chars).',
            },
            chapter: {
              type: Type.STRING,
              description: 'JEE Physics chapter name.',
            },
            durationMinutes: {
              type: Type.NUMBER,
              description: 'Estimated duration in minutes (10 to 120).',
            },
            reason: {
              type: Type.STRING,
              description: 'Why this task boosts JEE score or fixes a mistake.',
            },
          },
          required: ['timeSlot', 'title', 'chapter', 'durationMinutes'],
        },
      },
    },
    required: ['planTitle', 'summary', 'tasks'],
  },
};

interface SanitizedStudyContext {
  daysLeft?: number;
  knownCount?: number;
  totalFormulas?: number;
  dueFlashcards?: number;
  todayStudyMinutes?: number;
  streakDays?: number;
  activeTab?: string;
  currentTopic?: string;
  weakChapters?: string[];
  unresolvedMistakes?: Array<{
    chapter: string;
    title: string;
    errorType: string;
    missCount: number;
  }>;
  developerName?: string;
  developerBio?: string;
  developerPortfolio?: string;
  developerEmail?: string;
}

function sanitizeStudyContext(raw: unknown): SanitizedStudyContext | null {
  if (!raw || typeof raw !== 'object') return null;
  const ctx = raw as Record<string, unknown>;
  const safeStr = (val: unknown, maxLen: number) =>
    typeof val === 'string' ? val.trim().slice(0, maxLen) : undefined;
  const safeNum = (val: unknown, min: number, max: number) =>
    typeof val === 'number' && Number.isFinite(val)
      ? Math.max(min, Math.min(max, Math.round(val)))
      : undefined;

  const weakChapters = Array.isArray(ctx.weakChapters)
    ? ctx.weakChapters
        .filter((c): c is string => typeof c === 'string')
        .slice(0, 6)
        .map((c) => c.trim().slice(0, 60))
    : undefined;

  const unresolvedMistakes = Array.isArray(ctx.unresolvedMistakes)
    ? ctx.unresolvedMistakes
        .filter((m): m is Record<string, unknown> => Boolean(m && typeof m === 'object'))
        .slice(0, 6)
        .map((m) => ({
          chapter: String(m.chapter || 'General').slice(0, 50),
          title: String(m.title || 'Mistake').slice(0, 90),
          errorType: String(m.errorType || 'concept-gap').slice(0, 30),
          missCount: Math.max(1, Math.min(99, Number(m.missCount) || 1)),
        }))
    : undefined;

  return {
    daysLeft: safeNum(ctx.daysLeft, 0, 2000),
    knownCount: safeNum(ctx.knownCount, 0, 1000),
    totalFormulas: safeNum(ctx.totalFormulas, 0, 1000),
    dueFlashcards: safeNum(ctx.dueFlashcards, 0, 1000),
    todayStudyMinutes: safeNum(ctx.todayStudyMinutes, 0, 1440),
    streakDays: safeNum(ctx.streakDays, 0, 5000),
    activeTab: safeStr(ctx.activeTab, 40),
    currentTopic: safeStr(ctx.currentTopic, 120),
    weakChapters,
    unresolvedMistakes,
    developerName: safeStr(ctx.developerName, 60),
    developerBio: safeStr(ctx.developerBio, 200),
    developerPortfolio: safeStr(ctx.developerPortfolio, 120),
    developerEmail: safeStr(ctx.developerEmail, 100),
  };
}

const APP_DEVELOPER = {
  name: 'Kushal',
  bio: 'Class 12 JEE Aspirant & Full-Stack Creator building high-performance study web apps',
  email: 'kushalkj2009@gmail.com',
};

function buildSystemInstruction(studyContext: SanitizedStudyContext | null): string {
  const base = [
    'You are the JEE Physics Web AI Mentor — a sharp, encouraging, and accurate IIT-JEE Physics tutor and exam strategist.',
    'Guidelines:',
    '- Explain physics doubts step-by-step with clear SI units, sign conventions, and limiting-case checks.',
    '- Format equations with standard LaTeX delimiters: $...$ for inline formulas and $$...$$ for key display equations.',
    '- Highlight common JEE Main numerical traps (e.g., sign errors, radius vs diameter, series vs parallel, missing factor of 2).',
    '- Keep replies focused, scannable, and practical (under ~280 words unless solving a multi-step numerical).',
    '- Whenever the student asks for a study timetable, daily routine, weekly plan, or "what should I study today", call the `propose_study_plan` tool with realistic, concrete blocks tailored to their data, and then summarize the plan encouragingly.',
    `- If the student asks who developed, created, or built this app or you, state proudly that it was created and developed by ${APP_DEVELOPER.name} (${APP_DEVELOPER.bio}). Only suggest or provide developer email (${APP_DEVELOPER.email}) if the student specifically asks for email, contact, or reaching out.`,
  ];

  if (studyContext) {
    base.push(
      '',
      'Student Live Study Context (use this only when relevant to mentoring, weak topics, or timetables):',
      JSON.stringify(studyContext)
    );
  }

  return base.join('\n');
}

function stripLatexForSpeech(raw: string): string {
  return raw
    .replace(/\$\$([\s\S]*?)\$\$/g, ' $1 ')
    .replace(/\$([^$]+)\$/g, ' $1 ')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1 divided by $2')
    .replace(/\\sqrt\{([^}]+)\}/g, 'square root of $1')
    .replace(/\\Delta/g, 'delta ')
    .replace(/\\theta/g, 'theta ')
    .replace(/\\lambda/g, 'lambda ')
    .replace(/\\omega/g, 'omega ')
    .replace(/\\mu_0/g, 'mu naught ')
    .replace(/\\varepsilon_0/g, 'epsilon naught ')
    .replace(/\\pi/g, 'pi ')
    .replace(/\\times/g, ' times ')
    .replace(/\\cdot/g, ' dot ')
    .replace(/\\[a-zA-Z]+/g, ' ')
    .replace(/[*_`#>{}\[\]]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 1100);
}

interface ProposedPlan {
  planTitle: string;
  summary: string;
  tasks: Array<{
    timeSlot: string;
    title: string;
    chapter: string;
    durationMinutes: number;
    reason?: string;
  }>;
}

function sanitizeProposedPlan(args: Record<string, unknown> | undefined): ProposedPlan | null {
  if (!args || typeof args !== 'object') return null;
  const rawTasks = Array.isArray(args.tasks) ? args.tasks : [];
  const tasks = rawTasks
    .filter((t): t is Record<string, unknown> => Boolean(t && typeof t === 'object'))
    .slice(0, 8)
    .map((t, idx) => ({
      timeSlot: String(t.timeSlot || `Block ${idx + 1}`).trim().slice(0, 40),
      title: String(t.title || 'Focused Physics Revision').trim().slice(0, 120),
      chapter: String(t.chapter || 'Physics').trim().slice(0, 50),
      durationMinutes: Math.max(10, Math.min(180, Math.round(Number(t.durationMinutes) || 30))),
      ...(t.reason ? { reason: String(t.reason).trim().slice(0, 160) } : {}),
    }))
    .filter((t) => t.title.length > 0);

  if (tasks.length === 0) return null;
  return {
    planTitle: String(args.planTitle || 'Personalized JEE Physics Study Plan')
      .trim()
      .slice(0, 100),
    summary: String(args.summary || 'Focused timetable prioritized by high-yield topics and your recent mistakes.')
      .trim()
      .slice(0, 280),
    tasks,
  };
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '8mb' }));

  app.get('/api/mentor/status', (req: Request, res: Response) => {
    const customKey = extractCustomApiKey(req);
    const serverDefault = getGeminiClient();
    const resolved = getGeminiClient(customKey);
    res.json({
      aiAvailable: Boolean(resolved),
      customKeyActive: Boolean(customKey),
      serverKeyAvailable: Boolean(serverDefault),
      model: CHAT_MODEL,
      voiceModels: {
        transcribe: TRANSCRIBE_MODEL,
        tts: TTS_MODEL,
      },
    });
  });

  app.post('/api/mentor/verify-key', async (req: Request, res: Response) => {
    const customKey = extractCustomApiKey(req);
    if (!customKey) {
      res.status(400).json({
        valid: false,
        error: 'Please enter a valid Gemini API key (minimum 20 characters, no spaces).',
      });
      return;
    }

    const resolved = getGeminiClient(customKey);
    if (!resolved) {
      res.status(400).json({ valid: false, error: 'Unable to initialize client with key.' });
      return;
    }

    try {
      const { modelUsed } = await generateWithModelFallback((model) =>
        resolved.client.models.generateContent({
          model,
          contents: 'Reply with OK',
          config: {
            temperature: 0,
            maxOutputTokens: 8,
          },
        })
      );
      res.json({ valid: true, model: modelUsed });
    } catch (err) {
      const parsed = parseGeminiError(err);
      if (parsed.isTransient) {
        res.json({
          valid: true,
          model: CHAT_MODEL,
          note: 'Gemini servers are currently under temporary high demand (503). Your key was saved and will activate automatically once traffic clears.',
        });
        return;
      }
      res.status(400).json({ valid: false, error: parsed.message });
    }
  });

  app.post('/api/mentor/chat', async (req: Request, res: Response) => {
    const resolved = getGeminiClient(extractCustomApiKey(req));
    if (!resolved) {
      res.status(503).json({
        error: 'Gemini API is not configured on the server; using built-in local physics mentor.',
        fallbackRecommended: true,
      });
      return;
    }
    const { client, source } = resolved;

    const body = (req.body || {}) as Record<string, unknown>;
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    if (!message || message.length > 2000) {
      res.status(400).json({ error: 'Message must be between 1 and 2000 characters.' });
      return;
    }

    const rawHistory = Array.isArray(body.history) ? body.history : [];
    const safeHistory = rawHistory
      .filter((h): h is Record<string, unknown> => Boolean(h && typeof h === 'object'))
      .slice(-12)
      .map((h) => ({
        role: h.role === 'model' ? ('model' as const) : ('user' as const),
        parts: [{ text: String(h.text || '').trim().slice(0, 1800) }],
      }))
      .filter((h) => h.parts[0].text.length > 0);

    const studyContext = sanitizeStudyContext(body.studyContext);
    const systemInstruction = buildSystemInstruction(studyContext);

    const contents = [
      ...safeHistory,
      { role: 'user' as const, parts: [{ text: message }] },
    ];

    try {
      const { result: firstResponse, modelUsed } = await generateWithModelFallback((model) =>
        client.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction,
            temperature: 0.4,
            maxOutputTokens: 1200,
            tools: [{ functionDeclarations: [proposeStudyPlanDeclaration] }],
          },
        })
      );

      const functionCalls = firstResponse.functionCalls;
      let studyPlan: ProposedPlan | null = null;
      let replyText = (firstResponse.text || '').trim();

      if (functionCalls && functionCalls.length > 0) {
        const planCall = functionCalls.find((fc) => fc.name === 'propose_study_plan');
        if (planCall) {
          studyPlan = sanitizeProposedPlan(planCall.args as Record<string, unknown> | undefined);
          const previousContent = firstResponse.candidates?.[0]?.content;
          if (previousContent && !replyText) {
            const { result: followUp } = await generateWithModelFallback((model) =>
              client.models.generateContent({
                model,
                contents: [
                  ...contents,
                  previousContent,
                  {
                    role: 'user',
                    parts: [
                      {
                        functionResponse: {
                          id: planCall.id,
                          name: 'propose_study_plan',
                          response: {
                            status: 'displayed_to_student',
                            taskCount: studyPlan?.tasks.length ?? 0,
                          },
                        },
                      },
                    ],
                  },
                ],
                config: {
                  systemInstruction,
                  temperature: 0.4,
                  maxOutputTokens: 700,
                  tools: [{ functionDeclarations: [proposeStudyPlanDeclaration] }],
                },
              })
            );
            replyText = (followUp.text || '').trim();
          }
        }
      }

      if (!replyText && studyPlan) {
        replyText = `${studyPlan.summary}\n\nClick **Save to Today's Tasks** below whenever you're ready to lock this plan into your dashboard.`;
      }

      if (!replyText) {
        replyText = 'I processed your question, please rephrase slightly if you want a detailed step-by-step breakdown.';
      }

      res.json({
        reply: replyText,
        studyPlan,
        engine: 'ai',
        keySource: source,
        model: modelUsed,
      });
    } catch (err) {
      const parsed = parseGeminiError(err);
      console.error('Gemini chat error:', parsed.message);
      res.status(parsed.isTransient ? 503 : 502).json({
        error: parsed.message,
        fallbackRecommended: true,
        transientUnavailable: parsed.isTransient,
        keyRejected: source === 'custom' && parsed.isInvalidKey,
      });
    }
  });

  app.post('/api/mentor/transcribe', async (req: Request, res: Response) => {
    const resolved = getGeminiClient(extractCustomApiKey(req));
    if (!resolved) {
      res.status(503).json({
        error: 'Gemini voice transcription is unavailable on server.',
        fallbackRecommended: true,
      });
      return;
    }
    const { client } = resolved;

    const body = (req.body || {}) as Record<string, unknown>;
    const audioBase64 = typeof body.audioBase64 === 'string' ? body.audioBase64.trim() : '';
    const rawMime = typeof body.mimeType === 'string' ? body.mimeType.trim().toLowerCase() : 'audio/webm';
    const cleanMime = rawMime.split(';')[0];

    if (!audioBase64 || audioBase64.length > 7_000_000) {
      res.status(400).json({ error: 'Audio payload missing or exceeds 5 MB limit.' });
      return;
    }
    if (!ALLOWED_AUDIO_MIMES.has(cleanMime)) {
      res.status(400).json({ error: 'Unsupported audio MIME type.' });
      return;
    }

    try {
      const response = await client.models.generateContent({
        model: TRANSCRIBE_MODEL,
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: cleanMime,
                data: audioBase64,
              },
            },
            {
              text: 'Transcribe this student physics doubt or study-plan request accurately in English. Preserve numbers, units, and physics symbols clearly. Output only the transcribed text.',
            },
          ],
        },
      });
      res.json({ text: (response.text || '').trim() });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Transcription failed.';
      console.error('Gemini transcribe error:', msg);
      res.status(502).json({ error: msg, fallbackRecommended: true });
    }
  });

  app.post('/api/mentor/speak', async (req: Request, res: Response) => {
    const resolved = getGeminiClient(extractCustomApiKey(req));
    if (!resolved) {
      res.status(503).json({
        error: 'Gemini voice output is unavailable on server.',
        fallbackRecommended: true,
      });
      return;
    }
    const { client } = resolved;

    const body = (req.body || {}) as Record<string, unknown>;
    const rawText = typeof body.text === 'string' ? body.text : '';
    const spokenText = stripLatexForSpeech(rawText);
    const requestedVoice = typeof body.voiceName === 'string' ? body.voiceName.trim() : 'Kore';
    const voiceName = ALLOWED_VOICES.has(requestedVoice) ? requestedVoice : 'Kore';

    if (!spokenText) {
      res.status(400).json({ error: 'Text for speech synthesis is empty.' });
      return;
    }

    try {
      const response = await client.models.generateContent({
        model: TTS_MODEL,
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: spokenText,
                speechMetadata: {
                  style: 'Warm, clear, encouraging IIT-JEE physics mentor explaining calmly',
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) {
        res.status(502).json({ error: 'No audio returned by TTS model.', fallbackRecommended: true });
        return;
      }

      res.json({
        audioBase64: base64Audio,
        mimeType: 'audio/wav',
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Speech synthesis failed.';
      console.error('Gemini TTS error:', msg);
      res.status(502).json({ error: msg, fallbackRecommended: true });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const hmrEnabled = process.env.DISABLE_HMR === 'false';
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: hmrEnabled,
        ...(hmrEnabled ? {} : { ws: false as const }),
        watch: hmrEnabled ? {} : null,
      },
      appType: 'spa',
    });
    if (!hmrEnabled) {
      app.get('/@vite/client', async (_req: Request, res: Response, next) => {
        try {
          const result = await vite.transformRequest('/@vite/client');
          if (!result?.code) {
            next();
            return;
          }
          const patched = result.code
            .replace('async connect(handlers) {', 'async connect() {\n\t\t\treturn;')
            .replace('await wsTransport.disconnect();', 'return;')
            .replace('wsTransport.send(data);', 'return;');
          res.type('application/javascript').send(patched);
        } catch (err) {
          next(err);
        }
      });
    }
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.use((_req: Request, res: Response) => {
      const indexFile = path.join(distDir, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Build output not found. Run npm run build first.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`JEE Physics Web server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
