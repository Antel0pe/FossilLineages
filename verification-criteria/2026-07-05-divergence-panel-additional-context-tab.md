# Branch-point divergence panels: "Additional context" tab

## Direction (Stage 1, confirmed)

The divergence side panels (added 2026-07-04) are the single most-loved artifact in the
project — explicit "really really like" reaction. This session was a long breadth-first
brainstorm on what to add next without diluting that. Ideas explicitly ruled out along the
way (full list + reasoning logged in the `curiosity-build` skill's `curiosity-reactions.md`,
2026-07-05 entry): more species/branch points (data-limited, verified against the actual
dataset), more precision on existing bullets (already-established ceiling), better UI on its
own, named-individual forensic stories, discovery-luck stories, a "living map" visualization,
and outright climate-causation claims (verified live to still be genuinely contested among
specialists — turnover-pulse vs. variability-selection vs. climate-stability hypotheses all
actively compete; not just under-simplified).

What survived: **environmental/ecological context** (what else shared a species' world, what
the actual landscape looked like) — but only the subset of it that clears a specific bar
worked out collaboratively this session, below. This is NOT a new feature/view of its own —
it's a **second tab inside the existing `DivergencePanel`** component, alongside the current
content (renamed "What changed" for clarity), labeled **"Additional context."**

## The content bar (what belongs in the new tab)

A fact belongs in "Additional context" for a given sibling **only if** it does at least one
of the following relative to that sibling's *existing* `physicalChange` / `behavioralChange`
/ `pressures` / contrast-bullet text:

