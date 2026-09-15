# Extras — Obsidian Notes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish an Obsidian vault as a browsable `/extras` section — one grouped menu page, one page per note, each with a print-based "Download PDF" button.

**Architecture:** An Astro content collection reads Markdown from `src/content/extras/` at build time. A pure helper module derives slugs, titles and categories; a remark plugin rewrites Obsidian's `[[wikilink]]` and `![[embed]]` syntax into standard Markdown before rendering. Everything is static — no runtime code beyond a KaTeX call and `window.print()`.

**Tech Stack:** Astro 5.14.1 (content layer / glob loader), Tailwind CSS v4, KaTeX (already loaded site-wide via CDN), `node --test` for unit tests.

**Spec:** `docs/superpowers/specs/2026-08-05-extras-obsidian-notes-design.md`

## Global Constraints

- **Astro 5.14.1.** Use the content layer: `glob` from `astro/loaders`, `getCollection` and `render` from `astro:content`. Do **not** use the legacy `entry.slug` or `entry.render()` APIs — in Astro 5 the identifier is `entry.id` and rendering is `await render(entry)`.
- **Tailwind CSS v4**, imported via `@import "tailwindcss"` in `src/styles/global.css`. There is **no** `@tailwindcss/typography` plugin — `prose` classes do not exist. Style rendered Markdown with explicit CSS in `src/styles/notes.css`.
- **Only one new dependency is permitted:** `unist-util-visit@^5.0.0` as a **devDependency**. No other packages. No PDF library, no test framework.
- **Node 22.15 locally.** Test script must pass `--experimental-strip-types`; that flag is unnecessary on Node ≥ 22.18 but harmless.
- **Windows development machine.** Any code touching `entry.filePath` must normalise `\` to `/` before splitting on path separators.
- **Every note under `src/content/extras/` is public.** No draft flag, no opt-in gate.
- **Accented French text throughout.** Slugs strip diacritics; sorting uses `localeCompare(…, "fr")`.
- The site deploys to GitHub Pages via `.github/workflows/deploy.yml`. **Do not modify that workflow.**
- Commit after each task.

---

### Task 1: Extract `BaseLayout.astro`

`src/pages/index.astro` holds ~70 lines of `<head>` inline. Three pages will need it. Extract it first, with zero behaviour change, so later tasks have somewhere to plug in.

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Modify: `src/pages/index.astro:1-104` (replace `<html>`/`<head>`/`<body>` wrapper)

**Interfaces:**
- Consumes: nothing.
- Produces: `BaseLayout` accepting props `{ title?: string; description?: string; canonical?: string; bodyClass?: string }` and a default `<slot />`. All props optional; defaults come from `siteConfig`.

- [ ] **Step 1: Capture the current output as a baseline**

```bash
npm run build
cp dist/index.html /tmp/index-before.html
```

If `/tmp` is awkward on Windows, use the scratchpad directory instead. The point is a byte-comparable copy of the built homepage.

- [ ] **Step 2: Create `src/layouts/BaseLayout.astro`**

Move the `<head>` verbatim from `index.astro`. The only changes: `title`, `description` and `canonical` become props with the current values as defaults, and `<body>` gets a `<slot />`.

```astro
---
import { siteConfig } from "../config";
import "../styles/global.css";

interface Props {
  title?: string;
  description?: string;
  canonical?: string;
  bodyClass?: string;
}

const {
  title = `${siteConfig.name} - ${siteConfig.title}`,
  description = siteConfig.description,
  canonical = "https://gueranddewell.com/",
  bodyClass = "",
} = Astro.props;
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width" />
    <meta name="generator" content={Astro.generator} />

    <!-- SEO Meta Tags -->
    <meta name="description" content={description} />
    <meta name="keywords" content="Guerand Dewell, Mathematical Engineer, Portfolio, Python, Java, C, Applied Mathematics, Computer Science" />
    <meta name="author" content={siteConfig.name} />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href={canonical} />

    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonical} />
    <meta property="og:image" content="https://gueranddewell.com/og-image.jpg" />
    <meta property="og:site_name" content={siteConfig.name} />

    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content="https://gueranddewell.com/og-image.jpg" />

    <!-- PWA Meta Tags -->
    <link rel="manifest" href="/manifest.json" />
    <meta name="theme-color" content={siteConfig.accentColor} />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content={siteConfig.name} />

    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-EC53NM0GV2"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-EC53NM0GV2');
    </script>

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,100..900;1,100..900&family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap"
      rel="stylesheet"
    />

    <!-- KaTeX for rendering LaTeX math -->
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css"
      crossorigin="anonymous"
    />
    <script
      defer
      src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js"
      crossorigin="anonymous"></script>
    <script
      defer
      src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js"
      crossorigin="anonymous"></script>

    <slot name="head" />
    <title>{title}</title>
  </head>
  <body class={bodyClass}>
    <slot />
  </body>
</html>
```

Note: the JSON-LD `<script type="application/ld+json">` block is **deliberately left out** of `BaseLayout` — it is homepage-specific. It moves into `index.astro` via the `head` slot in the next step. (It is also currently broken: it uses `${siteConfig.name}` template syntax inside a plain `<script>`, which Astro does not interpolate, so it emits literal `${siteConfig.name}`. Leave that bug alone — fixing it is out of scope and would change output.)

- [ ] **Step 3: Rewrite `src/pages/index.astro` to use the layout**

Keep the `<body>` contents exactly as they are. Replace only the wrapper.

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Header from "../components/Header.astro";
import Hero from "../components/Hero.astro";
import About from "../components/About.astro";
import Projects from "../components/Projects.astro";
import Experience from "../components/Experience.astro";
import Education from "../components/Education.astro";
import Achievements from "../components/Achievements.astro";
import Footer from "../components/Footer.astro";
---

<BaseLayout>
  <Fragment slot="head">
    <script type="application/ld+json" is:inline>
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "${siteConfig.name}",
      "jobTitle": "${siteConfig.title}",
      "description": "${siteConfig.description}",
      "url": "https://gueranddewell.com/",
      "email": "${siteConfig.social.email}",
      "sameAs": [
        "${siteConfig.social.linkedin}",
        "${siteConfig.social.github}"
      ]
    }
    </script>
  </Fragment>

  <!-- Desktop Layout: Split Screen -->
  <div class="hidden lg:flex h-screen">
    <div class="w-1/2 flex flex-col overflow-hidden">
      <Header />
      <div class="flex-1 overflow-y-auto">
        <Hero />
      </div>
    </div>
    <div class="w-1/2 overflow-y-auto">
      <Education />
      <Projects />
      <Experience />
      <Achievements />
    </div>
  </div>

  <!-- Mobile Layout: Stacked -->
  <div class="lg:hidden">
    <Header />
    <div style="padding-top: var(--header-h, 4rem)">
      <Hero />
      <Education />
      <Projects />
      <Experience />
      <Achievements />
    </div>
  </div>
  <Footer />
</BaseLayout>
```

