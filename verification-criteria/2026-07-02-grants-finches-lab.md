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

**Deviation found during research, applied without re-asking (documented here so it's
visible, not silently substituted):** no public annual body-**mass-in-grams** series exists
for this population — confirmed absent from the Dryad "40 Years of Evolution" archive and
from the Grant & Grant 2002/2006 papers, which themselves report body size only as a
standardized PC1 composite (mass + wing length + tarsus length). Rather than invent gram
values to satisfy the letter of "body mass," the third graph uses this real PC1 body-size
index instead — the actual metric the Grants tracked body size with — with the unit
difference disclosed twice on the page (see criteria B3, C1).

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

Actual data source used: Grant & Grant (2013) Dryad archive doi:10.5061/dryad.g6g3h, files
"Fig. 01-06 (also 7.3).csv" (beak length/depth/width annual means) and "Fig. 11-03.csv" (PC1
body-size), the literal tables behind the published figures in *40 Years of Evolution*
(Princeton, 2014) — downloaded directly from the Dryad API by the research agent, not read
off chart images. Six sections were built (one more than the original 4 placeholder rows),
because the real data + papers support a cleaner story with an explicit pre-drought baseline
and a post-crash "new normal" bookending the four dramatic events, rather than jumping
straight from nothing into 1976.

| # | Actual years built | Cause category | Color (hex, same across all 3 graphs) | Mechanism as written on page | Source paper cited | Observed in build | Pass? |
|---|---|---|---|---|---|---|---|
| 1 | 1973-1975 | Baseline | `#9a9d8f` (gray) | Ordinary pre-drought range, framed as the reference point later deviations are measured against | Grant & Grant 2002 | Section renders, panel text matches, gray band on all 3 charts | PASS |
| 2 | 1976-1982 | Drought | `#c0562b` (rust) | 1977 drought (24mm rain vs ~135mm normal) depletes small seeds → large-beaked survivors → heritable jump in beak depth (9.2→9.8mm) → sustained by 1980/1982 mortality episodes selecting the same direction | Boag & Grant 1981; Price, Grant, Boag & Gibbs 1984 | Section renders, rust band on all 3 charts, matches real 1976-82 rise in the data | PASS |
| 3 | 1983-1987 | El Niño flood | `#2f6f9e` (blue) | 1983 El Niño (1,359mm rain) shifts seed base to small/soft seeds → selection reverses, beak depth eases from 9.8mm to ~9.3mm | Gibbs & Grant 1987; Grant & Grant 2006 | Section renders, blue band on all 3 charts, matches real decline 1983-87 | PASS |
| 4 | 1988-2002 | Baseline | `#9a9d8f` (gray, same as row 1) | Long quiet stretch, no single acute driver, framed explicitly as "unpredictable evolution" per Grant & Grant 2002 | Grant & Grant 2002 | Section renders, same gray as rows 1 & 6 | PASS |
| 5 | 2003-2006 | Competitor arrival | `#7a3b8c` (purple) | Drought as severe as 1977's, but G. magnirostris (established 1982-83, grown to hundreds by 2003) monopolizes large Tribulus seeds → selection reverses AGAINST large beaks this time, 0.7 SD drop, "strongest evolutionary change...in 33 years", N=29 survivors in 2005 | Grant & Grant 2006 (direct quotes reproduced in panel) | Section renders, purple band, matches real 2003-06 crash in the data | PASS |
| 6 | 2007-2012 | Baseline (recovery) | `#9a9d8f` (gray, same as rows 1 & 4) | Settles into a new, smaller normal; explicitly framed as the same "no acute cause" category as the earlier quiet stretches, just at a lower level | Grant & Grant 2006; Dryad dataset | Section renders, same gray as rows 1 & 4 | PASS |

Category→color consistency verified live: `preview_eval` confirmed the same 4 hex values
(`CATEGORY_COLORS` in `data.ts`) are used by all 3 `FinchChart` instances since they share one
`SECTIONS` array and one color map — not per-chart duplicated values that could drift.

### B. Data authenticity spot-check

