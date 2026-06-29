# Verification Criteria — Species Research Pass & Card Update (2026-06-28)

## Direction (Stage 1+2 outcome, /curiosity-build)
User's real itch surfaced this session: the site's per-species cards lean on Wikipedia-level
description (bone shape, dates, jaw size) without translating that into **what life actually
looked like** and **why the lineage branched the way it did**. A prior research pass (done
inline in this thread, not via the deep-research workflow which burned too much usage) showed
real paleontological inference (biomechanics, isotopes, microwear, trace fossils, ancient DNA,
phylogenetic bracketing) DOES meaningfully extend past Wikipedia for several taxa — e.g. P.
boisei's skull screams hard-object feeding but microwear shows it mostly ate soft food and
fell back on hard food only in scarcity; A. afarensis "walked upright" but in a distinct,
non-human gait while still climbing; Denisovans are reconstructed almost entirely from DNA +
butchered bones, not skeleton.

Task: do this same kind of research for **every taxon currently in `data/lineage.json`** (20
taxa), write one short concise note per taxon (not a paper — just what the science implies
about how they lived and why they diverged), then use those notes to rewrite the relevant card
fields, and extend the existing divergence tags (`data.divergences`, rendered as
`DivergenceTag` in `app/evolution-explorer.tsx`) with a faint connecting line/arrow from each
tag to the taxa it describes, so it's visually unambiguous which lineage split a tag refers to.

**What counts as relevant research** (explicit user framing — exclude raw science for its own
sake):
- "How they lived": diet, habitat, group size/social structure, time period context, locomotion,
  tool use, whether the population was thriving or struggling.
- "Evolutionary pressures": why this taxon diverged from its parent fork, why it differs from
  sibling taxa, and (where applicable) why its own descendants subsequently diverged from it.
- Explicitly OUT: isotope ratios, bone composition, or other raw findings stated without their
  behavioral/ecological meaning. A note that lists facts without saying what they imply about
  lived experience does not satisfy this task.