`About` is imported but never rendered in the current file. Keep the import so the diff stays minimal; it is unrelated to this feature.

- [ ] **Step 4: Rebuild and diff against the baseline**

```bash
npm run build
diff /tmp/index-before.html dist/index.html
```

Expected: no differences, or only the ordering of `<meta>` tags in `<head>`. If the `<body>` differs at all, the extraction is wrong — fix before continuing.

- [ ] **Step 5: Commit**

```bash
git add src/layouts/BaseLayout.astro src/pages/index.astro
git commit -m "refactor: extract BaseLayout from index.astro"
```

---

### Task 2: `src/lib/extras.ts` — slug, title and category derivation

Pure functions, no Astro imports, fully unit-tested. Three later tasks depend on these exact names.

**Files:**
- Create: `src/lib/extras.ts`
- Create: `src/lib/extras.test.ts`
- Modify: `package.json` (add `test` script)

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `slugifySegment(segment: string): string`
  - `slugifyPath(relativePath: string): string`
  - `stripExtension(path: string): string`
  - `vaultRelativePath(filePath: string): string`
  - `categoryOf(relativePath: string): { key: string; label: string }`
  - `firstHeading(body: string): string | undefined`
  - `titleOf(input: { frontmatterTitle?: string; body?: string; relativePath: string }): string`
  - `toNote(entry: NoteEntry): ExtraNote`
  - `groupByCategory(notes: ExtraNote[]): CategoryGroup[]`
  - `const UNCATEGORIZED_KEY = "divers"`, `const UNCATEGORIZED_LABEL = "Divers"`
  - types `NoteEntry`, `ExtraNote`, `CategoryGroup`

- [ ] **Step 1: Add the test script to `package.json`**

Add to `"scripts"`:

```json
"test": "node --experimental-strip-types --test src/lib/extras.test.ts"
```

- [ ] **Step 2: Write the failing tests**

Create `src/lib/extras.test.ts`:

```ts
import test from "node:test";
import assert from "node:assert/strict";
import {
  slugifySegment,
  slugifyPath,
  vaultRelativePath,
  categoryOf,
  firstHeading,
  titleOf,
  toNote,
  groupByCategory,
  UNCATEGORIZED_KEY,
  UNCATEGORIZED_LABEL,
} from "./extras.ts";

test("slugifySegment strips accents", () => {
  assert.equal(slugifySegment("Probabilités"), "probabilites");
  assert.equal(slugifySegment("Algèbre linéaire"), "algebre-lineaire");
  assert.equal(slugifySegment("Réseaux"), "reseaux");
});

test("slugifySegment folds case and collapses separators", () => {
  assert.equal(slugifySegment("créez un lien"), "creez-un-lien");
  assert.equal(slugifySegment("TCP-IP"), "tcp-ip");
  assert.equal(slugifySegment("A  --  B"), "a-b");
  assert.equal(slugifySegment("  spaced  "), "spaced");
  assert.equal(slugifySegment("!!!"), "");
});

test("slugifyPath slugifies each segment and drops the extension", () => {
  assert.equal(slugifyPath("Maths/Probabilités.md"), "maths/probabilites");
  assert.equal(slugifyPath("créez un lien.md"), "creez-un-lien");
});

test("slugifyPath keeps folders deeper than the first level", () => {
  assert.equal(
    slugifyPath("Maths/Algèbre/vecteurs.md"),
    "maths/algebre/vecteurs",
  );
});

test("vaultRelativePath normalises Windows separators", () => {
  assert.equal(
    vaultRelativePath("src\\content\\extras\\Maths\\Probabilités.md"),
    "Maths/Probabilités.md",
  );
  assert.equal(
    vaultRelativePath("src/content/extras/Réseaux/TCP-IP.md"),
    "Réseaux/TCP-IP.md",
  );
  assert.equal(
    vaultRelativePath("C:/dev/site/src/content/extras/Maths/Probabilités.md"),
    "Maths/Probabilités.md",
  );
});

test("categoryOf uses the first path segment only", () => {
  assert.deepEqual(categoryOf("Maths/Probabilités.md"), {
    key: "maths",
    label: "Maths",
  });
  assert.deepEqual(categoryOf("Maths/Algèbre/vecteurs.md"), {
    key: "maths",
    label: "Maths",
  });
});

test("categoryOf assigns root-level notes to Divers", () => {
  assert.deepEqual(categoryOf("orphan.md"), {
    key: UNCATEGORIZED_KEY,
    label: UNCATEGORIZED_LABEL,
  });
});

test("categoryOf falls back to Divers when a folder name slugifies to nothing", () => {
  assert.deepEqual(categoryOf("!!!/note.md"), {
    key: UNCATEGORIZED_KEY,
    label: UNCATEGORIZED_LABEL,
  });
});

test("firstHeading finds a level-one heading", () => {
  assert.equal(firstHeading("intro\n\n# Probabilités\n\ntext"), "Probabilités");
  assert.equal(firstHeading("# Titre #\n"), "Titre");
});

test("firstHeading ignores headings inside fenced code", () => {
  const body = "```md\n# Not a title\n```\n\n# Real Title\n";
  assert.equal(firstHeading(body), "Real Title");
});

test("firstHeading ignores level-two headings", () => {
  assert.equal(firstHeading("## Sous-titre\n"), undefined);
});

