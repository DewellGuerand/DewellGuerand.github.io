# Project "Discover" Modals with Media — Design

**Date:** 2026-07-28
**Status:** Approved (design), pending implementation plan

## Goal

Let each project on the portfolio expose a richer view: a longer description plus
images and/or local video, surfaced through a "Discover" button that opens a
centered modal/lightbox. Projects without extra content keep their current
appearance unchanged.

## Non-Goals

- No carousel/slider — media is a simple vertical stack.
- No CMS, no markdown rendering — `details` is plain text (paragraphs).
- No changes to other sections (Hero, About, Experience, Education, Achievements).
- No new dependencies.

## Data Structure (`src/config.ts`)

Each project object gains two **optional** fields. Existing projects that omit
them render exactly as before.

```ts
{
  name: string,
  description: string,        // short teaser — stays on the card
  link?: string,             // GitHub link — stays as the top-right corner arrow
  skills?: string[],
  details?: string,          // NEW: longer write-up, shown only in the modal
  media?: Array<{            // NEW: images and/or local video, shown in the modal
    type: "image" | "video",
    src: string,             // e.g. "/projects/hull-white-1.png"
    caption?: string,        // optional caption under the item
    poster?: string,         // optional; video only — thumbnail before play
  }>,
}
```

- Media files live in `public/projects/`, referenced with a leading slash
  (`/projects/foo.png`). Astro serves `public/` at the site root.
- A project shows a **"Discover"** button only when it has a non-empty `details`
  string **or** a non-empty `media` array.

## UI Behavior (`src/components/Projects.astro`)

### Card
- Card visual design is unchanged from today.
- The top-right arrow icon remains the external GitHub link (only when `link` set).
- A new **"Discover →"** button is added at the bottom of the card (below skills)
  for projects with `details` or `media`. The button uses the existing
  monospace/gray aesthetic and `accentColor`.
- Because the card body previously acted as the link when `link` was set, the
  "Discover" button must stop event propagation so clicking it does not also
  trigger the card's link navigation.

### Modal / lightbox
- One modal markup block is rendered per project with such content (hidden by
  default), identified by an index-based id (e.g. `project-modal-0`).
- Contents, top to bottom: project title, the `details` paragraphs, then the
  media stacked vertically:
  - `image` → `<img loading="lazy" alt={caption ?? name}>` with optional caption.
  - `video` → `<video controls preload="metadata" poster={poster}>` with optional
    caption. Not autoplayed.
- Centered over a dimmed, blurred backdrop. The modal panel scrolls internally
  when content is tall; the page behind does not scroll (body scroll locked).

### Open / close
- "Discover" button opens the matching modal.
- Closes via: an ✕ button (top-right of the panel), clicking the backdrop, or
  pressing **Escape**.
- A single lightweight vanilla-JS `<script>` in the component wires up all
  buttons/modals (event delegation or per-element listeners), toggles a hidden
  class, and manages `document.body` scroll lock + Escape handling.

## Responsiveness & Accessibility

- Modal is full-width with margins on mobile, capped max-width on desktop.
- Backdrop and panel follow existing Tailwind spacing/rounding conventions.
- ✕ button has an `aria-label`; images have `alt` text; Escape closes.

## Testing / Verification

- `npm run build` succeeds.
- `npm run dev`: a project with `details`+`media` shows "Discover", opens the
  modal, plays video, closes via ✕/backdrop/Escape; body scroll locks/unlocks.
- A project without `details`/`media` shows no "Discover" button and behaves as
  before (corner arrow still links out).

## Rollout

Add the fields to one project first (e.g. Finite Element Analysis, which has a
repo and is visual) using placeholder media paths, so the feature is verifiable
even before real assets are added. Document the `public/projects/` convention.
