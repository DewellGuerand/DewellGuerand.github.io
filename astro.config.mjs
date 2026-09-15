// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import remarkMath from "remark-math";
import remarkBreaks from "remark-breaks";
import rehypeKatex from "rehype-katex";
import remarkObsidian from "./src/lib/remark-obsidian.ts";

// https://astro.build/config
export default defineConfig({
  site: 'https://DewellGuerand.github.io',
  trailingSlash: 'ignore',
  markdown: {
    // Obsidian applies no smart typography: it leaves quotes, apostrophes and
    // "..." exactly as typed. Astro's default smartypants runs *before* our own
    // remark plugins, so it would rewrite `[[L'Algèbre]]` to `[[L’Algèbre]]`
    // before remarkObsidian ever sees it — the wikilink would never resolve.
    smartypants: false,
    // remarkMath is a syntax extension, so `$…$` becomes a math node while the
    // document is parsed — before escapes like `\{` are consumed and before any
    // transformer touches the text. That is what keeps `$\{1,2\}$` intact.
    // remarkBreaks matches Obsidian's default "strict line breaks: off", where a
    // single newline is a visible line break rather than a joined paragraph.
    remarkPlugins: [remarkMath, remarkObsidian, remarkBreaks],
    rehypePlugins: [[rehypeKatex, { throwOnError: false, strict: false }]],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