test("titleOf prefers frontmatter, then H1, then filename", () => {
  assert.equal(
    titleOf({
      frontmatterTitle: "Depuis le frontmatter",
      body: "# Depuis le H1",
      relativePath: "Maths/Depuis le fichier.md",
    }),
    "Depuis le frontmatter",
  );
  assert.equal(
    titleOf({ body: "# Depuis le H1", relativePath: "Maths/Fichier.md" }),
    "Depuis le H1",
  );
  assert.equal(
    titleOf({ body: "pas de titre", relativePath: "Maths/Probabilités.md" }),
    "Probabilités",
  );
});

test("titleOf ignores a blank frontmatter title", () => {
  assert.equal(
    titleOf({ frontmatterTitle: "   ", relativePath: "Maths/Probabilités.md" }),
    "Probabilités",
  );
});

test("toNote assembles a note from a collection entry", () => {
  const note = toNote({
    id: "maths/probabilites",
    body: "# Probabilités\n\ncontenu",
    filePath: "src/content/extras/Maths/Probabilités.md",
    data: { description: "Cours de L3" },
  });
  assert.equal(note.slug, "maths/probabilites");
  assert.equal(note.href, "/extras/maths/probabilites");
  assert.equal(note.title, "Probabilités");
  assert.equal(note.categoryKey, "maths");
  assert.equal(note.categoryLabel, "Maths");
  assert.equal(note.description, "Cours de L3");
});

test("toNote survives a missing filePath", () => {
  const note = toNote({
    id: "maths/probabilites",
    body: "",
    data: {},
  });
  assert.equal(note.categoryKey, "maths");
  assert.equal(note.categoryLabel, "Maths");
  assert.equal(note.title, "probabilites");
});

test("groupByCategory sorts groups and notes with French collation", () => {
  const notes = [
    toNote({ id: "reseaux/tcp-ip", filePath: "src/content/extras/Réseaux/TCP-IP.md", body: "", data: {} }),
    toNote({ id: "maths/probabilites", filePath: "src/content/extras/Maths/Probabilités.md", body: "", data: {} }),
    toNote({ id: "maths/algebre", filePath: "src/content/extras/Maths/Algèbre.md", body: "", data: {} }),
  ];
  const groups = groupByCategory(notes);
  assert.deepEqual(groups.map((g) => g.label), ["Maths", "Réseaux"]);
  assert.deepEqual(groups[0].notes.map((n) => n.title), ["Algèbre", "Probabilités"]);
});

test("groupByCategory puts Divers last", () => {
  const notes = [
    toNote({ id: "orphan", filePath: "src/content/extras/orphan.md", body: "", data: {} }),
    toNote({ id: "maths/algebre", filePath: "src/content/extras/Maths/Algèbre.md", body: "", data: {} }),
  ];
  assert.deepEqual(groupByCategory(notes).map((g) => g.label), ["Maths", "Divers"]);
});
```

- [ ] **Step 3: Run the tests to verify they fail**

Run: `npm test`
Expected: FAIL — `Cannot find module './extras.ts'`.

- [ ] **Step 4: Implement `src/lib/extras.ts`**

```ts
export const VAULT_ROOT = "src/content/extras";
export const UNCATEGORIZED_KEY = "divers";
export const UNCATEGORIZED_LABEL = "Divers";

export interface NoteEntry {
  /** Collection id — an already-slugified path, e.g. "maths/probabilites". */
  id: string;
  /** Raw Markdown body, frontmatter excluded. */
  body?: string;
  /** Path on disk, as reported by the glob loader. May use "\" on Windows. */
  filePath?: string;
  data: {
    title?: string;
    description?: string;
    updated?: Date;
  };
}

export interface ExtraNote {
  slug: string;
  href: string;
  title: string;
  categoryKey: string;
  categoryLabel: string;
  description?: string;
  updated?: Date;
}

export interface CategoryGroup {
  key: string;
  label: string;
  notes: ExtraNote[];
}

const collator = new Intl.Collator("fr", { sensitivity: "base", numeric: true });

export function stripExtension(path: string): string {
  return path.replace(/\.mdx?$/i, "");
}

