import { FORMULAS } from '../data/formulas';
import {
  ChecklistItem,
  FlashcardProgress,
  MentorMessage,
  MistakeEntry,
  PersistedState,
  StudySession,
} from '../types/physics';

export function buildDefaultFlashcards(): Record<string, FlashcardProgress> {
  const map: Record<string, FlashcardProgress> = {};
  const now = Date.now();
  for (const f of FORMULAS) {
    map[f.id] = {
      formulaId: f.id,
      box: 1,
      nextReviewAt: now,
      lastReviewedAt: 0,
      wrongCount: 0,
      correctStreak: 0,
    };
  }
  return map;
}

export function mergeStudyStates(
  local: PersistedState,
  cloud: Partial<PersistedState> | null | undefined
): PersistedState {
  if (!cloud || typeof cloud !== 'object') return local;

  const knownSet = new Set<string>([
    ...(local.knownIds || []),
    ...(Array.isArray(cloud.knownIds) ? cloud.knownIds : []),
  ]);
  const bookmarkedSet = new Set<string>([
    ...(local.bookmarkedIds || []),
    ...(Array.isArray(cloud.bookmarkedIds) ? cloud.bookmarkedIds : []),
  ]);

  // Merge flashcards keeping the most progressed / recently reviewed state per formulaId
  const flashcards: Record<string, FlashcardProgress> = {
    ...buildDefaultFlashcards(),
    ...local.flashcards,
  };
  if (cloud.flashcards && typeof cloud.flashcards === 'object') {
    for (const [id, cCard] of Object.entries(cloud.flashcards)) {
      if (!cCard || typeof cCard !== 'object') continue;
      const lCard = flashcards[id];
      if (!lCard) {
        flashcards[id] = cCard;
      } else {
        const useCloud =
          (cCard.lastReviewedAt || 0) > (lCard.lastReviewedAt || 0) ||
          ((cCard.lastReviewedAt || 0) === (lCard.lastReviewedAt || 0) &&
            (cCard.box || 1) > (lCard.box || 1));
        flashcards[id] = useCloud
          ? {
              ...cCard,
              wrongCount: Math.max(cCard.wrongCount || 0, lCard.wrongCount || 0),
              correctStreak: Math.max(cCard.correctStreak || 0, lCard.correctStreak || 0),
            }
          : {
              ...lCard,
              wrongCount: Math.max(cCard.wrongCount || 0, lCard.wrongCount || 0),
              correctStreak: Math.max(cCard.correctStreak || 0, lCard.correctStreak || 0),
            };
      }
    }
  }

  // Merge checklist additively (OR stage booleans so completed ticks are never lost)
  const checklistMap = new Map<string, ChecklistItem>();
  for (const item of local.checklist || []) {
    checklistMap.set(item.id, { ...item, stages: { ...item.stages } });
  }
  for (const cItem of Array.isArray(cloud.checklist) ? cloud.checklist : []) {
    if (!cItem || !cItem.id) continue;
    const existing = checklistMap.get(cItem.id);
    if (!existing) {
      checklistMap.set(cItem.id, cItem);
    } else {
      checklistMap.set(cItem.id, {
        ...existing,
        stages: {
          formulasLearnt: existing.stages.formulasLearnt || !!cItem.stages?.formulasLearnt,
          graphsUnderstood: existing.stages.graphsUnderstood || !!cItem.stages?.graphsUnderstood,
          flashcardsDone: existing.stages.flashcardsDone || !!cItem.stages?.flashcardsDone,
          pyqsSolved: existing.stages.pyqsSolved || !!cItem.stages?.pyqsSolved,
          revisedX2: existing.stages.revisedX2 || !!cItem.stages?.revisedX2,
        },
      });
    }
  }

  // Merge study sessions deduplicated by id (prefer entry carrying xpEarned)
  const sessionMap = new Map<string, StudySession>();
  for (const s of [...(local.sessions || []), ...(Array.isArray(cloud.sessions) ? cloud.sessions : [])]) {
    if (!s || !s.id) continue;
    const prev = sessionMap.get(s.id);
    if (!prev || (typeof prev.xpEarned !== 'number' && typeof s.xpEarned === 'number')) {
      sessionMap.set(s.id, s);
    }
  }
  const sessions = Array.from(sessionMap.values())
    .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0))
    .slice(0, 200);

  // Merge dailyReviews taking max per day
  const dailyReviews: Record<string, number> = { ...(local.dailyReviews || {}) };
  if (cloud.dailyReviews && typeof cloud.dailyReviews === 'object') {
    for (const [dateKey, count] of Object.entries(cloud.dailyReviews)) {
      if (typeof count === 'number') {
        dailyReviews[dateKey] = Math.max(dailyReviews[dateKey] ?? 0, count);
      }
    }
  }

  const streakDays = Math.max(local.streakDays || 1, cloud.streakDays || 1);
  const lastActiveDate =
    (cloud.lastActiveDate || '') > (local.lastActiveDate || '')
      ? cloud.lastActiveDate!
      : local.lastActiveDate;

  const baseSettings = local.settings.examDateConfigured
    ? local.settings
    : cloud.settings
      ? { ...local.settings, ...cloud.settings }
      : local.settings;

  const settings = {
    ...baseSettings,
    background3dEnabled:
      typeof local.settings.background3dEnabled === 'boolean'
        ? local.settings.background3dEnabled
        : (cloud.settings?.background3dEnabled ?? true),
    background3dPreset:
      local.settings.background3dPreset ||
      cloud.settings?.background3dPreset ||
      'em-field',
    dailyGoalLabel:
      local.settings.dailyGoalLabel || cloud.settings?.dailyGoalLabel || '',
    dailyTasks:
      local.settings.dailyTasks && local.settings.dailyTasks.length > 0
        ? local.settings.dailyTasks
        : cloud.settings?.dailyTasks || [],
  };

  // Merge mistakes deduplicated by id (keeping latest updatedAtMs and higher missCount)
  const mistakeMap = new Map<string, MistakeEntry>();
  for (const m of [...(local.mistakes || []), ...(Array.isArray(cloud.mistakes) ? cloud.mistakes : [])]) {
    if (!m || typeof m.id !== 'string' || !m.id) continue;
    const prev = mistakeMap.get(m.id);
    if (!prev) {
      mistakeMap.set(m.id, m);
    } else {
      const newer = (m.updatedAtMs || 0) >= (prev.updatedAtMs || 0) ? m : prev;
      mistakeMap.set(m.id, {
        ...newer,
        missCount: Math.max(m.missCount || 1, prev.missCount || 1),
        createdAtMs: Math.min(m.createdAtMs || Date.now(), prev.createdAtMs || Date.now()),
      });
    }
  }
  const mistakes = Array.from(mistakeMap.values())
    .sort((a, b) => (b.updatedAtMs || 0) - (a.updatedAtMs || 0))
    .slice(0, 200);

  // Merge mentorMessages deduplicated by id, sorted chronologically, capped to 60
  const msgMap = new Map<string, MentorMessage>();
  for (const msg of [...(local.mentorMessages || []), ...(Array.isArray(cloud.mentorMessages) ? cloud.mentorMessages : [])]) {
    if (!msg || typeof msg.id !== 'string' || !msg.id) continue;
    const prev = msgMap.get(msg.id);
    if (!prev || (msg.planApplied && !prev.planApplied)) {
      msgMap.set(msg.id, msg);
    }
  }
  const mentorMessages = Array.from(msgMap.values())
    .sort((a, b) => (a.createdAtMs || 0) - (b.createdAtMs || 0))
    .slice(-60);

  return {
    ...local,
    settings,
    knownIds: Array.from(knownSet).slice(0, 500),
    bookmarkedIds: Array.from(bookmarkedSet).slice(0, 500),
    flashcards,
    checklist: Array.from(checklistMap.values()).slice(0, 300),
    sessions,
    dailyReviews,
    mistakes,
    mentorMessages,
    streakDays,
    lastActiveDate,
    lastVisitedFormulaId: local.lastVisitedFormulaId || cloud.lastVisitedFormulaId || '',
  };
}

