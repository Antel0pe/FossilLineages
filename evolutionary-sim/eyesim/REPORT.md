# Eye evolution simulator — results

**Updated 2026-07-26.** Code in `evolutionary-sim/eyesim/`, built from
[eye-sim-build-spec.md](../eye-sim-build-spec.md).

---

## 1. Headline

Starting genome is a **bare flat patch**: no cup, no pigment, no lens, one membrane layer, 4
receptors, 600 s integration, Δρ = 180°. Nothing in the code rewards acuity — invariants I1–I3
verify that by source inspection, and no Nilsson "class" appears in any branch.

**The eye now reaches Nilsson class IV, in a world with no predators in it at all.**

Current numbers, from the verification run in `logs/verify-v3.txt`:

| Run | Predators | Δρ start → end | Class | Resolvable directions | Population |
|---|---|---|---|---|---|
| **V17/V2** pre-predation | **none** | 180° → **0.287°** | 1 → **4** | 1 → 30 | stable 34,105 |
| **V7** arms race | yes | 180° → **0.702°** | 1 → **4** | — | stable |

In the no-predator run, **predation deaths = 0; 2,624 starvation, 71 UV.** The camera eye is built
entirely by foraging.

Earlier drafts of this table quoted 0.243°/0.654° from a previous code state. Those are superseded;
the endpoint moved slightly as the predation defects in §3b.6 were fixed. The qualitative result —
flat patch to class IV, with zero predators — is unchanged throughout.

### Which endpoints are actually evidence — and which are circular

An evolved gene that finishes **at a bound I chose** is not evidence the model found that value,
especially when I drew the bound from the same literature the result is being compared against.
Invariant I12 reports this automatically so it can never be quoted as a match again.

| Quantity | Nilsson class IV | Evolved | Status |
|---|---|---|---|
| **Acceptance angle Δρ** | 1–5°, fractions of a degree possible | **0.22–0.33°** | **genuine** — derived from four blur terms, not a gene, not capped |
| **Integration time** | 0.05 s | **0.0137 s** | **genuine** — interior to [0.01, 600] |
| Membrane stacking | 1,500–4,000 | 2,777–4,000 | **partly circular** — 4000 *is* the cap, taken from Nilsson |
| Lens | focusing lens required | 0.350 | **circular** — 0.35 is the cap, set from Matthiessen's 0.33 |
| Eye size | — | 3.0 mm | **at cap** — my choice |

An earlier draft of this report called these "three independent matches". That was wrong.

---

## 2. How I got there — the experiment chain

This is the part that matters, because the first build did *not* work: it stalled at class III
(21–38°) no matter what. Four experiments, each changing one thing.

### 2.1 Diagnosis first: where does acuity actually pay?

Before touching the model I computed detection range against acceptance angle, straight from the
optics, for every target type and water clarity (`diagnose.mjs`). The result was unambiguous:

**Range gain from sharpening 20° → 2°:**

| Target | Kd 0.12 | Kd 0.35 | Kd 0.55 | Kd 1.0 |
|---|---|---|---|---|
| **food patch (10 m)** | **1.00×** | **1.00×** | **1.00×** | **1.00×** |
| *Anomalocaris* (0.35 m) | 1.98× | 1.59× | 1.37× | 1.04× |
| *Isoxys* (0.03 m) | 3.35× | 2.84× | 2.80× | 3.03× |
| mesozooplankton (2 mm) | 7.67× | 6.68× | 6.60× | 7.10× |
| particle (0.5 mm) | 9.20× | 8.67× | 8.61× | — |

**A 10 m food patch is angularly enormous, so it is always resolved and Δρ drops out of the
detection inequality entirely.** Foraging was 90% of deaths and it was supplying *exactly zero*
gradient on acuity. Predator detection gave only 1.04–1.98×. That is the whole reason the eye
stalled.

Acuity only pays when the target is **unresolved** — and it keeps paying down to 0.02° when the
target is a 0.5 mm particle.

### 2.2 Experiment 1 — was it water clarity? No.

The spec's primary sweep axis. Result: clarity changes the detection *range* but not the *steepness
of the acuity gradient*, exactly as the table above predicts. It was not the cause.

### 2.3 The change: discrete prey particles

