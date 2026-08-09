# Evershed et al. 2022 — what the evidence actually shows

Date: 2026-08-08
Paper: *Dairying, diseases and the evolution of lactase persistence in Europe*, Nature
(https://doi.org/10.1038/s41586-022-05010-7)

Interrogating the method rather than the abstract. One question per section, in the order
they were asked.

**Companion artefacts in this folder**
- `sweep_shape.py` → `sweep_shape.png` — what a selective sweep curve actually looks like
- `driver_comparison.py` → `driver_comparison.png` — the paper's own model, re-fit from its
  public data, plus the baseline it never ran

**The two findings that matter most**, both from re-running their model rather than reading it:

1. **A model with no time dimension at all — selection constant in time but different per
   region — beats every one of their ecological drivers** (3,351× vs. the null, against 1,232×
   for their best). The signal they attribute to famine and crowding is a *spatial gradient*.
2. **Their model window (8,000–2,500 BP) ends before most of the sweep happened.** The bulk of
   the LP rise is in the last ~3,000 years. They fit the flat shoulder, not the climb.

---

## Q1. What evidence supports the disease/famine theory?

Three layers, only the first quantitative.

**Layer 1 — model likelihood comparison.** LP trajectories fit under models where selection
strength follows an archaeological time series, versus a null of constant selection.
Population fluctuations 689×, settlement density 284×, wild-animal proportion 34×, milk use
**no improvement**. Built from >110,000 ¹⁴C dates across >27,000 sites and >1,000,000 NISP
faunal counts. Nine tests, Benjamini–Hochberg corrected at δ = 0.02.

**Layer 2 — eliminative.** Milk use was widespread from the Neolithic outset in an almost
entirely LNP population, so there was no ramp for a virtuous circle to ride. And in UK Biobank
(~337,000), 91.9% of genetically LNP people mainly drink dairy milk, only 2.5% follow a
lactose-free diet, and LP shows null associations with mortality (HR 1.00), vitamin D, bone
density, IGF-1, height, and fertility. Only BMI moved, by 0.01 s.d.

The crux: milk is near-harmless to healthy LNP adults *today*, yet LP was under ~1–2%/generation
selection. The cost needs an **amplifier that existed then and not now**.

**Layer 3 — plausibility from outside literature.** Lactose diarrhoea turns fatal in the
severely malnourished; unfermented milk gets eaten when other food runs out; ~61% of known and
~75% of emerging human infections are zoonotic; LP associates with gut microbiome *only* in milk
consumers; late-childhood mortality rose over the relevant period.

**Not shown:** any direct observation of famine- or infection-linked LP mortality. The
wild/domestic result is explicitly ambiguous.

---

## Q2. How exactly was the model fit? What "selection", mechanically?

**Object:** not a curve. Binary reads — derived (LP) or ancestral at rs4988235, per dated
individual. 1,786 individuals with coverage; **only ~98 derived alleles**, and only **31** inside
the window actually used for driver fitting.

**Core:** deterministic logistic sweep. No drift, no migration, no structure. Additive fitness
1+2s / 1+s / 1, 28-yr generations, y₀ free at 8,000 BP:

```
y(t) = y₀ / (y₀ + (1 − y₀)·e^(−st))
```

**How a proxy becomes selection — the whole mechanism:**

```
s(t) = b · m(t)^(1/a − 1)
```

`b` = max selection coefficient. `a ∈ (0,1]` = a **peakiness knob**. At `a = 1` the exponent is
0, `m` drops out, and `s(t) = b` — the null is nested inside. As `a → 0` selection collapses into
rare intense bursts. `m(t)` is piecewise constant over ~220-yr slices.

**No biology is encoded.** Crisis and chronic are narratives laid over a curve-shape test.

**Likelihood:** `lnL = Σ_ancestral ln(1−y) + Σ_derived ln(y)`, summed over four regions with
**one shared parameter set**. That shared-parameter constraint is what gives the test teeth.

**"689×" is `exp(Δ lnL)`** — a fit ratio. Not a probability that famine caused anything, not an
effect size.

**Why milk lost, and it isn't what you'd assume:** milk use is high from the outset and stays
high. A near-flat `m(t)` raised to any power is still near-flat — indistinguishable from constant
selection *by construction*. Milk failed partly by not varying informatively.

---

## Q3. So it's just "find which dataset best fits the gene curve"?

Broadly yes, with three qualifications.

1. **Not fitting to an LP curve** — there is no observed trajectory. The model turns a proxy into
   a predicted curve, scored against ~3,057 individual 0/1 calls. Fig. 3's smooth curves are
   *output*.
2. **The proxy can't be bent** — shape fixed; only peakiness, strength, and starting frequency
   are free, shared across four regions. Genuinely constrained.
3. **The headline test is against flat, not against each other.** The ranking among winners
   (689/284/34) had no significance test run on it, and the winners are mutually correlated.

Fair one-liner: *they asked whose time-shape the ancient DNA prefers; milk's lost; several won —
including the one supporting the hypothesis they set out to challenge.*

---

## Q4. Did famine line up with regions lacking LP? Why only some regions?

**It's a gradient, not presence/absence.** Mediterranean Europe went 0 → 26%. That's a real
sweep. And the per-region selection intervals overlap heavily (British Isles 1–6.3% vs.
Mediterranean 0.7–2.1%), so even "selection differed regionally" is weakly resolved.

**They never show southern Europe had less crisis.** No regional decomposition of proxies in the
main text. Their own "boom and bust" source documents collapses across Europe including the
Mediterranean.

**The tell:** solar insolation is *time-invariant* — one constant per polygon, confirmed in the
data file itself (British Isles 0.357, Baltic 0.291, Rhine–Danube 0.459, Mediterranean 0.614) —
and it beats the null. A model carrying **zero temporal information** wins. So much of what the
"fluctuating selection" models capture is not bursts; it's *regions differ*, north to south.

**Confounds the authors concede:** allele origin location, allele surfing, Steppe migration. The
model shares one y₀ and excludes migration, so any real regional difference in starting frequency
gets misattributed to ecology.

---

## Q5. When did LP rise? Was it smooth? Why would sunlight act with a delay?

**Dates:** first carrier ~4700–4600 BC; "appreciable frequencies" ~2000 BC; bulk of the rise in
the **last ~3,000 years** (Burger et al. 2020).

**Smooth? Unknown.** 9 derived alleles in the British Isles, 8 in the Baltic. Observed frequency
**never exceeds ~16%** anywhere in the ancient record. Fig. 3's sigmoids are the model's
assumption drawn through the data.

**⭐ Constant selection manufactures the delay for free.** Verified by simulation
(`sweep_shape.py`), at s = 2.2%, y₀ = 0.5%, from 6050 BC:

| Crosses | 2% | 5% | 10% | 25% | 50% |
|---|---|---|---|---|---|
| Date | 4258 BC | 3054 BC | 2102 BC | 702 BC | 698 AD |

Four millennia below 10%, then most of the climb in the last ~2,500 years. **Sunlight needs no
delayed onset. Nothing does.** The lag is the default behaviour of any sweep from a rare allele.

**With drift it's neither smooth nor reliable:** at Ne = 500, **34 of 40 replicates lost the
allele** despite 2.2% selection; at Ne = 5,000, 6 of 40. Survivors rise *faster* than the
deterministic curve — survivorship bias.

**🔁 This revises the premise in `lactase-persistence.md`.** "Nothing then all at once" is exactly
what steady selection predicts; it is not an anomaly. What *does* survive from that premise: LP is
uncorrelated (maybe inversely) with how early and heavily milk was consumed.

---

## Q6. Was milk use prevalent everywhere? Could processed dairy have had less lactose? Can lipids tell?

**No — Δ¹³C cannot distinguish fresh milk from cheese or yogurt.** It measures δ¹³C of C16:0 and
C18:0 **fatty acids**; fermentation doesn't alter them, and lactose is a sugar leaving no lipid
trace. "Dairy fat residue" means only *ruminant milk fat passed through this pot*.

This is the paper's deepest limitation: **the milk proxy is blind to the one variable LP responds
to.** Two regions with identical Δ¹³C could differ wildly in lactose load. The paper half-concedes
it by arguing unfermented milk gets eaten during famine — so they know it's load-bearing.

Cheese *has* been detected (Salque 2013; McClure 2018) but via **perforated sieve vessels plus
residues** — pot shape, not an intrinsic lipid signature. Not applicable systematically.

**Dairying without LP is the global norm:**
- **Mongolia** — dairy pastoralism for ~5,000 years, modern LP in the low single digits, managed
  by fermentation and gut microbiome. The decisive natural experiment, absent from this paper.
  *(Wilkin et al. dental-calculus proteomics — verify figures before citing.)*
- **China** — very low LP; 25-fold milk increase in fifty years, no evident penalty.
- **Africa / Arabia** — high LP in pastoralists via **different alleles entirely**.

**Synthesis stronger than the paper's:** milk is *necessary* (LP arose three times, always in
dairying populations, never elsewhere) but nowhere near *sufficient*, and its intensity predicts
nothing.