## Explicitly NOT in scope
- Rewriting `app/story/*` turning-point scenes.
- Changing layout/positions (`col`/`lane`) of existing taxon cards.
- Adding new taxa or new divergence forks beyond the 4 already in `data.divergences` — unless
  research surfaces a clearly missing, obvious fork (if so, log it as a deliberate addition in
  this doc, don't add silently).

## Process requirements (so this doesn't get skipped/slacked)
- Research is done **inline in this conversation** via direct `WebSearch`/`WebFetch` calls, one
  taxon at a time — **no parallel subagents, no Workflow tool** (cost control; the deep-research
  workflow run earlier burned ~2M tokens and hit a session limit).
- One file per taxon under `research/` (new top-level folder), named `research/<taxon-id>.md`
  (the `id` field from `lineage.json`, e.g. `research/paranthropus-boisei.md`). Short and
  concise — bullet points, not prose paragraphs, no full citations list (a source name/year
  inline is enough).
- Only ONE subagent is spawned in this whole task: the final verification pass at the end.

## Falsifiable criteria

**A — One research note per taxon, all 20 present.**
Check: `ls research/*.md` contains exactly one file per `id` in `data.taxa` (20 files, names
matching taxon ids).

**B — Each note has both required sections and is genuinely concise.**
Check: each note file contains a "How it lived" section and a "Why it diverged / pressures"
section (any heading wording naming these two ideas is fine), each under ~150 words. FAIL if a
note is mostly raw fact-dump (e.g. just lists isotope numbers) without stating what the finding
implies about behavior/life.

**C — Card fields updated to reflect the note, not left as pre-research boilerplate.**
Per-taxon ledger (filled below): for each of the 20 taxa, confirm `behavioralChange` and at
least one `pressures[].pressure` string in `data/lineage.json` changed from its original
wording (diffed against the pre-task git state) AND that the new wording traces to a specific
claim in that taxon's research note (not generic filler).

**D — Divergence tags get a visual line/arrow to the taxa they describe.**
Check via rendered browser screenshot + DOM inspection: each of the 4 (or more, if logged)
divergence tags has a visible faint connector (line or arrow, distinguishable from the
solid/dashed edge-path lines already used for ancestry edges) drawn from the tag to its
`fromId` taxon AND to each of its `siblingIds` taxa. FAIL if the connector is indistinguishable
from existing edge lines, or missing for any tag/taxon pair.

**E — Divergence tag labels also reflect the new research where it changes the story.**
Check: re-read each divergence label against the relevant taxa's updated `pressures`/
`behavioralChange` — if research surfaced a more specific/accurate contrast than the existing
label, the label text is updated; if the existing label already held up, log "unchanged,
confirmed accurate" rather than silently leaving it.

**F — No regression.**
Check: `bun run build` compiles clean; taxon count (20) and edge count (21) rendered match
pre-task counts; 0 new console errors.

**G — Scope discipline.**
Check: `git status --porcelain` touches only `research/**`, `data/lineage.json`,
`app/evolution-explorer.tsx`, `app/explorer.module.css` (or equivalent CSS module), this doc,
and `CLAUDE-UNDERSTANDING.md` if updated. 0 files under `app/story/` touched.

## Deliberate addition (logged per scope rule above)
Research surfaced that divergence #4 (`middle-pleistocene-homo` fork) was missing `denisovans`
from `siblingIds` even though `data.edges` already has a `supported` edge from
`middle-pleistocene-homo` to `denisovans` alongside `homo-sapiens` and `homo-neanderthalensis` —
all three are siblings from the same fork. Added `denisovans` to that divergence's
`siblingIds` and rewrote the label as a three-way contrast instead of leaving an incomplete
two-way one.

## Per-taxon ledger (fill during execution — one row per taxon)

| # | Taxon id | Research note exists? | Key "how it lived" finding | Key "why diverged" finding | Card fields updated? |
|---|---|---|---|---|---|
| 1 | ekembo-nyanzae | Yes | Microwear = soft fruit diet; canine dimorphism = male contest behaviour | Generalised ape body before any living lineage specialised | Yes |
| 2 | nakalipithecus-nakayamai | Yes | Thick enamel = flexible fallback diet in dry woodland | Shift to seasonal woodland (vs. forest) drove enamel thickening | Yes |
| 3 | gorilla | Yes | Silverback-led stable groups; diet tracks local forest type | Shrinking Miocene forest favoured bulk-vegetation body | Yes |
| 4 | chimpanzee | Yes | Fission-fusion society; rare tool-assisted hunting (mostly female, Fongoli) | Kept ancestor's social flexibility while human line added bipedalism | Yes |
| 5 | sahelanthropus-tchadensis | Yes | Lakeshore mosaic habitat; bipedalism genuinely contested (2023-24 papers) | If real, same patchy-mosaic pressure as Orrorin/Ardipithecus | Yes |
| 6 | orrorin-tugenensis | Yes | Dry evergreen forest (not savanna); walked AND climbed | Bipedalism for travel within forest, not escape from it | Yes |
| 7 | ardipithecus-kadabba | Yes | Toe joint shows real toe-off push; tougher fibrous diet than chimps | Canine reduction moving in parallel with earliest bipedal mechanics | Yes |
| 8 | ardipithecus-ramidus | Yes | Isotopes = varied woodland omnivore; near-zero canine dimorphism | Reduced male-male aggression may have freed capacity for bipedal foraging | Yes |
| 9 | australopithecus-anamensis | Yes | Real habitat mosaic (riparian woodland + grassland); still climbed | Shift to more open ground vs. Ardipithecus drove committed walking | Yes |
| 10 | australopithecus-afarensis | Yes | Non-modern flexed gait (Laetoli); wide individual dietary variation (isotopes) | Population's dietary range set up opposite descendant strategies (boisei vs. habilis) | Yes |
| 11 | australopithecus-africanus | Yes | <10% animal protein (2025 isotopes); more ground-walking than Paranthropus robustus | Solved food security via plant flexibility, not hunting/tools | Yes |
| 12 | paranthropus-boisei | Yes | Microwear shows soft-food diet despite hard-food skull (Liem's Paradox) | Mechanical fallback-insurance bet vs. sibling habilis's tool-use bet | Yes |
| 13 | homo-habilis | Yes | Cut marks over carnivore tooth marks = scavenger, not hunter | Tools replacing teeth's food-processing role, opposite bet from boisei | Yes |
| 14 | homo-erectus | Yes | Body plan debated (endurance vs. power running); fire by 1 Ma (Wonderwerk) | Locomotion + diet pressures reinforcing each other; wide dispersal set up later fork | Yes |
| 15 | homo-naledi | Yes | Deliberate-burial claim genuinely contested (2023 rebuttal) | Small brain survived late alongside large-brained Homo — brain size not tightly coupled to survival | Yes |
| 16 | homo-floresiensis | Yes | Organised Stegodon/giant-rat butchery with Oldowan-style tools | Island dwarfism pressure produced two independent dwarfing events on Flores | Yes |
| 17 | middle-pleistocene-homo | Yes | Schöningen spears = coordinated hunting (species attribution uncertain) | Cognitive/social investment outpacing skeletal change; shared base for 3-way split | Yes |
| 18 | homo-neanderthalensis | Yes | Near-total carnivory by isotopes; Shanidar 1 = sustained group care | Cold-climate body + tech layered together; "flower burial" specifically unsubstantiated | Yes |
| 19 | denisovans | Yes | Reconstructed almost entirely from DNA + butchered bones, not skeleton | EPAS1 gene payoff observable today in Tibetans, outliving the species | Yes |
| 20 | homo-sapiens | Yes | Modern face arrived ~150ka before modern (symbolic) behaviour did | Anatomical and cultural shifts were sequential, not one package | Yes |

## Self-check evidence (filled before spawning the final verification subagent)
- **A**: `research/*.md` contains exactly 20 files, one per taxon id.
- **B**: every note has "How it lived" and "Why it diverged / pressures" headings, all under
  ~150 words, all stating implications (not raw fact-dumps).
- **C**: per-taxon ledger above — all 20 rows show "Yes" with a specific traced claim.
- **D**: live DOM check via `preview_eval` — 20 taxon cards, 21 edge paths (unchanged), 4
  divergence tags, 13 `tagConnector` `<line>` elements (3+3+3+4, matching `fromId` + all
  `siblingIds` per divergence). Computed style confirms `tagConnector` (`rgba(29,42,36,.32)`,
  1px, dasharray `1 4`) is visually distinct from `edge_supported` (`rgb(64,94,77)`, 2px, solid).
  Screenshots at two tag locations show faint dotted connectors clearly distinct from the
  thicker amber/moss dashed ancestry edges.
- **E**: divergence #2 and #4 labels rewritten to reflect new research (fallback-insurance
  framing; 3-way Denisovan/sapiens/Neanderthal contrast). Divergences #1 and #3 re-checked
  against new research and confirmed still accurate — left unchanged deliberately.
- **F**: `bun run build` — compiled successfully, 0 type errors, all 7 routes generated.
  `bunx eslint app/evolution-explorer.tsx` — 0 errors. Live DOM: 20 cards / 21 edges, matching
  pre-task counts exactly. `preview_console_logs` — 0 errors (only HMR/devtools noise).
- **G**: `git status --porcelain` shows only `app/evolution-explorer.tsx`,
  `app/explorer.module.css`, `data/lineage.json`, `research/**`, and this doc. 0 files under
  `app/story/` touched.

## Final gate
At the end, spawn exactly one subagent, give it this doc's path and instruct it to check the
**current state of the repo** (not trust this doc's claims) against every criterion (A–G) and
the per-taxon ledger, and answer PASS/FAIL with specifics. If FAIL, fix and re-spawn. Repeat
until PASS.

## Result: PASS, all 7 criteria (A–G) independently verified by an adversarial subagent
(2026-06-28) against the live repo state, not this doc's claims. Subagent spot-checked 10 of 20
research notes and 17+ of 20 card diffs (spread across taxa not highlighted in this doc's own
prose), confirmed the `tagConnectors` rendering is wired from real `fromId`/`siblingIds` data
(not hardcoded), confirmed the Denisovan 3-way addition is grounded in pre-existing edge data,
and ran a clean `bun run build`. One nitpick noted (the "~150 words" self-check is true
per-section, not per whole file) — not a content defect.
