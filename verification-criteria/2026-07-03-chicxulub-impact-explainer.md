# Chicxulub asteroid impact — before / during / after evidence explainer

## Direction (from curiosity-build Stage 1)

User wants an explainer for the **Chicxulub asteroid impact** (K–Pg boundary, ~66 Ma) built
around **evidence sources**, each shown across three phases — **before** the impact, **during/at**
the impact, and **after** — so a visitor can see not just *that* the world changed but *why* it
changed, read as a detective story from real evidence. The organizing principle the user cares
about most: each evidence source should **explain a distinct causal "why"** (why we know it was
an asteroid, why life died, why the oceans collapsed, why some survived, how things recovered) —
the *why* is the important part, not a catalogue of what died.

This is a strong match for what reliably lands with this user (see `curiosity-reactions.md`):
**causal chains** (cause → mechanism → outcome) and the **"how we know" detective angle** (iridium
fingerprint, spherules-in-gills), not technical description for its own sake.

## Source selection — locked set (from Stage 1 answer)

User selected **Core 4 + Tanis + dinosaurs = 6 sources**, with an explicit instruction:
**a light foreword / inline caveat flagging Tanis (and any other contested claim) as not
100% settled** — concisely stating why it might not be fully accurate, rather than presenting
contested science as fact.

### Source ledger — evaluated against the user's 3 selection criteria

