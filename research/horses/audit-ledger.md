# Horse lineage completeness audit — genus-level ledger

Purpose: a durable, checkable artifact for "is the tree missing something, and if so why was
it left out." Built once (2026-07-10) against a compiled, source-checked genus-level Equidae
cladogram (MacFadden 1992; Wikipedia "Evolution of the horse"/"Equidae"/"Hipparionini"; Froehlich
2002; Bernor et al. 2021; Heintzman et al. 2017; Florida Museum gallery — see sources at bottom).
Genus-level only, per explicit instruction — not species-level (that would run to hundreds).

**How to use this**: every named Equidae genus goes in the table below with a `Status` of
`PANEL` (has its own dedicated panel), `NAMED` (named inside another panel's prose, no
dedicated panel), or `OMITTED` (not present anywhere) — and every non-`PANEL` row has a
`Reason`. When adding a new genus or panel later, update this table in the same pass so it
never drifts out of sync with `app/lab/horses/data.ts`.

## A. Eocene basal radiation ("dawn horse" wastebasket, split by Froehlich 2002)

| Genus | Time (Ma) | Parent | Fate | Status | Reason |
|---|---|---|---|---|---|
| Sifrhippus | ~55.5–55 | basal stock (sibling of Hyracotherium's own stock, not its ancestor) | dead end | **PANEL** (`sifrhippus-petm`) | Added 2026-07-10: real, tested, twice-independently-confirmed mechanism (temperature-driven body-size scaling during the PETM warming spike — Secord et al. 2012; the same response repeats proportionally in a second, smaller warming event per D'Ambrosia et al. 2017). Cleared the "genuine tested why, not just a curiosity" bar. Root-level sibling to the Hyracotherium chain in the tree (not its parent), since it's not ancestral to it. |
| Systemodon, Xenicohippus, Arenahippus, Minippus | ~55–50 | basal stock | dead ends | OMITTED | Same ecomorph as Hyracotherium/Eohippus (generalized forest browser) — no distinct pressure story, just chronospecies within the same panel-1 trend. Compressed per the audit's own recommendation. |
| Eohippus / Protorohippus | ~55.4–50 | basal stock | Protorohippus → Orohippus | OMITTED (naming) | "Eohippus" is used as panel 1's starting name per long-standing popular convention; the technical point that most classic "Eohippus" fossils are actually *Protorohippus* is a naming/synonymy dispute, not a missing ecological branch. |
| Haplohippus | ~48–47 | basal stock | dead end | OMITTED | Poorly known, same browsing ecomorph, no distinct story. |
| Orohippus | ~50–47 | Protorohippus | → Epihippus | NAMED-GAP | Real intermediate genus, continuation of the same "tougher browse" trend already in panel 1's why — not a new dimension, but currently not even named, which makes panel 1 look like a direct unexplained jump. **Fixed this pass**: named as an intermediate step in panel 1's text (no new panel — same trend, doesn't clear the bar for one). |
| Epihippus | ~47–37 | Orohippus | → Mesohippus | NAMED-GAP | Same as Orohippus — real, same trend, not previously named. **Fixed this pass.** |
| Pliolophus, Cymbalophus | ~55–52 | separate European lineage | dead ends | OMITTED | Family placement itself disputed (may not even be true Equidae, may sit in/near Palaeotheriidae) — too uncertain to build on. |
| *Propalaeotherium, Eurohippus* | Eocene, Europe | — | dead ends | **NOT EQUIDAE** | Current consensus places these in Palaeotheriidae, Equidae's extinct sister family — correctly excluded, not a gap. |

## B. Oligocene–Miocene browsers (Anchitheriinae + transitional Parahippus)

| Genus | Time (Ma) | Parent | Fate | Status | Reason |
|---|---|---|---|---|---|
| Mesohippus | ~37–30 | Epihippus | → Miohippus, dead-ends itself ~31 Ma | **PANEL** (`mesohippus-miohippus`) | — |
| Miohippus | ~36–25 | Mesohippus | splits 3 ways | **PANEL** (`mesohippus-miohippus` / `miohippus-branch`) | — |
| Kalobatippus | ~24–19 | Miohippus (forest-adapted stock) | → Anchitherium, Sinohippus | OMITTED (naming) | Actual direct intermediate between Miohippus and Anchitherium, but its own validity is disputed (some treat it as a junior synonym of Anchitherium or of *Miohippus intermedius*) — reasonable to compress given the dispute, though worth knowing it's the literal missing link if the genus does hold up. |
| Anchitherium | ~18–9 | Kalobatippus | dead end | **PANEL** (`anchitheriinae-extinction`) | — |
| Sinohippus | ~11–7 | Anchitherium/Kalobatippus stock | dead end | NAMED | Named in `anchitheriinae-extinction` as an Eurasian offshoot — same browsing strategy, bigger body, correctly grouped rather than given its own panel. |
| Hypohippus | ~17–9 | Miohippus/Kalobatippus stock | dead end | NAMED | Named in `anchitheriinae-extinction`. |
| Megahippus | ~15–9 | Hypohippus stock | dead end | NAMED | Named in `anchitheriinae-extinction`; audit itself calls this "essentially a size variant of Hypohippus's niche" — correctly compressed, not a distinct story. |
| Archaeohippus | ~30–15 | Miohippus stock | dead end | **PANEL** (`archaeohippus-dwarfing`) | — |
| Desmatippus | ~19–16 | Miohippus/Parahippus stock | dead end | OMITTED | Obscure transitional grade, no distinct story beyond what Parahippus already covers. |
| Parahippus | ~24–15 | Miohippus | → Merychippus | **NAMED-GAP → fixed this pass** | Audit flags this as "the key transitional genus... high-priority node" (first real crown-height rise toward grazing) — it existed only as the generic label "Equinae stem" in `miohippus-branch`'s prose after the brevity rewrite dropped the actual genus name. **Fixed this pass**: named explicitly. |

## C. Basal grazing radiation

| Genus | Time (Ma) | Parent | Fate | Status | Reason |
|---|---|---|---|---|---|
| Merychippus | ~17–11 | Parahippus | radiates into Hipparionini + Equini | **PANEL** (`merychippus-branch`) | — |
| Scaphohippus, Acritohippus | ~16–9 | Merychippus (carved out of that wastebasket) | dead ends / basal Equini stock | OMITTED | Audit's own verdict: "taxonomic refinement, not a distinct ecological story" — correctly compressed into "Merychippus." |

## D. Hipparionini — three-toed tribe, huge Old World radiation, zero living descendants

| Genus | Time (Ma) | Parent | Fate | Status | Reason |
|---|---|---|---|---|---|
| Cormohipparion | ~17.6–5 | Merychippus grade | seeds the whole Old World radiation | NAMED | Named in `hipparionine-extinction`'s baseline as the migrant lineage. |
| Nannippus, Neohipparion, Pseudhipparion | ~16–1.8 | same N. Am. stock | dead ends | OMITTED | Explicitly evaluated and rejected earlier this session (see verification-criteria doc revision 1): more genus-counting on the diet/dispersal theme `hipparionine-extinction` already covers — dwarfing (Nannippus) and hyper-grazing (Neohipparion) specialization don't clear the "new dimension" bar since Archaeohippus already covers dwarfing and Equini already covers committed grazing. |
| Hippotherium | ~11.5–5 | Cormohipparion | dead end | NAMED | Named in `merychippus-branch` as the mixed-feeder isotope example. |
| Hipparion (sensu stricto) | ~11–5 | Cormohipparion | dead end | OMITTED (tribe name used instead) | The tribe name "Hipparionini" is used as the collective umbrella per the audit's own top recommendation (treat the whole tribe as one unit) — the type genus itself isn't separately named, which is fine since nothing distinguishes it ecologically from its tribe-mates. |
| Cremohipparion, Sivalhippus, Plesiohipparion, Proboscidipparion | ~10.7–1 | Old World hipparionine stock | dead ends, last 3 survive to ~1 Ma (Sivalhippus persists latest in South Asia) | NAMED (3 of 4) | Plesiohipparion, Cremohipparion, Proboscidipparion are already named in `hipparionine-extinction` as the last 3 surviving genera. Sivalhippus is not named — regional/obscure, no distinct story beyond "persisted unusually late," a minor completeness gap not worth its own mention. |
| Baryhipparion | ~8–5 | Old World hipparionine stock | dead end | OMITTED | Obscure regional form, same strategy. |
| Eurygnathohippus | ~10.5–1 | Old World hipparionine stock (Africa) | dead end | OMITTED | Real, and it does overlap in time and place with early *Homo* in Africa — but that's a coincidence of geography/timing, not a causal "why" about anything. No selection pressure, no trait explanation, nothing this genus's own story adds beyond "it existed nearby." **Decision: SKIP** — same reasoning as Proboscidipparion: interesting-sounding trivia isn't the bar, a genuine why is. |
| Proboscidipparion (anatomy), Shanxihippus | ~7–1 | Sivalhippus/Plesiohipparion-grade stock | dead ends | **NAMED, story deliberately left untold** | Proboscidipparion is already *named* in `hipparionine-extinction` as one of the last 3 survivors. Investigated 2026-07-10 whether its retracted-nasal "trunk-like snout" has a real adaptive explanation: it doesn't. The original genus description (Deng Tao) only offers an offhand tapir analogy, not a mechanism, and frames the trait as useful for classification, not function. The one paper that gestures at a cause (Bernor et al. 2018) says only "likely due to similarities in feeding adaptation" — no specified diet, no tested mechanism, nothing like saiga's actual studied dust-filtering nose. **Decision: SKIP** — this is exactly the "anatomy described for its own sake, no real why" failure mode the page's own filter is built to exclude. |

## E. Equini — one-toed lineage to Equus

| Genus | Time (Ma) | Parent | Fate | Status | Reason |
|---|---|---|---|---|---|
| Protohippus, Calippus | ~16–5 | Merychippus/Acritohippus stock | dead ends | OMITTED | Explicitly evaluated earlier this session ("Protohippini" third-tribe candidate): real tribe name exists but taxonomically unstable (Calippus reassigned between tribes by different authors) and doesn't present a distinct selection-pressure story from Equini grazers — a systematics nuance, not a new dimension. |
| Parapliohippus, Heteropliohippus | ~13–11 | Acritohippus/basal Equini stock | dead ends | OMITTED | Poorly known, transitional, no distinct story. |
| Pliohippus | ~15–6 | Parapliohippus-grade stock | → Dinohippus | **PANEL** (`pliohippus-equus`) | Audit confirms this was the right node to build around — the *real* functional monodactyl threshold, earlier and less famous than Equus. |
| Astrohippus | ~6–4.5 | Pliohippus | dead end | OMITTED | Minor side branch, same grazing/monodactyl strategy, no distinct story. |
| Dinohippus | ~12–3 | Pliohippus | → Plesippus/Equus | NAMED | Named in `pliohippus-equus`'s title and `early-equus-branches`'s baseline. |
| Plesippus | ~4.5–2 | Dinohippus | → Equus, also reached Old World | OMITTED (naming) | The single most actively disputed genus-validity call in the whole tree — many analyses sink it entirely into Equus. Reasonable to compress into the Dinohippus→Equus transition rather than build around a genus whose own existence is contested. |
| Equus | ~4.5 Ma–present | Dinohippus/Plesippus | extant | **PANEL** (`equus-modern-split`) | — |
| Haringtonhippus | ~4.5–0.011 | sister to Equus (not descended from it) | extinct ~11 kya | **PANEL** (`early-equus-branches`) | Added last revision; audit independently confirms this is "genuinely novel... most older sources don't have it as its own genus." |

## F. South America (post-GABI, ~2.7 Ma)

| Genus | Time (Ma) | Parent | Fate | Status | Reason |
|---|---|---|---|---|---|
| Hippidion | ~2.5–0.011 | separate N. Am. Equini-grade dispersal | extinct ~11 kya | **PANEL** (`early-equus-branches`) | — |
| Onohippidium | ~2.5–0.3 | same dispersal as Hippidion | disputed | OMITTED | Actively argued as a likely synonym of Hippidion, not a separate genus — correct to omit. |
| *Equus (Amerhippus)* | — | Equus | subgenus, not a genus | **N/A** | A subgenus of Equus, not a separate genus — correctly not given its own row; its convergent-evolution-with-Hippidion angle is context, not a missing branch. |

## Summary — what this pass actually changed

**Fixed 2026-07-10, first pass (accuracy/completeness, no new panels):**
1. Named Orohippus and Epihippus as intermediate steps in `hyracotherium-mesohippus`'s text (were previously invisible, giving a false impression of a direct unexplained jump).
2. Named Parahippus explicitly in `miohippus-branch` (had been reduced to the generic label "Equinae stem" during the brevity rewrite).

**Added 2026-07-10, second pass — evaluated against the page's own filter ("a genuine tested selection pressure, not anatomy/coincidence described for its own sake") and decided one by one:**
1. **Sifrhippus** (~55.5-55 Ma) — **ADDED** as its own root-level panel (`sifrhippus-petm`). Body-size shrinkage during the PETM warming spike, verified with a real, tested, twice-independently-confirmed mechanism (Secord et al. 2012; corroborated by a second, independent warming event in D'Ambrosia et al. 2017). Genuinely new dimension: every other size-change story on this page is cooling/drying-driven; this one is warming-driven, and it's the earliest event in the whole tree.
2. **Proboscidipparion / Shanxihippus "weird nose"** — **SKIPPED.** Investigated whether the retracted-nasal/trunk-snout trait has a real tested adaptive explanation. It doesn't: the original genus description only offers an offhand tapir analogy (not a mechanism), and the one paper that gestures at a cause says just "likely due to similarities in feeding adaptation" with no specified diet or tested mechanism — nothing like saiga's actual studied dust-filtering nose. This is exactly the anatomy-for-its-own-sake failure mode the page's filter exists to exclude.
3. **Eurygnathohippus** — **SKIPPED.** Its only distinguishing fact is overlapping in time/place with early *Homo* in Africa — a coincidence of geography, not a selection-pressure story. Same reasoning as Proboscidipparion: interesting-sounding isn't the bar, a genuine why is.

**Confirmed correctly omitted, no action** (the remaining ~25 genera): taxonomic
refinements/synonym disputes with no distinct ecological story (Kalobatippus, Plesippus,
Onohippidium, Eohippus/Protorohippus naming), or genuinely "same strategy, different
time/place" regional-temporal variants already covered by an existing panel's collective
treatment (Systemodon/Xenicohippus/Arenahippus/Minippus/Haplohippus, Sinohippus/Hypohippus/
Megahippus, Scaphohippus/Acritohippus, Nannippus/Neohipparion/Pseudhipparion/Baryhipparion/
Sivalhippus, Protohippus/Calippus/Parapliohippus/Heteropliohippus/Astrohippus, Pliolophus/
Cymbalophus — the latter two also of disputed family placement).

**Tree now has 11 panels, 17 nodes, 9 levels deep** (Sifrhippus as a second root, sibling to
the main Hyracotherium spine — not its ancestor, since Sifrhippus belongs to a separate basal
lineage per the underlying cladogram).

## Sources
MacFadden (1992), *Fossil Horses: Systematics, Paleobiology, and Evolution of the Family
Equidae*, Cambridge University Press. Froehlich (2002), "Quo vadis Eohippus? The systematics
and taxonomic history of the first horses," *Zoological Journal of the Linnean Society*.
Bernor et al. (2021), "Old World hipparion evolution, biogeography, climatology and ecology,"
*Earth-Science Reviews* 221:103784. Heintzman et al. (2017), "A new genus of horse from
Pleistocene North America," *eLife* 6:e29944. Wikipedia: "Evolution of the horse," "Equidae,"
"Hipparionini," "Proboscidipparion," "Sivalhippus," "Hippidion." Florida Museum of Natural
History, "Fossil Horses in Cyberspace" gallery.