The focal animal's food was implemented as a smooth energy field. But the build spec lists
`mesozooplankton` as "individuals m⁻³", and the research doc has myllokunmingids eating "small
mesozooplankton" and bradoriids doing "sweep-net capture of food items down to 0.5 mm". **I had
simplified away a documented feature of the environment**, and it happened to be the only feature
in the world that requires resolution.

Added: three zooplankton size classes (0.5 / 1.5 / 4.0 mm, mass ∝ L³ at copepod scale) as depleting,
regrowing particle fields. Capture is a swept-volume encounter kernel using the detection range the
optics already give, saturated by handling time (Holling type II). The smooth field remains and
still feeds a blind animal.

### 2.4 Experiment 2 — the control that proves it is the mechanism

Sweep the particulate fraction, change nothing else:

| Particulate share of food flux | Δρ end | Class |
|---|---|---|
| **0%** (smooth field only) | **21.5°** | **2** |
| 15% | 0.368° | **4** |
| 30% | 0.258° | **4** |
| 50% | 0.224° | **4** |
| 70% | 0.313° | **4** |

**Remove the small discrete targets and the climb stalls at class II–III, exactly as before.** This
is a threshold crossing, not a dose-response: 15% is already enough, and more does not make the eye
monotonically sharper. The class III → IV step requires small individually-detected targets, which
is precisely what Nilsson lists class IV as being *for*.

### 2.5 Experiment 3 — a missing physics term found by a sensitivity sweep

After the particles went in, integration time evolved **upward** (129–335 s), which is backwards.
Cause: the build spec has a motion-blur term `dp_motion = ω × integration_time` and I had never
implemented it, so a long integration collected photons at no cost.

Implementing it (ω = 0.10 rad/s, the rate at which the scene sweeps across the retina for a 26 mm
animal cruising past targets at working range) flipped it: integration time now crashes to
**0.010–0.02 s**, and membrane stacking climbs to **2,777–4,000 layers** to recover the photons
that the short integration gives up. That stacking figure lands inside Nilsson's stated class IV
range without being aimed at it.

### 2.6 Experiment 4 — a discontinuity I had built in

An episode-length sweep gave a nonsense pattern: 0.5 days → class IV, **1 day → stuck at 180°**, 2
days → class IV. Non-monotone results usually mean an artefact, not a dependency.

Root cause: `if (invagination < 0.05) deltaRho = PI` — a hard cutoff in my optics. Below it, Δρ was
constant, so **the gradient on every other eye gene was exactly zero** and the population had to
cross that plain by drift alone. That is the same flat-plain failure the research doc's §3 warns
about, and I had built it into the code.

The geometry does not need the special case: with a wide aperture and a shallow cup, the defocus
term is several radians and Δρ saturates at π on its own. Deleting the cutoff and letting one
continuous formula cover every morphology fixed it:

| Episode length | 0.5 d | 1 d | 2 d | 4 d |
|---|---|---|---|---|
| Δρ end | 0.368° | **0.303°** | 0.224° | 0.241° |
| Class | 4 | **4** | 4 | 4 |

No sensitivity at all. The "episode length effect" was entirely that artefact.

---

## 3. The order in which the eye was built

Not specified anywhere. Generation at which each gene reached half its excursion (run G, no
predators):

| Order | Gene | 0 → end | Half at gen |
|---|---|---|---|
| 1 | **aperture ratio** | 1.00 → 0.94 | 20 |
| 2 | **integration time** | 600 s → 0.010 s | **20** |
| 3 | **cup invagination** | 0.00 → 0.470 | 40 |
| 4 | **lens index gradient** | 0.000 → **0.350** (Matthiessen ideal) | **40** |
| 5 | receptor count | 4 → 85 | 50 |
| 6 | eye size | 0.10 → **3.00 mm** | 50 |
| 7 | **membrane layers** | 1 → **4000** | 70 |
| 8 | screening pigment | 0.00 → 0.259 | 90 |

Class thresholds crossed: ≥2 resolvable directions at gen 50, Δρ ≤ 40° at gen 40, **Δρ ≤ 5° at gen
50, Δρ ≤ 1° at gen 50.**

The narrative: **stop integrating for ten minutes**, then **invaginate and focus**, then **grow the
eye and pack in receptors**, then **stack membrane** to buy back the photons the fast integration
gave away. That last step is the sensitivity/acuity trade-off resolving itself in the direction
Nilsson predicts — you cannot have both a 0.01 s integration and a fine acceptance angle without
paying for it in membrane.

---

## 3a. The anti-rigging invariants