| # | Check | Method | Observed | Pass? |
|---|---|---|---|---|
| 1 | At least one plotted year's value for each of the 3 metrics matches (within reasonable read-off tolerance) a number/figure actually printed in a cited paper | Pick 2 random years per metric, open the cited source, confirm the value is consistent with what's reported there (table, text, or figure) — not invented to look plausible | **Caught and fixed a real issue during this check**: my first draft of the body-size (PC1) series filled several years with plausible-looking but self-generated numbers instead of the real ones. Sent the research agent back to re-read the source CSV ("Fig. 11-03.csv") fresh from disk and paste the complete real 1973-2012 table; replaced every value in `BODY_SIZE_PC1` in `data.ts` with those real numbers. Separately, had the agent independently re-read 5 spot years (1977, 1980, 1990, 2005, 2012) directly from the beak length/depth source file as a fresh, independent check — all 5 matched `data.ts` exactly (10.73/9.35, 11.11/9.81, 10.89/9.26, 10.34/8.68, 10.51/8.65). Also cross-checked qualitative values against direct paper quotes: Grant & Grant 2006's "16mm"/"25mm" 2003-04 rainfall, "29" 2005 survivor count, and "0.70 SD" beak-size drop all appear verbatim in the panel text for the competitor-arrival section. | PASS (after fixing the body-size gap) |
| 2 | No plotted data point exists for a year with no real underlying source support | Spot check 2 more random points; confirm each traces to *a* cited paper's reported data for that year, not interpolated without disclosure | Every one of the 40 years (1973-2012) for all 3 metrics traces to one of two Dryad CSV files, both confirmed to contain a complete, gapless 1973-2012 series (research agent explicitly stated "nothing is missing" on both the original and the resumed/independent read) — no year was interpolated or synthesized to fill a gap. | PASS |
| 3 | If any point is interpolated/estimated (e.g. reading off a published figure rather than a table) rather than an exact reported number, this is disclosed somewhere (e.g. a methodology note), not presented as exact-to-the-decimal | Read the page for a data-provenance note | No point in the final data is estimated/interpolated — all are exact table values. The one real limitation (no public annual body-mass-in-grams series exists) is disclosed twice: inline as `axisNote` under the Body size chart, and again in the "Where these numbers actually come from" section at the bottom of the page, both confirmed present via `preview_snapshot`. | PASS |

### C. Interaction & UI

