# Evershed et al. 2022 — what the evidence actually shows

Date: 2026-08-07
Paper: *Dairying, diseases and the evolution of lactase persistence in Europe*, Nature (https://doi.org/10.1038/s41586-022-05010-7)

Working through this paper by interrogating its method rather than its abstract. Organized by
the questions asked, in the order they were asked, because the answers build on each other.

**Headline for the impatient:** the paper's negative results (milk doesn't explain LP; LP does
almost nothing today) are solid. Its positive claim — that famine and disease drove LP selection
— rests on a model comparison that, on inspection, is mostly detecting a *north–south spatial
gradient*, not the episodic crises the hypothesis is named for.

---

## Q1. What evidence supports the disease/famine theory?

Three layers, only the first quantitative.

### Layer 1 — model likelihood comparison (the only direct evidence)

LP allele frequency trajectories were fit under models where selection strength is modulated by
an archaeological time series, compared against a null of constant selection since the Neolithic.

| Proxy | Mechanism it stands for | LP data more probable than constant selection |
|---|---|---|
| Population fluctuations (detrended ¹⁴C SPD residuals) | crisis / famine | **689×** |
| Residential density statistic | chronic / pathogen | **284×** |
| Proportion wild vs. domestic animals | either | **34×** |
| Milk use (Δ¹³C ≤ −3.1‰ sherds) | virtuous circle | **no improvement** |
| Inverse solar insolation | calcium assimilation | also significant |

Proxies built from >110,000 ¹⁴C dates across >27,000 sites, and >1,000,000 NISP faunal counts
(17 meat-bearing taxa, 1,093 phases, 825 sites). Nine hypothesis tests total, Benjamini–Hochberg
corrected at δ = 0.02.

### Layer 2 — eliminative evidence

- Milk use was **widespread from the Neolithic outset**, in an almost entirely LNP population.
  There was no gradual ramp-up for a virtuous circle to ride.
- **UK Biobank (~337,000 unrelated white British):** 91.9% of genetically LNP participants mainly
  drink dairy milk. Only 2.5% follow a lactose-free diet. LP allele associations with mortality
  (HR 1.00), vitamin D, bone mineral density, IGF-1, height, live births, children fathered — all
  essentially null. Only BMI moved, by 0.01 s.d.

The crux: milk is near-harmless to healthy LNP adults *today*, yet LP was under ~1–2% per
generation selection. So the selective cost needs an **amplifier that existed then and not now**.
Famine and pathogen load are candidates for that amplifier.

### Layer 3 — mechanistic plausibility from outside literature

- Lactose-induced diarrhoea shifts from inconvenient to **fatal in the severely malnourished**.
- Unfermented high-lactose milk is more likely consumed once other food is exhausted.
- ~61% of known and ~75% of emerging human infectious diseases are zoonotic; farming raised
  density, mobility, animal proximity.
- LP genotype associates strongly with gut microbiome composition **only in milk consumers**.
- Late-childhood (5–18) to early-childhood (2–5) mortality ratio rose over the period LP rose.
- Modern China: very low LP, milk consumption up >25-fold in fifty years, no apparent penalty.

### What it does not do

Nothing here directly observes famine- or infection-linked LP mortality. The wild/domestic result
is explicitly ambiguous — readable as supporting either mechanism, *or* as counting against the
chronic one if pathogens came mainly from domesticates.

---

## Q2. How exactly was the model fit? What "selection", mechanically?

### The object being fit

Not a curve. Binary reads: at each dated ancient individual, the allele at rs4988235 is derived
(LP) or ancestral (LNP). 1,786 individuals with the SNP covered; 3,057 alleles from 1,770
individuals in Fig. 3 — but only **~98 derived**.

### The population-genetic core

Deterministic logistic sweep. **No drift, no migration, no population structure.** Additive
fitness 1+2s / 1+s / 1. Frequency after *t* generations (28 yr each) from starting frequency y₀
at 8,000 BP:

```
y(t) = y₀ / (y₀ + (1 − y₀)·e^(−st))
```

y₀ is a free parameter — which dodges dating the mutation's origin and avoids the low-frequency
regime where drift dominates.

### How a proxy becomes "selection" — the actual mechanism

Given proxy time series `m(t)` normalized to [0,1]:

```
s(t) = b · m(t)^(1/a − 1)
```

- `b` = maximum selection coefficient
- `a ∈ (0,1]` = a **peakiness knob**, nothing more
- At `a = 1` the exponent is 0, `m` drops out, `s(t) = b` — **the null is nested inside**
- As `a → 0` the exponent blows up, so `m(t)^big` ≈ 0 except near `m`'s maximum → selection
  collapses into rare intense bursts