The question this suite exists to answer is not "did the eye evolve" but **"did anything make it
evolve other than seeing better paying off"**. Governing rule, enforced in `verify.mjs`:

> Nothing may reward a morphological milestone, bias a direction of change, or make the answer
> reachable only one way. The eye must improve **only** because better sight returns more energy or
> fewer deaths, through the same physics that applies to an eye that stays bad.

| ID | Catches | Result |
|---|---|---|
| I1–I3, I8 | a fitness term reading acuity, a sight-range constant, control flow on a Nilsson class, a settable capture rate | PASS |
| **I9** | **a discontinuous reward at a morphological milestone**, anywhere in the perception→fitness path | PASS |
| **I10** | **a mutation operator with a hidden directional push** | PASS |
| **I11** | **the null control** — perception off, mutation on: the eye must NOT improve | PASS |
| **I12** | genes finishing at author-chosen bounds, so they can't be quoted as matches | INFO (reports them) |

### Two real violations these found

**I9 — a hand-set step.** `depthUncertainty()` contained `if (pixels < 2) return 6.0`, else ~0.2 m:
a **30× jump in a survival-relevant quantity at a specific morphological milestone**. I1 missed it
because I1 only guards the energy/birth/death/capture blocks and this sat in the perception block.
Replaced with a continuous derivation — the undifferentiated fraction of the eye's signal still
carries the depth/time-of-day confound, so σ_z = hypot(12 m × (1 − directionality), photon noise),
where directionality = (pixels − 1)/pixels. Smooth, monotone, largest single-sample drop 2.28%.

**Did it matter?** No — and that is the point of testing rather than confessing. Three seeds with
the step removed: **0.281°, 0.262°, 0.328°**, all class IV. The nudge was not load-bearing.

**I10 — an unbiased-looking operator that wasn't.** `receptorCount` drifted **+5.3% of its range
per generation with no selection whatsoever**, because a log-normal (multiplicative) step on a
bounded gene has a systematic upward push in linear space — and "up" is the direction of a better
eye. Three of the four log genes push toward better eyes. The operator is symmetric in the metric
it works in, so I10 now measures drift in log space for log genes (0.413%), and **I11 is the
empirical backstop** that would catch any residual bias in any metric.

### I11 is the result that answers the question

Disable perception entirely, leave mutation fully on, run 150 generations. Nothing in the world can
read the eye, so every eye gene is neutral:

| World | Δρ after 150 generations |
|---|---|
| **perception disabled** | **180.0°** — exactly where it started |
| perception on | **0.328°** |

**548×.** No one-way mutation street, no bounds artefact, no hidden reward is moving the eye. It
moves when, and only when, seeing feeds back into survival.

---

## 3b. Four things I was challenged on, and what the data said

All four came from reviewing the pre-commit disclosure. Three of my justifications turned out to
be wrong or stale.

### 3b.1 "Supply-limited phytoplankton instead of logistic" — my justification was stale

**What I claimed:** pure logistic growth locks the world into a dead state once grazed down, so I
replaced it with a supply-limited form.

**First correction:** I did not *limit* production. I **added a source term**. The change was the
opposite direction to "capping it".

**Second correction, from the experiment** (`--sweep advection`, 200 generations):

| | phyto at equilibrium | population | evolved Δρ |
|---|---|---|---|
| advection ON | 0.62% of capacity | 32,825 | 0.294° (class IV) |
| **advection OFF (pure logistic)** | **0.00% — permanently** | **16,630** | **0.230° (class IV)** |

The phytoplankton field *does* collapse to an absorbing zero under pure logistic — that part was
right. But **the world does not die and the eye still evolves.** My claim was true of an earlier
build where the smooth field was the only food; since particulate zooplankton was added (with its
own supply term) the population simply lives on zooplankton, at about half the carrying capacity.

So the advection term is **justified but not load-bearing**. It stays because a 4 m grid cell is
not a closed plankton population — horizontal mixing refills it in hours — but the headline result
does not depend on it, and I should have re-tested the claim instead of carrying it forward.

### 3b.2 Is the world over-grazed? The alarming number is a misleading metric

At equilibrium the grazing fraction reads **1.000** — the guild eats 100% of production, forever.
That looks pathological. It is not, and the metric was my fault:

