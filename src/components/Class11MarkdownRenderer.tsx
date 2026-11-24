import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Flag,
  Flame,
  HelpCircle,
  Lightbulb,
  Printer,
  Sparkles,
  Target,
} from 'lucide-react';
import { Class11ChapterMeta } from '../data/class11NotesData';
import { FormattedMathText } from './FormattedMathText';
import { MathBlock } from './MathBlock';
import { getClass11ReadingTime } from '../utils/readingTime';
import { MistakeErrorType, MistakeSource } from '../types/physics';

interface Class11MarkdownRendererProps {
  chapter: Class11ChapterMeta;
  isRevised: boolean;
  onToggleRevised: () => void;
  onNavigatePrev?: () => void;
  onNavigateNext?: () => void;
  prevChapterTitle?: string;
  nextChapterTitle?: string;
  searchQuery?: string;
  highYieldOnly?: boolean;
  blurEquations?: boolean;
  blurEpoch?: number;
  onFlagMistake?: (entry: {
    source: MistakeSource;
    chapter: string;
    title: string;
    prompt: string;
    errorType?: MistakeErrorType;
    explanation?: string;
  }) => void;
}

interface ParsedBlock {
  type:
    | 'h2'
    | 'h3'
    | 'numbered-point'
    | 'display-math'
    | 'table'
    | 'blockquote'
    | 'asked'
    | 'bullet'
    | 'focus-group'
    | 'paragraph';
  number?: number;
  content?: string;
  lines?: string[];
  focusTitle?: string;
  focusKind?: 'patterns' | 'combined' | 'tricky' | 'mistakes' | 'april2026';
  bullets?: string[];
}

