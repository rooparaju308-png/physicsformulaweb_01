# Prompt: replace all Class 11 Physics notes in the existing project

Copy everything below the line into Claude Code / Cursor / any coding agent, opened at the root of the "JEE Physics Short Notes" project. First copy the 14 `.md` files (02 to 15) from this folder into the project in a temporary folder called `_new_class11/`.

---

## Context

This is a single-page JEE Physics Short Notes web app (hash routing such as `#/`, sidebar with chapters, dark/light toggle). Each chapter page shows: a title, "Class 11 Physics" badge, a weightage badge, "Mark revised" and "Print / PDF" buttons, numbered concept points, formula tables, "Asked: ..." PYQ tags, and "JEE Main Focus" boxes.

I have 14 clean, already-corrected Class 11 chapter files in `_new_class11/`:

```
02-units-and-measurement.md           09-mechanical-properties-of-solids.md
03-motion-in-a-straight-line.md       10-mechanical-properties-of-fluids.md
04-motion-in-a-plane.md               11-thermal-properties-of-matter.md
05-laws-of-motion.md                  12-thermodynamics.md
06-work-energy-and-power.md           13-kinetic-theory.md
07-system-of-particles-and-rotational-motion.md   14-oscillations.md
08-gravitation.md                     15-waves.md
```

## Task

**Remove all existing Class 11 Physics short notes from the project and replace them with the content of these 14 files. Do not touch Class 12 content or the app shell (layout, theme toggle, print styles).**

## Step 1 — Explore first, change nothing yet

1. Read the project structure and find: where chapter content lives (JS/JSON/HTML/MD data), how the sidebar/menu is generated, how routes (`#/...`) map to chapters, and where "Mark revised" state, search, and any chapter index or counts are stored (localStorage keys, arrays, etc.).
2. List every Class 11 chapter you find (id, title, file, route). Show me this list and your plan in a short message. If anything is ambiguous (for example a chapter that could belong to Class 11 or 12), ask me before deleting.

## Step 2 — Remove the old Class 11 notes

- Delete every Class 11 chapter's content, its sidebar/menu entry, its route, and any references (search index, chapter counters, prev/next links, sitemap, README lists).
- Remove stale "Mark revised" localStorage entries for removed chapter ids, or migrate them to the new ids if the ids are being reused.
- Keep Class 12 chapters and all shared components untouched.
- Do not leave dead code, unused assets, or orphan routes.

## Step 3 — Add the new chapters

For each markdown file, create a chapter in the project's own data/page format, in the order of the file prefixes (02 to 15). Rules for conversion:

- `# Title` is the chapter title. The three bullets under it are metadata: Class (11 Physics), Chapter no., Weightage (Very high / High / Medium). Show them in the existing badge style.
- `## Heading` is a section. `### Heading` is a sub-section.
- Numbered items (`1.`, `2.` …) are the numbered concept points. Keep the original numbers exactly as written.
- `$...$` is inline LaTeX and `$$...$$` is display LaTeX. Render with KaTeX (reuse the project's existing math renderer if it already has one, otherwise add KaTeX). Do not rewrite the math.
- Markdown tables become the project's table component, with math inside cells rendered too.
- Blockquotes (`>`) are the highlighted "note / exam tip" boxes. Lines starting with `*Asked: ...*` are the PYQ tags shown under a section. Keep their style.
- `## JEE Main Focus` (and `### JEE Main Focus — ...`) sections become the Focus box with four labelled groups when present: "Question patterns asked again and again", "Concepts combined in one question", "Tricky points", "Mistakes to avoid", plus the "Asked in April 2026" list. Chapters can have more than one Focus block; keep them in the place where they appear.
- Lines such as `*Figure: ...*` and `(Graph of ...)` are figure captions or hints only. Do not render them as text if the project already has the figure.

Keep the app features working for the new chapters: "Mark revised", "Print / PDF", sidebar highlight, prev/next navigation, search, dark mode.

## Step 4 — Diagrams and derivations

The markdown files contain text and formulas only. Diagrams (SVG) and collapsible "Derivation" blocks were not part of the paste.

- If the old Class 11 chapters had SVG diagrams or derivation blocks, **reuse them** in the matching section of the new chapter (match by section title / topic) instead of deleting them. Only drop a diagram or derivation if its topic no longer exists in the new notes.
- If a section had no old diagram, do not invent one. Leave it as plain text.
- Report every diagram or derivation that you reused, and every one that you dropped.

## Step 5 — Verify

1. Run the build and the dev server. There must be no errors or warnings about missing chapters or routes.
2. Open every one of the 14 chapters. Check: title, badges, numbered points present, no raw `$`, `\frac`, `\sqrt` or `**` visible on screen, tables render, the "Asked" tags and Focus boxes show.
3. Search the whole project for leftover references to removed Class 11 chapters (old ids, titles, routes) and fix them.
4. Confirm Class 12 chapters and the theme toggle still work.
5. Spot-check these formulas on screen, because they were corrected from the source:
   - Oscillations: $K=U$ at $x=A/\sqrt2$.
   - Laws of Motion: string goes slack for $\sqrt{2gr}<v_{bottom}<\sqrt{5gr}$.
   - Gravitation: ring field is maximum at $x=a/\sqrt2$.
   - Units: $[\sqrt{LC}]=T$.
   - Kinetic Theory: Graham's law $v\propto1/\sqrt\rho$.
   - Waves: sonometer in water $\nu'/\nu=\sqrt{1-\sigma/\rho}$.

## Step 6 — Final report

Give me a short summary: files deleted, files added/changed, how conversion was done, anything skipped, and anything I should check by hand. Do not commit or deploy until I confirm.

## Constraints

- Do not change the wording of the notes while converting. Only formatting changes are allowed.
- Do not delete `_new_class11/` until I confirm that everything looks right.
- Keep the existing code style and dependencies unless KaTeX must be added.
