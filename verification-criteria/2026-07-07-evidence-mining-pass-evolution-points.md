# Evidence-mining pass: sharper causal content for the 4 evolution-point panels

## Direction (confirmed this session)
User named the actual bottleneck on the branch/evolution-point panels: not a missing
feature/format, but a lack of *specific, hard* evidence to enrich the "what changed" and
"what forced it" content already sourced. Scope, per user instruction: stay conservative —
no subagent swarm, a bounded research pass done directly, not a full re-mining of all 10+
existing branch/evolution edges.

**This pass covers the 4 `evolutionPoints` only** (the newest, least-enriched panels — they
lack the `additionalContext` mechanism the 6 divergence clusters already got on 2026-07-05),
plus one adjacent one-line taxon edit (`anamensis.certainty`) where the strongest finding
landed one hop downstream of its evolution point. The 11 divergence-cluster siblings that
still lack `additionalContext` (gorilla, chimpanzee, afarensis, africanus, garhi, boisei,
habilis, rudolfensis, sediba, sapiens, denisovans) are explicitly **out of scope this round**
— a larger next batch, not attempted here, so as not to blow the conservative budget.

## Method
For each of the 4 evolution points, searched (via `WebSearch`, live, this session) for a
hard-evidence fact in categories not yet used for that specific edge: isotopes, microwear,
biomechanics/trabecular bone, trackways, dated tool/cut-mark finds, paleoclimate proxies, or
a specialist dispute about an existing claim. Only added a fact if (a) a real, checkable
source was found (not assumed), and (b) the fact *complicates* the existing bullet rather than
just restating it in more words (the causal-depth-ceiling test).

## Per-edge ledger (falsifiable — check by reading the actual JSON diff + the cited source)

