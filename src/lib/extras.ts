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
    .replace(/\p{Diacritic}/gu, "")
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
