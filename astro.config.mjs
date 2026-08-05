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