| Edge | New fact added | Complicates (not just restates)? | Source (verified real, checked this session) |
|---|---|---|---|
| Ekembo → Nakalipithecus | The ~10 My fossil silence itself has a candidate cause: East African Rift uplift + falling CO2 converted forest to grassland across this window, and wooded-pocket apes fossilize poorly in acidic forest soil — the silence may be a trace of the same squeeze the "thicker teeth as insurance" story describes | Yes — turns "the gap exists" into "here's why the gap is shaped like this," which the existing confidenceNote didn't have | Werner et al. 2025, *Science Advances*, doi:10.1126/sciadv.adx6569 |
| A. kadabba → A. ramidus (fact landed on ramidus's own baseline, surfaced via the ramidus→anamensis confidenceNote) | Ramidus's "woodland" habitat call is itself specialist-disputed: the describing team (White et al.) read it as closed woodland; Cerling et al.'s isotope re-analysis of the same Aramis soils argues for predominantly open wooded grassland instead | Yes — the existing text asserted "woodland (not open savanna)" as settled; it isn't | Cerling et al. 2010, *Science* comment, doi:10.1126/science.1185274 (vs. White et al.'s response, doi:10.1126/science.1185466) |
| A. ramidus → A. anamensis | Bonus, one hop down: a 2019 skull (MRD) showed anamensis and afarensis coexisted for 100,000+ years rather than one cleanly replacing the other — added to `anamensis.certainty`, not the evolutionPoint itself, since that's the more precise fit | Yes — undercuts the implicit "clean handoff" reading of the lineage ladder | Haile-Selassie et al. 2019, *Nature*, doi:10.1038/s41586-019-1513-8 (already an existing sourceId on this taxon — reused, not fabricated) |
| Homo habilis → Homo erectus | Dmanisi Skull 5 (2013): a 546cc brain — barely bigger than habilis's — found alongside much larger-brained Dmanisi individuals in one population, leading its describers to argue habilis/rudolfensis/early-erectus may be one variable lineage, not three species | Yes — directly complicates the "clean handoff, brain scales up" framing already in the confidenceNote | Lordkipanidze et al. 2013, *Science* 342:326–331 |

FAIL condition for this doc: any row above where the cited source doesn't actually say what
the fact claims (re-verify by re-reading the search result before marking PASS), or where the
added sentence merely restates existing content instead of complicating it.

## Mechanical checks
1. `data/lineage.json` remains valid JSON (parses).
2. `data/human-lineage-sources.json` gets exactly 3 new entries (werner-2025, cerling-2010
   ardipithecus dispute, lordkipanidze-2013), each with a real doi/url — no invented citations.
3. `bun run build` / `tsc --noEmit` — no new errors introduced by the longer strings.
4. Spot-check in the running app (`preview_click` + `preview_snapshot`): the 4 evolution-point
   panels still open and render the new, longer text without visual breakage; the anamensis
   species modal still opens and shows the updated certainty line.

## Explicitly out of scope this round
- No new taxa, no new evolutionPoints/divergences, no schema/UI changes.
- The 11 divergence-sibling gaps listed above — flagged as the natural next batch, not done now.

## Batch 2 (2026-07-07, same day): the 11 divergence-sibling gaps, closed

User asked to continue onto the remaining siblings without an `additionalContext` fact. Same
method and bar as batch 1 (verified real source, complicates rather than restates). All 11
resolved with a fact — none needed the "search exhausted, nothing found" escape hatch.

| Sibling (cluster) | New fact | Source (verified) |
|---|---|---|
| gorilla (gorilla/chimp split) | The ~9 Ma split date is fossil-calibrated, not something genomes alone resolve — mutation-rate variation leaves gorilla vs. chimp/human split timing genuinely underdetermined by DNA | Scally et al. 2012 (already an existing citation on this taxon) |
| chimpanzee (gorilla/chimp split) | Chimps and bonobos split ~1-2 Ma via Congo River isolation; bonobos evolved a starkly less aggressive, female-led social system afterward — "kept the ancestral system" kept changing anyway | Prüfer et al. 2012, *Nature* |
| afarensis (afarensis vs. platyops) | 2016 CT scan: Lucy's own fractures are consistent with a fatal tree fall — the icon of confident ground-walking still needed trees enough to possibly die falling from one | Kappelman et al. 2016, *Nature* |
| africanus (five strategies) | Trabecular bone in africanus's hand shows human-like forceful-grip loading, predating any confirmed tool industry for the species | Skinner et al. 2015, *Science* |
| garhi (five strategies) | Lomekwi stone tools (3.3 Ma) predate garhi's butchery layer by ~750,000 years and predate genus Homo entirely — toolmaking was already old technology by the time garhi's population used it | Harmand et al. 2015, *Nature* |
| boisei (five strategies) | Isotopes show boisei's actual diet was >75% C4 grass/sedge, far more than near-identical-jawed robustus — contradicts the microwear-only "soft food most days" reading | Cerling et al. 2011 (already an existing citation on this taxon) |
| habilis (five strategies) | A 1999 reassessment argues habilis's body proportions are Australopithecus-like enough that it shouldn't be in genus Homo at all | Wood & Collard 1999, *Evolutionary Anthropology* |
| rudolfensis (five strategies) | A 2012 juvenile face (KNM-ER 62000) shares rudolfensis's distinctive features at immature size, undercutting the "just a large habilis" reading | Leakey, Spoor et al. 2012, *Nature* |
| sediba (South Africa's own split) | 2011 endocast scan: frontal-lobe reorganization toward human pattern preceded, not followed, brain-size increase | Carlson et al. 2011, *Science* |
| sapiens (last three-way split) | Skull shape only reached fully modern globular form 100,000-35,000 years ago — 200,000+ years after early sapiens faces/brain size already looked modern | Neubauer, Hublin & Gunz 2018, *Science Advances* |
| denisovans (last three-way split) | Highest living Denisovan ancestry is in Papuans/Melanesians, not near any known Denisovan fossil site, from 2+ Denisovan populations separated 350,000+ years — implies an unfound population in Southeast Asia/Wallacea | Jacobs et al. 2019, *Cell* |

### Mechanical verification (this batch)
- 9 new sources registered in `human-lineage-sources.json` (78 total, zero duplicate ids —
  caught and fixed one accidental `scally-2012` duplicate before it landed).
- Cross-check script: every `sourceIds` reference across all taxa and all divergence
  `additionalContext` blocks resolves to a real registered source — **0 missing**.
- 16/16 `additionalContext` blocks now present across the 6 divergence clusters (5 from
  2026-07-05 + 11 from this pass) — every sibling in every cluster now has one.
- `data/lineage.json` and `data/human-lineage-sources.json` both valid JSON.
- `tsc --noEmit`: only the pre-existing unrelated `leaflet.markercluster` error.
- Live dev server (already running on port 3000) confirmed serving all 9 new facts verbatim
  (`curl` + grep match, HTTP 200) — Next.js picked up the file changes without a restart.

**Coverage after batch 2: every divergence-cluster sibling (16/16) and all 4 evolution points
now carry at least one hard-evidence fact beyond the original baseline/change/confidence
content.** No taxa/edges remain with a known, unaddressed gap in this category.
