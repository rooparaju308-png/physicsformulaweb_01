import React from 'react';
import { MathBlock } from './MathBlock';

interface FormattedMathTextProps {
  text: string;
  className?: string;
}

export const FormattedMathText: React.FC<FormattedMathTextProps> = ({ text, className = '' }) => {
  if (!text) return null;

  // First split by display math $$...$$
  const displayParts = text.split(/\$\$([\s\S]*?)\$\$/g);

  return (
    <span className={className}>
      {displayParts.map((part, dIdx) => {
        if (dIdx % 2 === 1) {
          return (
            <div key={`d-${dIdx}`} className="my-2.5 overflow-x-auto text-center">
              <MathBlock latex={part.trim()} displayMode={true} />
            </div>
          );
        }

        return (
          <React.Fragment key={`t-${dIdx}`}>
            {renderInlineTokens(part, `t-${dIdx}`)}
          </React.Fragment>
        );
      })}
    </span>
  );
};

function renderInlineTokens(input: string, keyPrefix: string, allowStyles = true): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let i = 0;
  let plainBuf = '';
  let tokenIdx = 0;

  const flushPlain = () => {
    if (plainBuf) {
      nodes.push(plainBuf);
      plainBuf = '';
    }
  };

  while (i < input.length) {
    // Inline math $...$ (single-line, non-$$)
    if (input[i] === '$' && input[i + 1] !== '$') {
      const end = input.indexOf('$', i + 1);
      if (end !== -1 && !input.slice(i + 1, end).includes('\n')) {
        flushPlain();
        const latex = input.slice(i + 1, end).trim();
        nodes.push(
          <MathBlock
            key={`${keyPrefix}-m-${tokenIdx++}`}
            latex={latex}
            displayMode={false}
            className="inline text-cyan-600 dark:text-cyan-300 font-medium px-0.5"
          />
        );
        i = end + 1;
        continue;
      }
    }

    if (allowStyles) {
      // Bold **...**
      if (input[i] === '*' && input[i + 1] === '*') {
        const end = input.indexOf('**', i + 2);
        if (end !== -1 && !input.slice(i + 2, end).includes('\n')) {
          flushPlain();
          const inner = input.slice(i + 2, end);
          nodes.push(
            <strong
              key={`${keyPrefix}-b-${tokenIdx++}`}
              className="font-bold text-slate-900 dark:text-slate-100"
            >
              {renderInlineTokens(inner, `${keyPrefix}-b-${tokenIdx}`, false)}
            </strong>
          );
          i = end + 2;
          continue;
        }
      }

      // Italic *...* (must not start or end with whitespace)
      if (input[i] === '*' && input[i + 1] !== '*' && input[i + 1] && !/\s/.test(input[i + 1])) {
        const end = findClosingSingleAsterisk(input, i + 1);
        if (end !== -1) {
          flushPlain();
          const inner = input.slice(i + 1, end);
          nodes.push(
            <em
              key={`${keyPrefix}-em-${tokenIdx++}`}
              className="italic text-slate-600 dark:text-slate-400"
            >
              {renderInlineTokens(inner, `${keyPrefix}-em-${tokenIdx}`, false)}
            </em>
          );
          i = end + 1;
          continue;
        }
      }
    }

    // Inline code `...`
    if (input[i] === '`') {
      const end = input.indexOf('`', i + 1);
      if (end !== -1 && !input.slice(i + 1, end).includes('\n')) {
        flushPlain();
        nodes.push(
          <code
            key={`${keyPrefix}-c-${tokenIdx++}`}
            className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-cyan-700 dark:text-cyan-300 font-mono text-xs"
          >
            {input.slice(i + 1, end)}
          </code>
        );
        i = end + 1;
        continue;
      }
    }

    plainBuf += input[i];
    i++;
  }

  flushPlain();
  return nodes;
}

function findClosingSingleAsterisk(input: string, start: number): number {
  let inMath = false;
  for (let j = start; j < input.length; j++) {
    const ch = input[j];
    if (ch === '\n') return -1;
    if (ch === '$') {
      inMath = !inMath;
      continue;
    }
    if (inMath) continue;
    if (ch === '*' && input[j + 1] !== '*' && input[j - 1] !== '*' && !/\s/.test(input[j - 1])) {
      return j;
    }
  }
  return -1;
}