---

## Q7. How do the three LP variants differ mechanistically?

They **don't differ in what they do to the enzyme** — and that's the informative part.

| Variant | rsID | Population |
|---|---|---|
| −13910\*T | rs4988235 | Europe (this paper's allele) |
| −13915\*G | rs41380347 | Middle East / Arabia |
| −14010\*C | rs145946881 | East Africa |
| −13907\*G | rs41525747 | East Africa / Sudan |

All four sit in the **same enhancer**, in intron 13 of the neighbouring **MCM6** gene, ~14 kb
upstream of *LCT*. All are **cis-regulatory**: none alters lactase's sequence, kinetics, or
efficiency. They work by altering binding of **Oct-1 (POU2F1)** and neighbouring factors
**GATA-6, HNF-3A (FOXA1), c-Ets1**, which appears to block the age-related methylation that
normally shuts the enhancer down. −13910\*T roughly **doubles** enhancer activation of the *LCT*
promoter.

**So the phenotype is the same switch, thrown four independent ways: keep making the ordinary
enzyme past weaning.** There's no "one variant digests faster" axis to explain regional selection
differences — variant identity tells you about *ancestry*, not about *strength of benefit*.

The one nuance worth chasing: in-vitro work finds different enhancer variants reach increased
promoter activity by **different molecular routes**, which could mean modest differences in
expression level or tissue timing. Not enough to carry a selection story on current evidence.

---

## Q8. Can we simulate a gene under mild selection and see the curve?

Done — `sweep_shape.py`. See Q5 for the numbers. Three results: constant selection produces the
"sudden" shape; drift makes real trajectories jagged and usually fatal to the allele; and the
observed aDNA (96 derived in 3,084) constrains almost none of the curve.

---

## Q9. If hotspots are just where LP originated, shouldn't the genomes show a timeline?

Yes — and **the paper had the data and didn't look.** They collated **2,999 ancient BAM files**
(whole-genome alignments) and extracted **one SNP pileup**. Haplotype length and diversity around
rs4988235, and ancestry decomposition, would directly test origin-versus-selection. Unused.

One fact already cuts against pure allele surfing: the inferred origin is **central Europe**
(Itan et al. 2009), but the modern peak is **Britain/Ireland/Scandinavia**, and the paper's own
map shows central Europe had *lower* milk use than the northwest. Origin, milk hotspot, and LP
hotspot are three different places.

---

## Q10. Why crisis in Britain, the Middle East, and Africa specifically?

**Premise needs correcting.** Two different maps are being conflated:

| | rs4988235 (this paper) | Global LP phenotype |
|---|---|---|
| NW Europe | high (74.9% Britain) | high |
| Middle East | **5.4% — low** | high, via −13915\*G |
| Africa | not analyzed | high, via −14010\*C |

The paper's polygons are all European/Eurasian and its allele is the European one. Middle Eastern
and African LP are **different mutations**, so "crisis in Britain, Middle East and Africa" is not
a claim this paper makes or could make. Within its scope the pattern is a **single north–south
European gradient**.

---

## Q11. Does that hold up — interpolate between hotspots and check against ancient LP?

**There is no ancient hotspot structure to interpolate.** Ancient LP is near-zero essentially
everywhere until very late — never clearing ~16%, with 9 and 8 derived alleles in the two
northern regions. You cannot locate a hotspot from 9 observations.

The structure people point at is the *modern* map, separated from anything ancient by 2,000+
years of unobserved history, migration, and drift. That is precisely why the paper models
trajectories rather than mapping ancient hotspots: **the ancient map is flat.**

---

## Q12. Did the paper chart insolation vs. crisis predictions against reality? Can we build it?

The paper has Extended Data Figs 3–6 — one panel per driver — but **never puts them on shared
axes**, which avoids the question of whether the winning models are distinguishable at all.

**Built it:** `driver_comparison.py` → `driver_comparison.png`. Their model reimplemented from
scratch, fit to their public proxies (github.com/AdrianTimpson/2020-03-03523A) and the local
AADR pileups.

**Replication check:** 31 derived alleles in the fitted window — matching their power analysis's
"less than 30 derived alleles, which is the number we observe in the actual data". Constant-
selection null: s = 2.29%/gen, y₀ = 0.0011.

| model | Δ lnL | likelihood ratio | p |
|---|---|---|---|
| **PER-REGION constant s** *(never run in the paper)* | **8.12** | **3,351×** | 0.001 |
| insolation (inverse) | 7.12 | 1,232× | 0.00016 |
| settlement density | 6.22 | 505× | 0.00042 |
| population fluctuations | 5.11 | 166× | 0.0014 |
| wild animals (inverse domestic) | 3.63 | 38× | 0.007 |
| insolation (direct) | −0.00 | 1× | — |
| **milk proportion** | **−3.06** | **worse than null** | — |

**Qualitative reproduction is good** — same four drivers beat the null, milk fails outright, wild
animals lands at 38× against their 34×. **Ordering differs** from their 689/284/34: I use the full
AADR file rather than their curated 1,293-individual subset, and they also ran a dominant model.
Treat my absolute ratios as indicative, the *ranking against per-region constant* as the finding.

**The result:** a model with **no time dimension whatsoever** — just four regional constants —
beats every ecological driver they tested. And the plotted curves are visually indistinguishable
until the final few slices, where the confidence intervals span most of the y-axis.

This does not disprove the crisis mechanism. It shows the evidence offered for it is equally
consistent with "selection was steady and simply stronger in the north", which requires no famine,
no crowding, and no episodes.

---

## Q13. Bulk of change from 2000 BC onward — what evidence? Did the Black Death select for LP?

**⭐ The window problem.** The driver comparison was fit on individuals from **8,000–2,500 BP**
(confirmed in the proxy files: 25 slices of 220 years, ending 2500 BP = 550 BC). But the bulk of
the sweep runs from roughly **1050 BC to the present**.

**The overlap is ~500 years.** The famine and density proxies were tested almost entirely across
the flat shoulder — when LP was rare and barely moving — and are silent over the period when the
allele actually swept. **The 689× describes the millennia when nothing much happened.**

Every crisis you'd most want to test therefore falls outside the model: Late Bronze Age collapse
(~1200 BC), the Antonine and Justinianic plagues, the Great Famine of 1315–17, the Black Death.

**The Black Death test — attempted, not feasible.** European samples (lat 35–62, lon −11–40) from
the local AADR file:

| period | individuals | alleles | derived | LP freq |
|---|---|---|---|---|
| pre-2000 BP | 1,062 | 1,854 | 40 | 2.2% |
| 2000–1000 BP | 77 | 119 | 10 | 8.4% |
| 1000–700 BP (pre-plague) | 17 | 27 | 6 | 22.2% |
| 700–550 BP (plague era) | 7 | 13 | 3 | 23.1% |
| <550 BP (post-plague) | 9 | 14 | 2 | 14.3% |

**14 alleles after the plague.** The apparent post-plague *decline* is noise, not signal — no test
on these counts means anything. The AADR samples also aren't drawn from plague contexts, so
there's no victim/survivor contrast even in principle.

**The design exists and is proven:** Klunk et al. 2022 (Nature) compared pre-plague, victim, and
post-plague London and Danish burials and detected selection at immune loci including ERAP2. The
same design applied to rs4988235 is a well-posed, **unrun** experiment. It would need targeted
sampling from plague cemeteries, not a compendium.

**Long-run trend evidence is real, though:** the 2.2% → 8.4% → 22% progression above is
independent corroboration of Burger et al. 2020 — LP genuinely does most of its climbing in the
last two to three millennia.

**On milk as famine food** — dairy was a staple of the medieval European poor and features in
pastoralist famine strategies, but I haven't verified specific sources; treat as unresearched.

---

## Where this leaves the paper

**Solid:** the milk map itself (6,899 residues, 13,181 sherds, 554 sites, ~30% new — milk
widespread from the Neolithic start, fluctuating rather than rising). Milk intensity doesn't
explain LP. LP has almost no modern phenotypic consequence.

**Weak:** that famine and pathogens specifically drove selection. The winning proxies are
correlated, latitude-entangled, share their advantage with a time-invariant variable, and are all
beaten by four regional constants.

**Structurally compromised:** the driver test runs over 8,000–2,500 BP while the sweep runs
1050 BC → present. Wrong window, and only 31 derived alleles inside it. Their own power analysis
says that at fewer than 30 derived alleles, only ~20% of genuine signals would be detected.

**Unresolved by the authors' own admission:** crisis vs. chronic cannot be separated, and the
calcium/vitamin-D hypothesis was *not* ruled out.

---

## Open threads

1. **Resolve the sign of the population-fluctuation proxy.** The *direct* form wins (inverse
   fails), but the file is a 0–1 normalized residual with no stated polarity. If high = population
   above trend, the winning model puts peak selection during **booms**, which is the crowding
   story, not famine. This is checkable against the raw SPD and would materially change what the
   result means.
2. **Extend the model window past 2,500 BP** using the medieval and Roman aDNA that exists, so
   the drivers are tested over the period when the allele actually moved.
3. **Haplotype and ancestry analysis** on the 2,999 BAMs to separate origin/surfing from
   selection.
4. **Targeted plague-cemetery LP typing**, Klunk-style.
5. **A lactose-load proxy**, not a milk-fat proxy — sieve vessels, vessel morphology, or dental
   calculus proteomics — since Δ¹³C cannot see the variable that matters.

## Sources beyond the paper

- [Molecular basis of lactase persistence: linking genetics and epigenetics](https://onlinelibrary.wiley.com/doi/10.1111/ahg.12575) — Cohen 2025, Annals of Human Genetics
- [In vitro functional analyses of variants in the lactase enhancer](https://pmc.ncbi.nlm.nih.gov/articles/PMC5129500/)
- [Timpson data + code repo](https://github.com/AdrianTimpson/2020-03-03523A)
- [Diekmann aDNA analysis repo](https://github.com/ydiekmann/Evershed_Nature_2022)