| Denominator | Value |
|---|---|
| Total primary production | 3,699 J m⁻² day⁻¹ |
| × accessible (0.20) × focal share (0.25) → guild allocation | 185 J m⁻² day⁻¹ = **5.0% of PP** |
| of which the smooth field | 92 J m⁻² day⁻¹ = **2.5% of PP** |

"1.000" meant *100% of the focal guild's own allocation*, which is **2.5% of total primary
production**. Modern mesozooplankton graze 10–40% of PP, so the model is if anything *under*-grazing.
And consuming 100% of your own allocation is the definition of a resource-limited equilibrium: the
stock sits at R\*, the break-even resource density. The 0.6%-of-capacity standing stock is R\*, not a
crash.

Both numbers are now logged: `grazingFractionOfAllocation` and `grazingFractionOfPP`.

### 3b.3 Why 50% density and a 120 m arena? Because of bugs I later fixed

**Density** — I seeded at 50% of the spec's 2.1 m⁻² because seeding at 100% collapsed the
population. That was before I fixed the gut-fraction bug and the non-recovering resource, and **I
never re-tested it**. Sweep:

| initial density | 0.5 | 1.0 (spec) | 1.5 |
|---|---|---|---|
| evolved Δρ | 0.294° | **0.304°** | (run) |
| population | 32,825 | 33,799 | |

The full spec density works. **Default changed to 1.0** — the workaround is gone.

**Arena** — 120 m rather than the spec's 150 m was purely compute cost. Sweep: 120 m → 0.294°,
150 m → 0.271°, populations 32,825 and 51,786. Both class IV, no effect on the result. 120 m stays
as the default for speed, and it is above the spec's own ≥100 m floor for apex-predator viability.

### 3b.4 V7 capture success 0.514 — a measurement timing error, not lenient grading

I had flagged this as me grading leniently. The real cause is worse and simpler. Trajectory of the
evolved eye:

| generation | 0 | 25 | **50** | **75** | 100 | 150 |
|---|---|---|---|---|---|---|
| Δρ | 180° | 180° | **180°** | **1.04°** | 0.42° | 0.33° |

**The eye is still at 180° at generation 50 and only crosses into class IV around gen 75.** V7 ran
for **60 generations** — so it was measuring capture success against effectively blind prey. 0.514
is the right answer to the wrong question, and the 600-generation arms-race run gives 0.18–0.23,
inside the spec band.

V7 now runs 400 generations and measures the median over the last 25%, reporting the pre-vision
value alongside it so the difference is visible rather than hidden.

### 3b.5 Running the rest of the spec's verifiers found three more defects

Implementing V1, V3, V4, V10–V14, V16, V19–V22 (previously unrun) surfaced problems that the
partial suite had been hiding.

**V4 — the apex predator was eating the wrong prey.** Realised diet measurement showed
*Anomalocaris* taking 157,023 items averaging **0.211 g** — a **1184:1** mass ratio, far outside
the 20:1–330:1 the energy ledger predicts. Two causes, both mine:

1. The spec makes *Isoxys* "visual mesopredator **AND** prey of *Anomalocaris*" and calls that
   three-level structure "the engine". I had implemented *Isoxys* as predator-only, so the apex
   had nothing to hunt but the 0.2 g focal species.
2. I applied the spec's profitability floor (0.3% of predator mass) to the predator-on-predator
   path but **not** to the focal path, so a 250 g animal kept hunting 0.2 g prey it should ignore.

Fixed both. *Anomalocaris* now takes 2,200 items averaging **1.000 g → 250:1, inside the band** —
and it switched to *Isoxys* on its own, from the profitability floor rather than a diet list.

**A predator population that could only ever shrink.** The fix above immediately exposed the next
one: `p.count = Math.max(1, p.count)` meant predator numbers were floored but never grew. As soon
as *Anomalocaris* began taking *Isoxys* it ate the entire mesopredator population to extinction,
and predation on the focal species stopped altogether — V7 and V12 started reporting *no captures*.
Predators are environment, not the species under study, so their abundance should track carrying
capacity: they now relax toward their spec density at a rate set by their own body condition, and
a locally extirpated species recolonises from the surrounding shelf.

**V11/V12 are one failure, not two.** V12 (predator diurnality) fails, and I checked its premise
rather than arguing about it. Computed from the model's own optics, *Anomalocaris*'s detection
range across six orders of magnitude of light:

| noon | full moon | starlight |
|---|---|---|
| 3.94 m | 2.04 m | 1.31 m |

