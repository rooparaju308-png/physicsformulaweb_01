import type { ShortNoteChapter } from '../data/shortNotes';

const WORDS_PER_MINUTE = 180;

/**
 * Counts readable words in markdown/LaTeX text by stripping formatting noise
 * while keeping meaningful text and formula terms.
 */
export function countReadableWords(text: string): number {
  if (!text) return 0;

  const cleaned = text
    // Remove markdown table separator rows like |---|---|
    .replace(/^\s*\|?(?:\s*:?-+:?\s*\|)+\s*$/gm, ' ')
    // Replace LaTeX commands like \frac, \text, \vec with spaces while keeping their brace contents
    .replace(/\\[a-zA-Z]+/g, ' ')
    // Strip markdown, math delimiters, and braces
    .replace(/[$#*`>|{}[\]()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned) return 0;
  return cleaned.split(' ').filter((token) => /[a-zA-Z0-9]/.test(token)).length;
}

export function formatReadingTime(wordCount: number): {
  words: number;
  minutes: number;
  label: string;
} {
  const minutes = Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
  return {
    words: wordCount,
    minutes,
    label: `${minutes} min read`,
  };
}

export function getClass11ReadingTime(rawMarkdown: string) {
  return formatReadingTime(countReadableWords(rawMarkdown));
}

export function getClass12ReadingTime(chapter: ShortNoteChapter) {
  const parts: string[] = [chapter.title, ...chapter.keyConcepts];

  for (const sec of chapter.sections) {
    parts.push(sec.title);
    for (const bullet of sec.bullets) {
      parts.push(bullet.text);
      if (bullet.equations) {
        parts.push(...bullet.equations);
      }
      if (bullet.subBullets) {
        parts.push(...bullet.subBullets);
      }
    }
    if (sec.tables) {
      for (const tbl of sec.tables) {
        if (tbl.title) parts.push(tbl.title);
        parts.push(...tbl.headers);
        for (const row of tbl.rows) {
          parts.push(...row);
        }
      }
    }
  }

  return formatReadingTime(countReadableWords(parts.join(' ')));
}