/** Lowercase ASCII slug: diacritics removed, non-alphanumerics collapsed to "-". */
export function slugifySegment(segment: string): string {
  return segment
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Slugify every segment of a path, preserving "/" separators. */
export function slugifyPath(relativePath: string): string {
  return stripExtension(relativePath)
    .split(/[\\/]/)
    .filter(Boolean)
    .map(slugifySegment)
    .filter(Boolean)
    .join("/");
}

/**
 * Reduce a loader filePath to a path relative to the vault root, with forward
 * slashes. The loader reports paths relative to the project root on POSIX and
 * may use backslashes on Windows, so normalise before matching.
 */
export function vaultRelativePath(filePath: string): string {
  const normalised = filePath.replace(/\\/g, "/");
  const marker = `${VAULT_ROOT}/`;
  const index = normalised.lastIndexOf(marker);
  return index === -1 ? normalised : normalised.slice(index + marker.length);
}

export function categoryOf(relativePath: string): { key: string; label: string } {
  const segments = stripExtension(relativePath).split("/").filter(Boolean);
  if (segments.length < 2) {
    return { key: UNCATEGORIZED_KEY, label: UNCATEGORIZED_LABEL };
  }
  const key = slugifySegment(segments[0]);
  if (!key) {
    return { key: UNCATEGORIZED_KEY, label: UNCATEGORIZED_LABEL };
  }
  return { key, label: segments[0] };
}

/** First level-one ATX heading, ignoring fenced code blocks. */
export function firstHeading(body: string): string | undefined {
  const withoutFences = body.replace(/^(```|~~~)[\s\S]*?^\1[^\n]*$/gm, "");
  const match = withoutFences.match(/^#[ \t]+(.+?)[ \t]*#*[ \t]*$/m);
  return match ? match[1].trim() : undefined;
}

export function titleOf(input: {
  frontmatterTitle?: string;
  body?: string;
  relativePath: string;
}): string {
  const fromFrontmatter = input.frontmatterTitle?.trim();
  if (fromFrontmatter) return fromFrontmatter;

  const fromHeading = input.body ? firstHeading(input.body) : undefined;
  if (fromHeading) return fromHeading;

  const basename = input.relativePath.split("/").pop() ?? input.relativePath;
  return stripExtension(basename);
}

function capitalize(value: string): string {
  return value ? value[0].toUpperCase() + value.slice(1) : value;
}

export function toNote(entry: NoteEntry): ExtraNote {
  // filePath preserves the author's original casing and accents; the id does
  // not. Prefer it, and fall back to the id when the loader omits it.
  const hasFilePath = Boolean(entry.filePath);
  const relativePath = entry.filePath
    ? vaultRelativePath(entry.filePath)
    : `${entry.id}.md`;

  const derived = categoryOf(relativePath);
  // Without a filePath the label came from the slug, so it is lowercase and
  // accent-stripped. Capitalising is the best presentation available.
  const category = hasFilePath
    ? derived
    : { key: derived.key, label: capitalize(derived.label) };

  return {
    slug: entry.id,
    href: `/extras/${entry.id}`,
    title: titleOf({
      frontmatterTitle: entry.data.title,
      body: entry.body,
      relativePath,
    }),
    categoryKey: category.key,
    categoryLabel: category.label,
    description: entry.data.description,
    updated: entry.data.updated,
  };
}

export function groupByCategory(notes: ExtraNote[]): CategoryGroup[] {
  const groups = new Map<string, CategoryGroup>();

  for (const note of notes) {
    let group = groups.get(note.categoryKey);
    if (!group) {
      group = { key: note.categoryKey, label: note.categoryLabel, notes: [] };
      groups.set(note.categoryKey, group);
    }
    group.notes.push(note);
  }

  for (const group of groups.values()) {
    group.notes.sort((a, b) => collator.compare(a.title, b.title));
  }

  return [...groups.values()].sort((a, b) => {
    // "Divers" is a catch-all, so it always sorts last regardless of collation.
    if (a.key === UNCATEGORIZED_KEY) return 1;
    if (b.key === UNCATEGORIZED_KEY) return -1;
    return collator.compare(a.label, b.label);
  });
}
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS — all tests, 0 failures.

- [ ] **Step 6: Commit**

```bash
git add src/lib/extras.ts src/lib/extras.test.ts package.json
git commit -m "feat: add slug, title and category derivation for extras notes"
```

---

### Task 3: Content collection and vault restructure

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/extras/Maths/Probabilités.md` (sample content)
- Create: `src/content/extras/Réseaux/TCP-IP.md` (sample content)
- Delete: `src/content/Bienvenue.md`, `src/content/créez un lien.md`
- Move: `src/content/.obsidian/` → `src/content/extras/.obsidian/`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: `slugifyPath` from `src/lib/extras.ts`.
- Produces: collection `"extras"` with schema `{ title?: string; description?: string; updated?: Date }`. Entry ids are slugified paths (`"maths/probabilites"`).

- [ ] **Step 1: Restructure the vault folder**

```bash
mkdir -p "src/content/extras/Maths" "src/content/extras/Réseaux" "src/content/extras/assets"
git mv --force src/content/.obsidian src/content/extras/.obsidian 2>/dev/null || mv src/content/.obsidian src/content/extras/.obsidian
rm -f "src/content/Bienvenue.md" "src/content/créez un lien.md"
```

`src/content/.obsidian/` is untracked, so `git mv` will fail and the `mv` fallback handles it. That is expected.

- [ ] **Step 2: Add two sample notes**

These exercise every feature — a wikilink, math, a code block, and a heading. Keep them; they are the manual-verification fixtures.

`src/content/extras/Maths/Probabilités.md`:

```markdown
---
description: Rappels de probabilités, niveau L3.
---

# Probabilités

Un rappel rapide, à lire avant [[TCP-IP]].

## Espérance

Pour une variable aléatoire discrète $X$ :

$$
\mathbb{E}[X] = \sum_{i} x_i \, \mathbb{P}(X = x_i)
$$

L'espérance est linéaire : $\mathbb{E}[aX + bY] = a\,\mathbb{E}[X] + b\,\mathbb{E}[Y]$.

## En Python

```python
import numpy as np

def esperance(valeurs, probas):
    return float(np.dot(valeurs, probas))
```

Un lien cassé exprès : [[Note Qui N'Existe Pas]].
```

`src/content/extras/Réseaux/TCP-IP.md`:

```markdown
---
description: Le modèle en couches, en bref.
---

# TCP / IP

Quatre couches : liaison, réseau, transport, application.

| Couche | Exemple |
| --- | --- |
| Transport | TCP, UDP |
| Réseau | IP, ICMP |

Voir aussi [[Probabilités|les rappels de probas]].
```

- [ ] **Step 3: Create `src/content.config.ts`**

```ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { slugifyPath } from "./lib/extras";

const extras = defineCollection({
  loader: glob({
    base: "./src/content/extras",
    // Dot-directories such as .obsidian/ are excluded by the loader already;
    // the negations below cover Obsidian's attachment folder and any file or
    // folder the author prefixes with "_".
    pattern: ["**/*.md", "!assets/**", "!**/_*/**", "!**/_*"],
    generateId: ({ entry }) => slugifyPath(entry),
  }),
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    updated: z.coerce.date().optional(),
  }),
});

export const collections = { extras };
```

- [ ] **Step 4: Ignore Obsidian's workspace state**

Append to `.gitignore`:

```
# Obsidian vault state (per-machine, not content)
src/content/extras/.obsidian/workspace.json
src/content/extras/.obsidian/workspace-mobile.json
```

Only the workspace files are ignored — `app.json`, `appearance.json` and `core-plugins.json` are worth committing so the vault opens consistently on any machine.

- [ ] **Step 5: Verify the collection loads**

```bash
npm run build
```

Expected: build succeeds. `dist/` contains no `/extras` pages yet (no route exists), but the collection must load without a schema error. If the build reports "Unknown collection", the config filename or export name is wrong.

- [ ] **Step 6: Commit**

```bash
git add -A src/content src/content.config.ts .gitignore
git commit -m "feat: add extras content collection and restructure the vault"
```

---

### Task 4: The `/extras` menu page

**Files:**
- Create: `src/pages/extras/index.astro`
- Create: `src/styles/notes.css`

**Interfaces:**
- Consumes: `BaseLayout` (Task 1); `toNote`, `groupByCategory` (Task 2); collection `"extras"` (Task 3).
- Produces: the route `/extras`. `notes.css` gains print rules in Task 6 and prose rules in Task 5 — create it here with only the shared page shell.

- [ ] **Step 1: Create `src/styles/notes.css`**

Tailwind v4 has no typography plugin in this project, so the reading column is plain CSS.

```css
/* Shared shell for every /extras page. */
.extras-page {
  max-width: 72ch;
  margin: 0 auto;
  padding: 2rem 1.25rem 4rem;
}

.extras-group + .extras-group {
  margin-top: 2.5rem;
}

.extras-group-title {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #6b7280;
  margin-bottom: 0.75rem;
}

.extras-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
  gap: 0.75rem;
}

.extras-card {
  display: block;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.875rem 1rem;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.2s, transform 0.2s;
}

.extras-card:hover {
  border-color: var(--accent-color, #3b82f6);
  transform: translateY(-2px);
}

.extras-card-title {
  font-weight: 600;
  margin-bottom: 0.15rem;
}

.extras-card-description {
  font-size: 0.875rem;
  color: #6b7280;
}

.extras-empty {
  color: #6b7280;
  font-size: 0.95rem;
}
```

- [ ] **Step 2: Create `src/pages/extras/index.astro`**

```astro
---
import { getCollection } from "astro:content";
import BaseLayout from "../../layouts/BaseLayout.astro";
import Header from "../../components/Header.astro";
import Footer from "../../components/Footer.astro";
import { toNote, groupByCategory } from "../../lib/extras";
import "../../styles/notes.css";

const entries = await getCollection("extras");
const groups = groupByCategory(entries.map(toNote));
---

<BaseLayout
  title="Extras - Notes"
  description="Notes de cours et fiches de révision."
  canonical="https://gueranddewell.com/extras"
>
  <Header variant="page" />
  <main class="extras-page" style="padding-top: var(--header-h, 4rem)">
    <h1 class="text-2xl font-bold mb-1">Extras</h1>
    <p class="text-gray-500 mb-8">Notes de cours et fiches de révision.</p>

    {groups.length === 0 && (
      <p class="extras-empty">Aucune note pour le moment.</p>
    )}

    {groups.map((group) => (
      <section class="extras-group">
        <h2 class="extras-group-title">{group.label}</h2>
        <div class="extras-grid">
          {group.notes.map((note) => (
            <a class="extras-card" href={note.href}>
              <div class="extras-card-title">{note.title}</div>
              {note.description && (
                <div class="extras-card-description">{note.description}</div>
              )}
            </a>
          ))}
        </div>
      </section>
    ))}
  </main>
  <Footer />
</BaseLayout>
```

`Header` does not accept a `variant` prop until Task 8. Astro ignores unknown props without erroring, so this builds now and starts working in Task 8.

- [ ] **Step 3: Build and inspect**

```bash
npm run build
```

Expected: `dist/extras/index.html` exists and contains both `Probabilités` and `TCP / IP` under the headings `MATHS` and `RÉSEAUX`. The card links point at `/extras/maths/probabilites` and `/extras/reseaux/tcp-ip` — those 404 until Task 5.

- [ ] **Step 4: Check it in the browser**

```bash
npm run dev
```

Open `http://localhost:4321/extras`. Confirm: two groups, `MATHS` before `RÉSEAUX`, cards show their frontmatter descriptions, hover lifts the card. Stop the dev server.

- [ ] **Step 5: Commit**

```bash
git add src/pages/extras/index.astro src/styles/notes.css
git commit -m "feat: add the /extras topic menu page"
```

---

### Task 5: The note page

**Files:**
- Create: `src/pages/extras/[...slug].astro`
- Modify: `src/styles/notes.css` (append prose rules)

**Interfaces:**
- Consumes: `BaseLayout` (Task 1); `toNote` (Task 2); collection `"extras"` (Task 3); `notes.css` (Task 4).
- Produces: routes `/extras/<category>/<slug>`. Renders `<article class="note-body">`, which Task 6's print stylesheet and Task 7's wikilinks both target.

- [ ] **Step 1: Append prose styles to `src/styles/notes.css`**

```css
/* --- Rendered Markdown ------------------------------------------------- */

.note-header {
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1rem;
  margin-bottom: 2rem;
}

.note-category {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #6b7280;
}

.note-title {
  font-size: 1.875rem;
  font-weight: 700;
  margin: 0.25rem 0 1rem;
}

.note-body {
  line-height: 1.7;
}

.note-body h1,
.note-body h2,
.note-body h3 {
  font-weight: 700;
  line-height: 1.3;
  margin: 2rem 0 0.75rem;
}

.note-body h1 { font-size: 1.5rem; }
.note-body h2 { font-size: 1.25rem; }
.note-body h3 { font-size: 1.05rem; }

.note-body p,
.note-body ul,
.note-body ol,
.note-body blockquote {
  margin: 0 0 1rem;
}

.note-body ul { list-style: disc; padding-left: 1.5rem; }
.note-body ol { list-style: decimal; padding-left: 1.5rem; }

.note-body a {
  color: var(--accent-color, #3b82f6);
  text-decoration: underline;
  text-underline-offset: 2px;
}

/* Wikilinks that resolved to nothing — deliberately not links. */
.note-body .wikilink-missing {
  color: #9ca3af;
  border-bottom: 1px dashed #d1d5db;
}

.note-body blockquote {
  border-left: 3px solid #e5e7eb;
  padding-left: 1rem;
  color: #4b5563;
}

.note-body code {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.875em;
  background: #f3f4f6;
  padding: 0.15em 0.35em;
  border-radius: 0.25rem;
}

.note-body pre {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  overflow-x: auto;
  margin: 0 0 1.25rem;
}

.note-body pre code {
  background: none;
  padding: 0;
  font-size: 0.85rem;
}

.note-body img {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1rem 0;
}

.note-body table {
  width: 100%;
  border-collapse: collapse;
  margin: 0 0 1.25rem;
  font-size: 0.9rem;
}

.note-body th,
.note-body td {
  border: 1px solid #e5e7eb;
  padding: 0.5rem 0.75rem;
  text-align: left;
}

.note-body th { background: #f9fafb; font-weight: 600; }

.note-back {
  display: inline-block;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  color: #6b7280;
  text-decoration: none;
}

.note-back:hover { color: #111827; }
```

- [ ] **Step 2: Create `src/pages/extras/[...slug].astro`**

```astro
---
import { getCollection, render } from "astro:content";
import BaseLayout from "../../layouts/BaseLayout.astro";
import Header from "../../components/Header.astro";
import Footer from "../../components/Footer.astro";
import { toNote } from "../../lib/extras";
import "../../styles/notes.css";

export async function getStaticPaths() {
  const entries = await getCollection("extras");
  return entries.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const note = toNote(entry);
const { Content } = await render(entry);
---

<BaseLayout
  title={`${note.title} - Extras`}
  description={note.description ?? `${note.title} - ${note.categoryLabel}`}
  canonical={`https://gueranddewell.com${note.href}`}
>
  <Header variant="page" />
  <main class="extras-page" style="padding-top: var(--header-h, 4rem)">
    <a class="note-back" href="/extras">&larr; Extras</a>

    <header class="note-header">
      <div class="note-category">{note.categoryLabel}</div>
      <h1 class="note-title">{note.title}</h1>
    </header>

    <article class="note-body">
      <Content />
    </article>
  </main>
  <Footer />
</BaseLayout>

<script>
  // KaTeX is loaded with `defer` in BaseLayout, so it may not be ready when
  // this runs. Poll briefly rather than racing it — same approach as
  // Projects.astro, which renders math inside modals.
  function renderMath() {
    const fn = (window as any).renderMathInElement;
    const article = document.querySelector(".note-body");
    if (typeof fn !== "function" || !article) return false;
    fn(article, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "\\[", right: "\\]", display: true },
        { left: "$", right: "$", display: false },
        { left: "\\(", right: "\\)", display: false },
      ],
      ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code"],
      throwOnError: false,
    });
    return true;
  }

  if (!renderMath()) {
    let attempts = 0;
    const timer = setInterval(() => {
      if (renderMath() || ++attempts > 40) clearInterval(timer);
    }, 50);
  }
</script>
```

- [ ] **Step 3: Build and verify the routes exist**

```bash
npm run build
ls dist/extras/maths dist/extras/reseaux
```

Expected: `dist/extras/maths/probabilites/index.html` and `dist/extras/reseaux/tcp-ip/index.html`.

- [ ] **Step 4: Check rendering in the browser**

```bash
npm run dev
```

Open `http://localhost:4321/extras/maths/probabilites`. Confirm:
- the title, the `MATHS` category label and the back link render;
- the display equation and the inline `$\mathbb{E}[aX + bY]$` render as typeset math, not raw LaTeX;
- the Python block renders as a code block and its contents are **not** mathified;
- `[[TCP-IP]]` still shows as the literal text `[[TCP-IP]]` — that is Task 7's job.

Open `/extras/reseaux/tcp-ip` and confirm the table renders with borders. Stop the dev server.

- [ ] **Step 5: Commit**

```bash
git add "src/pages/extras/[...slug].astro" src/styles/notes.css
git commit -m "feat: render individual extras notes with math support"
```

---

### Task 6: Print stylesheet and the PDF button

**Files:**
- Modify: `src/pages/extras/[...slug].astro` (add the button)
- Modify: `src/styles/notes.css` (append the `@media print` block)

**Interfaces:**
- Consumes: `.note-body`, `.note-header`, `.extras-page` (Task 5).
- Produces: nothing later tasks depend on.

- [ ] **Step 1: Append the print stylesheet to `src/styles/notes.css`**

```css
/* --- Print / "Download PDF" -------------------------------------------- */

.note-actions {
  margin-bottom: 2rem;
}

.note-print-button {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.8rem;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.55rem 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.note-print-button:hover { background: #374151; }

@media print {
  @page {
    size: A4;
    margin: 18mm 16mm;
  }

  /* Site chrome has no business on paper. */
  header#header,
  footer,
  .note-back,
  .note-actions {
    display: none !important;
  }

  html, body {
    background: #fff !important;
    color: #000 !important;
  }

  .extras-page {
    max-width: none;
    margin: 0;
    padding: 0 !important;
  }

  .note-body,
  .note-title,
  .note-category {
    color: #000 !important;
  }

  .note-body a {
    color: #000 !important;
    text-decoration: underline;
  }

  /* Make external URLs recoverable on paper; internal links stay clean. */
  .note-body a[href^="http"]::after {
    content: " (" attr(href) ")";
    font-size: 0.85em;
    word-break: break-all;
  }

  .note-body pre,
  .note-body code {
    background: #fff !important;
    border-color: #999 !important;
  }

  .note-body pre,
  .note-body table,
  .note-body figure,
  .note-body img,
  .note-body blockquote,
  .katex-display {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  /* A heading stranded at the foot of a page is a formatting bug. */
  .note-body h1,
  .note-body h2,
  .note-body h3 {
    break-after: avoid;
    page-break-after: avoid;
  }

  .note-header {
    border-bottom: 1px solid #000;
  }
}
```

- [ ] **Step 2: Add the button to the note page**

In `src/pages/extras/[...slug].astro`, insert immediately after the closing `</header>` of `.note-header`:

```astro
    <div class="note-actions">
      <button type="button" class="note-print-button" data-print>
        Télécharger en PDF
      </button>
    </div>
```

- [ ] **Step 3: Wire the button up**

The browser derives the proposed PDF filename from `document.title`, which here is
`"Probabilités - Extras"`. Swap in the bare note title for the duration of the
print, then restore it, so the file is offered as `Probabilités.pdf`.

Pass the title in from the frontmatter by adding a data attribute to the button
in Step 2's markup:

```astro
      <button type="button" class="note-print-button" data-print data-title={note.title}>
```

Then add to the existing `<script>` block in the same file, after the KaTeX code:

```ts
  // No PDF library: the browser's own print-to-PDF does the rendering, driven
  // by the @media print rules in notes.css.
  const printButton = document.querySelector<HTMLElement>("[data-print]");
  const noteTitle = printButton?.dataset.title;

  if (printButton && noteTitle) {
    const pageTitle = document.title;
    // Browsers name the saved file after document.title, so borrow it for the
    // print and hand it back afterwards.
    window.addEventListener("beforeprint", () => { document.title = noteTitle; });
    window.addEventListener("afterprint", () => { document.title = pageTitle; });
    printButton.addEventListener("click", () => window.print());
  }
```

Using `beforeprint`/`afterprint` rather than setting the title around the
`window.print()` call means `Ctrl+P` gets the same filename as the button.

- [ ] **Step 4: Verify the print output**

```bash
npm run dev
```

Open `http://localhost:4321/extras/maths/probabilites` and press `Ctrl+P`. In the preview, confirm:
- the site header, the footer, the back link and the PDF button are all absent;
- the title and body are black on white;
- the equation and the code block are not split across a page boundary;
- the browser proposes `Probabilités` as the document name (it derives this from `<title>`).

Click the **Télécharger en PDF** button and confirm it opens the same dialog. Stop the dev server.

- [ ] **Step 5: Commit**

```bash
git add "src/pages/extras/[...slug].astro" src/styles/notes.css
git commit -m "feat: add print stylesheet and PDF button to note pages"
```

---

### Task 7: `remark-obsidian` — wikilinks and embeds

**Files:**
- Create: `src/lib/remark-obsidian.ts`
- Modify: `astro.config.mjs`
- Modify: `package.json` (add `unist-util-visit` devDependency)

**Interfaces:**
- Consumes: `slugifyPath`, `slugifySegment`, `stripExtension`, `VAULT_ROOT` from `src/lib/extras.ts` (Task 2).
- Produces: default export `remarkObsidian()` — a remark plugin factory taking no arguments.

- [ ] **Step 1: Declare the dependency**

```bash
npm install --save-dev unist-util-visit@^5.0.0
```

It is already present in `node_modules` (Astro depends on it directly), so this only records the intent in `package.json`. Declaring it explicitly means a future npm hoisting change cannot silently break the build.

- [ ] **Step 2: Create `src/lib/remark-obsidian.ts`**

```ts
import { readdirSync, statSync } from "node:fs";
import { join, relative, dirname, posix } from "node:path";
import { visit } from "unist-util-visit";
import { VAULT_ROOT, slugifyPath, slugifySegment, stripExtension } from "./extras";

const MARKDOWN = /\.mdx?$/i;
const EMBED_OR_LINK = /!?\[\[([^\][|#]+)(#[^\][|]+)?(\|([^\][]+))?\]\]/g;

interface VaultIndex {
  /** lowercased basename without extension -> vault-relative note path */
  notes: Map<string, string>;
  /** lowercased basename with extension -> vault-relative asset path */
  assets: Map<string, string>;
  duplicates: string[];
}

let cachedIndex: VaultIndex | undefined;
const warnings = new Set<string>();

function walk(dir: string, root: string, index: VaultIndex): void {
  let names: string[];
  try {
    names = readdirSync(dir);
  } catch {
    return; // vault folder absent — nothing to index
  }

  for (const name of names) {
    if (name.startsWith(".") || name.startsWith("_")) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      walk(full, root, index);
      continue;
    }

    const relPath = relative(root, full).replace(/\\/g, "/");

    if (MARKDOWN.test(name)) {
      const key = stripExtension(name).toLowerCase();
      const existing = index.notes.get(key);
      if (existing) {
        index.duplicates.push(`"${name}": ${existing} and ${relPath}`);
        continue; // first match wins, matching Obsidian's own behaviour
      }
      index.notes.set(key, relPath);
    } else {
      index.assets.set(name.toLowerCase(), relPath);
    }
  }
}

function getIndex(): VaultIndex {
  if (cachedIndex) return cachedIndex;
  const index: VaultIndex = { notes: new Map(), assets: new Map(), duplicates: [] };
  walk(VAULT_ROOT, VAULT_ROOT, index);
  for (const duplicate of index.duplicates) {
    warn(`duplicate note basename ${duplicate} — the first was used`);
  }
  cachedIndex = index;
  return index;
}

function warn(message: string): void {
  if (warnings.has(message)) return;
  warnings.add(message);
  console.warn(`[remark-obsidian] ${message}`);
}

/** Vault-relative path of the file currently being processed. */
function currentNotePath(file: { path?: string; history?: string[] }): string {
  const raw = file.path ?? file.history?.[0] ?? "";
  const normalised = raw.replace(/\\/g, "/");
  const marker = `${VAULT_ROOT}/`;
  const at = normalised.lastIndexOf(marker);
  return at === -1 ? "" : normalised.slice(at + marker.length);
}

export default function remarkObsidian() {
  return function transformer(tree: any, file: any) {
    const index = getIndex();
    const notePath = currentNotePath(file);
    const noteDir = notePath ? dirname(notePath) : ".";

    // Only `text` nodes are visited, so `code` and `inlineCode` nodes — fenced
    // blocks and backtick spans — are skipped for free.
    visit(tree, "text", (node: any, nodeIndex: number | undefined, parent: any) => {
      if (!parent || nodeIndex === undefined) return;
      if (!node.value.includes("[[")) return;

      const replacements: any[] = [];
      let cursor = 0;
      EMBED_OR_LINK.lastIndex = 0;

      for (const match of node.value.matchAll(EMBED_OR_LINK)) {
        const [full, targetRaw, anchor, , alias] = match;
        const start = match.index ?? 0;

        if (start > cursor) {
          replacements.push({ type: "text", value: node.value.slice(cursor, start) });
        }
        cursor = start + full.length;

        const isEmbed = full.startsWith("!");
        const target = targetRaw.trim();

        if (isEmbed) {
          replacements.push(resolveEmbed(target, noteDir, index, full));
        } else {
          replacements.push(resolveLink(target, anchor, alias, index, full));
        }
      }

      if (cursor === 0) return; // nothing matched
      if (cursor < node.value.length) {
        replacements.push({ type: "text", value: node.value.slice(cursor) });
      }

      parent.children.splice(nodeIndex, 1, ...replacements);
      return nodeIndex + replacements.length;
    });
  };
}

function resolveLink(
  target: string,
  anchor: string | undefined,
  alias: string | undefined,
  index: VaultIndex,
  original: string,
): any {
  const notePath = index.notes.get(target.toLowerCase());
  const label = alias?.trim() || target;

  if (!notePath) {
    warn(`unresolved wikilink ${original}`);
    // Degrade to inert text rather than a link to a 404.
    return {
      type: "html",
      value: `<span class="wikilink-missing">${escapeHtml(label)}</span>`,
    };
  }

  const fragment = anchor ? `#${slugifySegment(anchor.slice(1))}` : "";
  return {
    type: "link",
    url: `/extras/${slugifyPath(notePath)}${fragment}`,
    children: [{ type: "text", value: label }],
  };
}

