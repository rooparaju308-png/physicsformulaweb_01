import { CHAPTERS, FORMULAS } from '../data/formulas';
import { getTrapNote } from '../data/traps';
import { ChapterId, Formula, MistakeEntry } from '../types/physics';

export type AnkiExportFormat = 'txt' | 'csv';
export type AnkiCardStyle = 'qa' | 'formula-recall';
export type ExportScope = 'all' | 'high-yield' | 'starred' | 'unknown';
export type ChapterFilterValue = ChapterId | 'all' | 'class-12' | 'class-11';

export interface AnkiExportOptions {
  chapterFilter: ChapterFilterValue;
  scope: ExportScope;
  cardStyle: AnkiCardStyle;
  format: AnkiExportFormat;
  includeTraps: boolean;
  includeDetails: boolean;
  includeMistakes: boolean;
  unresolvedMistakesOnly: boolean;
  knownIds: string[];
  bookmarkedIds: string[];
  mistakes: MistakeEntry[];
}

export interface AnkiCardItem {
  id: string;
  title: string;
  chapterTitle: string;
  frontHtml: string;
  backHtml: string;
  frontPlain: string;
  backSummary: string;
  latex?: string;
  tags: string[];
  kind: 'formula' | 'mistake';
}

export interface AnkiExportResult {
  content: string;
  filename: string;
  mimeType: string;
  cardCount: number;
  formulaCount: number;
  mistakeCount: number;
  cards: AnkiCardItem[];
  previewCards: AnkiCardItem[];
}

const CHAPTER_MAP = new Map(CHAPTERS.map((c) => [c.id, c]));

export function isClass11Chapter(chapterId: ChapterId): boolean {
  return chapterId.startsWith('c11-');
}

export function filterFormulasForExport(
  chapterFilter: ChapterFilterValue,
  scope: ExportScope,
  knownIds: string[],
  bookmarkedIds: string[]
): Formula[] {
  const knownSet = new Set(knownIds);
  const bookmarkSet = new Set(bookmarkedIds);

  return FORMULAS.filter((f) => {
    if (chapterFilter === 'class-12' && isClass11Chapter(f.chapter)) return false;
    if (chapterFilter === 'class-11' && !isClass11Chapter(f.chapter)) return false;
    if (
      chapterFilter !== 'all' &&
      chapterFilter !== 'class-12' &&
      chapterFilter !== 'class-11' &&
      f.chapter !== chapterFilter
    ) {
      return false;
    }

    if (scope === 'high-yield' && f.jeeWeight !== 3) return false;
    if (scope === 'starred' && !bookmarkSet.has(f.id)) return false;
    if (scope === 'unknown' && knownSet.has(f.id)) return false;

    return true;
  });
}

