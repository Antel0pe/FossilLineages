# Grant's Galapagos finches — causal-oscillation lab site

## Direction (from curiosity-build Stage 1)

User wants a new `app/lab/` site built around Peter & Rosemary Grant's decades-long study of
Darwin's finches on Daphne Major — real, verified per-year trait data (beak length, beak
depth, body mass) plotted as line graphs, with the graph itself divided into colored sections
that each correspond to a real causal event (a drought, an El Niño flood, arrival of a
competing species). Colors repeat across graphs when the underlying cause is the same/similar,
so a visitor can visually pattern-match "this shape of the line, in this event" across all
three traits at once. A right-hand panel shows a short blurb for whichever section is
currently active — "El Niño reduced pressure on beak size because small seeds became abundant"
— with a link to the source paper. Clicking a colored section on any graph switches the panel
to that section's blurb (this is the finalized interaction model — the user considered and
rejected a synced video-scrubber-style playhead in favor of clickable pre-divided sections).

This is a strong match for what's reliably landed with this user before: it's a **causal
chain** (pressure → trait, repeated across decades) and a **detective story from real data**,
not a technical-anatomy description. See `curiosity-reactions.md` distilled signals.

**Scope locked in from Stage 1 answers:**
- Species: **G. fortis** (medium ground finch) on Daphne Major, built first. **G. scandens is
  an explicit planned next step**, not part of this pass — the data model should not make
  adding a second species painful, but building it now is out of scope.
- Time span: **full record, 1973–2012** (the continuous Grant & Grant published series), not
  just the two flagship drought years.
- Metrics/graphs: **beak length, beak depth, body mass** — three line graphs.
- Data sourcing: **published yearly means** as reported in the Grants' peer-reviewed papers,
  each data point traceable to a cited source (not raw bird-by-bird measurements, which aren't
  fully public) — approximation of true values is acceptable, invention is not.

**UX decisions made autonomously (not re-asked, since the interaction model itself was already
fully specified by the user) — flagged here so they're falsifiable, not assumed:**
- Colored sections use a **fixed cause-category → color mapping** shared across all three
  graphs (e.g. drought = one color, El Niño/flood = another, competitor arrival = another,
  "no strong signal / baseline" = neutral gray) — same category, same color, on every graph.
- **Default state on page load**: the earliest (leftmost) section is pre-selected and its
  blurb shown, so the panel is never empty before any click.
- Each section's blurb includes a **link to its source paper** (title + link, not just a bare
  citation).

## Falsifiable criteria

Per-item ledger — one row per causal section actually built, filled with the OBSERVED result,
not intent. A "PASS" here requires having read the actual rendered page/DOM, not just the code.

### A. Causal sections (filled during/after research — every row must cite a real paper)

| # | Approx. years | Cause category | Color (must match across all 3 graphs) | Claimed mechanism | Source paper cited | Observed in build | Pass? |
|---|---|---|---|---|---|---|---|
| 1 | 1976-1977 | Drought | TBD | Drought kills small/soft seed producers → large hard seeds dominate → big-beaked birds survive, mean beak size jumps | Boag & Grant 1981 Science (or equivalent) | | |
| 2 | 1980s | Wet reversal | TBD | Wet years → small seeds abundant again → selection favors smaller beaks, partial reversal | Gibbs & Grant 1987 Nature (or equivalent) | | |
| 3 | 1982-1983 | El Niño flood | TBD | Heavy El Niño rains → small-seed plants proliferate → reduced pressure favoring large beaks | Grant & Grant papers on 1983 El Niño | | |
| 4 | 2003-2005 | Drought + competitor arrival | TBD | Drought + arrival/establishment of larger-beaked G. magnirostris competing for large seeds → strong selection AGAINST large beaks, sharp size drop | Grant & Grant 2006 Science ("Evolution of Character Displacement in Darwin's Finches") | | |
| (more rows added if research surfaces additional real, citable events in 1973-2012 — do not force events into arbitrary year boundaries just to fill color slots) |

### B. Data authenticity spot-check

| # | Check | Method | Observed | Pass? |
|---|---|---|---|---|
| 1 | At least one plotted year's value for each of the 3 metrics matches (within reasonable read-off tolerance) a number/figure actually printed in a cited paper | Pick 2 random years per metric, open the cited source, confirm the value is consistent with what's reported there (table, text, or figure) — not invented to look plausible | | |
| 2 | No plotted data point exists for a year with no real underlying source support | Spot check 2 more random points; confirm each traces to *a* cited paper's reported data for that year, not interpolated without disclosure | | |
| 3 | If any point is interpolated/estimated (e.g. reading off a published figure rather than a table) rather than an exact reported number, this is disclosed somewhere (e.g. a methodology note), not presented as exact-to-the-decimal | Read the page for a data-provenance note | | |

### C. Interaction & UI

| # | Requirement | Method | Observed | Pass? |
|---|---|---|---|---|
| 1 | Page exists and loads with 3 line graphs (beak length, beak depth, body mass) rendered, each spanning 1973-2012 | Load page in browser, screenshot | | |
| 2 | Each graph is visibly divided into colored sections aligned to the causal events in table A | Screenshot + inspect DOM for section boundaries | | |
| 3 | Same cause category = same color on all 3 graphs (e.g. the 1977 drought band is the same color on the beak-length graph as on the body-mass graph) | Inspect rendered color/fill values across all 3 graphs for matching sections | | |
| 4 | Clicking a colored section on ANY of the 3 graphs updates the side panel to that section's blurb | `preview_click` each section at least once across at least 2 of the 3 graphs, screenshot panel after each click | | |
| 5 | Side panel blurb text states the real-world event + the mechanism (cause → pressure → trait change), not just a date range | Read rendered panel text per section | | |
| 6 | Side panel includes a working link to the cited source paper for the active section | Click/inspect link `href`, confirm it resolves to a real paper (DOI, journal page, or equivalent — not a dead/placeholder link) | | |
| 7 | Panel is not empty on first load (some section pre-selected) | Load page fresh, screenshot before any click | | |
| 8 | Page is reachable from the site (linked from `/lab` index), not an orphan route | Check `app/lab/page.tsx` entry + click through from `/lab` | | |
| 9 | Layout holds at a narrow (~380px) viewport — graphs and panel don't overlap/cut off | `preview_resize` to mobile width, screenshot | | |
| 10 | `bun run build` succeeds with no new errors attributable to this page | Run `bun run build` | | |

## Explicit non-goals
- G. scandens / two-species comparison is NOT part of this build (explicit next step, per
  Stage 1 answer) — but the data structure should be shaped so adding a second species'
  series later doesn't require a rewrite.
- No synced video-scrubber/playhead — that design was explicitly considered and dropped by
  the user in favor of clickable pre-divided sections.
- No charting library dependency unless one is already in `package.json` (it currently is
  not) — build the line graph as inline SVG consistent with the rest of the codebase.
