# Evolution points: a second nav row for non-branching change

## Direction (Stage 1, confirmed in this session)

The existing "Branch points" row/panel (see `2026-07-04-lineage-branching-and-comparison-
panel.md`) only covers places where a taxon has 2+ children — actual forks. The user pointed
out that plenty of real, interesting change happens on the human spine with **no** branch at
all (their explicit example: Ardipithecus ramidus → Australopithecus anamensis) and wants the
same kind of clickable, reasoned content for those straight, single-parent→single-child
transitions — as a **second row** under "Branch points", offset so a branch-point pill and an
evolution-point pill don't sit directly on top of each other, with horizontal scrolling if the
combined strip needs it.

Confirmed decisions from Stage 1 questions this session:
- **Content style: new authored entries.** Each evolution point gets fresh prose (baseline →
  what changed & why → a dedicated confidence line), following the divergence-panel pattern,
  not a verbatim reuse of the existing per-taxon modal text. The prose is grounded in each
  taxon's *existing* `physicalChange`/`behavioralChange`/`pressures`/`certainty` fields and
  `sourceIds` — no new web research required, since nothing here is a new taxon or a new
  claim, just a baseline-relative reframing of already-sourced facts.
- **Row layout: shared age-positioned timeline.** Both rows position their pills using the
  same `col` field each edge's ancestor taxon already has in the graph (the same mapping the
  existing `eraLabels` row already uses: `x = layout.padX + col * layout.colSpacing`), so the
  nav visually lines up with the graph's actual timeline beneath it. Pills get a deterministic
  collision-avoidance pass (estimate width from label length, push right on overlap) so (a) no
  two pills in the same row overlap and (b) an evolution-point pill is nudged clear of any
  branch-point pill directly above it. The whole two-row strip scrolls horizontally as one unit
  (reusing the existing horizontal-scroll pattern already on `.branchNav`).

## The 4 identified "no known branch" transitions

