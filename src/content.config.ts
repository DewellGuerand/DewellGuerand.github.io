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