function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function normalizeInlineWhitespace(raw: string): string {
  return raw.replace(/[\t\r\n]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
}

function sanitizeAnkiTag(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');
}

function sanitizeLatexForAnkiMathJax(latex: string): string {
  // Keep valid TeX commands intact while ensuring single-line TSV safety
  return latex.replace(/[\t\r\n]+/g, ' ').trim();
}

function escapeCsvCell(value: string): string {
  const escaped = value.replace(/"/g, '""');
  return `"${escaped}"`;
}

function sanitizeTsvCell(value: string): string {
  return value.replace(/\t/g, ' ').replace(/\r?\n/g, '<br>');
}

export function buildAnkiDeck(options: AnkiExportOptions): AnkiExportResult {
  const formulas = filterFormulasForExport(
    options.chapterFilter,
    options.scope,
    options.knownIds,
    options.bookmarkedIds
  );

  const knownSet = new Set(options.knownIds);
  const bookmarkSet = new Set(options.bookmarkedIds);

  const formulaCards: AnkiCardItem[] = formulas.map((f) => {
    const chapterMeta = CHAPTER_MAP.get(f.chapter);
    const chapterTitle = chapterMeta?.shortTitle || f.chapter;
    const trap = options.includeTraps ? getTrapNote(f.id) : undefined;
    const cleanLatex = sanitizeLatexForAnkiMathJax(f.latex);

    let frontHtml = '';
    let frontPlain = '';
    if (options.cardStyle === 'qa') {
      frontPlain = f.flashcard.front;
      frontHtml =
        `<div style="font-size:12px;color:#64748b;margin-bottom:6px;">${escapeHtml(chapterTitle)} &middot; ${escapeHtml(f.subtopic)}</div>` +
        `<div style="font-size:16px;font-weight:600;line-height:1.45;">${escapeHtml(f.flashcard.front)}</div>`;
    } else {
      frontPlain = `${f.title} (${chapterTitle})`;
      frontHtml =
        `<div style="font-size:12px;color:#64748b;margin-bottom:6px;">${escapeHtml(chapterTitle)} &middot; ${escapeHtml(f.subtopic)}</div>` +
        `<div style="font-size:17px;font-weight:700;line-height:1.35;">${escapeHtml(f.title)}</div>` +
        `<div style="font-size:12px;color:#64748b;margin-top:8px;">Recall the exact equation, symbols, and validity conditions.</div>`;
    }

    const backParts: string[] = [];
    if (options.cardStyle === 'qa') {
      backParts.push(
        `<div style="font-size:15px;font-weight:600;margin-bottom:8px;">${escapeHtml(f.flashcard.back)}</div>`
      );
    } else {
      backParts.push(
        `<div style="font-size:13px;color:#475569;margin-bottom:8px;">${escapeHtml(f.flashcard.back)}</div>`
      );
    }

    backParts.push(
      `<div style="margin:10px 0;padding:8px 10px;border:1px solid #cbd5e1;border-radius:6px;">\\[ ${cleanLatex} \\]</div>`
    );

    if (options.includeDetails) {
      if (f.variables.length > 0) {
        const varText = f.variables
          .map((v) => `<code>${escapeHtml(v.symbol)}</code>: ${escapeHtml(v.meaning)}`)
          .join(' &middot; ');
        backParts.push(
          `<div style="font-size:12px;margin-top:6px;"><strong>Variables:</strong> ${varText}</div>`
        );
      }
      if (f.conditions.length > 0) {
        const condItems = f.conditions
          .map((c) => `<li>${escapeHtml(c)}</li>`)
          .join('');
        backParts.push(
          `<div style="font-size:12px;margin-top:6px;"><strong>Conditions:</strong><ul style="margin:4px 0 0 18px;padding:0;">${condItems}</ul></div>`
        );
      }
    }

    if (trap) {
      backParts.push(
        `<div style="font-size:12px;margin-top:8px;padding:6px 8px;border:1px solid #f59e0b;border-radius:6px;color:#92400e;"><strong>JEE Trap (${escapeHtml(trap.headline)}):</strong> ${escapeHtml(trap.safeRule)}</div>`
      );
    }

    const yieldTag =
      f.jeeWeight === 3 ? 'yield-high' : f.jeeWeight === 2 ? 'yield-core' : 'yield-foundation';
    const rawTags = [
      'jee-physics',
      f.chapter,
      yieldTag,
      ...f.tags.slice(0, 4),
      bookmarkSet.has(f.id) ? 'starred' : '',
      !knownSet.has(f.id) ? 'needs-revision' : 'mastered',
    ];
    const tags = Array.from(new Set(rawTags.map(sanitizeAnkiTag).filter(Boolean)));

    return {
      id: f.id,
      title: f.title,
      chapterTitle,
      frontHtml,
      backHtml: backParts.join(''),
      frontPlain,
      backSummary: f.flashcard.back,
      latex: cleanLatex,
      tags,
      kind: 'formula',
    };
  });

  const formulaLookup = new Map(FORMULAS.map((f) => [f.id, f]));
  const selectedMistakes = options.includeMistakes
    ? options.mistakes.filter((m) => (options.unresolvedMistakesOnly ? !m.resolved : true))
    : [];

  const mistakeCards: AnkiCardItem[] = selectedMistakes.map((m) => {
    const linked = m.formulaId ? formulaLookup.get(m.formulaId) : undefined;
    const cleanLatex = linked ? sanitizeLatexForAnkiMathJax(linked.latex) : undefined;
    const frontHtml =
      `<div style="font-size:12px;color:#b45309;margin-bottom:6px;">Mistake Notebook &middot; ${escapeHtml(m.chapter)} &middot; ${escapeHtml(m.errorType)}</div>` +
      `<div style="font-size:15px;font-weight:600;line-height:1.45;">${escapeHtml(m.title)}</div>` +
      `<div style="font-size:13px;color:#475569;margin-top:6px;">${escapeHtml(normalizeInlineWhitespace(m.prompt))}</div>`;

    const backParts: string[] = [];
    if (m.options && typeof m.correctIndex === 'number' && m.options[m.correctIndex]) {
      backParts.push(
        `<div style="font-size:14px;font-weight:700;margin-bottom:6px;">Correct Answer: ${escapeHtml(m.options[m.correctIndex])}</div>`
      );
    }
    if (m.explanation) {
      backParts.push(
        `<div style="font-size:13px;line-height:1.45;">${escapeHtml(normalizeInlineWhitespace(m.explanation))}</div>`
      );
    }
    if (m.note) {
      backParts.push(
        `<div style="font-size:12px;margin-top:6px;"><strong>Personal Note:</strong> ${escapeHtml(normalizeInlineWhitespace(m.note))}</div>`
      );
    }
    if (cleanLatex) {
      backParts.push(
        `<div style="margin:8px 0;padding:8px 10px;border:1px solid #cbd5e1;border-radius:6px;">\\[ ${cleanLatex} \\]</div>`
      );
    }
    if (backParts.length === 0) {
      backParts.push(`<div style="font-size:13px;">Review ${escapeHtml(m.title)} (${escapeHtml(m.chapter)}).</div>`);
    }

    const tags = Array.from(
      new Set(
        ['jee-physics', 'mistake-notebook', m.errorType, m.chapter, m.resolved ? 'resolved' : 'unresolved']
          .map(sanitizeAnkiTag)
          .filter(Boolean)
      )
    );

    return {
      id: `mistake-${m.id}`,
      title: m.title,
      chapterTitle: m.chapter,
      frontHtml,
      backHtml: backParts.join(''),
      frontPlain: m.title,
      backSummary: m.explanation || m.note || m.title,
      latex: cleanLatex,
      tags,
      kind: 'mistake',
    };
  });

  const allCards = [...formulaCards, ...mistakeCards];
  const dateTag = new Date().toISOString().slice(0, 10);
  const scopeSlug = options.chapterFilter === 'all' ? 'all-chapters' : options.chapterFilter;

  if (options.format === 'csv') {
    const header = 'Front,Back,Tags';
    const rows = allCards.map((c) =>
      [escapeCsvCell(c.frontHtml), escapeCsvCell(c.backHtml), escapeCsvCell(c.tags.join(' '))].join(',')
    );
    const content = '\uFEFF' + [header, ...rows].join('\r\n');
    return {
      content,
      filename: `jee-physics-anki-${scopeSlug}-${dateTag}.csv`,
      mimeType: 'text/csv;charset=utf-8;',
      cardCount: allCards.length,
      formulaCount: formulaCards.length,
      mistakeCount: mistakeCards.length,
      cards: allCards,
      previewCards: allCards.slice(0, 2),
    };
  }

  // Native Anki TSV (.txt) with headers
  const headerLines = ['#separator:tab', '#html:true', '#tags column:3'];
  const rows = allCards.map(
    (c) => `${sanitizeTsvCell(c.frontHtml)}\t${sanitizeTsvCell(c.backHtml)}\t${c.tags.join(' ')}`
  );
  const content = [...headerLines, ...rows].join('\n');

  return {
    content,
    filename: `jee-physics-anki-${scopeSlug}-${dateTag}.txt`,
    mimeType: 'text/plain;charset=utf-8;',
    cardCount: allCards.length,
    formulaCount: formulaCards.length,
    mistakeCount: mistakeCards.length,
    cards: allCards,
    previewCards: allCards.slice(0, 2),
  };
}

export function triggerTextFileDownload(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
