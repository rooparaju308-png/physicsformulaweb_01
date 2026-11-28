import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Download, FileText, Printer, X } from 'lucide-react';
import { CHAPTERS } from '../data/formulas';
import { getTrapNote } from '../data/traps';
import { MistakeEntry } from '../types/physics';
import {
  ChapterFilterValue,
  ExportScope,
  filterFormulasForExport,
} from '../utils/ankiExport';
import { MathBlock } from './MathBlock';

interface StudyWallCheatSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  knownIds: string[];
  bookmarkedIds: string[];
  mistakes?: MistakeEntry[];
  initialChapter?: ChapterFilterValue;
  onSwitchToAnki?: (chapter: ChapterFilterValue, scope: ExportScope) => void;
}

type ColumnDensity = 2 | 3;
type PageOrientation = 'portrait' | 'landscape';

const SCOPE_LABELS: Record<ExportScope, string> = {
  all: 'All Formulas',
  'high-yield': 'High Yield Only',
  starred: 'Starred / Bookmarked',
  unknown: 'Need Revision',
};

export const StudyWallCheatSheetModal: React.FC<StudyWallCheatSheetModalProps> = ({
  isOpen,
  onClose,
  knownIds,
  bookmarkedIds,
  mistakes = [],
  initialChapter = 'all',
  onSwitchToAnki,
}) => {
  const [chapterFilter, setChapterFilter] = useState<ChapterFilterValue>(initialChapter);
  const [scope, setScope] = useState<ExportScope>('all');
  const [columns, setColumns] = useState<ColumnDensity>(2);
  const [orientation, setOrientation] = useState<PageOrientation>('portrait');
  const [showConditions, setShowConditions] = useState(true);
  const [showVariables, setShowVariables] = useState(true);
  const [showTraps, setShowTraps] = useState(true);
  const [includeMistakes, setIncludeMistakes] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setChapterFilter(initialChapter);
    }
  }, [isOpen, initialChapter]);

  useEffect(() => {
    if (!isOpen) return;
    document.body.classList.add('cheatsheet-print-open');
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.classList.remove('cheatsheet-print-open');
      window.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, onClose]);

  const filteredFormulas = useMemo(
    () => filterFormulasForExport(chapterFilter, scope, knownIds, bookmarkedIds),
    [chapterFilter, scope, knownIds, bookmarkedIds]
  );

  const groupedChapters = useMemo(() => {
    return CHAPTERS.map((ch) => ({
      chapter: ch,
      items: filteredFormulas.filter((f) => f.chapter === ch.id),
    })).filter((g) => g.items.length > 0);
  }, [filteredFormulas]);

  const unresolvedMistakes = useMemo(
    () => mistakes.filter((m) => !m.resolved),
    [mistakes]
  );

  const chapterDisplayLabel = useMemo(() => {
    if (chapterFilter === 'all') return 'All Chapters (Class 11 & 12)';
    if (chapterFilter === 'class-12') return 'Class 12 Syllabus';
    if (chapterFilter === 'class-11') return 'Class 11 Syllabus';
    return CHAPTERS.find((c) => c.id === chapterFilter)?.title || chapterFilter;
  }, [chapterFilter]);

  const estimatedSheets = useMemo(() => {
    const perPage =
      columns === 3
        ? orientation === 'landscape'
          ? 24
          : 20
        : orientation === 'landscape'
          ? 16
          : 13;
    const totalItems =
      filteredFormulas.length + (includeMistakes ? unresolvedMistakes.length : 0);
    return Math.max(1, Math.ceil(totalItems / perPage));
  }, [filteredFormulas.length, includeMistakes, unresolvedMistakes.length, columns, orientation]);

  if (!isOpen || typeof document === 'undefined') return null;

  const formattedDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return createPortal(
    <div
      className="cheat-sheet-print-portal fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="Printable A4 Study-Wall Cheat Sheet"
    >
      {orientation === 'landscape' && (
        <style>{`@media print { @page { size: A4 landscape; margin: 8mm 9mm; } }`}</style>
      )}

      {/* Interactive Print Configuration Toolbar (Hidden in Print Output) */}
      <div className="print:hidden shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-9 w-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-300 shrink-0">
                <FileText className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 truncate">
                  A4 Study-Wall Cheat Sheet Builder
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                  {filteredFormulas.length} formulas · ~{estimatedSheets} A4{' '}
                  {estimatedSheets === 1 ? 'sheet' : 'sheets'} · {columns}-column {orientation}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {onSwitchToAnki && (
                <button
                  type="button"
                  onClick={() => onSwitchToAnki(chapterFilter, scope)}
                  className="min-h-[40px] px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-cyan-400 inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  <Download className="h-4 w-4 text-cyan-500 shrink-0" />
                  <span>Anki Export</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => window.print()}
                disabled={filteredFormulas.length === 0 && !(includeMistakes && unresolvedMistakes.length > 0)}
                className="min-h-[40px] px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-45 text-white text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap shadow-sm transition-colors cursor-pointer"
              >
                <Printer className="h-4 w-4 shrink-0" />
                <span>Print / Save A4 PDF</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close A4 cheat sheet preview"
                className="min-h-[40px] min-w-[40px] rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 flex items-center justify-center cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>

          {/* Filter & Print Density Controls */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <label className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="font-medium whitespace-nowrap">Chapter:</span>
              <select
                value={chapterFilter}
                onChange={(e) => setChapterFilter(e.target.value as ChapterFilterValue)}
                className="min-h-[36px] px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs font-medium focus:outline-none focus:border-cyan-400"
              >
                <option value="all">All Chapters (27)</option>
                <option value="class-12">Class 12 Only</option>
                <option value="class-11">Class 11 Only</option>
                {CHAPTERS.map((ch) => (
                  <option key={ch.id} value={ch.id}>
                    {ch.shortTitle}
                  </option>
                ))}
              </select>
            </label>

            <div className="inline-flex items-center rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 gap-0.5">
              {(['all', 'high-yield', 'starred', 'unknown'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setScope(s)}
                  className={`min-h-[34px] px-2.5 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    scope === s
                      ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-300 shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  {s === 'all'
                    ? 'All'
                    : s === 'high-yield'
                      ? 'High Yield'
                      : s === 'starred'
                        ? 'Starred'
                        : 'Need Revision'}
                </button>
              ))}
            </div>

            <div className="inline-flex items-center rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 gap-0.5">
              {([2, 3] as const).map((col) => (
                <button
                  key={col}
                  type="button"
                  onClick={() => setColumns(col)}
                  className={`min-h-[34px] px-2.5 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    columns === col
                      ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-300 shadow-sm'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {col}-Col A4
                </button>
              ))}
            </div>

            <div className="inline-flex items-center rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 gap-0.5">
              {(['portrait', 'landscape'] as const).map((ori) => (
                <button
                  key={ori}
                  type="button"
                  onClick={() => setOrientation(ori)}
                  className={`min-h-[34px] px-2.5 rounded-md font-medium capitalize whitespace-nowrap transition-colors cursor-pointer ${
                    orientation === ori
                      ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-300 shadow-sm'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {ori}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 pl-1 text-slate-700 dark:text-slate-300">
              <label className="inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={showVariables}
                  onChange={(e) => setShowVariables(e.target.checked)}
                  className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                />
                <span>Variables</span>
              </label>
              <label className="inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={showConditions}
                  onChange={(e) => setShowConditions(e.target.checked)}
                  className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                />
                <span>Conditions</span>
              </label>
              <label className="inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={showTraps}
                  onChange={(e) => setShowTraps(e.target.checked)}
                  className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                />
                <span>JEE Traps</span>
              </label>
              {unresolvedMistakes.length > 0 && (
                <label className="inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={includeMistakes}
                    onChange={(e) => setIncludeMistakes(e.target.checked)}
                    className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                  />
                  <span>Mistake Alerts ({unresolvedMistakes.length})</span>
                </label>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable A4 Paper Preview Surface */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 print:p-0 print:overflow-visible">
        <div
          className={`a4-cheat-sheet-document mx-auto bg-white text-slate-900 shadow-2xl print:shadow-none rounded-xl print:rounded-none border border-slate-200 print:border-0 p-5 sm:p-7 print:p-0 ${
            orientation === 'landscape' ? 'max-w-[297mm]' : 'max-w-[210mm]'
          }`}
        >
          {/* Sheet Header */}
          <header className="border-b border-slate-300 pb-2.5 mb-3.5 flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-950">
                JEE Physics Study-Wall Cheat Sheet
              </h1>
              <p className="text-[11px] text-slate-600 mt-0.5 tabular-nums">
                {chapterDisplayLabel} · {SCOPE_LABELS[scope]} · {filteredFormulas.length} formulas
              </p>
            </div>
            <div className="text-[11px] text-slate-500 font-mono tabular-nums">
              Generated {formattedDate}
            </div>
          </header>

          {groupedChapters.length === 0 && !(includeMistakes && unresolvedMistakes.length > 0) ? (
            <div className="py-12 text-center text-sm text-slate-500">
              No formulas match the selected chapter and scope filter. Try switching to All Formulas or All Chapters.
            </div>
          ) : (
            <div className={columns === 3 ? 'a4-cols-3' : 'a4-cols-2'}>
              {groupedChapters.map(({ chapter, items }) => (
                <section key={chapter.id} className="mb-3">
                  <div className="a4-chapter-heading border-b border-slate-800/80 pb-0.5 mb-1.5 flex items-baseline justify-between gap-2">
                    <h2 className="text-[12px] font-bold uppercase tracking-wide text-slate-950">
                      {chapter.shortTitle}
                    </h2>
                    <span className="text-[10px] font-mono text-slate-500 tabular-nums">
                      {items.length}
                    </span>
                  </div>

                  {items.map((f) => {
                    const trap = showTraps ? getTrapNote(f.id) : undefined;
                    return (
                      <article
                        key={f.id}
                        className="a4-formula-card mb-2 rounded-md border border-slate-200/90 bg-slate-50/50 p-2"
                      >
                        <div className="flex items-baseline justify-between gap-1.5">
                          <h3 className="text-[11px] font-bold text-slate-900 leading-snug">
                            {f.title}
                          </h3>
                          <span className="text-[9.5px] font-medium text-slate-500 whitespace-nowrap shrink-0">
                            {f.jeeWeight === 3 ? 'High Yield' : f.subtopic}
                          </span>
                        </div>

                        <div className="my-1 rounded bg-white border border-slate-200/75 px-1.5 py-1 text-slate-950 overflow-hidden">
                          <MathBlock
                            latex={f.latex}
                            displayMode={false}
                            className="text-[11px] leading-relaxed block"
                          />
                        </div>

                        {showVariables && f.variables.length > 0 && (
                          <p className="text-[9.5px] leading-snug text-slate-600 mt-0.5">
                            <span className="font-semibold text-slate-700">Vars: </span>
                            {f.variables.map((v, idx) => (
                              <React.Fragment key={`${f.id}-v-${idx}`}>
                                {idx > 0 && ' · '}
                                <span className="font-mono text-slate-900">{v.symbol}</span>: {v.meaning}
                              </React.Fragment>
                            ))}
                          </p>
                        )}

                        {showConditions && f.conditions.length > 0 && (
                          <p className="text-[9.5px] leading-snug text-slate-600 mt-0.5">
                            <span className="font-semibold text-slate-700">Note: </span>
                            {f.conditions[0]}
                          </p>
                        )}

                        {trap && (
                          <p className="text-[9.5px] leading-snug text-amber-900 bg-amber-50/80 border border-amber-200/80 rounded px-1.5 py-0.5 mt-1">
                            <span className="font-bold">Trap: </span>
                            {trap.safeRule}
                          </p>
                        )}
                      </article>
                    );
                  })}
                </section>
              ))}

              {includeMistakes && unresolvedMistakes.length > 0 && (
                <section className="mb-3">
                  <div className="a4-chapter-heading border-b border-rose-700/70 pb-0.5 mb-1.5 flex items-baseline justify-between gap-2">
                    <h2 className="text-[12px] font-bold uppercase tracking-wide text-rose-900">
                      Mistake Notebook Alerts
                    </h2>
                    <span className="text-[10px] font-mono text-rose-700 tabular-nums">
                      {unresolvedMistakes.length}
                    </span>
                  </div>
                  {unresolvedMistakes.map((m) => (
                    <article
                      key={m.id}
                      className="a4-formula-card mb-2 rounded-md border border-rose-200 bg-rose-50/40 p-2"
                    >
                      <div className="flex items-baseline justify-between gap-1.5">
                        <h3 className="text-[11px] font-bold text-slate-900 leading-snug">
                          {m.title}
                        </h3>
                        <span className="text-[9.5px] text-rose-700 whitespace-nowrap shrink-0">
                          {m.chapter}
                        </span>
                      </div>
                      {(m.explanation || m.note) && (
                        <p className="text-[9.5px] leading-snug text-slate-700 mt-0.5">
                          {m.explanation || m.note}
                        </p>
                      )}
                    </article>
                  ))}
                </section>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
