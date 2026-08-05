# Extras — Obsidian notes rendered in Astro

**Date:** 2026-08-05
**Status:** Approved, ready for planning

## Goal

Publish a personal note collection, authored in Obsidian, as a browsable section
of the portfolio site at `/extras`. Each note gets its own page with a
"Download PDF" button.

The site is a static Astro build deployed to GitHub Pages. Nothing in this design
runs at request time — all Markdown parsing, link resolution and page generation
happens during `npm run build`.

## Non-goals

- Search across notes.
- Comments, reactions, or any dynamic feature requiring a backend.
- Server-side or build-time PDF file generation (see "PDF" below for the
  rationale, and "Deferred" for the upgrade path).
- Rendering an Obsidian graph view.

## Content source

The Obsidian vault root is `src/content/extras/`. That folder — and only that
folder — is opened as a vault in Obsidian.

```
src/content/extras/          <- Obsidian vault root
├── .obsidian/               <- git-ignored, never published
├── assets/                  <- Obsidian attachment folder (set in vault settings)
│   └── schema-tcp.png
├── Maths/
│   ├── Algèbre linéaire.md
│   └── Probabilités.md
└── Réseaux/
    └── TCP-IP.md
```

**Every note in this folder is published.** There is no draft or opt-in flag.
The repository is public (`DewellGuerand.github.io`), so a note excluded from the
site would still be readable on GitHub — an in-site draft flag would give a false
sense of privacy. Private notes belong in a separate vault outside this repo.

Excluded from the collection: `.obsidian/`, `assets/`, and any file or directory
whose name starts with `_`.

## Data flow

```
src/content/extras/**/*.md
        │
        │  glob loader (src/content.config.ts)
        ▼
   collection "extras"          id = "maths/probabilites"
        │
        │  src/lib/extras.ts — normalization
        │  · category = first path segment          -> "maths"
        │  · label    = original folder name        -> "Maths"
        │  · title    = frontmatter.title
        │               ?? first H1 in body
        │               ?? original filename        -> "Probabilités"
        │  · slug     = accent-stripped path        -> "maths/probabilites"
        ▼
  ┌──────────────────────────┬──────────────────────────────┐
  ▼                          ▼
/extras/index.astro     /extras/[...slug].astro
groups notes by         one static page per note,
category, renders       via getStaticPaths
clickable boxes
```

## Pages

### `/extras` — the menu

A single page. Every note is rendered as a clickable box, boxes grouped under
their category heading. One click from the menu to any note.

```
/extras

MATHS
┌──────────────┐ ┌──────────────┐
│ Algèbre lin. │ │ Probabilités │
└──────────────┘ └──────────────┘

RÉSEAUX
┌──────────────┐
│   TCP / IP   │
└──────────────┘
```

Categories are ordered alphabetically by label; notes alphabetically by title
within a category. Boxes reuse the visual treatment of the existing
`Projects.astro` cards so the section reads as part of the same site.

Empty vault renders an explicit "no notes yet" message, not an empty grid.

### `/extras/<category>/<slug>` — a note

Full-width document layout: a single centred column capped at a comfortable
reading measure (~70ch). The homepage's split-screen layout is deliberately not
reused — it halves the available width, which is wrong for code blocks, tables
and display equations.

Page contains: title, category, "Download PDF" button, rendered note body, and a
back link to `/extras`.

A note at the vault root (no containing folder) is grouped under **Divers** and
lives at `/extras/<slug>`.

## Obsidian syntax

A remark plugin (`src/lib/remark-obsidian.ts`) converts Obsidian-specific syntax
to standard Markdown before Astro renders it. At build it scans the vault once
and builds a `basename → slug` map, matching how Obsidian itself resolves links:
by filename, across the whole vault, regardless of folder.

| Authored | Rendered |
|---|---|
| `[[Probabilités]]` | link to `/extras/maths/probabilites` |
| `[[Probabilités\|les probas]]` | same link, text `les probas` |
| `[[Probabilités#Bayes]]` | same link + `#bayes` anchor |
| `![[schema-tcp.png]]` | `<img>` through Astro's image pipeline |

Embeds are rewritten to a path relative to the containing note
(`![schema-tcp](../assets/schema-tcp.png)`), which hands them to Astro's
built-in content-collection image handling: resizing, content hashing and lazy
loading come for free, with no extra integration.

### Failure behaviour

Renaming a note must never fail a deploy. Every failure degrades and warns:

| Situation | Behaviour |
|---|---|
| `[[X]]` resolves to nothing | rendered as plain muted text, not a link; warning logged |
| Same basename in two folders | first match wins; warning logged naming both files |
| `![[x.png]]` resolves to nothing | literal text kept; warning logged |

Warnings are printed once per build as a grouped list.

## Math