**Only 3× — the binding constraint is the contrast horizon (4/c = 2.08 m), not photons.** A 2 cm
aperture with a 0.05 s integration is not photon-limited at night. The fossil "eye parameter < 2"
argument says the eye was *optimised* for daylight acuity; it does not say the animal was blind
after dark, and V12 conflates the two. **V11 (diel vertical migration) then fails downstream:** with
no nocturnal refuge there is no reason to migrate. V12 stays recorded as a FAIL — I am not
relabelling a failure — with `V12PHYS` reporting the numbers alongside it.

### 3b.6 Chasing V7 down found four more defects, and then a structural answer

V7's numbers contained a clue I initially under-read: **pre-vision 0.605, equilibrium 0.604 —
identical.** Prey vision was having *zero* effect on capture success. Computing the evolved eye's
detection range on a predator showed it could see one at **2.72 m**, losing only 0.031 m to
reaction latency, so capture probability against the focal species should have been ~0.004. The
0.604 was coming from somewhere else. Four defects, each exposed by fixing the previous one:

1. **A hard-coded capture rate.** I had written `if (!a.genome) return 0.6` for non-focal victims.
   Once *Anomalocaris* switched to eating *Isoxys*, that constant *was* the measured capture rate.
   It is now derived from the same escape curve using the victim's mechanosensory range.
2. **The metric mixed two different quantities.** Capture success now reports the **focal species**
   specifically (`captureSuccessAllPrey` retained separately); the all-victim figure is dominated by
   the apex taking *Isoxys* and says nothing about prey vision.
3. **A predation gap.** With the profitability floor applied consistently, the 0.2 g focal animal
   was too small for *Anomalocaris* (floor 0.75 g) and too large for every other predator
   (ceiling 0.05 g) — nothing hunted it at all. Cause: I had generalised
   `MAX_PREY_MASS_FRACTION = 0.05` to every predator, when that number is the **FEA-derived limit
   for *Anomalocaris*'s thin endites specifically**. It is now per-species.
4. **Kills were not limited by digestive capacity.** A super-individual strike killed ~57 prey while
   the gut cap truncated only the *stored* energy — the rest were killed and wasted, taking 83% of
   the focal population per episode. Digestive room now throttles how many individuals **strike**,
   which is both physically right and the correct denominator for capture success.

**With all four fixed, the ecosystem is stable and the causal chain is visible:**

| generation | 0 | 20 | 40 | 60 | 109 |
|---|---|---|---|---|---|
| Δρ | 180° | 25.05° | 1.85° | 0.66° | **0.61°** |
| **capture success** | **0.672** | **0.271** | 0.089 | 0.068 | **0.047** |
| predation, % of deaths | 8.2% | 2.8% | 2.2% | 1.7% | 1.2% |
| population | 27,729 | 40,302 | 39,452 | 41,007 | 41,470 |

**Capture success falls from 0.67 to 0.047 as the eye sharpens from 180° to 0.61°** — prey vision
eroding predator success, which is exactly the causal chain the model is supposed to contain, and
it is not something any term in the code asserts.

**Why V7 still fails, structurally.** The trajectory passes *through* the spec's 0.15–0.35 band
around generation 20–30 and keeps going. That band describes a **co-evolved** predator–prey system.
In this build the predators' eyes are **fixed at measured fossil values by design** (build spec
§7.2, which itself notes "the arms race in this build is one-sided"), so prey improve indefinitely
and predators cannot answer. Equilibrium capture success of 0.047 is the correct outcome *of a
one-sided arms race*. V7 cannot be satisfied until predator eyes co-evolve — that is the fix, and
it is a scope change, not a tuning problem.

---

## 4. Verification

Run `bun evolutionary-sim/eyesim/verify.mjs`; output in `logs/verification.txt`.

**Invariants (source inspection):** I1 no energy/birth/death/capture rule reads acuity · I2 no
sight-range constant · I3 control flow never depends on a Nilsson class · I4 all 35 decision
parameters are genes · I6 Δρ ≤ π across 5,000 sampled genomes · I7 detection strictly monotone in
Δρ at all distances · I8 capture success is not settable. **All pass.**

**Physics:** V8 acuity payoff saturates near the 4/c contrast horizon (asymptote 1.53 m vs 2.08 m) ·
V9 class IV unreachable without membrane stacking at a 5,000-photon budget · BUDGET apex ration
3.3%/day, inside the measured 1–15% band · STARVE predator outlasts prey 27.7 d vs 3.3 d (8.5×).
**All pass.**

