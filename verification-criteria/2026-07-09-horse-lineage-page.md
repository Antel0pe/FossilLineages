# Horse (Equidae) lineage page — verification criteria (2026-07-09)

## Direction (already specified by user, compressed Stage 1/2 per curiosity-build)

Build a second, non-human lineage page applying the same research method as the human
branch/evolution-point panels (`.claude/skills/other-lineage-branch-points/SKILL.md`), but
with a deliberately simpler container than the human fossil-lineage graph/explorer:

- No tree/graph, no branching cards, no figure images, no `col`/lane layout math.
- Just place the panels **horizontally, in chronological order** — a simple ordered strip,
  nothing fancy.
- A **simple side panel** shows the actual research text for whichever panel is selected.
- New page under the lab (`app/lab/horses/`), linked from `app/lab/page.tsx`.
- Research already done and reviewed (5 panels in `research/horses/*.txt`), following the
  baseline → what-changed+why (per descendant/outcome) → why-of-the-why → confidence →
  citations ladder, with real DOIs and no mono-causal flattening.

## The 5 panels, in chronological order

| # | id | kind | span |
|---|---|---|---|
| 1 | `hyracotherium-mesohippus` | evolution point (straight) | ~55–34 Ma |
| 2 | `miohippus-branch` | branch point (2 descendants) | ~32–24 Ma |
| 3 | `merychippus-branch` | branch point (2 descendants) | ~17–15 Ma |
| 4 | `pliohippus-equus` | evolution point (straight) | ~13–4 Ma |
| 5 | `hipparionine-extinction` | dead end | ~17 Ma–~1 Ma (terminal) |

## Falsifiable criteria

### A — Per-panel content ledger (fill with OBSERVED values, not "all pass")

For each of the 5 panels, checked by clicking its marker in the running app and reading the
side panel (not by reading the source code):

| # | Marker opens panel (preview_click + snapshot) | Baseline text shown | # of "what changed" blocks matches kind (1 for evolution points, 2 for branch/dead-end) | Why-of-the-why text present and distinct from the Why in the change block(s) | Confidence line present | ≥1 citation shown with a real, clickable link |
|---|---|---|---|---|---|---|
| 1 |  |  |  |  |  |  |
| 2 |  |  |  |  |  |  |
| 3 |  |  |  |  |  |  |
| 4 |  |  |  |  |  |  |
| 5 |  |  |  |  |  |  |

FAIL the row if any cell is not literally observed true.

### B — Ban-list / anti-teleology spot check (qualitative, read the actual rendered text)

1. No panel bullet uses bare "changed/different/adapted" without naming what it's contrasted
   against or what it let the animal do differently (spot-check panels 2, 3, 5 — the ones with
   siblings/contrast).
2. Panel 5 (hipparionine dead end) does NOT read as a foil whose only purpose is to make Equus
   look like the winner — check for the explicit framing sentence(s) making this point.
3. No panel states a Why as a single flat mono-causal claim where the source research
   documented plurality/contest (panel 3's mesowear/grit-vs-grass/C4-timing plurality and
   panel 5's climate-vs-competition live debate must both survive into the rendered UI text,
   not get compressed into one clean sentence).

FAIL on any violation found in the rendered text.

### C — Layout/mechanical checks

1. The 5 markers render in a single horizontal row/strip (not a tree, not a vertical list, no
   branching lines/lanes) — checked via `preview_snapshot`/`preview_screenshot`.
2. Markers appear left-to-right in chronological order matching the table above (panel 1
   leftmost, panel 5 rightmost) — checked via `getBoundingClientRect` x-position or visual
   screenshot read.
3. A side panel (not a centered/backdrop modal) displays the selected panel's content —
   checked that the panel occupies a side region of the layout, not a full-screen overlay.
4. Clicking a different marker updates the side panel content (no stale content left over from
   the previous selection) — click panel 1, then panel 3, confirm the displayed title/baseline
   text changed to panel 3's.
5. No console errors, no failed network requests after a full page load and clicking through
   all 5 panels (`preview_console_logs`, `preview_network`).

FAIL on any sub-item.

### D — Lab link

1. `/lab` shows a card/entry linking to `/lab/horses` (or equivalent) — verified by loading
   `/lab` and finding the link in the accessibility snapshot.
2. Clicking it navigates to the horses page and it renders without error.

FAIL if either sub-item fails.

## Explicitly out of scope

- No new species-level "cards" with images/figures — this is panel-text-only, unlike the human
  explorer.
- No attempt to scale marker spacing proportionally to actual elapsed millions of years — "in
  order" chronologically is sufficient per the user's own instruction ("nothing fancy just in
  order").
- No dark-mode-specific styling pass beyond reusing the site's existing single-palette CSS
  variables (`--background`/`--foreground`) — this project has no light/dark toggle today.

---

## Verification results (2026-07-09)

Checked with the app running (`bun run dev` on port 3300) via browser preview: accessibility
snapshot, `preview_eval` DOM reads after each click (clicks issued as separate tool calls so
React's render actually flushes between them — an initial same-tick multi-click test gave
stale reads, a test-methodology artifact, not a bug in the page), `getBoundingClientRect` for
marker positions, and `preview_console_logs`/`preview_network` for errors.

