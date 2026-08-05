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