The three selection criteria (from the user's request):
- **C1 — Data before/during/after exists, is online, and is accessible.**
- **C2 — Explains an aspect of the impact NOT overlapping with the other sources.**
- **C3 — Explains something interesting about *why* — a mechanism, not just "things died".**

> Note: C1 (data actually online & accessible) is asserted here from prior knowledge at my normal
> confidence; it is **to be positively verified per-source during the Stage 3 build** (find a real,
> linkable source for each phase of each source before writing its panel). This table is the
> contract for *what* to source, not proof it's already sourced.

| # | Source | Owns (distinct aspect, C2) | The *why* it explains (C3) | Before → During → After data (C1) | Contested? |
|---|---|---|---|---|---|
| 1 | **Boundary clay layer** — iridium spike + shocked quartz + spherules/tektites | The *fingerprint*: proof it was an extraterrestrial impact + where it hit | **Why we blame an asteroid at all** — iridium is rare in crust, abundant in asteroids; spherule-thickness gradient points to Yucatán | Before: normal marine limestone. During: the mm-thick iridium/spherule clay. After: return to normal sedimentation. Alvarez 1980; many published boundary sections | No — well established |
| 2 | **Impact winter** — soot/charcoal + sunlight & temperature proxies | The *global kill mechanism* — darkness, photosynthesis shutdown, cold snap | **Why life died worldwide**, not just near the crater — sunlight blocked → food chains starve from the base | Before: baseline climate. During: soot spike / darkness. After: temperature recovery curve. Published soot/PAH + proxy-temperature records | Magnitude/duration debated, but the mechanism itself is mainstream |
| 3 | **Marine microfossils** — planktonic foraminifera | The *ocean collapse* — highest-resolution death-and-recovery curve that exists ("Strangelove ocean") | **Why the seas crashed** — plankton (base of marine food web) collapse starves everything above | Before: diverse assemblages. During: abrupt collapse at boundary. After: low-diversity survivors → recovery. Ocean-drilling data openly archived | No — gold-standard record |
| 4 | **Pollen & fern spike** — terrestrial plants | The *land collapse AND recovery* — disaster taxa recolonizing scorched ground | **Why/how forests came back** — ferns as first responders after the die-off; the aftermath + a genuine hope note | Before: diverse angiosperm pollen. During/just-after: the "fern spike". After: forest recovery. Well-published in many basins | No — classic, well-supported |
| 5 | **Dinosaur / vertebrate record** (Hell Creek) | The *charismatic what-died* + **survival selectivity** | **Why some survived** — small, burrowing, aquatic, generalist lived; large & specialized didn't | Before: diverse dinosaur fauna. During: extinction. After: mammal + bird radiation. Hell Creek widely published | Mildly — the "3-metre gap"/completeness-of-extinction debate → flag in foreword |
| 6 | **Tanis** (North Dakota) | The *minutes-to-hours after* — a snapshot of the impact day itself | **Why it was sudden & catastrophic** — spherules in fish gills, seismic seiche deposit: death within hours, not a slow decline | Before/after less relevant; its value is the "during" freeze-frame. Depositional-Cretaceous—Palaeogene site; some findings peer-reviewed, some still contested/unpublished | **Yes** — single site, some claims contested → **must carry the caveat the user asked for** |

## Falsifiable build criteria (Stage 3 will fill the Observed/Pass columns)

Per-item ledger — one row per source, plus page-level criteria. A PASS requires reading the
actual rendered page (screenshot / DOM), not just that the code compiles.

### A. Per-source content (one row per source above, filled during build)

Built as `app/lab/chicxulub/data.ts` (`EVIDENCE` array) — one entry per source, each with
`phases.before/during/after` text arrays, a `why` array, and `sourceIds` pointing at real
citations in `SOURCES`.

| # | Source | Real sourced data/link for **before** | for **during** | for **after** | Distinct *why* stated in words (mechanism, not just dates) | Observed | Pass? |
|---|---|---|---|---|---|---|---|
| 1 | Boundary clay layer | Normal pre-boundary limestone/chalk sedimentation | Global iridium spike (100-10,000x background) + shocked quartz + spherules; 113 iridium localities, 28 shocked-quartz, 54 spherule (Alvarez 1980; Goderis et al 2021 Sci Adv) | Ordinary sedimentation resumes, fauna changed | "Why we blame an asteroid at all" — iridium+shocked-quartz+spherules together is the forensic fingerprint of impact, not volcanism | Read via `preview_snapshot`, panel renders all 3 phases + why block | PASS |
| 2 | Impact winter | Warm Cretaceous greenhouse baseline | Soot (7.5×10¹⁴–2.5×10¹⁵ g), sunlight cut 80-85%, cooling 10-16°C, photosynthesis shutdown ~1-2yr (Junium et al 2020 PNAS; Senel et al 2023 Nat Geo) | Sunlight/temp recover as dust settles, but food webs already collapsed | "Why the dying was global" — explains why die-off wasn't limited to the impact site | Read via snapshot, caveat block renders (duration debated) | PASS |
| 3 | Foraminifera | Diverse Cretaceous assemblages (El Kef, Tunisia) | Near-total species collapse at boundary, "Strangelove Ocean" of 1-2 opportunist survivors (Keller 1988) | Shelf productivity ~400k yr later; deep/specialist diversity recovers much slower (Yale 2019; PMC8220277) | "Why the oceans crashed" — plankton is food-web base, explains collapse above it | Read via snapshot | PASS |
| 4 | Pollen & fern spike | Diverse angiosperm pollen pre-boundary | Pollen diversity crashes, dominated by fern spores (pioneer/disaster taxa) | Angiosperm diversity gradually returns (~1,000-71,000 yrs depending on site) (NYBG; Wikipedia) | "Why/how the land recovered" — ferns as first responders, distinct from ocean-recovery story | Read via snapshot, marked `debated` re: how universal the pattern is | PASS |
| 5 | Dinosaur record | Diverse Hell Creek fauna, large + small | All non-avian dinosaurs vanish; lizards/snakes show large-bodied near-total loss vs small-bodied survival (Longrich et al 2012 PNAS) | Mammal/bird radiation into vacated niches | "Why some survived" — small/generalist could shelter & scavenge through the dark years from source 2 | Read via snapshot, caveat re: dinosaur-specific taphonomic gap | PASS |
| 6 | Tanis | Ordinary Hell Creek river channel (n/a as before-state, disclosed) | Seismic seiche (~M10-11 eq, <1hr arrival) buries fish alive, spherules in ~50% of gills examined (DePalma et al 2019 PNAS) | Instantly buried, undisturbed since — explicitly disclosed as "not really an after story" | "Why it was sudden" — a freeze-frame timestamp tying the crater to a specific afternoon, distinct from every other source's slower timescale | Clicked via `preview_eval`, confirmed via DOM that all 3 phase texts + why + debated caveat render distinctly (see below) | PASS |

Each row's "why" text is a causal mechanism (cause → pressure → outcome), and does not duplicate
another source's why (C2 — verified by re-reading all 6 `why` arrays side by side, no repeated
mechanism). Interaction verified live: `preview_eval` clicked the Tanis source button, then the
"During" phase tab, and confirmed via `aria-selected` + panel text query that both the source
switch and phase switch independently re-render the correct text (not just the initial "before"
text left stale) — e.g. Tanis "During" panel body read "Seismic waves from the Chicxulub
impact — modeled as equivalent to a magnitude 10–11 earthquake..." matching the authored copy
exactly.

### B. Contested-claim honesty (the user's explicit instruction)