`m(t)` is piecewise constant over ~century windows, so `s(t)` is too; the logistic is chained
across windows, each starting where the last ended.

**No biology is encoded.** The crisis and chronic narratives are interpretation laid over a
curve-shape test.

### Likelihood

Each ancient allele is a Bernoulli draw from the modeled frequency at its date:

```
ln L = Σ_ancestral ln(1 − y(tᵢ)) + Σ_derived ln y(tⱼ)
```

Summed across all four regions with **one shared parameter set** (y₀, a, b). That's the
constraint that gives the test teeth: three numbers must reproduce four regional trajectories at
once. Optimized by differential evolution (`JDEoptim`, 6 restarts).

### What "689×" is

`exp(Δ ln L)` — a likelihood ratio. Δ ln L ≈ 6.5, LRT ≈ 13 on 1 df (the extra parameter `a`),
p ≈ 3×10⁻⁴. **It is a measure of fit, not a probability that famine caused anything, and not an
effect size.**

### Why milk lost — and it isn't what you'd assume

Not because milk is unrelated to LP. Because of **time-series shape**. Milk use is high from the
outset and stays broadly high everywhere. A near-flat `m(t)` raised to any power is still
near-flat — nearly indistinguishable from the constant model *by construction*, so the optimizer
just pushes `a → 1` and gains nothing. Milk's failure is substantially a failure to vary
informatively.

---

## Q3. So it's "find which pre-existing dataset best fits the gene curve"?

Broadly yes — a fit contest among curves they already had. Three qualifications:

1. **They weren't fitting to an LP curve.** There is no observed LP trajectory. The model turns a
   proxy into a predicted frequency curve, scored on how probable it makes ~3,057 individual 0/1
   observations. The smooth curves in Fig. 3 are *output*.
2. **The proxy can't be bent.** Its shape is fixed; the optimizer gets only peakiness, max
   strength, and starting frequency — shared across four regions. Genuinely constrained, not
   curve-fitting in the pejorative sense.
3. **The headline test is against flat, not against each other.** Milk failed that test; four
   others passed. The ranking among winners (689 / 284 / 34) had no significance test run on it,
   and the winners are mutually correlated.

Fair one-liner: **they asked whose time-shape the ancient DNA prefers, milk's shape lost, and
several others won — including the one supporting the hypothesis they set out to challenge.**

---

## Q4. Did famine line up with regions lacking LP? Why only some regions?

### It's a gradient, not presence/absence

| Region | Modern LP | Inferred selection/gen | LP alleles in aDNA | LNP alleles |
|---|---|---|---|---|
| British Isles | 74.9% | 1–6.3% | **9** | 278 |
| Baltic | 57.5% | 1.2–3.9% | **8** | 110 |
| Rhine–Danube | 40.3% | 0.6–2.5% | 18 | 829 |
| Mediterranean Europe | 26.1% | 0.7–2.1% | 28 | 655 |
| Central Asia | 8.9% | 0.4–1.8% | 32 | 763 |
| Southwest Asia | 5.4% | 0.2–3.3% | 3 | 296 |

Mediterranean Europe went 0 → 26%. That's a real sweep, just less complete. And the intervals
overlap heavily (British Isles 1–6.3% vs. Mediterranean 0.7–2.1%) — the claim that selection
*differed regionally* is itself weakly resolved.

### How the model encodes regions

Proxies built per polygon; population fluctuation normalized *globally* across polygons, so
cross-regional magnitude differences survive. With y₀, a, b shared, **every regional difference in
outcome must be carried by the proxy.** The model's answer is therefore: southern Europe ended
lower because its `m(t)` was lower or less peaked.

### The problem

**They never show southern Europe had less crisis.** No regional decomposition of the proxies in
the main text — only joint likelihoods. And the literature they lean on (Shennan et al. 2013,
their own "boom and bust" source) documents collapses across Europe broadly, Mediterranean
included.

### The tell — insolation is time-invariant and still wins

The authors state plainly that solar insolation and its inverse "are not time variable" — one
constant number per polygon. **A model carrying zero temporal information beat the null.**

That means much of what the "fluctuating selection" models capture is not bursts at all. It is
just *regions differ in selection strength*, in a north-to-south gradient. Any proxy that runs
high in Britain and low in the Mediterranean picks up that signal. Population volatility,
settlement density, and latitude are all entangled in exactly that pattern.

### Confounds the paper itself concedes

Modern LP distribution may reflect the allele's **origin location**, **allele surfing** on a range
expansion, or **Steppe-associated migration**. The model shares one y₀ across regions and excludes
migration entirely, so any real regional difference in starting frequency or ancestry gets
misattributed to ecology.

Also: LP is high in Africa, the Middle East, and southern Asia, via *independent* alleles. "The
north selected harder" is not a general law — it's a European pattern needing a European
explanation.