function resolveEmbed(
  target: string,
  noteDir: string,
  index: VaultIndex,
  original: string,
): any {
  const assetPath = index.assets.get(target.toLowerCase());

  if (!assetPath) {
    warn(`unresolved embed ${original}`);
    return { type: "text", value: original };
  }

  // Astro's content layer resolves *relative* image paths in Markdown through
  // its asset pipeline, so emit a path relative to the note, not an absolute one.
  let url = posix.relative(noteDir === "." ? "" : noteDir, assetPath);
  if (!url.startsWith(".")) url = `./${url}`;

  return {
    type: "image",
    url,
    alt: stripExtension(target),
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
```

- [ ] **Step 3: Register the plugin in `astro.config.mjs`**

```js
// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import remarkObsidian from "./src/lib/remark-obsidian.ts";

// https://astro.build/config
export default defineConfig({
  site: 'https://DewellGuerand.github.io',
  trailingSlash: 'ignore',
  markdown: {
    remarkPlugins: [remarkObsidian],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
```

- [ ] **Step 4: Add a test image so the embed path is exercised**

Put any PNG at `src/content/extras/assets/schema-tcp.png` (a screenshot is fine), then append to `src/content/extras/Réseaux/TCP-IP.md`:

```markdown
![[schema-tcp.png]]
```

- [ ] **Step 5: Build and check the warnings**

```bash
npm run build
```

Expected in the output:
- `[remark-obsidian] unresolved wikilink [[Note Qui N'Existe Pas]]` — exactly one warning, from the deliberate broken link in `Probabilités.md`;
- **no** warning for `[[TCP-IP]]`, `[[Probabilités|les rappels de probas]]` or `![[schema-tcp.png]]`;
- the build **succeeds**. An unresolved link must never fail a build.

- [ ] **Step 6: Verify in the browser**

```bash
npm run dev
```

On `/extras/maths/probabilites`:
- `[[TCP-IP]]` is a link whose text is `TCP-IP` and whose href is `/extras/reseaux/tcp-ip`; click it and confirm it lands correctly;
- `[[Note Qui N'Existe Pas]]` is grey dashed text, **not** a link;
- the Python code block is untouched.

On `/extras/reseaux/tcp-ip`:
- `[[Probabilités|les rappels de probas]]` reads `les rappels de probas` and links to `/extras/maths/probabilites`;
- the image renders, and its `src` in devtools points at a hashed file under `/_astro/` — proof it went through Astro's image pipeline rather than being served raw.

Stop the dev server.

- [ ] **Step 7: Commit**

```bash
git add src/lib/remark-obsidian.ts astro.config.mjs package.json package-lock.json src/content/extras
git commit -m "feat: resolve Obsidian wikilinks and embeds at build time"
```

---

### Task 8: Header navigation

**Files:**
- Modify: `src/components/Header.astro:1-8` (props), `:11-70` (links)

**Interfaces:**
- Consumes: nothing.
- Produces: `Header` accepting `variant?: "home" | "page"`, defaulting to `"home"`.

- [ ] **Step 1: Add the `variant` prop**

Replace the frontmatter block of `src/components/Header.astro`:

```astro
---
import { siteConfig } from "../config";

interface Props {
  variant?: "home" | "page";
}

const { variant = "home" } = Astro.props;

// Section links are in-page anchors on the homepage. Everywhere else those
// sections do not exist, so they have to navigate home first.
const sectionHref = (id: string) => (variant === "home" ? `#${id}` : `/#${id}`);

const hasProjects = siteConfig.projects && siteConfig.projects.length > 0;
const hasExperience = siteConfig.experience && siteConfig.experience.length > 0;
const hasEducation = siteConfig.education && siteConfig.education.length > 0;
const hasAchievements = siteConfig.achievements && siteConfig.achievements.length > 0;
---
```

- [ ] **Step 2: Route the four section links through the helper**

Change each of the four existing `href` attributes:

| Was | Becomes |
|---|---|
| `href="#projects"` | `href={sectionHref("projects")}` |
| `href="#experience"` | `href={sectionHref("experience")}` |
| `href="#education"` | `href={sectionHref("education")}` |
| `href="#achievements"` | `href={sectionHref("achievements")}` |

Leave the `View CV` link and the social icons alone.

The component's smooth-scroll handler selects `a[href^="#"]`, so under `variant="page"` these become plain navigations and are correctly ignored by it.

- [ ] **Step 3: Add the Extras link**

Insert as a new `<li>` immediately before the `View CV` list item:

```astro
      <li>
        <a
          href="/extras"
          class="text-gray-700 hover:text-black transition-colors font-medium"
        >
          Extras
        </a>
      </li>
```

- [ ] **Step 4: Verify both variants**

```bash
npm run build
grep -o 'href="[^"]*"' dist/index.html | grep -E '#(projects|extras)' | head
grep -o 'href="[^"]*"' dist/extras/index.html | grep -E '/#(projects)|"/extras"' | head
```

Expected: `dist/index.html` uses `#projects` (bare anchor); `dist/extras/index.html` uses `/#projects`. Both contain `/extras`.

- [ ] **Step 5: Check navigation end to end**

```bash
npm run dev
```

- From `/`, click **Extras** → lands on `/extras`.
- From `/extras`, click **Projects** → navigates to `/` and scrolls to the projects section.
- From `/`, click **Projects** → still smooth-scrolls in place, no page reload (the homepage behaviour must be unchanged).
- On mobile width (<1024px), confirm the header still wraps correctly with the extra link and that content is not hidden behind it.

Stop the dev server.

- [ ] **Step 6: Full verification pass**

```bash
npm test
npm run build
```

Expected: tests pass; build succeeds; the only console warning is the deliberate unresolved wikilink.

- [ ] **Step 7: Commit**

```bash
git add src/components/Header.astro
git commit -m "feat: add Extras to the header and fix section links off the homepage"
```

---

## Done when

- `npm test` passes.
- `npm run build` succeeds, warning only about the intentional broken wikilink.
- `/extras` lists notes grouped by folder, `MATHS` before `RÉSEAUX`.
- A note page renders math, code, tables, images and resolved wikilinks.
- `Ctrl+P` on a note page produces a clean A4 document with no site chrome.
- The homepage's built HTML `<body>` is unchanged from before Task 1.