export const Class11MarkdownRenderer: React.FC<Class11MarkdownRendererProps> = ({
  chapter,
  isRevised,
  onToggleRevised,
  onNavigatePrev,
  onNavigateNext,
  prevChapterTitle,
  nextChapterTitle,
  searchQuery = '',
  highYieldOnly = false,
  blurEquations = false,
  blurEpoch = 0,
  onFlagMistake,
}) => {
  // Parse raw markdown into structured visual blocks
  const { introQuote, blocks } = useMemo(() => {
    const lines = chapter.rawMarkdown.split('\n');
    let introQuote: string | null = null;
    const blocks: ParsedBlock[] = [];
    let i = 0;

    // Skip top title & metadata bullets
    while (i < lines.length) {
      const l = lines[i].trim();
      if (
        l.startsWith('# ') ||
        l.startsWith('- Class:') ||
        l.startsWith('- Chapter no.:') ||
        l.startsWith('- Weightage:') ||
        l === ''
      ) {
        i++;
      } else {
        break;
      }
    }

    // Capture initial intro blockquote if present immediately below metadata
    if (i < lines.length && lines[i].trim().startsWith('>')) {
      let q = lines[i].trim().replace(/^>\s*/, '');
      i++;
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        q += ' ' + lines[i].trim().replace(/^>\s*/, '');
        i++;
      }
      introQuote = q;
    }

    let inFocusMode = false;
    let focusSubHeader = '';

    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();

      if (!trimmed) {
        i++;
        continue;
      }

      // Check if entering a JEE Main Focus section
      if (trimmed.startsWith('## JEE Main Focus') || trimmed.startsWith('### JEE Main Focus')) {
        inFocusMode = true;
        focusSubHeader = trimmed.replace(/^###?\s*JEE Main Focus\s*—?\s*/, '').trim();
        blocks.push({
          type: 'h2',
          content: trimmed.replace(/^###?\s*/, '').trim(),
        });
        i++;
        continue;
      }

      // New H2 resets focus mode if it's not a focus block
      if (trimmed.startsWith('## ')) {
        inFocusMode = false;
        blocks.push({
          type: 'h2',
          content: trimmed.substring(3).trim(),
        });
        i++;
        continue;
      }

      // H3
      if (trimmed.startsWith('### ')) {
        const h3Title = trimmed.substring(4).trim();
        if (h3Title.toLowerCase().includes('asked in april 2026')) {
          // Parse upcoming bullets as April 2026 PYQs
          i++;
          const pyqs: string[] = [];
          while (i < lines.length) {
            const nextL = lines[i].trim();
            if (nextL.startsWith('- ')) {
              pyqs.push(nextL.substring(2).trim());
              i++;
            } else if (!nextL) {
              i++;
            } else {
              break;
            }
          }
          blocks.push({
            type: 'focus-group',
            focusKind: 'april2026',
            focusTitle: 'Asked in April 2026 (Recent JEE Main Shifts)',
            bullets: pyqs,
          });
          continue;
        } else {
          blocks.push({
            type: 'h3',
            content: h3Title,
          });
          i++;
          continue;
        }
      }

      // JEE Main Focus 4-category headers
      if (
        inFocusMode &&
        (trimmed.startsWith('**Question patterns') ||
          trimmed.startsWith('**Concepts combined') ||
          trimmed.startsWith('**Tricky points') ||
          trimmed.startsWith('**Mistakes to avoid'))
      ) {
        let kind: 'patterns' | 'combined' | 'tricky' | 'mistakes' = 'patterns';
        if (trimmed.includes('Concepts combined')) kind = 'combined';
        else if (trimmed.includes('Tricky points')) kind = 'tricky';
        else if (trimmed.includes('Mistakes to avoid')) kind = 'mistakes';

        const focusTitle = trimmed.replace(/^\*\*/, '').replace(/\*\*$/, '').trim();
        i++;
        const bullets: string[] = [];
        while (i < lines.length) {
          const nextL = lines[i].trim();
          if (nextL.startsWith('- ')) {
            bullets.push(nextL.substring(2).trim());
            i++;
          } else if (!nextL) {
            i++;
          } else {
            break;
          }
        }
        blocks.push({
          type: 'focus-group',
          focusKind: kind,
          focusTitle,
          bullets,
        });
        continue;
      }

      // Display math $$ ... $$
      if (trimmed.startsWith('$$')) {
        let math = trimmed;
        if (!trimmed.endsWith('$$') || trimmed === '$$') {
          i++;
          while (i < lines.length) {
            math += '\n' + lines[i];
            if (lines[i].trim().endsWith('$$')) {
              i++;
              break;
            }
            i++;
          }
        } else {
          i++;
        }
        blocks.push({
          type: 'display-math',
          content: math.replace(/^\$\$/, '').replace(/\$\$$/, '').trim(),
        });
        continue;
      }

      // Table (lines starting and ending with |)
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        const tableLines = [trimmed];
        i++;
        while (
          i < lines.length &&
          lines[i].trim().startsWith('|') &&
          lines[i].trim().endsWith('|')
        ) {
          tableLines.push(lines[i].trim());
          i++;
        }
        blocks.push({ type: 'table', lines: tableLines });
        continue;
      }

      // Blockquote (Exam tips, traps, key notes)
      if (trimmed.startsWith('>')) {
        let quote = trimmed.replace(/^>\s*/, '');
        i++;
        while (i < lines.length && lines[i].trim().startsWith('>')) {
          quote += ' ' + lines[i].trim().replace(/^>\s*/, '');
          i++;
        }
        blocks.push({ type: 'blockquote', content: quote });
        continue;
      }

      // Asked PYQ tag
      if (trimmed.startsWith('*Asked:')) {
        blocks.push({
          type: 'asked',
          content: trimmed.replace(/^\*Asked:\s*/, '').replace(/\*$/, '').trim(),
        });
        i++;
        continue;
      }

      // Numbered concept item (1. ..., 2. ...)
      const numMatch = trimmed.match(/^(\d+)\.\s+([\s\S]*)$/);
      if (numMatch) {
        const num = parseInt(numMatch[1], 10);
        let content = numMatch[2];
        i++;
        // Gather continuation lines until next block starts
        while (i < lines.length) {
          const next = lines[i];
          const nextTrim = next.trim();
          if (!nextTrim) {
            // Check lookahead
            if (
              i + 1 < lines.length &&
              (lines[i + 1].trim().startsWith('$$') ||
                lines[i + 1].trim().startsWith('- ') ||
                lines[i + 1].trim().startsWith('*Figure:'))
            ) {
              i++;
              continue;
            }
            break;
          }
          if (
            nextTrim.startsWith('#') ||
            nextTrim.startsWith('>') ||
            nextTrim.startsWith('*Asked:') ||
            /^\d+\.\s/.test(nextTrim) ||
            nextTrim.startsWith('|')
          ) {
            break;
          }
          content += '\n' + nextTrim;
          i++;
        }
        blocks.push({ type: 'numbered-point', number: num, content });
        continue;
      }

      // Unordered bullets
      if (trimmed.startsWith('- ')) {
        blocks.push({ type: 'bullet', content: trimmed.substring(2).trim() });
        i++;
        continue;
      }

      // Normal paragraph or caption
      blocks.push({ type: 'paragraph', content: trimmed });
      i++;
    }

    return { introQuote, blocks };
  }, [chapter.rawMarkdown]);

  const [showAllSections, setShowAllSections] = useState(false);
  const [revealedMathKeys, setRevealedMathKeys] = useState<Record<string, boolean>>({});
  const [flaggedFlash, setFlaggedFlash] = useState(false);

  useEffect(() => {
    setShowAllSections(false);
  }, [chapter.id, searchQuery]);

  useEffect(() => {
    setRevealedMathKeys({});
  }, [blurEquations, blurEpoch, chapter.id]);

  const readingTime = useMemo(
    () => getClass11ReadingTime(chapter.rawMarkdown),
    [chapter.rawMarkdown]
  );

  // Group blocks by H2 sections so keyword search can filter matching sections cleanly
  const { visibleBlocks, totalSectionsCount, matchingSectionsCount } = useMemo(() => {
    const tokens = searchQuery
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    if (tokens.length === 0 || showAllSections) {
      return {
        visibleBlocks: blocks,
        totalSectionsCount: 0,
        matchingSectionsCount: 0,
      };
    }

    const headerText = `${chapter.title} ${chapter.prefix} chapter ${chapter.number} ch ${chapter.number} ${chapter.weightage}`.toLowerCase();
    if (tokens.every((tok) => headerText.includes(tok))) {
      return {
        visibleBlocks: blocks,
        totalSectionsCount: 0,
        matchingSectionsCount: 0,
      };
    }

    const sections: ParsedBlock[][] = [];
    let currentSection: ParsedBlock[] = [];
    for (const b of blocks) {
      if (b.type === 'h2' && currentSection.length > 0) {
        sections.push(currentSection);
        currentSection = [b];
      } else {
        currentSection.push(b);
      }
    }
    if (currentSection.length > 0) {
      sections.push(currentSection);
    }

    const matchingSections = sections.filter((sec) => {
      const secText = sec
        .map((b) =>
          [
            b.content ?? '',
            b.focusTitle ?? '',
            ...(b.bullets ?? []),
            ...(b.lines ?? []),
          ].join(' ')
        )
        .join(' ')
        .toLowerCase();
      return tokens.every((tok) => secText.includes(tok));
    });

    if (matchingSections.length === 0 || matchingSections.length === sections.length) {
      return {
        visibleBlocks: blocks,
        totalSectionsCount: sections.length,
        matchingSectionsCount: matchingSections.length,
      };
    }

    return {
      visibleBlocks: matchingSections.flat(),
      totalSectionsCount: sections.length,
      matchingSectionsCount: matchingSections.length,
    };
  }, [blocks, chapter, searchQuery, showAllSections]);

  const isSectionFiltered =
    totalSectionsCount > 0 &&
    matchingSectionsCount > 0 &&
    matchingSectionsCount < totalSectionsCount &&
    !showAllSections;

  const displayedBlocks = useMemo(() => {
    if (!highYieldOnly) return visibleBlocks;
    return visibleBlocks.filter(
      (b) =>
        b.type === 'h2' ||
        b.type === 'h3' ||
        b.type === 'display-math' ||
        b.type === 'table' ||
        b.type === 'blockquote' ||
        b.type === 'asked' ||
        b.type === 'focus-group'
    );
  }, [visibleBlocks, highYieldOnly]);

  const weightBadgeColor =
    chapter.weightage === 'Very high'
      ? 'border-emerald-500/35 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
      : chapter.weightage === 'High'
      ? 'border-amber-500/35 bg-amber-500/10 text-amber-700 dark:text-amber-300'
      : 'border-sky-500/35 bg-sky-500/10 text-sky-700 dark:text-sky-300';

  return (
    <article className="space-y-6 max-w-4xl mx-auto print:max-w-none print:m-0 print:p-0">
      {/* Chapter Top Bar & Badges */}
      <header className="rounded-2xl border studio-surface p-5 sm:p-6 space-y-4 print:border-none print:shadow-none print:p-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
              <BookOpen className="h-3.5 w-3.5" />
              <span>{chapter.classTag}</span>
            </span>

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <span>Chapter {chapter.number}</span>
            </span>

            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold border ${weightBadgeColor}`}
            >
              <Award className="h-3.5 w-3.5" />
              <span>{chapter.weightage} Weightage</span>
            </span>

            <span
              title={`Estimated from ${readingTime.words.toLocaleString()} words`}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-500/25"
            >
              <Clock className="h-3.5 w-3.5" />
              <span>{readingTime.label}</span>
            </span>
          </div>

          {/* Action Buttons: Flag Tricky, Mark Revised & Print */}
          <div className="flex flex-wrap items-center gap-2 print:hidden">
            {onFlagMistake && (
              <button
                type="button"
                onClick={() => {
                  onFlagMistake({
                    source: 'notes',
                    chapter: chapter.title,
                    title: `Notes Flag · ${chapter.prefix}. ${chapter.title}`,
                    prompt: `Review tricky formulas & April 2026 PYQ traps in ${chapter.title}`,
                    errorType: 'concept-gap',
                    explanation: introQuote || `Class 11 Ch ${chapter.number} (${chapter.weightage} weightage)`,
                  });
                  setFlaggedFlash(true);
                  window.setTimeout(() => setFlaggedFlash(false), 1800);
                }}
                className={`min-h-[40px] px-3 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 border transition-colors cursor-pointer ${
                  flaggedFlash
                    ? 'border-rose-400 bg-rose-500/15 text-rose-600 dark:text-rose-300'
                    : 'bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-rose-400'
                }`}
              >
                <Flag className="h-3.5 w-3.5" />
                <span>{flaggedFlash ? 'Flagged ✓' : 'Flag Tricky'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onToggleRevised}
              className={`min-h-[40px] px-3.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 transition-all cursor-pointer ${
                isRevised
                  ? 'bg-emerald-500 text-slate-950 border border-emerald-400 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-emerald-500/15 hover:text-emerald-700 dark:hover:text-emerald-300'
              }`}
              title="Toggle chapter revision status"
            >
              <CheckCircle2 className={`h-4 w-4 ${isRevised ? 'fill-current' : ''}`} />
              <span>{isRevised ? 'Revised ✓' : 'Mark revised'}</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="min-h-[40px] px-3.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200/80 dark:hover:bg-slate-700 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              title="Print or Save as PDF"
            >
              <Printer className="h-4 w-4" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            {chapter.title}
          </h1>
        </div>

        {/* Introductory Chapter Quote / Philosophy Box */}
        {introQuote && (
          <div className="rounded-xl border border-cyan-500/25 bg-cyan-500/5 dark:bg-cyan-950/20 p-3.5 text-xs sm:text-sm italic text-cyan-900 dark:text-cyan-100 flex items-start gap-2.5">
            <Sparkles className="h-4 w-4 text-cyan-500 shrink-0 mt-0.5" />
            <FormattedMathText text={introQuote} />
          </div>
        )}
      </header>

      {isSectionFiltered && (
        <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs print:hidden">
          <span className="text-cyan-700 dark:text-cyan-300 font-medium">
            Showing {matchingSectionsCount} of {totalSectionsCount} sections matching &ldquo;
            {searchQuery.trim()}&rdquo;
          </span>
          <button
            type="button"
            onClick={() => setShowAllSections(true)}
            className="font-bold text-cyan-600 dark:text-cyan-300 hover:underline cursor-pointer"
          >
            Show all sections in Ch {chapter.number}
          </button>
        </div>
      )}

      {/* Chapter Content Stream */}
      <div className="space-y-4">
        {displayedBlocks.map((block, idx) => {
          switch (block.type) {
            case 'h2':
              return (
                <div key={idx} className="pt-4 pb-1 border-b border-slate-200/80 dark:border-slate-800">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-cyan-400 shrink-0" />
                    <span>{block.content}</span>
                  </h2>
                </div>
              );

            case 'h3':
              return (
                <h3
                  key={idx}
                  className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 pt-2"
                >
                  {block.content}
                </h3>
              );

            case 'numbered-point':
              return (
                <div
                  key={idx}
                  className="rounded-xl border studio-surface p-4 transition-colors hover:border-cyan-500/35"
                >
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-xs font-bold text-cyan-700 dark:text-cyan-300">
                      {block.number}
                    </span>
                    <div className="flex-1 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed overflow-x-auto">
                      <FormattedMathText text={block.content || ''} />
                    </div>
                  </div>
                </div>
              );

            case 'display-math': {
              const key = `${chapter.id}-m-${idx}`;
              const isMasked = blurEquations && !revealedMathKeys[key];
              return (
                <div
                  key={idx}
                  className="relative rounded-xl border studio-surface-subtle p-3 overflow-x-auto text-center"
                >
                  <div className={isMasked ? 'blur-md select-none opacity-45 transition-all' : 'transition-all'}>
                    <MathBlock latex={block.content || ''} displayMode={true} />
                  </div>
                  {isMasked && (
                    <button
                      type="button"
                      onClick={() => setRevealedMathKeys((prev) => ({ ...prev, [key]: true }))}
                      className="absolute inset-0 flex items-center justify-center gap-1.5 bg-slate-950/20 dark:bg-slate-950/45 text-xs font-bold text-cyan-700 dark:text-cyan-200 cursor-pointer"
                    >
                      <Eye className="h-4 w-4" />
                      <span>Tap to reveal equation</span>
                    </button>
                  )}
                </div>
              );
            }

            case 'table':
              return (
                <div
                  key={idx}
                  className="rounded-xl border studio-surface overflow-hidden my-3"
                >
                  <div className="overflow-x-auto">
                    {renderMarkdownTable(block.lines || [])}
                  </div>
                </div>
              );

            case 'blockquote':
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 p-4 text-xs sm:text-sm text-amber-900 dark:text-amber-200 space-y-1"
                >
                  <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300 text-xs">
                    <Lightbulb className="h-4 w-4 shrink-0 text-amber-500" />
                    <span>Exam Tip / High-Yield Trap</span>
                  </div>
                  <div className="leading-relaxed">
                    <FormattedMathText text={block.content || ''} />
                  </div>
                </div>
              );

            case 'asked':
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-violet-500/25 bg-violet-500/5 dark:bg-violet-950/20 px-3.5 py-2.5 text-xs flex items-center gap-2 text-violet-800 dark:text-violet-300"
                >
                  <Calendar className="h-4 w-4 shrink-0 text-violet-500" />
                  <div className="font-medium truncate">
                    <strong className="font-bold">Asked: </strong>
                    <FormattedMathText text={block.content || ''} />
                  </div>
                </div>
              );

            case 'focus-group':
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border p-4 sm:p-5 space-y-2.5 ${
                    block.focusKind === 'patterns'
                      ? 'border-blue-500/30 bg-blue-500/5 dark:bg-blue-950/15'
                      : block.focusKind === 'combined'
                      ? 'border-purple-500/30 bg-purple-500/5 dark:bg-purple-950/15'
                      : block.focusKind === 'tricky'
                      ? 'border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/15'
                      : block.focusKind === 'mistakes'
                      ? 'border-rose-500/30 bg-rose-500/5 dark:bg-rose-950/15'
                      : 'border-cyan-500/35 bg-cyan-500/5 dark:bg-cyan-950/15'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
                    {block.focusKind === 'patterns' && <Flame className="h-4 w-4 text-blue-500" />}
                    {block.focusKind === 'combined' && <Sparkles className="h-4 w-4 text-purple-500" />}
                    {block.focusKind === 'tricky' && <Target className="h-4 w-4 text-amber-500" />}
                    {block.focusKind === 'mistakes' && <AlertTriangle className="h-4 w-4 text-rose-500" />}
                    {block.focusKind === 'april2026' && <Award className="h-4 w-4 text-cyan-400" />}
                    <span>{block.focusTitle}</span>
                  </div>

                  <ul className="space-y-1.5 pl-1">
                    {block.bullets?.map((bullet, bIdx) => (
                      <li
                        key={bIdx}
                        className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed flex items-start gap-2"
                      >
                        <span className="text-slate-400 shrink-0 mt-0.5">•</span>
                        <div className="flex-1">
                          <FormattedMathText text={bullet} />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              );

            case 'bullet':
              return (
                <div key={idx} className="flex items-start gap-2 pl-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <span className="text-cyan-500 shrink-0 mt-0.5">•</span>
                  <div className="flex-1">
                    <FormattedMathText text={block.content || ''} />
                  </div>
                </div>
              );

            case 'paragraph':
            default:
              return (
                <p
                  key={idx}
                  className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed"
                >
                  <FormattedMathText text={block.content || ''} />
                </p>
              );
          }
        })}
      </div>

      {/* Prev / Next Bottom Navigation Bar */}
      <footer className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
        {onNavigatePrev && prevChapterTitle ? (
          <button
            type="button"
            onClick={onNavigatePrev}
            className="w-full sm:w-auto min-h-[44px] px-4 rounded-xl border studio-surface text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-cyan-500/40 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4 shrink-0" />
            <span className="truncate">Prev: {prevChapterTitle}</span>
          </button>
        ) : (
          <div />
        )}

        <button
          type="button"
          onClick={onToggleRevised}
          className={`min-h-[42px] px-4 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer ${
            isRevised
              ? 'bg-emerald-500 text-slate-950 border border-emerald-400'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <CheckCircle2 className="h-4 w-4" />
          <span>{isRevised ? 'Marked Revised' : 'Mark as Revised'}</span>
        </button>

        {onNavigateNext && nextChapterTitle ? (
          <button
            type="button"
            onClick={onNavigateNext}
            className="w-full sm:w-auto min-h-[44px] px-4 rounded-xl border studio-surface text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-cyan-500/40 inline-flex items-center justify-end gap-1.5 cursor-pointer"
          >
            <span className="truncate">Next: {nextChapterTitle}</span>
            <ChevronRight className="h-4 w-4 shrink-0" />
          </button>
        ) : (
          <div />
        )}
      </footer>
    </article>
  );
};

function renderMarkdownTable(lines: string[]): React.ReactNode {
  if (lines.length < 2) return null;

  const headerLine = lines[0];
  const headers = headerLine
    .split('|')
    .map((c) => c.trim())
    .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);

  // Skip line 1 (the |---|---| separator)
  const rowLines = lines.slice(2);
  const rows = rowLines.map((row) =>
    row
      .split('|')
      .map((c) => c.trim())
      .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1)
  );

  return (
    <table className="w-full text-left border-collapse text-xs sm:text-sm">
      <thead>
        <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-bold">
          {headers.map((h, hIdx) => (
            <th key={hIdx} className="py-2.5 px-3.5 whitespace-nowrap">
              <FormattedMathText text={h} />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, rIdx) => (
          <tr
            key={rIdx}
            className="border-b border-slate-100 dark:border-slate-800/60 last:border-b-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
          >
            {r.map((cell, cIdx) => (
              <td
                key={cIdx}
                className={`py-2 px-3.5 ${
                  cIdx === 0
                    ? 'font-semibold text-slate-900 dark:text-slate-100'
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <FormattedMathText text={cell} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
