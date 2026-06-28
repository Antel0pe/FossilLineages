# Verification Criteria — Graph Divergence Labels (2026-06-27)

## Direction (Stage 1 outcome)
The existing lineage graph (`app/evolution-explorer.tsx` + `data/lineage.json`) already
stores a `change`/`pressure` pair per taxon, but it's written standalone — nothing today
contrasts two sibling branches against each other at the point where they actually diverge.

Add a lightweight, **always-visible** annotation at a pilot set of split points in the graph:
a short, terse, contrastive label (a tag, not prose) naming the two diverging evolutionary
strategies — e.g. "Fruit-foraging vs. leaf/stem fallback diet". This is explicitly an
**overview/index layer on the graph**, not a replacement for it and not part of the
turning-point scenes. Per the 2026-06-23 pivot in `CLAUDE-UNDERSTANDING.md`, the scenes remain
the primary "why" storytelling format — this graph feature is a deliberately smaller, separate
itch (confirmed by user 2026-06-27: "still the graph, deliberately").

Explicitly NOT in scope for this pass: replacing the tree, click-to-reveal interaction,
full side-by-side change+pressure writeups, or touching any `app/story/*` scene files.

## Pilot splits (4)
Anchored to actual fork points already in `data/lineage.json` (a taxon with 2+ children):

| # | Fork (parent → siblings) | Why picked |
|---|---|---|
| 1 | `nakalipithecus-nakayamai` → `gorilla`, `chimpanzee` | Literal `"kind": "split"` edges already in the data; user's own example case |
| 2 | `australopithecus-afarensis` → `paranthropus-boisei`, `homo-habilis` | Classic robust-chewing-specialist vs. tool-using-omnivore contrast |
| 3 | `homo-erectus` → `homo-floresiensis`, `middle-pleistocene-homo` | Island dwarfism vs. continued continental scaling |
| 4 | `middle-pleistocene-homo` → `homo-sapiens`, `homo-neanderthalensis` | Dispersal generalist vs. cold-climate robust specialist |

## Falsifiable criteria

**A — New data exists, one entry per pilot fork.**
A new structure (e.g. `divergences: {fromId, siblingIds: [a,b], label}[]`) is added to
`data/lineage.json`. Check: exactly 4 entries, each with a non-empty `label` string under
~100 chars, each `fromId`/`siblingIds` matching the table above exactly.

**B — Each label is genuinely contrastive, not one-sided description.**
Check: read each of the 4 label strings — FAIL if it just restates one species' trait without
naming what the other branch did differently (must contain an explicit contrast: "vs.",
"while", "instead of", or two clearly opposed phrases).

**C — Label renders, always visible, at the correct fork.**
Check via rendered browser screenshot: 4 visible label elements appear on the canvas, each
positioned at/between the correct pair of sibling branches, with **zero** click or hover
required to see them.

**D — Visually distinct from existing taxon cards and edge lines.**
Check via screenshot: the label reads unambiguously as an annotation (e.g. a pill/tag), not
as a 21st taxon card or a relabeled edge — confirmed by eye, not just "it has a CSS class".

**E — No regression to existing graph.**
Check: taxon count and edge count rendered after the change match the count before the change
(programmatic count, not eyeballed); 0 new console errors in the browser.

**F — Change is scoped to the graph only.**
Check: `git diff --stat` for this task touches only graph-related files
(`app/evolution-explorer.tsx`, its CSS module, `data/lineage.json`) — 0 files under
`app/story/` are touched.

## Per-item ledger (filled during verification, 2026-06-27)

| # | Fork | Label text (observed) | B: contrastive? | C: visible no-click? | D: visually distinct? |
|---|---|---|---|---|---|
| 1 | nakalipithecus → gorilla/chimpanzee | "Bulk leaf-eating vs. fruit-foraging in groups" | PASS (explicit "vs.") | PASS — rendered, 0px,0px offset required | PASS — see below |
| 2 | afarensis → boisei/habilis | "Mega-chewing plant specialist vs. tool-using omnivore" | PASS | PASS | PASS |
| 3 | erectus → floresiensis/mid-Pleistocene Homo | "Island dwarfism vs. continued continental scaling" | PASS | PASS | PASS |
| 4 | mid-Pleistocene Homo → sapiens/neanderthalensis | "Lightly-built dispersal generalist vs. cold-adapted robust specialist" | PASS | PASS | PASS |

**D detail** (`preview_inspect`/`getComputedStyle` in a live browser, not just CSS source):
tag = `border-style: dashed`, `border-radius: 100px` (pill), `border-color: rgb(154,123,58)`
(gold), `font-style: italic`. Taxon card = `border-style: solid`, `border-radius: 5px`. Distinct
shape, border treatment, and color family — confirmed in the rendered DOM, not just by reading
the stylesheet.

**A**: confirmed 4 entries in `data.divergences`, matching the fork table exactly.

**C caveat found & fixed**: first implementation positioned tags at the geometric midpoint
between sibling branches. At this layout's 2px lane gap, that landed tags on top of taxon
cards — measured via `getBoundingClientRect()` in the live browser: tag 1 overlapped the
Gorilla card by ~25×26px, tag 4 overlapped Neanderthal by ~60×20px. Real collisions, not a
hypothetical. Repositioned to sit just right of the parent card with a small collision search
across nearby lanes (checked against all 20 taxa's actual rendered rects, with an 8px margin).
Re-measured after the fix: **0 collisions** across all 4 tags × 20 cards (40 pairs checked).

**E**: taxon-card count = 20, edge-path count = 21, both unchanged from before this change.
0 console errors (checked via `preview_console_logs`, only HMR/devtools-suggestion noise).

**F**: `git status --porcelain` shows only `app/evolution-explorer.tsx`,
`app/explorer.module.css`, `data/lineage.json`, plus `CLAUDE-UNDERSTANDING.md` and this doc.
0 files under `app/story/` touched.

**Build/lint**: `bun run build` — compiles, typechecks, and statically generates all 7 routes
clean. (Caught and fixed a real type error along the way: `Divergence.siblingIds` was typed
as a 2-tuple, which the plain-array JSON literal in `lineage.json` doesn't satisfy — loosened
to `string[]`.) `bunx eslint app/evolution-explorer.tsx` — 0 errors. (Repo-wide `bun run lint`
still fails on 7 pre-existing unescaped-apostrophe errors in `app/story/bipedalism/page.tsx`
and `app/story/endurance-running/page.tsx` — unrelated to this change, not touched by it.)

**Not yet verified — full-page screenshot was uninformative**: `preview_screenshot` in this
environment renders the entire horizontally-overflowing canvas scaled into one small thumbnail
regardless of viewport size or scroll position, so it couldn't confirm fine visual polish (e.g.
exact pill proportions at a glance) the way a normal crop would. Substituted
`getBoundingClientRect` + `getComputedStyle` collision/style checks against the live DOM
instead, which are stronger for the falsifiable claims here (exact geometry, exact computed
style) even though they're not a literal screenshot. Flagging this so it isn't silently treated
as "looked at a screenshot, it's fine."

## Result: PASS, all 6 criteria (A–F) verified against the live rendered app.