---

## Q5. When did LP start rising in northern Europe? Was it smooth? If smooth, why would sunlight act with a delay?

### The dates the paper keeps deliberately separate

- **~4700–4600 BC** — earliest individual carrying the allele
- **~2000 BC** — first "appreciable frequencies"
- **Last ~3,000 years** — where Burger et al. 2020 place the bulk of the rise (Iron Age onward,
  into historical times)

The paper is emphatic that origin, start of selection, first observation, and reaching appreciable
frequency are four distinct events "each possibly separated by thousands of years."

### Smooth? Unknown — the northern data are almost absent

**Nine derived alleles in the British Isles.** Eight in the Baltic. The entire climb from near-zero
to 75% happens *after* the aDNA sample thins out. The blue sigmoids in Fig. 3 are "maximum
likelihood sigmoid curves of constant selection" — the model's assumption drawn through the data,
not a measured trajectory. With 9 points, smooth and bursty are indistinguishable. That is exactly
why the analysis is a likelihood comparison rather than a look at the curve.

### ⭐ The key finding: constant selection manufactures the delay for free

A logistic sweep from a rare allele produces a long flat shoulder *by itself*. Exponential growth
is invisible in absolute terms for millennia, then appears to explode.

Running their own equation with y₀ = 0.5%, s = 2.2%/generation, 28-yr generations from 8,000 BP —
**perfectly constant selection, no fluctuation whatsoever**:

| Crosses | Approx. date |
|---|---|
| 2% | ~4300 BC |
| 5% | ~3000 BC |
| 10% | ~2100 BC |
| 25% | ~700 BC |
| 50% | ~700 AD |
| ~75% | today |

*(My arithmetic — illustrative, not the paper's published fit, but using their parameterization
and inside their British Isles range of 1–6.3%.)*

Half the total rise falls in the last ~2,700 years. The allele sits under 10% for four millennia
after selection begins. This reproduces "first seen 4700 BC", "appreciable by 2000 BC", and
"ongoing strong selection over the last 3,000 years" — **with a pressure that never changes.**

So sunlight needs no delayed onset. Neither does anything else. The lag is not evidence of
episodic pressure; it is the default behavior of any sweep starting from a rare allele.

### 🔁 This revises the premise in `lactase-persistence.md`

That file's driving question assumes: *"It wasn't a slow gradual development, it was basically
nothing then all at once."*

The "nothing then all at once" shape is **exactly what steady, unchanging selection predicts.** It
is not an anomaly demanding a special explanation. The genuinely anomalous parts of the premise
survive, though:

- LP is **not** correlated with how early or how heavily milk was consumed — central Europe had
  consistently *lower* milk use than the northwest yet was proposed as the LP selection origin;
  Britain had immediate high milk use that then *declined* while ending with the highest LP.
- Milk arrived first, everywhere, into a population that couldn't digest it and drank it anyway
  with little immediate cost.

---

## Where this leaves the paper

**Well-supported:**
- The milk map itself — 6,899 animal fat residues, 13,181 potsherds, 826 phases, 554 sites, ~30%
  newly generated. Milk use widespread from the Neolithic start, fluctuating regionally rather
  than trending upward. Absent from Neolithic Greece despite >870 sherds.
- Milk-use intensity does not explain LP trajectories.
- LP has almost no measurable phenotypic consequence in modern populations.

**Weakly supported:**
- That famine and pathogen exposure specifically drove selection. The winning proxies are
  mutually correlated, latitude-entangled, and share their advantage with a time-invariant
  variable — which points at a spatial gradient rather than episodic crises.

**Untested:**
- The crisis mechanism's one distinguishing prediction: that selection came in **episodes timed
  to specific demographic crashes**. Nothing in this analysis discriminates that from a steady
  pressure that simply differs in strength between regions.

**Unresolved by the authors' own admission:**
- Crisis vs. chronic cannot be separated.
- The calcium/vitamin-D hypothesis they set out to challenge was *not* ruled out — inverse solar
  insolation also beat the null.

---

## Open threads worth pulling

1. Does the ¹⁴C-derived population-fluctuation proxy actually differ in amplitude between northern
   and Mediterranean polygons? The data are public
   (github.com/AdrianTimpson/2020-03-03523A) — this is checkable, and the paper doesn't report it.
2. If insolation (time-invariant) and population fluctuation (time-varying) fit comparably well,
   how much likelihood is left once you regress out the between-region constant? A model with
   per-region constant `s` and no time-series at all would be the honest baseline — and the paper
   never runs it.
3. Where does the LP allele's inferred geographic origin sit relative to the selection gradient?
   If origin and gradient coincide, allele surfing explains the map without ecology.