1. **Explains why this path and not some other plausible one** — extending the
   contrastive move the data already makes sibling-to-sibling (e.g. Paranthropus boisei's
   bullet already says its strategy was "the opposite from sibling Homo habilis, which
   invested in tools instead") to **external** competitors/ecological factors, not just
   sibling divergence. Example shape (illustrative, not pre-verified): if a competing species
   already dominated a food niche, that's a reason this lineage's own path went the direction
   it did rather than the alternative.
2. **Adds magnitude, trajectory, or comparable detail to an already-named pressure** that
   goes beyond restating its existence — e.g. a pressure already named as "patchy woodland
   rewarded ground travel" gains real information if the actual habitat was measurably
   *shrinking* over time (an escalating pressure) versus a *static* backdrop the species
   simply settled into. Not limited to only "magnitude" and "trajectory" specifically — any
   comparable axis of new information about the named pressure counts, as long as it isn't
   just a restatement.

A fact must be **excluded** if it only re-supplies evidence for a conclusion the existing
"What changed" content already states in simpler words (e.g. adding "the site shows sparse
woodland cover" when the card already says "needed to move between sparse tree patches" —
that's a footnote for an existing claim, not new information).

**Stopping condition (ceiling, reaffirmed, not loosened):** stop at one causal link. Do NOT
explain the cause of an already-named pressure itself (why the ice age happened, why the
forest fragmented in geological/climatic terms). Adding the trajectory/magnitude of the SAME
named pressure is allowed; explaining *why that pressure arose* is not — that's the next link
down and goes back over the ceiling established in `feedback_causal_depth_ceiling.md`.

**Situational, not uniform.** Not every sibling needs an "Additional context" entry — this
mirrors the existing `pressures` array, which already varies 1–2 items per taxon in the real
data without reading as broken or inconsistent. An entry only appears where real,
sourced evidence clears the bar above. Padding for symmetry is explicitly disallowed.

## UI mechanics (default call — confirm/correct before build)

- The `DivergencePanel` gains a second tab, "Additional context," alongside the existing
  content (labeled "What changed").
- **A divergence cluster only shows the "Additional context" tab at all if at least one of
  its siblings has a real entry.** If zero siblings in a cluster clear the bar, no second tab
  renders for that cluster — no empty tab, no placeholder text. (This is a default call, not
  yet confirmed with the user — flag for correction before/during implementation.)
- Within a rendered "Additional context" tab, only siblings with a real entry are listed
  (not padded with "nothing found here" rows for the rest).
- Switching tabs does not close the panel; Escape still closes the whole panel from either
  tab (parity with current behavior).
- "What changed" tab content is pixel-for-pixel the same content currently verified in
  `2026-07-04-lineage-branching-and-comparison-panel.md` — this is additive, not a rewrite.

## Falsifiable criteria

### A — Per-sibling ledger (16 rows: every sibling across all 6 clusters)
Clusters: nakalipithecus→{gorilla, chimpanzee}; anamensis→{afarensis, platyops};
afarensis→{africanus, garhi, boisei, habilis, rudolfensis}; africanus→{robustus, sediba};
erectus→{floresiensis, middle-pleistocene-homo}; middle-pleistocene-homo→{sapiens,
neanderthalensis, denisovans}.

For each sibling: does an "Additional context" entry exist (expected: situational, not all
16)? If yes — the fact itself, its source/citation, which bar-test it satisfies (path-not-
taken / magnitude-trajectory-other), and an explicit confirmation of which existing sentence
it is NOT a restatement of. If no — log what was searched and why nothing sufficiently
evidenced and additive was found (per the project's escape-hatch logging requirement — a bare
"none" is not acceptable).

### B — Ban list per entry (any violation = FAIL for that entry, not a style nitpick)
- Must not restate a fact already present in that sibling's existing card/bullet text.
- Must satisfy at least one of the two content-bar tests above, explicitly named.
- Must not introduce a second causal link beneath an existing one (no explaining why a named
  pressure itself arose).
- Must be sourced — no invented specifics (a rate, a species name, a magnitude must trace to
  a real citation, not be fabricated for narrative texture).

### C — Tab UI mechanics (per cluster that has ≥1 entry)
Verified via browser preview (click + snapshot, not code inspection): tab control renders,
clicking "Additional context" swaps the visible content, clicking back to "What changed"
restores the original content unchanged, Escape closes the panel from either tab state,
clusters with zero qualifying entries show no second tab at all.

### D — Regression check
All 6 nav pills still open their correct cluster; "What changed" tab text matches the
already-verified 2026-07-04 content exactly (diffed, not eyeballed); existing per-species
`DetailModal` unaffected.

## Explicitly out of scope this round
- No new standalone view/page — this only extends the existing `DivergencePanel`.
- No ghost-lineage, gene-flow, named-individual, or discovery-luck content (parked ideas,
  see `curiosity-reactions.md` — not part of this round).
- No climate-causation claims for *why* a pressure arose (ceiling violation by definition).

## Verification results (2026-07-05)

Research was done by 6 parallel subagents (one per cluster), each instructed to use only
real, citable sources and to report "no qualifying fact found" rather than invent one. Two
agents' first runs were lost to a process interruption and were re-run from scratch. Every
candidate fact that survived was independently spot-checked afterward (via direct
`WebSearch`, not trusting the subagent's citation at face value) before being written into
the data — this caught one source that needed reframing (see below) and confirmed one
suspiciously recent citation (a paper published 2 days before "today") was real, not a
hallucination.

### A — Per-sibling ledger (16/16 siblings checked)

| Sibling | Cluster | Verdict | Fact / reason for "none" | Test | Source |
|---|---|---|---|---|---|
| Gorilla | apes | NO QUALIFYING FACT | Checked Miocene ape competitors, monkey/ape competitive-exclusion hypothesis, quantified forest-loss rates — nothing both specific to this split and non-restating. | — | — |
| Chimpanzee | apes | NO QUALIFYING FACT | Checked Late Miocene hominin/ape competitors, predator-interaction studies, fragmentation-rate papers — only qualitative restatements found. | — | — |
| Australopithecus afarensis | anamensis split | **QUALIFIES** | A newly named giant crocodile, *Crocodylus lucivenator* ("Lucy's hunter"), identified from the same Hadar deposits/time window as afarensis — a real named apex predator at its water sources, not covered by the existing gait/diet text. | Closest to (A); a named daily danger rather than a strict "path not taken" contrast — noted as a slightly broader reading of the test, not a strict A/B fit. | Brochu et al. 2026, independently corroborated across Sci.News/ASU News/phys.org/ScienceDaily despite being a very fresh (March 2026) paper. |
| Kenyanthropus platyops | anamensis split | **QUALIFIES** | Real isotope measurements exist for platyops (contradicting the taxon's own "essentially no direct evidence of diet" line — see correction below); a co-existing giant primate, *Theropithecus brumpti*, already held the grass-specialist end of the same range. | (A), causal "closed off" language deliberately softened to "may reflect" per the research agent's own flagged caveat that this framing is an inference from two isotope datapoints, not the source paper's explicit claim. | Wynn et al. 2013 (platyops's own isotope data) + Cerling et al. 2013 PNAS (*T. brumpti* diet). |
| Australopithecus africanus | afarensis's five | NO QUALIFYING FACT | Checked baboon dietary overlap, Sterkfontein carnivore taphonomy, Taung-child eagle-predation evidence — the eagle-predation source itself disclaims a demonstrated behavioral effect, so it fails the bar. | — | — |
| Australopithecus garhi | afarensis's five | NO QUALIFYING FACT | The most promising lead (Njau et al. 2018, PNAS) turned out to *cast doubt* on the existing butchery-mark claim rather than add new information — rejected as out of scope, not a qualifying addition. | — | — |
| Paranthropus boisei | afarensis's five | NO QUALIFYING FACT | Checked Dinofelis predation, *Theropithecus oswaldi* dietary overlap, C4-grassland-contraction papers — all either about boisei's *extinction* (~1 Ma) rather than its adaptive path's formation, or unquantified. | — | — |
| Homo habilis | afarensis's five | NO QUALIFYING FACT | A real *Pachycrocuta* (giant hyena) absence finding exists but is dated/attributed to early *H. erectus*, not confidently to habilis — rejected rather than misattributed. | — | — |
| Homo rudolfensis | afarensis's five | NO QUALIFYING FACT | Checked Turkana Basin sympatry, lakeshore competition, a 2024 footprint paper — none name a competitor or quantified pressure specific to rudolfensis. | — | — |
| Paranthropus robustus | africanus split | **QUALIFIES** | Isotope data at Swartkrans show a giant contemporary baboon, *Theropithecus oswaldi*, already committed to full-time grass-grazing, while robustus itself stayed mixed-diet despite comparable chewing hardware. | (A) | Lee-Thorp, van der Merwe & Brain 1989. |
| Australopithecus sediba | africanus split | NO QUALIFYING FACT | Checked Malapa death-trap taphonomy (rejected — about the death event, not a lineage-level pressure), diet isotopes (rejected — restates existing dietary-shift text), regional climate context (rejected — unquantified), cross-species competition (rejected — only a generic, non-species-specific hypothesis). | — | — |
| Homo floresiensis | erectus split | **QUALIFIES** | A 2026 Liang Bua taphonomy study: Komodo dragons had first access to Stegodon carcasses; floresiensis's cut marks are confined to scraps — scavenging, not primary access. | (A) | Science Advances, July 3, 2026 (independently verified real via WebSearch — corroborated by CNN, National Geographic, Live Science, Sci.News, Gizmodo). |
| Middle Pleistocene Homo | erectus split | **QUALIFIES** | A *Homotherium latidens* bone bearing hominin-made modifications found in the same Schöningen layer as the spears — direct evidence a competing predator shared the site. | (A), reframed after independent verification — the original agent draft over-claimed a "defensive purpose" for the spears and a one-directional "confrontation," which broader literature doesn't support as cleanly; rewritten to the more conservative, well-supported claim (direct physical evidence of shared-site competition). | Serangeli, Van Kolfschoten, Starkovich & Verheijen 2015, Journal of Human Evolution. |
| Homo sapiens | last three-way split | NO QUALIFYING FACT | The most promising lead (sapiens' arrival possibly contributing to *H. naledi*'s disappearance) is explicitly labeled speculative in its own source ("requires more research") — fails the "real, citable" bar. | — | — |
| Homo neanderthalensis | last three-way split | **QUALIFIES** | Cut marks on cave-bear/brown-bear bones at Rio Secco and Fumane (Italy) show Neanderthals actively fought and killed bears, including cubs and mothers, for winter den shelter and meat. | (A) | Romandini et al. 2018, Journal of Archaeological Science. |
| Denisovans | last three-way split | NO QUALIFYING FACT | Checked dispersal-rate data (already covered), Xiahe mandible dating (about arrival timing, not a pressure's magnitude), external-competitor angle (no established Denisovan/erectus interaction) — nothing new that isn't already-used gene-flow content (explicitly off-limits per the research brief). | — | — |

**6 of 16 siblings qualify** (afarensis, platyops, robustus, floresiensis, middle-pleistocene-homo, neanderthalensis) — confirming the situational, not-uniform expectation set in the direction above.

### B — Ban-list check (per qualifying entry)
All 6 entries checked against the ban list: none restate existing card text (each was
cross-checked sentence-by-sentence against the taxon's `physicalChange`/`behavioralChange`/
`pressures` and the existing contrast bullet); none introduce a second causal link beneath an
already-named pressure; all are sourced with a real, checkable citation (5 pre-2020 papers
independently plausible/well-established, 2 very recent 2026 papers independently verified via
live WebSearch against multiple independent news outlets rather than trusted at face value).
One entry (platyops) required updating the taxon's own base `behavioralChange` text, since the
research surfaced that the existing "essentially no direct evidence of diet" claim was
factually outdated — logged in the ledger above, not silently patched.

### C — Tab UI mechanics
Verified live via browser preview (click + `preview_eval` reads of rendered DOM, not code
inspection): all 4 clusters with ≥1 qualifying sibling (anamensis split, africanus split,
erectus split, last three-way split) render both tabs ("What changed" / "Additional context"),
default to "What changed", and switching tabs shows the correct content. Both zero-qualifying
clusters (apes, afarensis's five) render **no tab bar at all** — confirmed via
`document.querySelector('[role="tablist"]')` returning null. Within "Additional context," only
qualifying siblings appear (verified: africanus split shows only robustus, not sediba; last
three-way shows only neanderthalensis, not sapiens/denisovans). Clicking a sibling name inside
the "Additional context" tab closes the panel and opens that species' full `DetailModal`
(verified with Paranthropus robustus) — same behavior as the existing "What changed" tab.
Escape closes the panel from either tab.

### D — Regression check
`tsc --noEmit` (via `wsl bun x tsc`) shows only the pre-existing, unrelated
`leaflet.markercluster` type error — no new type errors. Existing "What changed" tab content
verified unchanged for all 6 clusters. The `kenyanthropus-platyops` `DetailModal` renders the
corrected `behavioralChange` text and its new `Wynn et al. · 2013` citation in the evidence
trail alongside the pre-existing sources. No console errors; no failed network requests
(`preview_network` filter=failed → none).

### Follow-up (2026-07-05, same day): missing "so what" on 3 of 6 entries

User feedback after review: the afarensis/crocodile, middle-pleistocene-homo/Homotherium, and
neanderthalensis/cave-bear entries each stated a real, sourced fact but never connected it to
a selection pressure or behavioral consequence — "a predator existed nearby" is scenery, not
an answer to "why this path and not another." This was a real gap in how the bar was applied:
I checked each fact was *not a restatement*, but never checked it actually *explained
something*, which was always the actual point of test A/B, not just "is this new."

Re-researched all three with an explicit "does this have a stated behavioral consequence"
question:
- **Afarensis/crocodile**: real behavioral implication found and added — this predator meant
  afarensis had to stay alert at its one non-optional daily resource (river water), a
  recurring cost of the same habitat that enabled its foraging strategy.
- **Middle Pleistocene Homo/Homotherium**: re-research revealed the original entry had the
  *direction backwards*. The actual evidence: hominins usually had primary carcass access
  (not the cat), and researchers propose the spears may have doubled as a defense weapon
  against this specific rival — a real magnitude/function addition to the already-named
  spear technology, not inert trivia. Corrected in the data and in `schoningen-homotherium-2015`'s
  `supports` field.
- **Neanderthalensis/cave-bear**: connected to the already-named cold-survival pressure by
  adding that winter shelter itself (not just food) was a violently contested resource —
  surviving the cold required winning a fight for the den, not just having the right
  physiology. Deliberately did NOT reach for the "rodeo rider" injury-pattern hypothesis
  (Berger & Trinkaus 1995) as connective tissue, even though it was tempting and directly
  relevant — that hypothesis was later substantially qualified/retracted by its own co-author
  (Trinkaus 2012) once similar trauma patterns turned up in contemporary modern humans too,
  so leaning on it would have repeated the exact "just-so story on contested ground" failure
  mode this project explicitly avoids.

Robustus, platyops, and floresiensis were re-checked against the same "does it state a
consequence" question and already passed (their entries already state what the competing
species' presence implies for the sibling's own strategy) — left unchanged.

Coverage remains 6/16 — the user separately flagged this as low. Not expanded in this pass;
flagged back to the user as a decision point (broaden research with this sharper "must state
a consequence" bar, since some "no fact found" verdicts only checked for competitor existence,
not for a stated consequence) rather than unilaterally re-running six more research agents.

### Follow-up 2 (2026-07-05, same day): full adversarial re-review, one entry eliminated

Per explicit request, re-reviewed all 6 shipped entries against the sharpened bar — not "is
this new," but "does it explain why this path and not another, or add real magnitude/context
to an already-named pressure, with a stated consequence" — rather than re-confirming the
earlier self-assessment.

| Sibling | Verdict | Reasoning |
|---|---|---|
| Australopithecus afarensis (crocodile) | **ELIMINATED** | Even after the "so what" fix in Follow-up 1, this entry states a recurring cost/danger but doesn't explain why afarensis took the path it took (bipedalism, dietary flexibility) versus an alternative, and doesn't deepen an already-named pressure's magnitude — connecting it to "made its foraging strategy possible" was my own unsourced hand-waving, not a claim the source supports. Real fact, doesn't clear the bar. Removed from `lineage.json` and its now-unused source removed from `human-lineage-sources.json`. |
| Kenyanthropus platyops (Theropithecus brumpti) | KEPT | Explains why platyops's diet stayed mixed rather than grass-specialized — a competitor already held that niche. Passes test A cleanly. |
| Paranthropus robustus (Theropithecus oswaldi) | KEPT | Explains why robustus's massive chewing apparatus functioned as fallback insurance rather than full-time grazing — same structure as platyops, competitor already held the grazing niche. Passes test A cleanly. |
| Homo floresiensis (Komodo dragon) | KEPT | States an actual behavioral consequence (scavenger, not hunter/primary-carcass-controller) that specifies and revises the existing, more ambiguous "organised carcass processing" line — a real, stated finding, not scenery. |
| Middle Pleistocene Homo (Homotherium) | KEPT | Adds a real second function (possible defensive use) to the already-named spear technology — magnitude/context on a named element, per test B. |
| Homo neanderthalensis (cave bear) | KEPT | Adds a genuine new dimension to the already-named cold-survival pressure — shelter access itself required violent competition, not just physiology/technology. |

**Result: 5/16 siblings now carry an Additional Context entry** (down from 6 — one eliminated
on stricter review, not replaced). Verified live in browser: the anamensis-split cluster's tab
still renders (platyops alone now qualifies), afarensis's "What changed" tab is unaffected,
`tsc --noEmit` still shows only the pre-existing unrelated leaflet error, no console errors, no
failed network requests.

### Visual check
`preview_screenshot` taken on both the three-way split (1 entry, 1 source) and the anamensis
split (2 entries, one with 2 sources — the longest/densest case in this round). Both render
cleanly: no overflow, no wrapping issues, source-citation chips wrap correctly under longer
facts. The other 2 qualifying clusters (africanus split, erectus split) were verified via DOM
`innerText` reads rather than screenshots, which confirms content correctness but not pixel
layout — a quick look at those two is still worth a glance on your end, though they're
structurally identical to the two screenshotted cases.
