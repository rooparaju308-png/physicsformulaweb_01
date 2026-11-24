import { FORMULAS } from '../data/formulas';
import { MentorStudyPlan, MentorPlanTask, Formula } from '../types/physics';
import { solvePhysicsDoubt } from './doubtSolver';

export interface MentorStudyContext {
  daysLeft: number;
  knownCount: number;
  totalFormulas: number;
  dueFlashcards: number;
  todayStudyMinutes: number;
  streakDays: number;
  activeTab: string;
  currentTopic?: string;
  weakChapters: string[];
  unresolvedMistakes: Array<{
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

export interface LocalMentorResponse {
  reply: string;
  formulaIds?: string[];
  labId?: Formula['labId'];
  studyPlan?: MentorStudyPlan;
}

function extractRequestedHours(prompt: string): number {
  const match = prompt.match(/(\d+(?:\.\d+)?)\s*(?:hr|hrs|hour|hours)/i);
  if (match) {
    const val = Number(match[1]);
    if (Number.isFinite(val) && val >= 1 && val <= 12) return val;
  }
  return 3;
}

function buildLocalTimetable(prompt: string, ctx: MentorStudyContext | null): LocalMentorResponse {
  const totalHours = extractRequestedHours(prompt);
  const totalMinutes = Math.round(totalHours * 60);
  const topWeak = ctx?.weakChapters?.[0] || 'Electrostatics & Gauss Law';
  const secondWeak = ctx?.weakChapters?.[1] || 'Rotational & Current Electricity';
  const topMistake = ctx?.unresolvedMistakes?.[0];
  const dueCards = ctx?.dueFlashcards ?? 10;
  const daysLeft = ctx?.daysLeft ?? 60;

  const block1 = Math.max(20, Math.round(totalMinutes * 0.3));
  const block2 = Math.max(20, Math.round(totalMinutes * 0.25));
  const block3 = Math.max(25, Math.round(totalMinutes * 0.3));
  const block4 = Math.max(15, totalMinutes - (block1 + block2 + block3));

  const tasks: MentorPlanTask[] = [
    {
      timeSlot: `Block 1 · ${block1}m`,
      title: topMistake
        ? `Mistake Repair: ${topMistake.title} (${topMistake.chapter})`
        : `${topWeak}: High-yield formulas & JEE trap check`,
      chapter: topMistake ? topMistake.chapter : topWeak,
      durationMinutes: block1,
      reason: topMistake
        ? `Fixes your recurring ${topMistake.errorType.replace('-', ' ')} (${topMistake.missCount}x missed).`
        : 'Eliminates negative marking on weak-radar concepts first.',
    },
    {
      timeSlot: `Block 2 · ${block2}m`,
      title: `${Math.min(18, Math.max(8, dueCards))} Due Flashcards + Blur-Equation Recall`,
      chapter: 'Spaced Repetition',
      durationMinutes: block2,
      reason: 'Locks formula recall into long-term memory before numerical drills.',
    },
    {
      timeSlot: `Block 3 · ${block3}m`,
      title: `Solve 15 Timed PYQs: ${secondWeak}`,
      chapter: secondWeak,
      durationMinutes: block3,
      reason: 'Builds calculation speed and unit-check accuracy under JEE clock pressure.',
    },
    {
      timeSlot: `Block 4 · ${block4}m`,
      title: `Short Notes Sprint & Dimensional Sanity Review`,
      chapter: 'Rapid Revision',
      durationMinutes: block4,
      reason: 'End-of-day consolidation so formulas stay sharp tomorrow.',
    },
  ];

  const studyPlan: MentorStudyPlan = {
    planTitle: `${totalHours}-Hour JEE Physics Rank-Booster Plan`,
    summary: ctx
      ? `Built for ${daysLeft} days to JEE (${ctx.knownCount}/${ctx.totalFormulas} nodes mastered, ${ctx.unresolvedMistakes.length} open mistakes). Prioritizes your weak-topic repair before timed numericals.`
      : `Structured ${totalHours}-hour sprint balancing concept repair, active recall, and timed JEE numericals.`,
    tasks,
  };

  const replyLines = [
    `Here is a focused **${totalHours}-hour Physics study timetable** tailored for your current prep:`,
    '',
    ...tasks.map(
      (t, i) => `${i + 1}. **${t.timeSlot}** — ${t.title} _(${t.reason})_`
    ),
    '',
    ctx && ctx.unresolvedMistakes.length > 0
      ? `Tip: Start strictly with **${tasks[0].chapter}** while your focus is highest, then log any tricky traps straight into your Mistake Notebook.`
      : `Tip: Keep a rough pad beside you and verify dimensional units ($\text{SI}$) before picking any MCQ option.`,
  ];

  const matchedFormula = FORMULAS.find((f) =>
    f.chapter.toLowerCase().includes(topWeak.toLowerCase().split(' ')[0] || '')
  );

  return {
    reply: replyLines.join('\n'),
    studyPlan,
    formulaIds: matchedFormula ? [matchedFormula.id] : undefined,
    labId: matchedFormula?.labId,
  };
}

function buildWeaknessReview(ctx: MentorStudyContext | null): LocalMentorResponse {
  if (!ctx) {
    return {
      reply:
        'Turn on **Use My Progress** in the header or ask a specific chapter/formula question, and I can analyze your Mistake Notebook, due flashcards, and weak chapters!',
    };
  }

  const lines: string[] = [
    `### Prep Snapshot (${ctx.daysLeft} days to JEE Main)`,
    `- **Formula Web Mastery**: **${ctx.knownCount} / ${ctx.totalFormulas}** nodes mastered`,
    `- **Active Streak**: **${ctx.streakDays} days** · **Today**: ${ctx.todayStudyMinutes} min studied · **Due Flashcards**: ${ctx.dueFlashcards}`,
  ];

  if (ctx.unresolvedMistakes.length > 0) {
    lines.push('', '**Top Mistake Traps to Clear First:**');
    ctx.unresolvedMistakes.slice(0, 4).forEach((m, i) => {
      lines.push(
        `${i + 1}. **${m.title}** (${m.chapter}) — ${m.errorType.replace('-', ' ')} · missed ${m.missCount}x`
      );
    });
  } else {
    lines.push('', 'Your Mistake Notebook has zero unresolved traps right now—great discipline!');
  }

  if (ctx.weakChapters.length > 0) {
    lines.push(
      '',
      `**Priority Focus Chapters**: ${ctx.weakChapters.slice(0, 3).join(', ')}.`,
      '',
      'Ask **"Build my 3-hour study timetable today"** anytime and I will turn these gaps into Today\'s Tasks.'
    );
  }

  return { reply: lines.join('\n') };
}

function buildDailyStudyTips(ctx: MentorStudyContext | null): LocalMentorResponse {
  const topWeak = ctx?.weakChapters?.[0] || 'Electrostatics & Rotational Motion';
  const topMistake = ctx?.unresolvedMistakes?.[0];
  const dueCards = ctx?.dueFlashcards ?? 8;
  const daysLeft = ctx?.daysLeft ?? 60;

  const tips: string[] = [
    topMistake
      ? `1. **Fix Recurring ${topMistake.errorType.replace('-', ' ')} First**: You missed **${topMistake.title}** (${topMistake.chapter}) ${topMistake.missCount} times. Re-derive its sign convention once today before starting new problems.`
      : `1. **Lock High-Yield Core First**: Spend 20 focused minutes on **${topWeak}** using Blur-Equation Recall on Short Notes before jumping to numericals.`,
    `2. **Protect Accuracy with Dimensional Checks**: On any unfamiliar MCQ, check SI dimensions of options first—it catches 30% of JEE Main formula-inversion traps in under 10 seconds.`,
    dueCards > 0
      ? `3. **Clear ${Math.min(15, dueCards)} Due Flashcards Tonight**: With ${daysLeft} days left to JEE Main, spaced-repetition reviews prevent formula drift across old chapters.`
      : `3. **Micro-Sprint Discipline**: Solve 10 mixed PYQs under a strict 18-minute timer and log every wrong choice into your Mistake Notebook.`,
  ];

  const reply = [
    `### 3 Personalized JEE Physics Study Tips`,
    '',
    ...tips,
    '',
    `Want me to convert these into an actionable schedule? Tap **"Turn into today’s study plan"** below.`,
  ].join('\n');

  const matchedFormula = FORMULAS.find((f) =>
    f.chapter.toLowerCase().includes(topWeak.toLowerCase().split(' ')[0] || '')
  );

  return {
    reply,
    formulaIds: matchedFormula ? [matchedFormula.id] : undefined,
    labId: matchedFormula?.labId,
  };
}

export function runLocalMentorEngine(
  prompt: string,
  ctx: MentorStudyContext | null
): LocalMentorResponse {
  const q = prompt.trim();
  const lower = q.toLowerCase();

  // 0. Check for developer / creator / email inquiry intent
  if (
    /\b(developer|creator|author|who (made|developed|created|built) (this|you|app)|founder|email|contact|reach|mail)\b/i.test(
      lower
    )
  ) {
    const devName = 'Kushal';
    const devBio = 'Class 12 JEE Aspirant & Full-Stack Creator building high-performance study web apps';
    const devEmail = 'kushalkj2009@gmail.com';
    const isEmailQuery = /\b(email|contact|reach|mail)\b/i.test(lower);

    const lines = [
      `### App Developer & Creator`,
      ``,
      `JEE Physics Web and Mini Gemini were created and developed by **${devName}** (${devBio})!`,
    ];
    if (isEmailQuery) {
      lines.push('', `Developer Email: **[${devEmail}](mailto:${devEmail})**`);
    }
    lines.push('', `Ask me any JEE Physics doubt or type **"Build my 3-hour study timetable today"** anytime!`);
    return { reply: lines.join('\n') };
  }

  // 1. Check for daily study tips intent
  if (/\b(tip|tips|advice|habit|remember)\b/i.test(lower)) {
    return buildDailyStudyTips(ctx);
  }

  // 2. Check for timetable / routine / schedule planning intent
  if (
    /\b(timetable|schedule|study plan|routine|roadmap|plan my|hours?\s+plan|what should i study|daily plan)\b/i.test(
      lower
    )
  ) {
    return buildLocalTimetable(q, ctx);
  }

  // 3. Check for progress / weakness / mentoring audit intent
  if (
    /\b(weak|mistake|progress|radar|mentor|motivat|score|rank|boost|how am i|backlog|exam prep|strategy)\b/i.test(
      lower
    ) &&
    q.split(/\s+/).length <= 16
  ) {
    return buildWeaknessReview(ctx);
  }

  // 3. Run deterministic physics doubt & numerical solver
  const solved = solvePhysicsDoubt(q);

  if (solved.numerical) {
    const matched = solved.matchedFormulas[0]?.formula;
    const stepsText = solved.numerical.steps.map((s, idx) => `${idx + 1}. ${s}`).join('\n');
    const caveat = solved.numerical.caveat
      ? `\n\n> **JEE Trap Check**: ${solved.numerical.caveat}`
      : '';
    return {
      reply: `**Worked Solution · ${solved.numerical.title}**\n\n${stepsText}\n\n**Final Answer:** \`${solved.numerical.finalAnswer}\`${caveat}`,
      formulaIds: [solved.numerical.formulaId],
      labId: matched?.labId,
    };
  }

  if (solved.mathResult) {
    return {
      reply: `**Physics Expression Result**\n\n- Expression: \`${solved.mathResult.expression}\`\n- Value: **${solved.mathResult.formatted}**\n\nTip: Double-check whether inputs were converted to strict SI units ($\\text{m}$, $\\text{kg}$, $\\text{s}$, $\\text{C}$, $\\text{V}$).`,
    };
  }

  if (solved.matchedFormulas.length > 0) {
    const top = solved.matchedFormulas.slice(0, 2);
    const lines: string[] = [
      `Here ${top.length === 1 ? 'is the closest verified JEE formula' : 'are the closest verified JEE formulas'} for your doubt:`,
    ];
    let labId: Formula['labId'] | undefined;
    for (const item of top) {
      if (!labId && item.formula.labId) labId = item.formula.labId;
      lines.push(
        '',
        `**${item.formula.title}** _(${item.chapterTitle})_`,
        `$$${item.formula.latex}$$`
      );
      if (item.formula.conditions.length > 0) {
        lines.push(`- Condition: ${item.formula.conditions[0]}`);
      }
      if (item.trap) {
        lines.push(`- **JEE Trap (${item.trap.headline})**: ${item.trap.safeRule}`);
      }
    }

    if (solved.matchedNotes.length > 0) {
      const note = solved.matchedNotes[0];
      lines.push('', `Quick Note Check (${note.chapterTitle}): **${note.item.label}** — $${note.item.latex}$`);
    }

    return {
      reply: lines.join('\n'),
      formulaIds: top.map((t) => t.formula.id),
      labId,
    };
  }

  // 4. Fallback guidance when offline query has no keyword match
  return {
    reply: [
      `I couldn't find an exact offline keyword match for **"${q.slice(0, 80)}"**.`,
      '',
      'You can:',
      '- Try **Smart AI Mode** (when online) for open-ended conceptual explanations & custom numericals.',
      '- Include core physics keywords or numbers (e.g., *"400V electron de broglie"*, *"silvered lens"*, *"RLC impedance"*, *"Gauss cube flux"*).',
      '- Ask **"Build my 3-hour study timetable today"** or **"Review my weak topics"** for instant coaching.',
    ].join('\n'),
  };
}