**Simulation:** V2 class IV reached from a flat patch · V17 the climb happens with zero predators ·
ZOOCTL removing discrete targets stalls it · V15 blind founders persist · V7 capture success < 1
with common failures.

### The Nilsson cross-check

His three class thresholds, solved for the signal-to-noise ratio each implies:

| Class | N photons | stated contrast | **implied SNR** |
|---|---|---|---|
| I | 50 | 0.30 | **2.12** |
| II | 500 | 0.10 | **2.24** |
| III/IV | 5,000 | 0.03 | **2.12** |

**Spread 5.3%.** They are not three assumptions — they are one photon-shot-noise criterion (Rose)
at three photon budgets. So the simulation implements `|C|·√N ≥ 2` and never references a class at
all; classes are labels applied when reading output, enforced by invariant I3.

---

## 5. What is still wrong or unresolved

- **Several genes finish at their range caps** (membrane 4000, lens 0.350, eye size 3.0 mm). Two of
  those caps are the literature's own class-IV endpoint, so stopping there is arguably correct —
  but it means the eye cost is *not* producing an interior optimum, and V10 (linear vs superlinear
  cost) has still not been run to check that.
- **Capture success ~0.45 in the verification run**, above the spec's expected 0.15–0.35, though the
  600-generation arms-race run settles at 0.18–0.23, inside the band. The escape model is still too
  generous to the predator early on.
- **Diel vertical migration is weak** (1.4 m day/night amplitude vs >3 m expected). The UV hazard is
  ~10× too weak against the vertical food gradient; both are tier D and the model cannot tell which
  is wrong.
- **Predator diurnality (V12) does not emerge**, and I now think the criterion is wrong rather than
  the model: a 2 cm aperture collects ~10⁷ photons per 50 ms under full moon. *Anomalocaris*'s eye
  parameter <2 says it was *optimised* for daylight acuity, not that it was blind at night.
- **Countershading (V22) cannot be claimed.** The dorsal/ventral gap appears in no-predator runs
  too, where ρ is under no selection — so it is drift. Needs a paired control I have not run.
- **The eye parameter comparison in the previous report was wrong.** *p* = D·Δρ < 2 is a *compound
  eye* statistic where D is the facet diameter (~95 µm). For a camera eye with 2 µm receptors the
  number is not comparable, and the earlier "0.92–1.61 matches the fossil target" was a coincidence.
  The meaningful comparison for a camera eye is Δρ itself.
- **Predators do not evolve** (fixed at measured fossil values, by design), so the arms race is
  one-sided.
- **Predators take 75% of their ration from prey outside the model.** Without that they must
  over-harvest the focal species or starve. It is a real assumption and it sets predation pressure.

**The load-bearing assumption is that this animal was a partial visual particulate feeder.** The
diet (small mesozooplankton) is documented; the *visual* capture mode is inferred. §2.4 quantifies
exactly how much rests on it: at 0% the eye stalls at class II, at 15% it reaches class IV.

---

## 6. Honest model accounting

- A generation is one evaluation episode of `episodeDays` simulated days, not a calendar year.
  Compression against Nilsson & Pelger's 365,800 generations is ~900–1,500×, printed per run.
- Movement steps at 30 s; detection and strike outcomes are resolved analytically within the step
  rather than by simulating a chase. Optics, contrast, light and reaction-time asymmetry all
  survive; sub-second kinematics do not.
- One focal agent represents 100 animals; predation and starvation remove individuals from its
  count. Systematic resampling holds the agent list at 400 while preserving total population.
- Population seeded at 50% of the spec's density (the spec figure is a zero-waste ceiling), then
  regulated by real resource competition. Phytoplankton production is supply-limited, not
  stock-limited — a pure logistic collapses permanently once grazed down.

---

## 7. Running it

```bash
bun evolutionary-sim/eyesim/run.mjs --generations 400 --nobearing --epoch pre_predation --nopredation --tag mytest
```

```bash
bun evolutionary-sim/eyesim/diagnose.mjs
```

```bash
bun evolutionary-sim/eyesim/verify.mjs && bun evolutionary-sim/eyesim/analyze.mjs
```

Sweeps: `--sweep kd|sigma|eyecost|eyeexp|handling|epoch|predation|bearing|zoo|episode --seeds 3`.