Derived directly from `data/lineage.json`'s edges: an edge qualifies when its `fromId` taxon
has exactly one outgoing non-gene-flow edge (i.e. it doesn't branch) — every taxon in this
tree already has exactly one incoming edge, so that's the only condition that matters.

| fromId | toId | edge kind |
|---|---|---|
| `ekembo-nyanzae` | `nakalipithecus-nakayamai` | context |
| `ardipithecus-kadabba` | `ardipithecus-ramidus` | candidate |
| `ardipithecus-ramidus` | `australopithecus-anamensis` | candidate (the user's own example) |
| `homo-habilis` | `homo-erectus` | supported |

No other edge qualifies — every other taxon either has 2+ children (already a branch point) or
is a leaf/sibling with no further descendant. This is exhaustive under the rule above, not a
curated subset.

## Data/schema plan

New top-level array in `data/lineage.json`, `evolutionPoints`, one entry per row above:
`{ fromId, toId, label, ancestorBaseline, whatChangedBullet, confidenceNote }` — same shape
family as `Divergence` but singular (`toId` not `siblingIds`, one bullet not a list, no
`additionalContext`/tabs since there's no sibling to contrast against).

New `EvolutionPoint` TS type + `EvolutionPointPanel` component in
`app/evolution-explorer.tsx`, visually matching `DivergencePanel` (same backdrop/panel CSS
classes) but simpler: eyebrow reads "Evolution point" instead of "Branch point · N
strategies", one "Starting point" block (ancestor baseline) directly followed by one "What
changed" block (the single bullet) and the confidence block — no tabs.

## Falsifiable criteria

### A — Per-item content ledger (4 rows)
For each of the 4 evolution points: does clicking its nav pill open the panel (verified via
`preview_click` + `preview_snapshot`, not inferred from code); does the panel show the
ancestor's name + a baseline sentence; does it show exactly one "what changed" bullet that
names what changed **relative to the stated baseline** (not a free-floating trait — same ban
list as the branch panel: no bare "changed"/"adapted" without an object, must say what it let
the animal do differently); does it show a confidence line that specifically addresses
whether this is a genuinely unbroken single lineage vs. an artifact of missing fossils (not
just a restatement of the taxon's existing `certainty` field). FAIL if any sub-item is
missing for a row.

### B — Row layout / offset (mechanical)
1. A second row labeled "Evolution points" (or equivalent) renders directly under the
   existing "Branch points" row.
2. Both rows' pills are positioned using each edge's ancestor `col` (checked via
   `getBoundingClientRect` on each pill vs. the expected proportional x order — pills should
   appear left-to-right in the same chronological order as their `col` values).
3. No two pills in the same row overlap (pairwise `getBoundingClientRect` check).
4. No evolution-point pill's rendered rect overlaps any branch-point pill's rendered rect
   (the actual "offset" ask) — checked pairwise across both rows.
5. The combined nav strip scrolls horizontally (verify a `scrollWidth > clientWidth` and that
   `scrollLeft` changes when scrolled/the existing scroll-left/right buttons are used).
FAIL on any sub-item.

### C — Regression check
Existing "Branch points" row still opens the correct `DivergencePanel` for all 6 clusters
(spot-check 2 of the 6, since full regression was already verified 2026-07-04) and the
existing species `DetailModal` is unaffected. FAIL if either regressed.

## Explicitly out of scope this round
- No new taxa, no new research/sources — this only reframes already-sourced content for 4
  existing edges.
- No change to the on-graph rendering itself (cards/edges/lanes) — this is nav-strip-only,
  same as the 2026-07-04 branch-point work.

## Verification results (2026-07-06)

Checked with the app running (`bun run dev`) via browser preview: accessibility snapshot,
`preview_click` + DOM reads for panel content, `getBoundingClientRect` pairwise-overlap checks
across both nav rows, `preview_screenshot`, and `preview_network`/console error checks.

### A — Per-item content ledger (4/4)

| fromId → toId | Pill opens panel | Ancestor name + baseline shown | One "what changed" bullet, names comparison point | Confidence line addresses unbroken-lineage question specifically |
|---|---|---|---|---|
| ekembo-nyanzae → nakalipithecus-nakayamai | PASS (clicked, dialog found) | PASS ("Starting point · Ekembo nyanzae" + baseline sentence) | PASS ("Nakalipithecus **kept** Ekembo's arboreal habit but **shifted** into drier woodland and **added** thick-enamelled molars" — named against the stated baseline) | PASS ("no continuous fossil sequence links them... an unsampled branch hidden in that gap can't be ruled out") |
| ardipithecus-kadabba → ardipithecus-ramidus | PASS | PASS ("Starting point · Ardipithecus kadabba" + baseline sentence) | PASS ("Ramidus turned kadabba's tentative signals into a genuine mosaic body... pushed kadabba's already-reduced canine dimorphism much further") | PASS ("rests on very sparse kadabba material... a reasonable inference from continuity rather than a proven parent-child fossil sequence") |
| ardipithecus-ramidus → australopithecus-anamensis (user's example) | PASS | PASS ("Starting point · Ardipithecus ramidus" + baseline sentence) | PASS ("Anamensis gave up ramidus's climbing/walking compromise... while its jaws and teeth stayed just as large and primitive as ramidus's") | PASS ("no single fossil trail physically connects the two... a currently unknown side branch... can't be excluded") |
| homo-habilis → homo-erectus | PASS | PASS ("Starting point · Homo habilis" + baseline sentence) | PASS ("Erectus dropped habilis's leftover climbing anatomy entirely... scaled habilis's brain-over-teeth bet much further") | PASS ("Homo erectus is itself a broad grade... treat this as the best-supported reading of a real but incompletely sampled transition") |

All 4/4 rows PASS with no sub-item failures. No bullet uses a bare "changed"/"adapted" without
naming what it let the animal do differently or what it's contrasted against.

### B — Row layout / offset (mechanical)

1. Second row labeled "Evolution points" renders directly under "Branch points" — confirmed in
   accessibility snapshot (`BRANCH POINTS` / `EVOLUTION POINTS` as adjacent static text) and
   screenshot.
2. Pills positioned by `col` — confirmed both rows render left-to-right in the same
   chronological order as their `col`/age values (9 Ma → 400 ka for branch row; 9.9 Ma → 1.9 Ma
   for evolution row).
3. No same-row overlap — pairwise `getBoundingClientRect` check across all 6 branch pills: **0
   overlaps**; across all 4 evolution pills: **0 overlaps**.
4. No cross-row overlap — pairwise check of all 6 branch pills against all 4 evolution pills:
   **0 overlaps** (verified both at initial scroll position and after scrolling the strip
   ~700px; screenshot confirms visually distinct, non-touching rows at both scroll positions).
5. Horizontal scroll — the combined strip's track width (computed from the widest pill's
   `col`-based position, ~3050px+ at these labels) exceeds the visible nav width; scrolling the
   nav's scroll container moves both rows together (confirmed via direct `scrollLeft` set +
   screenshot showing both rows shifted identically).

All 5 sub-items PASS.

### C — Regression check

Spot-checked 2 of 6 branch-point clusters: "The gorilla/chimp split" pill still opens the
correct `DivergencePanel` (title + 2 siblings confirmed). Clicking an evolution-point panel's
"Starting point" ancestor link correctly closes the evolution panel and opens the full species
`DetailModal` (confirmed: title "Ardipithecus kadabba", evolution panel no longer in DOM).
Escape key closes whichever panel is open (confirmed via dispatched keydown). No console
errors, no failed network requests after a full page reload. **PASS.**

### Extra checks run beyond the written criteria
- `tsc --noEmit`: no new errors (only the pre-existing unrelated `leaflet.markercluster` error).
- `bun run lint`: the only error attributed to `evolution-explorer.tsx` (`set-state-in-effect`
  at the `setTab("changed")` call) is pre-existing code in `DivergencePanel`, confirmed present
  at the same line in `git show HEAD` before this session's edits — not introduced by this change.
- All 4 evolution points individually clicked in sequence (not just the first) and each showed
  the correct ancestor/descendant pairing with no stale content carried over from the previous
  panel (verified via the `key={activeEvolutionPointKey}` remount + fresh DOM reads per click).

All criteria PASS. No known gaps.

## Follow-up (2026-07-06, same day): chronological order was actually broken

User caught a real bug: pills weren't reliably left-to-right by age. Root cause — the original
implementation packed the two rows independently (`packRow` per row) and then, for the
evolution row only, nudged any pill that overlapped a branch pill *directly rightward* past it
(`nudgeBelowRow`). That "push right to dodge a collision" step had no awareness of chronological
order: it could (and did) shove an *older* evolution pill to the right of a *younger* branch
pill purely to avoid a visual overlap, and the cascading re-pack made it worse — e.g. the 9.9 Ma
evolution point ended up rendering to the right of the 9 Ma branch point, and the 4.2/1.9 Ma
evolution points got dragged all the way past the 0.4 Ma branch point.

Verified this by reading real rendered pill positions (`getBoundingClientRect`) sorted
left-to-right against their displayed age text — the sequence was 9, 9.9, 4.5, 3.9, 3.3, 2.0,
0.7, 0.4, **4.2, 1.9**: non-monotonic (increases twice), confirming the bug independent of any
theory about the cause.

**Fix:** replaced the per-row-pack-then-nudge approach with a single shared pack
(`packTimeline`) across both rows' pills at once, sorted purely by each pill's natural `col`-based
position. Cross-checked that `col` order and the displayed-age order agree for all 10 pills
(they do, exactly) before relying on `col` as the sort key. Because every pill's left position is
now set relative to the ONE pill immediately before it in this single true chronological
sequence, no pill — branch or evolution — can ever end up positioned after a chronologically
earlier one, and (as a corollary, not a separate mechanism) no two pills can ever overlap either.

**Re-verified after the fix:**
- Rendered order re-checked via the same `getBoundingClientRect` + displayed-age read: now
  strictly monotonic, 9.9 → 9 → 4.5 → 4.2 → 3.9 → 3.3 → 2.0 → 1.9 → 0.7 → 0.4. **PASS.**
- Pairwise overlap check across all 10 pills: 0 overlaps. **PASS.**
- Re-ran the interaction regression: clicking a branch pill ("The gorilla/chimp split") and an
  evolution pill ("The climbing trade-off gets abandoned") both still open their correct panel.
  **PASS.**
- `tsc --noEmit`: no new errors (same pre-existing unrelated `leaflet.markercluster` error).
- No console errors after reload.