| # | Requirement | Method | Observed | Pass? |
|---|---|---|---|---|
| B1 | A visible foreword/caveat flags Tanis as a single site with some contested/unpublished claims, in plain language, concisely stating why it may not be 100% accurate | Read rendered page | Top-of-page "A note on certainty" box names Tanis explicitly plus the fern spike and dinosaur pattern as debated; Tanis's own panel additionally carries a dedicated "Where this is debated" block naming the specific issue (dinosaur-remains claims less peer-reviewed; Keller's reworked-spherule critique) | PASS |
| B2 | Any other non-settled claim used (e.g. dinosaur "3-metre gap" / completeness debate, exact impact-winter duration) is likewise flagged, not stated as settled fact | Read rendered text of sources 2 & 5 | Impact-winter panel's caveat flags duration/severity as still-refined; dinosaur-record panel's caveat flags the taphonomic under-representation of small dinosaurs specifically (the real substance of the "3-metre gap"-style debate); fern-spike panel flags pattern universality as debated | PASS |
| B3 | Settled sources (iridium, foraminifera, fern spike-as-phenomenon) are NOT hedged into false uncertainty — the caveat is targeted, not blanket | Read rendered text | Boundary-clay and foraminifera sources have no `caveat` block at all (rendered `confidence: "settled"`, no debated tag on their source buttons); fern spike carries a narrow caveat about pattern universality, not about whether the spike itself is real | PASS |

### C. Structure / UX

| # | Requirement | Method | Observed | Pass? |
|---|---|---|---|---|
| C1 | One explorable page (consistent with the existing `app/lab/` pattern — inline SVG-free, no new charting dep), reachable from the site (not an orphan route) | Load page, click through from index | Built at `app/lab/chicxulub/page.tsx`; added as first card in `app/lab/page.tsx`; confirmed via `preview_eval` that `a[href="/lab/chicxulub"]` exists on `/lab` with correct kicker/title/hook text | PASS |
| C2 | Each of the 6 sources is presented across the three phases (before / during / after), with the phase switchable via a clickable toggle so text ties to the visual — the format that has reliably beaten static prose for this user | Interact via `preview_eval`, confirm text changes | Clicked the Tanis source button then the "During" tab; confirmed via `aria-selected` + panel text that both source and phase switches independently re-render distinct, correct text | PASS |
| C3 | Each source's panel states its distinct causal *why* (per table A) | Read rendered panels | Every entry has a non-empty `why` array rendered under a "Why this happened" kicker; six distinct mechanisms confirmed (fingerprint / global kill / ocean base collapse / land recolonization / size-selective survival / sudden-vs-slow timestamp) | PASS |
| C4 | `bun run build` succeeds with no new errors attributable to this page | Run `bun run build`; also `bunx tsc --noEmit` and `bunx eslint` on changed files directly | `bun run build` fails only on the pre-existing `app/lab/geology-map/GeologyMap.tsx` `leaflet.markercluster` type error (present before this session, confirmed via prior finches verification doc noting the same issue). `bunx tsc --noEmit` output has zero lines outside that file. `bunx eslint app/lab/chicxulub app/lab/page.tsx` returned zero output | PASS (build red only on pre-existing unrelated error) |
| C5 | Layout holds at ~380px width | `preview_resize` to 380x900, inspect DOM widths | `preview_screenshot` was unreliable in this environment (repeated timeouts unrelated to the app — confirmed via `preview_console_logs` showing no errors, just HMR/analytics noise), so verified via `preview_inspect`/`preview_eval` instead: `body` width exactly 380px with `overflow-x: visible` (no horizontal scroll), and `.layout`/`.sourceList`/`.panelColumn`/`.panel` all measured 352px (single-column, correctly stacked under the 800px breakpoint) | PASS (verified via DOM measurement, not screenshot, due to tool timeout) |

### D. Link accessibility spot-check (C1 from the source-selection criteria)

Checked all 17 unique citation URLs with `curl -I -L` (custom User-Agent). 10 returned clean
HTTP 200 (Nature, PMC, NYBG, both Wikipedia pages, Yale News, Smithsonian, Sci Reports).
7 returned 403 with Cloudflare/publisher anti-bot headers (`accept-ch`, `cf_bm` cookies) on
science.org, PNAS DOIs, ScienceDirect, and LPI/Kring — the same bot-blocking pattern already
noted and accepted in the finches verification doc (real pages, blocked to non-browser clients,
not dead links). One link, the original Keller 1988 PDF at `geoweb.princeton.edu`, returned a
genuine Apache 404 (not a bot-block signature) — this was caught and fixed by swapping the
citation URL to the paper's ScienceDirect abstract page instead.

## Explicit non-goals / notes
- Not spawning deep-research agents (user's explicit instruction). Sourcing during build should
  be targeted lookups per source, not a fan-out research swarm.
- Deccan Traps volcanism deliberately **excluded** — it's a scientific debate (co-cause), which
  muddies the clean asteroid causal spine rather than adding a clean distinct *why*.
- Format details in section C are **proposals pending user confirmation**, not locked.
