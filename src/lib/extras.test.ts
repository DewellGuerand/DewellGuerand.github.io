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