export function compactFlashcardsForCloud(
  flashcards: Record<string, FlashcardProgress>
): Record<string, FlashcardProgress> {
  const out: Record<string, FlashcardProgress> = {};
  let count = 0;
  for (const [id, card] of Object.entries(flashcards)) {
    if (count >= 500) break;
    if (card.lastReviewedAt > 0 || card.box > 1 || card.wrongCount > 0 || card.correctStreak > 0) {
      out[id] = card;
      count += 1;
    }
  }
  return out;
}

export function compactMistakesForCloud(mistakes: MistakeEntry[]): MistakeEntry[] {
  return (mistakes || []).slice(0, 200).map((m) => ({
    id: String(m.id || '').slice(0, 128),
    source: m.source,
    chapter: String(m.chapter || 'general').slice(0, 64),
    title: String(m.title || '').slice(0, 140),
    prompt: String(m.prompt || '').slice(0, 420),
    ...(m.formulaId ? { formulaId: String(m.formulaId).slice(0, 128) } : {}),
    ...(Array.isArray(m.options) ? { options: m.options.slice(0, 4).map((o) => String(o).slice(0, 160)) } : {}),
    ...(typeof m.correctIndex === 'number' ? { correctIndex: m.correctIndex } : {}),
    ...(m.explanation ? { explanation: String(m.explanation).slice(0, 400) } : {}),
    errorType: m.errorType,
    missCount: Math.max(1, Math.min(999, Number(m.missCount) || 1)),
    resolved: Boolean(m.resolved),
    ...(m.note ? { note: String(m.note).slice(0, 240) } : {}),
    createdAtMs: Number(m.createdAtMs) || Date.now(),
    updatedAtMs: Number(m.updatedAtMs) || Date.now(),
  }));
}

export function compactMentorMessagesForCloud(messages: MentorMessage[]): MentorMessage[] {
  return (messages || []).slice(-60).map((m) => ({
    id: String(m.id || '').slice(0, 64),
    role: m.role === 'user' ? 'user' : 'mentor',
    text: String(m.text || '').slice(0, 2000),
    engine: m.engine === 'ai' ? 'ai' : 'local',
    createdAtMs: Number(m.createdAtMs) || Date.now(),
    ...(Array.isArray(m.formulaIds) && m.formulaIds.length > 0
      ? { formulaIds: m.formulaIds.slice(0, 6).map((id) => String(id).slice(0, 128)) }
      : {}),
    ...(m.labId ? { labId: m.labId } : {}),
    ...(m.studyPlan && Array.isArray(m.studyPlan.tasks)
      ? {
          studyPlan: {
            planTitle: String(m.studyPlan.planTitle || '').slice(0, 100),
            summary: String(m.studyPlan.summary || '').slice(0, 280),
            tasks: m.studyPlan.tasks.slice(0, 8).map((t) => ({
              timeSlot: String(t.timeSlot || '').slice(0, 40),
              title: String(t.title || '').slice(0, 120),
              chapter: String(t.chapter || '').slice(0, 50),
              durationMinutes: Math.max(5, Math.min(240, Number(t.durationMinutes) || 30)),
              ...(t.reason ? { reason: String(t.reason).slice(0, 160) } : {}),
            })),
          },
        }
      : {}),
    ...(typeof m.planApplied === 'boolean' ? { planApplied: m.planApplied } : {}),
  }));
}
