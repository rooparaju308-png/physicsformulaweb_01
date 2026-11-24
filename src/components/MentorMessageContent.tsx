import React from 'react';
import { MathBlock } from './MathBlock';

interface MentorMessageContentProps {
  text: string;
}

function renderInlineSegments(line: string): React.ReactNode[] {
  // Split inline $...$, **bold**, and `code` cleanly without HTML injection
  const tokens: React.ReactNode[] = [];
  const pattern = /(\$[^$\n]+\$|\*\*[^*\n]+\*\*|`[^`\n]+`|_[^_\n]+_)/g;
  let lastIdx = 0;
  let match: RegExpExecArray | null;
  let keyCounter = 0;

  while ((match = pattern.exec(line)) !== null) {
    if (match.index > lastIdx) {
      tokens.push(line.slice(lastIdx, match.index));
    }
    const tok = match[0];
    if (tok.startsWith('$') && tok.endsWith('$') && tok.length > 2) {
      tokens.push(
        <MathBlock
          key={`m-${keyCounter++}`}
          latex={tok.slice(1, -1)}
          displayMode={false}
          className="inline-block align-middle mx-0.5 text-slate-900 dark:text-cyan-100"
        />
      );
    } else if (tok.startsWith('**') && tok.endsWith('**') && tok.length > 4) {
      tokens.push(
        <strong key={`b-${keyCounter++}`} className="font-semibold text-slate-900 dark:text-white">
          {tok.slice(2, -2)}
        </strong>
      );
    } else if (tok.startsWith('`') && tok.endsWith('`') && tok.length > 2) {
      tokens.push(
        <code
          key={`c-${keyCounter++}`}
          className="px-1.5 py-0.5 rounded bg-slate-200/75 dark:bg-slate-800/90 font-mono text-[12px] text-cyan-700 dark:text-cyan-300"
        >
          {tok.slice(1, -1)}
        </code>
      );
    } else if (tok.startsWith('_') && tok.endsWith('_') && tok.length > 2) {
      tokens.push(
        <em key={`i-${keyCounter++}`} className="italic text-slate-600 dark:text-slate-300">
          {tok.slice(1, -1)}
        </em>
      );
    } else {
      tokens.push(tok);
    }
    lastIdx = match.index + tok.length;
  }

  if (lastIdx < line.length) {
    tokens.push(line.slice(lastIdx));
  }
  return tokens;
}

export const MentorMessageContent: React.FC<MentorMessageContentProps> = ({ text }) => {
  // Split display math blocks $$...$$ first
  const blocks = text.split(/(\$\$[\s\S]*?\$\$)/g);

  return (
    <div className="space-y-2 text-[13.5px] leading-relaxed text-slate-800 dark:text-slate-200 break-words">
      {blocks.map((block, bIdx) => {
        if (!block) return null;
        if (block.startsWith('$$') && block.endsWith('$$') && block.length > 4) {
          const latex = block.slice(2, -2).trim();
          return (
            <div
              key={`eq-${bIdx}`}
              className="rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-slate-50/90 dark:bg-slate-950/75 px-3 py-2 overflow-x-auto"
            >
              <MathBlock latex={latex} displayMode />
            </div>
          );
        }

        const lines = block.split('\n');
        return (
          <div key={`txt-${bIdx}`} className="space-y-1.5">
            {lines.map((rawLine, lIdx) => {
              const line = rawLine.trim();
              if (!line) return null;

              if (line.startsWith('### ')) {
                return (
                  <h4
                    key={lIdx}
                    className="text-xs font-bold text-slate-900 dark:text-slate-100 pt-1"
                  >
                    {renderInlineSegments(line.slice(4))}
                  </h4>
                );
              }

              if (line.startsWith('> ')) {
                return (
                  <div
                    key={lIdx}
                    className="rounded-xl border border-amber-500/30 bg-amber-500/8 px-3 py-2 text-xs text-amber-800 dark:text-amber-200"
                  >
                    {renderInlineSegments(line.slice(2))}
                  </div>
                );
              }

              if (line.startsWith('- ') || line.startsWith('• ')) {
                return (
                  <div key={lIdx} className="flex items-start gap-2 pl-1">
                    <span className="text-cyan-500 font-bold leading-5 shrink-0">•</span>
                    <div className="min-w-0 flex-1">{renderInlineSegments(line.slice(2))}</div>
                  </div>
                );
              }

              const numMatch = line.match(/^(\d+)\.\s+(.*)$/);
              if (numMatch) {
                return (
                  <div key={lIdx} className="flex items-start gap-2 pl-0.5">
                    <span className="font-mono text-xs font-semibold text-cyan-600 dark:text-cyan-400 tabular-nums mt-0.5 shrink-0">
                      {numMatch[1]}.
                    </span>
                    <div className="min-w-0 flex-1">{renderInlineSegments(numMatch[2])}</div>
                  </div>
                );
              }

              return <p key={lIdx}>{renderInlineSegments(line)}</p>;
            })}
          </div>
        );
      })}
    </div>
  );
};