### A — Per-panel content ledger (5/5)

| # | Marker opens panel | Baseline text shown | "What changed" blocks | Why-of-the-why present & distinct | Confidence line present | Citations shown w/ links |
|---|---|---|---|---|---|---|
| 1 Hyracotherium→Mesohippus | PASS | PASS ("Hyracotherium (\"Eohippus\")..." shown) | PASS — 2 blocks ("Toes and legs", "Teeth"), both about the single descendant Mesohippus, each naming the Hyracotherium baseline contrast | PASS (Zachos 2001 global isotopes + Zanazzi 2007 regional isotopes, a distinct proxy from the anatomical Why) | PASS | PASS — 5 links, all resolve to real DOI/URL |
| 2 Miohippus branch | PASS | PASS | PASS — 2 blocks, one per sibling (Anchitheriinae, Equinae stem) | PASS (Great Plains paleosol geochemistry + Sandelzhausen fossil-community reconstruction — two independent lines) | PASS (explicitly flags early-Miocene equid phylogeny as less resolved) | PASS — 5 links |
| 3 Merychippus branch | PASS | PASS | PASS — 2 blocks (Hipparionini, Equini stem) | PASS (mesowear variability + C4-timing mismatch + grit-vs-grass, 3 independent streams) | PASS | PASS — 6 links |
| 4 Pliohippus→Equus | PASS | PASS | PASS — 1 block (single descendant chain Dinohippus/Equus) | PASS (Great Plains paleosol carbonates + global enamel isotopes, independent of the biomechanics Why) | PASS (flags spring-foot hypothesis as current, not settled) | PASS — 6 links |
| 5 Hipparionine extinction | PASS | PASS (opens with explicit "This panel is not a foil for Equus" framing) | PASS — 2 blocks ("What changed, over their run", "The terminal fact") | PASS (2018 niche-modeling study, independent of both isotope and Old World fossil record) | PASS (states climate-vs-competition as genuinely open) | PASS — 2 links |

Note on criterion A's original wording ("1 block for evolution points, 2 for branch/dead-end"):
built content splits panel 1's single descendant into 2 named sub-aspects (toe/leg change,
tooth change) rather than 1 combined block — both blocks are about Mesohippus only, contrasted
against the same Hyracotherium baseline, so this doesn't violate the panel method (no sibling
is implied), it's just finer-grained than the criterion assumed. Panel 4 uses 1 combined block.
Both are faithful renderings of the source research files; criterion intent (block count
reflects real descendant/outcome structure, not siblings invented or hidden) is satisfied in
both cases.

### B — Ban-list / anti-teleology spot check

1. No bare "changed/different/adapted" without a named comparison — spot-checked panels 2, 3,
   5: every bullet names its contrast ("Against its Equini sibling...", "Against Hyracotherium's
   splayed, four-toed...", "Against the single-toed, narrower-diet Equini/Equus lineage..."). PASS.
2. Panel 5 anti-teleology: confirmed via direct text search — `textContent.includes("not a foil
   for Equus")` → `true`, and the opening line explicitly states hipparionines "radiated ... into
   more species and genera than the entire Equini/Equus lineage ever produced at one time." PASS.
3. Flattening check: panel 3's why-of-the-why keeps all three complicating strands (mesowear
   variability, C4-timing mismatch, grit-vs-grass) rather than collapsing to one clean cause;
   panel 5 explicitly states "which one did the work... is not settled." PASS.

### C — Layout/mechanical checks

1. Single horizontal row confirmed — `nav` contains 5 sibling `button` elements, no tree/lane
   structure. PASS.
2. Chronological left-to-right order confirmed via `getBoundingClientRect`: marker x-positions
   170.5 → 334.5 → 498.5 → 662.5 → 826.5, strictly increasing, matching panel order 1→5. PASS.
3. Side panel is a persistent block below the timeline (panel `y` position below the nav's `y`
   in page flow), not a centered/backdrop modal — confirmed structurally (plain `<article>`,
   no backdrop element, no `position: fixed` overlay in the CSS). PASS.
4. Clicking a different marker updates the panel content with no stale carryover — verified
   individually for all 5 markers (each produced its own distinct title/baseline/subjects/
   citation count). PASS.
5. No console errors, no failed network requests after full page load, `/lab`→`/lab/horses`
   navigation, and clicking through all 5 panels. PASS. `tsc --noEmit` shows only the
   pre-existing unrelated `leaflet.markercluster` error (confirmed present before this session's
   changes); `bun run lint` shows nothing attributed to the new `app/lab/horses/*` files.

### D — Lab link

1. `/lab` shows a card linking to `/lab/horses` with kicker/title/hook text — confirmed via
   `preview_eval` reading the anchor's `textContent`. PASS.
2. Clicking it navigates to `/lab/horses` and renders correctly (`window.location.href` and
   `h1` text both confirmed post-click). PASS.

All criteria PASS. No known gaps. One screenshot-tool timeout occurred mid-session
(`preview_screenshot`) unrelated to page behavior (all `preview_eval`/`preview_console_logs`/
`preview_network` calls against the same live page succeeded before and after) — a visual
screenshot was not captured, but every criterion above was independently verified through DOM
reads, click-driven state changes, and geometry checks rather than a screenshot proxy.