KaTeX (CSS + JS + auto-render) is already loaded site-wide, but
`renderMathInElement` is currently only invoked lazily from
`src/components/Projects.astro:321` when a project modal opens. Note pages
therefore make their own call, against the article element, with:

- delimiters `$…$`, `$$…$$`, `\(…\)`, `\[…\]` — Obsidian's own syntax, so a note
  renders identically in the editor and on the site;
- `ignoredTags: ["code", "pre", "script"]` so code blocks are left alone.

KaTeX is `defer`-loaded, so the call reuses the wait-and-retry guard already
established in `Projects.astro`.

## PDF

The button calls `window.print()`. The browser's own PDF engine does the
rendering, driven by a print stylesheet.

This costs no dependency and no build time, and works offline. The trade-off is
that the user goes through the browser's print dialog and chooses "Save as PDF"
rather than getting a one-click file download. Build-time PDF generation was
considered and rejected for now: it requires Chromium in CI (~200 MB, roughly
+1–2 min per deploy) and restructuring `deploy.yml`.

The page sets `document.title` to the note title so the browser proposes a
sensible filename (`Probabilités.pdf`).

### Print stylesheet

Lives in `src/styles/notes.css` under `@media print`:

```
@page          size A4, margin 18mm 16mm
hidden         header, footer, back link, the PDF button itself
forced         black text on white; no shadows, rounded corners
               or background tints
never split    pre, table, figure, .katex-display
kept together  h1/h2/h3 stay with the text beneath them
external links printed as "text (https://url)" so URLs survive
               on paper; internal /extras links are not annotated
```

## Navigation

`Header.astro` gains an `Extras` link pointing at `/extras`.

Its other links are in-page anchors (`#projects`, `#education`, …) targeting
sections that do not exist on `/extras`. `Header.astro` therefore takes a
`variant: "home" | "page"` prop; under `"page"` those anchors become `/#projects`
so they navigate home and then scroll. The component's existing click handler
only intercepts `a[href^="#"]`, so real page links pass through untouched.

## Files

New:

| File | Purpose |
|---|---|
| `src/content.config.ts` | `extras` collection definition and frontmatter schema |
| `src/lib/extras.ts` | title / slug / category derivation |
| `src/lib/extras.test.ts` | unit tests for the above |
| `src/lib/remark-obsidian.ts` | wikilink and embed transformation |
| `src/layouts/BaseLayout.astro` | `<head>` extracted from `index.astro` |
| `src/pages/extras/index.astro` | the grouped menu |
| `src/pages/extras/[...slug].astro` | the note page |
| `src/styles/notes.css` | prose typography and the `@media print` block |

Modified:

| File | Change |
|---|---|
| `src/pages/index.astro` | use `BaseLayout`; output must be unchanged |
| `src/components/Header.astro` | `Extras` link, `variant` prop |
| `astro.config.mjs` | register the remark plugin |
| `.gitignore` | ignore `src/content/extras/.obsidian/` |
| `package.json` | `test` script (see "Verification") |

Deleted: Obsidian's two default notes, `src/content/Bienvenue.md` and
`src/content/créez un lien.md`.

### Why `src/lib/extras.ts` is its own module

Three consumers need the same rules: the menu page, the note page, and the
remark plugin (which needs the slug rule to resolve wikilinks). One
implementation, one place to change them.

## Verification

Most of this feature is verified by `npm run build` succeeding, plus a manual
pass over: menu grouping, a wikilink, an embedded image, a math block, and the
browser's print preview.

The derivation functions in `src/lib/extras.ts` also get unit tests. They are
pure, and they are where a bug hides silently — a mishandled accent produces a
wrong URL that goes unnoticed for weeks.

No test dependency is added. Tests run on Node's built-in runner with native
TypeScript type-stripping:

```
"test": "node --experimental-strip-types --test src/lib/extras.test.ts"
```

The flag is required on the local Node 22.15 and becomes unnecessary on Node
≥ 22.18, where stripping is on by default. Tests are run locally; the deploy
workflow is not changed to run them.

Cases to cover:

- accents stripped (`Probabilités` → `probabilites`)
- spaces to hyphens (`créez un lien` → `creez-un-lien`)
- case folded, repeated and trailing separators collapsed
- category taken from the first path segment only; deeper folders stay in the
  slug (`Maths/Algèbre/vecteurs.md` → category `maths`, slug
  `maths/algebre/vecteurs`)
- root-level note assigned to `Divers`
- title precedence: frontmatter `title` > first H1 > filename

## Deferred

- **Build-time PDF files.** If the print dialog proves annoying, a Playwright
  step can render each note to a real `.pdf` and the button becomes a plain
  download link. The print stylesheet is reused as-is by that renderer, so
  nothing built now is wasted.
- **Table of contents sidebar** on long notes.
- **Search** across notes.