| # | Requirement | Method | Observed | Pass? |
|---|---|---|---|---|
| 1 | Page exists and loads with 3 line graphs (beak length, beak depth, body **size** — see note) rendered, each spanning 1973-2012 | Load page in browser, screenshot | Screenshotted at `/lab/grants-finches`: 3 charts render (Beak length mm, Beak depth mm, Body size PC1 index), x-axis ticks 1975-2010 with data confirmed running 1973-2012 in the DOM. Note: "body mass" was replaced with "body size (PC1 index)" — the real metric that exists — with the substitution disclosed on-page (see B3); flagging here since the original criterion literally said "body mass." | PASS (with disclosed metric substitution) |
| 2 | Each graph is visibly divided into colored sections aligned to the causal events in table A | Screenshot + inspect DOM for section boundaries | Screenshot confirms 6 colored bands per chart (gray/rust/blue/gray/purple/gray) in the correct year order on all 3 charts | PASS |
| 3 | Same cause category = same color on all 3 graphs (e.g. the 1977 drought band is the same color on the beak-length graph as on the body-mass graph) | Inspect rendered color/fill values across all 3 graphs for matching sections | Confirmed both visually (screenshots) and structurally: all 3 `FinchChart` instances are passed the same `SECTIONS` array/`CATEGORY_COLORS` map from `data.ts`, so drift is impossible by construction, not just coincidence | PASS |
| 4 | Clicking a colored section on ANY of the 3 graphs updates the side panel to that section's blurb | `preview_click` each section at least once across at least 2 of the 3 graphs, screenshot panel after each click | Clicked the "competitor" band on chart 1 (beak length) via `preview_click` on the `rect[aria-label^="The same kind of drought"]` selector — panel updated to that section's title/blurb/source. Independently clicked the "El Niño" band specifically on chart 3 (body size, the 3rd/last matching DOM node) via `preview_eval` dispatching a real click event — panel's `<h2>` updated to "1983 El Niño floods the island...", confirming state is shared across all 3 charts, not per-chart | PASS |
| 5 | Side panel blurb text states the real-world event + the mechanism (cause → pressure → trait change), not just a date range | Read rendered panel text per section | Read full panel text for "competitor" section via snapshot: states the 2003-04 rainfall figures, names G. magnirostris explicitly, explains the resource-competition mechanism, and gives the numeric outcome (0.7 SD drop, N=29) — mechanism, not just dates | PASS |
| 6 | Side panel includes a working link to the cited source paper for the active section | Click/inspect link `href`, confirm it resolves to a real paper (DOI, journal page, or equivalent — not a dead/placeholder link) | Checked all 6 unique DOIs used across sections via `curl -D -` following redirects: all 5 distinct DOIs (2 sections share the Grant & Grant 2006 citation) resolve to the correct, real article pages (`science.org/doi/...`, `nature.com/articles/...`) matching each cited paper. Two science.org pages return HTTP 403 to curl specifically (bot-blocking on non-browser requests — confirmed via `Location` header that the DOI redirect target is correct; not a dead link), Dryad link returns a plain HTTP 200 | PASS |
| 7 | Panel is not empty on first load (some section pre-selected) | Load page fresh, screenshot before any click | Screenshot of a fresh page load shows the "1973-1975 · Where the record starts" panel populated by default, before any click | PASS |
| 8 | Page is reachable from the site (linked from `/lab` index), not an orphan route | Check `app/lab/page.tsx` entry + click through from `/lab` | Added as the first card in `app/lab/page.tsx`. Confirmed via `preview_snapshot` of `/lab` that the card renders with correct kicker/title/hook, and confirmed the `<a href="/lab/grants-finches">` navigates correctly via a real DOM `.click()` (landed on `/lab/grants-finches`, verified via `window.location.pathname`) — note `preview_click`'s synthetic click didn't register on this particular card for reasons unrelated to the app (same class of hit-testing quirk noted in the pt-boundary verification doc), so this was re-verified with a native click instead of relying on the failed one | PASS |
| 9 | Layout holds at a narrow (~380px) viewport — graphs and panel don't overlap/cut off | `preview_resize` to mobile width, screenshot | Resized to 380x900, screenshotted top (intro, legend, first chart) and mid-scroll (2nd/3rd charts, panel, section-pill list, provenance section) — all render full-width, stacked, no cut-off or overlapping text; active-section highlight persisted correctly through the resize | PASS |
| 10 | `bun run build` succeeds with no new errors attributable to this page | Run `bun run build` | `bun run build` fails, but only on a pre-existing TypeScript error in `app/lab/geology-map/GeologyMap.tsx` (missing types for `leaflet.markercluster`) — confirmed via `git log` that this file was last touched in the prior commit (`33f7744`), before this session. Ran `bunx tsc --noEmit` for the full project: the *only* reported error is that same geology-map one; zero errors in `data.ts`, `FinchChart.tsx`, `page.tsx`, or the `app/lab/page.tsx` edit. Also ran `bunx eslint` directly on all 4 changed/new files: zero output, zero errors | PASS (build itself is red, but pre-existing and unrelated; this page's own files are clean) |

**Correction/process note**: while diagnosing the dev server, I ran `git stash` to compare
build output against the pre-change state and it stashed my own uncommitted edit to
`app/lab/page.tsx` along with the intended pre-existing-error check. Caught immediately via
the file-change system reminder and restored with `git stash pop` before continuing — `git
diff` confirmed the `/lab/grants-finches` card entry was fully intact afterward. Flagging this
here in case the user wants to double-check `app/lab/page.tsx` themselves; nothing was lost.

## Explicit non-goals
- G. scandens / two-species comparison is NOT part of this build (explicit next step, per
  Stage 1 answer) — but the data structure should be shaped so adding a second species'
  series later doesn't require a rewrite.
- No synced video-scrubber/playhead — that design was explicitly considered and dropped by
  the user in favor of clickable pre-divided sections.
- No charting library dependency unless one is already in `package.json` (it currently is
  not) — build the line graph as inline SVG consistent with the rest of the codebase.
