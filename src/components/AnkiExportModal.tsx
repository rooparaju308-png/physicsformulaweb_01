import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Download, FileSpreadsheet, FileText, Layers, Printer, X } from 'lucide-react';
import { CHAPTERS } from '../data/formulas';
import { MistakeEntry } from '../types/physics';
import {
  AnkiCardStyle,
  AnkiExportFormat,
  buildAnkiDeck,
  ChapterFilterValue,
  ExportScope,
  triggerTextFileDownload,
} from '../utils/ankiExport';
import { MathBlock } from './MathBlock';

interface AnkiExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  knownIds: string[];
  bookmarkedIds: string[];
  mistakes: MistakeEntry[];
  initialChapter?: ChapterFilterValue;
  initialScope?: ExportScope;
  onSwitchToCheatSheet?: (chapter: ChapterFilterValue) => void;
}

export const AnkiExportModal: React.FC<AnkiExportModalProps> = ({
  isOpen,
  onClose,
  knownIds,
  bookmarkedIds,
  mistakes,
  initialChapter = 'all',
  initialScope = 'all',
  onSwitchToCheatSheet,
}) => {
  const [chapterFilter, setChapterFilter] = useState<ChapterFilterValue>(initialChapter);
  const [scope, setScope] = useState<ExportScope>(initialScope);
  const [cardStyle, setCardStyle] = useState<AnkiCardStyle>('qa');
  const [format, setFormat] = useState<AnkiExportFormat>('txt');
  const [includeTraps, setIncludeTraps] = useState(true);
  const [includeDetails, setIncludeDetails] = useState(true);
  const [includeMistakes, setIncludeMistakes] = useState(mistakes.length > 0);
  const [unresolvedMistakesOnly, setUnresolvedMistakesOnly] = useState(true);
  const [downloadedNotice, setDownloadedNotice] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setChapterFilter(initialChapter);
      setScope(initialScope);
      setDownloadedNotice(null);
    }
  }, [isOpen, initialChapter, initialScope]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const deck = useMemo(
    () =>
      buildAnkiDeck({
        chapterFilter,
        scope,
        cardStyle,
        format,
        includeTraps,
        includeDetails,
        includeMistakes,
        unresolvedMistakesOnly,
        knownIds,
        bookmarkedIds,
        mistakes,
      }),
    [
      chapterFilter,
      scope,
      cardStyle,
      format,
      includeTraps,
      includeDetails,
      includeMistakes,
      unresolvedMistakesOnly,
      knownIds,
      bookmarkedIds,
      mistakes,
    ]
  );

  if (!isOpen) return null;

  const unresolvedCount = mistakes.filter((m) => !m.resolved).length;

  const handleDownload = () => {
    if (deck.cardCount === 0) return;
    triggerTextFileDownload(deck.content, deck.filename, deck.mimeType);
    setDownloadedNotice(`Exported ${deck.cardCount} cards to ${deck.filename}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Export Physics Deck to Anki"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl max-h-[90dvh] overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-5 sm:p-6 space-y-5"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-300 shrink-0">
              <Layers className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                Anki Flashcard Deck Export
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ready for Anki Desktop & AnkiDroid with MathJax equations, JEE trap notes, and chapter tags.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onSwitchToCheatSheet && (
              <button
                type="button"
                onClick={() => onSwitchToCheatSheet(chapterFilter)}
                className="min-h-[38px] px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-cyan-400 inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5 text-cyan-500" />
                <span className="hidden sm:inline">A4 Cheat Sheet</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Anki export modal"
              className="min-h-[38px] min-w-[38px] rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 flex items-center justify-center cursor-pointer"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Configuration Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Chapter Selection
            </label>
            <select
              value={chapterFilter}
              onChange={(e) => setChapterFilter(e.target.value as ChapterFilterValue)}
              className="w-full min-h-[42px] px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-cyan-400"
            >
              <option value="all">All Chapters (Class 11 & 12)</option>
              <option value="class-12">Class 12 Only</option>
              <option value="class-11">Class 11 Only</option>
              {CHAPTERS.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.shortTitle}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Formula Scope
            </label>
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80">
              {(
                [
                  { id: 'all', label: 'All Formulas' },
                  { id: 'high-yield', label: 'High Yield' },
                  { id: 'starred', label: 'Starred' },
                  { id: 'unknown', label: 'Need Revision' },
                ] as const
              ).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setScope(item.id)}
                  className={`min-h-[34px] px-2.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    scope === item.id
                      ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-300 shadow-sm font-semibold'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Card Prompt Style
            </label>
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80">
              <button
                type="button"
                onClick={() => setCardStyle('qa')}
                className={`min-h-[38px] px-3 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  cardStyle === 'qa'
                    ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-300 shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Flashcard Q&A
              </button>
              <button
                type="button"
                onClick={() => setCardStyle('formula-recall')}
                className={`min-h-[38px] px-3 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  cardStyle === 'formula-recall'
                    ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-300 shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Title to Formula
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Export Format
            </label>
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80">
              <button
                type="button"
                onClick={() => setFormat('txt')}
                className={`min-h-[38px] px-2.5 rounded-lg text-xs font-medium inline-flex items-center justify-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
                  format === 'txt'
                    ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-300 shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <FileText className="h-3.5 w-3.5 shrink-0" />
                <span>Anki .txt (TSV)</span>
              </button>
              <button
                type="button"
                onClick={() => setFormat('csv')}
                className={`min-h-[38px] px-2.5 rounded-lg text-xs font-medium inline-flex items-center justify-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
                  format === 'csv'
                    ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-300 shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <FileSpreadsheet className="h-3.5 w-3.5 shrink-0" />
                <span>Standard .csv</span>
              </button>
            </div>
          </div>
        </div>

        {/* Include Checkboxes */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-3.5 flex flex-wrap items-center gap-4 text-xs text-slate-700 dark:text-slate-300">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeTraps}
              onChange={(e) => setIncludeTraps(e.target.checked)}
              className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
            />
            <span>Include JEE Trap Warnings</span>
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeDetails}
              onChange={(e) => setIncludeDetails(e.target.checked)}
              className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
            />
            <span>Include Variables & Conditions</span>
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeMistakes}
              onChange={(e) => setIncludeMistakes(e.target.checked)}
              disabled={mistakes.length === 0}
              className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 disabled:opacity-50"
            />
            <span>
              Append Mistake Notebook ({mistakes.length === 0 ? '0 saved' : `${unresolvedCount} unresolved`})
            </span>
          </label>
          {includeMistakes && mistakes.length > 0 && (
            <label className="inline-flex items-center gap-2 cursor-pointer text-slate-500 dark:text-slate-400">
              <input
                type="checkbox"
                checked={unresolvedMistakesOnly}
                onChange={(e) => setUnresolvedMistakesOnly(e.target.checked)}
                className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
              />
              <span>Unresolved mistakes only</span>
            </label>
          )}
        </div>

        {/* Live Card Preview */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Deck Preview (First 2 Cards)
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-mono tabular-nums">
              {deck.formulaCount} formula + {deck.mistakeCount} mistake = {deck.cardCount} total cards
            </span>
          </div>

          {deck.previewCards.length === 0 ? (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-6 text-center text-xs text-slate-500 dark:text-slate-400">
              No cards match the current selection. Try switching to All Formulas or All Chapters.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {deck.previewCards.map((card) => (
                <div
                  key={card.id}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/70 p-3.5 space-y-2"
                >
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {card.chapterTitle} · {card.kind === 'mistake' ? 'Mistake Card' : 'Formula Card'}
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      Front
                    </div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 mt-0.5 line-clamp-2">
                      {card.frontPlain}
                    </p>
                  </div>
                  <div className="border-t border-slate-200/80 dark:border-slate-800 pt-2">
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      Back (Anki MathJax Preview)
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 line-clamp-2">
                      {card.backSummary}
                    </p>
                    {card.latex && (
                      <div className="mt-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 py-1 overflow-x-auto">
                        <MathBlock latex={card.latex} displayMode={false} className="text-xs" />
                      </div>
                    )}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">
                    Tags: {card.tags.join(' ')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Import Guide & Download Action */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
            In Anki Desktop or AnkiDroid: choose <strong className="text-slate-700 dark:text-slate-200">File → Import</strong> and select the downloaded{' '}
            <span className="font-mono">.{format}</span> file. Equations render natively via Anki&apos;s built-in MathJax.
          </p>

          <button
            type="button"
            onClick={handleDownload}
            disabled={deck.cardCount === 0}
            className="min-h-[44px] px-5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-45 text-white text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 whitespace-nowrap shadow-sm transition-colors cursor-pointer shrink-0"
          >
            <Download className="h-4 w-4 shrink-0" />
            <span>Download Deck ({deck.cardCount})</span>
          </button>
        </div>

        {downloadedNotice && (
          <div className="rounded-xl border border-emerald-500/35 bg-emerald-500/10 px-3.5 py-2.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{downloadedNotice}</span>
          </div>
        )}
      </div>
    </div>
  );
};
