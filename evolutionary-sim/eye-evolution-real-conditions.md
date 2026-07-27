# From light-sensitive patch to camera eye: the real numbers

**Compiled 2026-07-25. Revised 2026-07-25 after review.**

---

## 0. What this document is and how it must be used

### 0.1 The goal

Build a **thorough, physically real simulation of the environment in which the eye evolved**, such
that when it runs, an eye evolves — and it evolves *because of the modelled selection pressures*,
not because anything in the code rewards having an eye. The claim we want to be able to make at
the end is:

> "We encoded the environment. We did not encode the outcome. The eye appeared anyway, and its
> endpoint matches the fossil endpoint."

Anything that says "as time passes, acuity improves" is a failure, however well disguised. The
code must *enable* the eye to get better and stay agnostic about whether it does.

### 0.2 The build order: complex-and-correct first, simplify second

**Start maximally complete. Remove things only after the simulation demonstrably works.**

The reason is asymmetric risk. If a parameter is included and turns out to be irrelevant, the cost
is a little wasted compute and one deletion. If a parameter is omitted and turns out to be load-
bearing, the simulation quietly fails to produce an eye and there is no way to tell *which* of the
hundred absent things was responsible. Debugging an absence is far harder than debugging a
presence.

So: **when in doubt, include it.** Section 6 keeps moonlight and starlight even though it is hard
to imagine them mattering — and it turns out (§13.1) they do matter, for a reason that was not
obvious. That is exactly the pattern this rule exists to catch.

The two deliberate exceptions, made on judgement, are listed with their reasoning in **§18
(Deliberately excluded)**, which doubles as the "if it doesn't work, try adding these back"
checklist.

### 0.3 What this document is *for* — and what it is not

**This is the research document.** It holds raw numbers, derivations, reasoning, open questions and
discussion. It is deliberately not clean, and it is not the implementation spec.

**The lean build spec is [eye-sim-build-spec.md](eye-sim-build-spec.md)** — only the settled
numbers, variable names, ranges and what each affects, with none of the discussion. Argument and
uncertainty stay in *this* file where they can be seen and challenged. When a number changes here,
update the spec; when the spec is unclear, the answer is here.

### 0.4 The completeness contract

Even so, the *numbers* must be complete. When the build spec is extracted, the implementing
engineer/LLM should make **no numerical decisions at all** — only translate. If the implementer has
to invent a value, a threshold, a rate, or a rule, that is a bug in this document. Where the
literature gives nothing, this document still gives a number, plus the method that produced it
(§17.1) and an honest confidence tier.

With one deliberate and important exception: **decision parameters are not supposed to have values
here.** They belong in the genome and are discovered by the simulation, not specified by us — see
§3B.1. A blank in the SET column is a bug; a "EVOLVED" in it is the point.

The test: *it should be hard to imagine that a faithful implementation of this document fails to
take a light-sensitive patch to a camera eye.*

---

## 1. Evidence tiers

| Tier | Meaning | How to treat it |
|---|---|---|
| **A** | Measured directly from fossils or rocks | Hard constraint. If the sim contradicts it, the sim is wrong. |
| **B** | Inferred from Cambrian geology/geochemistry via a published model | Constrain to the published range; sweep within it. |
| **C** | Transferred from modern analogues | Free within the analogue's spread. Conclusions should survive the whole range. |
| **D** | Constructed here to close the budget, with reasoning given | Explicitly a free parameter. Never report a result that hinges on one tier-D value. |

**There is no fossil calorie.** Every energy number is C or D. The fossils give bodies, eyes, guts,
bite marks, eggs, and the rock. The energetics is scaffolding built on top, and §17 lists the
weakest joints so they can be attacked first.

---

## 2. Answers to the four questions raised in review

### 2.1 Compound eye vs camera eye — what is actually different?

**They are two different optical solutions to the same problem, not two points on one axis.**

- A **camera eye** has one aperture and one lens forming a single image on a sheet of
  photoreceptors. Resolution is set by focal length and receptor spacing. Vertebrates, cephalopods,
  some snails, some worms.
- A **compound eye** has thousands of separate tiny tubes (ommatidia), each sampling one direction.
  Resolution is set by how many tubes there are and how tightly packed. Arthropods.

**The selection pressure is identical.** Both are Nilsson's class III → IV climb, driven by the
same behaviours: detect and pursue prey, detect and escape predators, recognise mates. Nothing in
this document's environment section changes depending on which architecture you simulate. That is
the good news, and it means the environmental research below is architecture-agnostic.

**What differs is the physics of improvement, and it differs sharply (tier A, physics):**

| | Camera eye | Compound (apposition) eye |
|---|---|---|
| To double angular resolution | roughly double focal length → eye volume ×~8, but no facet-count penalty | must double facet diameter **and** quadruple facet count → **eye size scales as the square of resolution** |
| Consequence at high acuity | cheap; a 25 mm human eye resolves ~1 arcminute | catastrophic. Mallock (1894): a compound eye matching human central acuity needs a **6 m radius** |
| Where it wins | high acuity, any body size ≥ a few mm | small size, wide field, fast motion detection, low acuity |

**On the *Nautilus*** — this is worth correcting carefully, because the mental model it creates is
the single most common misconception about eye evolution.

*Nautilus* is **not an ancestor of anything, and it was not "the most advanced eye of its time."**
It is a **living animal today**, and its eye is a **pinhole camera eye that never acquired a lens** —
an evolutionary dead end held in place for ~500 Myr, not a rung that later animals climbed past.
Each of its receptors views an angle of **>2°** (versus fractions of a degree in octopus), and its
image is extremely dim, because a pinhole eye has an unavoidable trade-off that a lens eye does
not: **any improvement in resolution costs sensitivity, one-for-one.** Shrink the pupil to sharpen
the image and you starve the retina of photons. That trade-off is exactly what a lens breaks, and
it is why the lens is the pivotal innovation in the whole sequence.

The reason *Nautilus* appears in every eye-evolution diagram is that it is a convenient **living
illustration of the pinhole grade** — one of the eight Nilsson–Pelger stages, still walking around.
The diagrams line up flatworm cup → *Nautilus* pinhole → octopus lens eye because those are three
*grades of construction*, not because one descended from another. Octopus and *Nautilus* are both
cephalopods and their camera eyes evolved **separately**; vertebrate camera eyes evolved separately
again, from a third starting point.

So: yes, the sequence patch → cup → pinhole → lens is real and is what we are simulating. No, it is
not a single lineage marching forward, and *Nautilus* is not a step on the way to us.

So the answer to *"if we ran it longer, would a compound eye become a camera eye?"* is **no.** An
arthropod lineage under unlimited selection for acuity produces a *better compound eye*, forever —
it will hit the quadratic wall and stop, but it will never restructure into a camera eye. The two
architectures have different developmental starting points, and evolution cannot cross between them.

**Therefore the architecture is a choice we make, not something the simulation discovers**, unless
we explicitly implement both (see §2.2, option C). Since you want camera-eye selection pressure,
we pick a camera-eye lineage.

### 2.2 Which lineage, then — and the 518–514 Ma window

The 518–514 Ma window in the earlier draft was **the locality window, not the eye-evolution
window.** It is the interval for which we have exceptional, quantitative data on *the environment*
— Chengjiang (~518 Ma) and Emu Bay (~514 Ma) are the two best-resolved Cambrian ecosystems on
Earth. It is not a claim that eyes went from patch to camera eye in those four million years.

**Revised lineage recommendation — and this is a change from the first draft.**

A Nature paper published in 2026 reports **four camera-type eyes in myllokunmingids** — the
earliest known vertebrates, from Chengjiang, ~518 Ma. Two lateral eyes plus pineal and parapineal
organs, all four with melanin-bearing retinal pigment epithelium and a distinct ovoid **lens**,
interpreted as image-forming. This is a **fossil camera eye in the exact ecosystem we already have
the best environmental data for.**

That resolves the tension cleanly:

| | Option A: arthropod line | **Option B: chordate line (recommended)** | Option C: both architectures compete |
|---|---|---|---|
| Eye architecture | compound | **camera** | both, as alternative genomes |
| Fossil endpoint | *Anomalocaris*, ≥16,000 facets, Δφ <1.4° | ***Haikouichthys / Myllokunmingia*, lateral camera eyes + pineal pair, ~518 Ma** | both |
| Same environment? | yes | **yes — same locality, same food web** | yes |
| Gives what you asked for | no | **yes** | yes, plus a genuinely open outcome |

**DECIDED (2026-07-26): option B.** Camera eye, chordate lineage. Simulate the **chordate lineage** (myllokunmingid-
grade, 25–30 mm, nektobenthic) as the eye-evolving population, embedded in the Chengjiang food web
with *Anomalocaris* and *Isoxys* as the visual predator guild. All the environmental,
energetic, optical and light-field research below carries over unchanged — only the eye genome
changes.

**Option C is worth considering later and is the more interesting experiment.** Implement both
architectures with their true cost/size scaling (compound eye size ∝ resolution²; camera eye
resolution ∝ focal length) and let selection choose. The prediction is that compound wins at small
size and low acuity, and camera takes over at the high-acuity end. If the sim reproduces *that*
crossover unprompted, it is a much stronger result than either architecture alone. But build B
first.

### 2.3 "The climb happened before eyes fossilise" — clarified

Not about eye sockets or cavities. The point is simpler and more awkward:

**Eyes are soft tissue. They essentially never fossilise. The handful of Cambrian sites where they
do (Chengjiang, Emu Bay, Burgess) are freak preservation events. And at every single one of those
sites, the eyes we find are already finished — fully formed compound eyes on the first trilobites,
fully formed camera eyes on the first vertebrates.**

There is no fossil sequence anywhere showing a patch becoming a cup becoming a pinhole becoming a
lens. Nilsson's phylogenetic reconstruction puts classes I–III in the Precambrian, in small, soft,
shell-less animals that left no body fossils at all, with the whole opsin-to-high-resolution
process **largely complete by ~530 Ma**.

So the honest framing of what this simulation is:

> We know the *endpoint* (fossil eyes, measured). We know the *environment* (Chengjiang/Emu Bay
> rocks and fauna, measured). We do **not** have the intermediate stages from fossils. The
> simulation asks: **is this environment sufficient to produce that endpoint from a light-sensitive
> patch?** If yes, we have shown the environment was enough. That is a real scientific claim and it
> is the one worth making.

The Chengjiang environment is used as the best available proxy for late-Ediacaran / basal-Cambrian
shallow-shelf conditions. Say this in the sim's README rather than implying the eye evolved at
518 Ma.

### 2.4 The starting point

Start at **Nilsson class I: a bare patch of opsin-expressing cells with no screening pigment, no
membrane stacking, no cup, no lens.** Concretely:

| Property | Starting value | Tier |
|---|---|---|
| Photoreceptor cells | 1–10, in a flat unshielded patch | D |
| Screening pigment | **none** | D |
| Membrane stacking (microvillar/ciliary layers) | 1 (i.e. none) | D |
| Cup invagination | 0 (flat) | D |
| Aperture | undefined (no cup) | D |
| Lens refractive index gradient | 0 (no lens) | D |
| Acceptance angle Δρ | 180° (hemispheric) — the physical maximum | A (physics) |
| Integration time | 600 s | A (Nilsson) |
| Contrast threshold | 30% | A (Nilsson) |
| What it can do | tell bright from dark, slowly | A (Nilsson) |

Opsin itself is **given, not evolved** — the opsin gene family had already diversified into its
three subfamilies (ciliary, rhabdomeric, Go/RGR) by ~700 Ma, ~180 Myr before any eye. Do not
simulate the origin of light sensitivity. Simulate what happens to an animal that already has it.

**What this animal can actually perceive on day one** is computed, not asserted — see §3A.7. With
one unshielded receptor patch, `Δρ = 180°` and a 600 s integration, the percept is **a single noisy
scalar: `intensity`, with relative error 1/√N**. No direction, no image, no object. Everything it
can do with that is in §3A.8: estimate its depth, estimate the time of day, and nothing else.

**The rest of the founder animal** (so the starting state is fully specified):

| Property | Starting value | Tier |
|---|---|---|
| Body length / wet mass | 20 mm / **0.10 g** (epoch-1 animals are smaller than the 518 Ma fossils) | D |
| Habit | nektobenthic, weak swimmer | B |
| Diet | suspension/deposit: phytoplankton, floc, detritus, carrion | B |
| Cruise / burst speed | 0.030 / 0.30 m s⁻¹ | D (allometric) |
| Non-visual senses | chemosensory (0.5–5 m, plume-following) + mechanosensory (1–3 body lengths) — **fully functional from the start** | C |
| Body radiance ratio ρ | 0.50 (mid, opaque) — evolvable (§15.2) | D |
| All behavioural weights | **random small values**, evolvable (§3B.2) | — |
| Generation time | 1.0 yr | D |

**The founder must be viable while completely blind.** Non-visual foraging has to support a stable
population on its own (criterion V15), or the eye is being selected in a world that was rigged to
require it.

---

## 3. THE MOST IMPORTANT SECTION: why an eye may fail to evolve even when it is free

You reported that in earlier runs, **the eye did not evolve even when its cost was set to zero.**
That is diagnostic, and it almost certainly is not a cost problem. If a trait is free and still
does not spread, the environment is supplying **no fitness gradient** at the bottom of the ladder.

Here is the likely cause, and it is structural:

> **A light-sensitive patch cannot find prey. It is physically incapable of it.** A class-I
> photoreceptor has a 180° acceptance angle, a 600-second integration time, and a 30% contrast
> threshold. It cannot resolve an object, cannot tell direction, and cannot respond in less than ten
> minutes. If the only fitness payoff in the world is "see prey / see predators," then classes I,
> II and III are **exactly neutral**, the first ~90% of the ladder is a flat plain, and drift will
> never carry a population across it. The eye never starts.

**Nilsson's central claim is that each class buys a completely different behaviour.** The
simulation must implement **four separate fitness pathways**, and the first three have nothing to
do with predation:

| Class | What it can physically do | **The behaviour that must pay for it in the sim** |
|---|---|---|
| **I** — nondirectional | measure ambient intensity, 600 s integration, 30% contrast, 360° | **Depth-holding and diel timing.** Hold station in the optimal depth band; avoid the UV-damaging surface layer; time activity to when food is available. |
| **II** — directional | 100–180° acceptance, 1 s, 10% contrast; needs body scanning | **Phototaxis and shadow-alarm.** Swim up/down a light gradient to find the productive layer; withdraw/flinch when a shadow passes overhead. |
| **III** — low-res vision | 25–40° per receptor, ≥2 pixels, 0.1 s, 3% contrast | **Self-motion, obstacle avoidance, habitat finding.** Hold position against flow, avoid colliding with structure, locate and stay on productive patches. |
| **IV** — high-res vision | 1–5° down to fractions of a degree, 0.05 s, 3% contrast | **Prey detection and pursuit; predator detection and escape; mate finding.** |

**If your simulation only implements the class-IV payoff, the eye cannot evolve at any cost,
including zero.** This is, in my judgement, the highest-probability explanation for the earlier
failure, and it should be fixed before anything else is touched.

Each pathway needs its own concrete, physical payoff in the world. All four are specified with
numbers below:

- Class I payoff → §6.4 (UV damage rate by depth), §6.5 (diel cycle), §8.3 (food layer depth)
- Class II payoff → §8.3 (vertical food gradient), §11.6 (shadow-response escape)
- Class III payoff → §7.4 (habitat patch structure), §8.4 (patch finding), §11.4 (flow)
- Class IV payoff → §11 (detection, pursuit, escape)

**Corollary for the mutation model:** the ladder is only continuous if intermediate morphologies
are *reachable and functional*. Nilsson's proposed route for each transition is an **exaptation**
— the component arises for a non-optical reason and is recruited for optics later:

- **I → II:** screening pigment (melanin) is present first as an **antioxidant / photodamage
  shield**, not as an optical device. It becomes optical when it happens to sit on one side.
- **II → III:** membrane stacking already pays at class II (sensitivity), so it is available. A
  weak lens is initially favoured for **non-optical** reasons — keeping debris out of the cup,
  scaffolding the retina, spectral filtering.
- **III → IV:** once a weak lens exists, every incremental improvement in focus pays immediately.

**Encode this**: give the pigment, membrane and lens traits a small non-optical benefit as well as
their optical one. If a trait can only ever be selected for its final function, the ladder has
gaps and the climb stalls. (**No genome simulation** — see §18. These are plain continuous traits
with mutable values, not genes.)

---

## 3A. Perception — converting eye morphology into what the animal actually sees

This is the mathematical core of the simulation, and it can be done **entirely from standard
optics and photon statistics, with no thresholds chosen by us.** Everything below is textbook
physics; none of it is a modelling choice.

### 3A.1 The chain

```
genome morphology → optics → photon catch → signal-to-noise → detection → percept → behaviour
```

Each arrow is a published equation. Walk it in order.

### 3A.2 Step 1 — Optics from morphology

From the genome parameters in §12.3, derive:

```
A  = aperture diameter                     [µm]     = aperture_ratio × cup_diameter
f  = focal length                          [µm]     from invagination + lens_index_gradient
d  = photoreceptor cross-sectional diameter[µm]
l  = photoreceptor length                  [µm]     = membrane_layers × layer_thickness (~30 nm)
k  = absorption coefficient of rhabdom     [µm⁻¹]   ≈ 0.0067 µm⁻¹  (standard for visual pigment)
λ  = wavelength                            [µm]     = 0.50 (blue-green, peak transmission in water)
```

### 3A.3 Step 2 — Angular resolution: three blur terms, take the sum in quadrature

```
Δρ_sampling   = d / f                       (receptor subtends this angle)
Δρ_diffraction= λ / A                       (Airy limit of the aperture)
Δρ_defocus    = A / f × |1 − lens_quality|  (geometric blur when the image is not focused)

Δρ = sqrt( Δρ_sampling² + Δρ_diffraction² + Δρ_defocus² )     [radians]
```

**Why this matters: the pinhole trade-off falls out automatically.** With no lens
(`lens_quality = 0`), Δρ_defocus = A/f and Δρ_diffraction = λ/A pull in opposite directions.
Shrinking the aperture sharpens the geometric image but worsens diffraction *and* costs photons.
The optimum is at `A = sqrt(λ·f)` — the classic pinhole result, and the reason *Nautilus* is stuck
at >2° per receptor with a very dim image. **We do not code this trade-off. It emerges.** The lens
term is what releases it, which is exactly why the lens is the pivotal innovation.

### 3A.4 Step 3 — Photon catch: the Land sensitivity equation

The standard equation for comparing optical performance between eyes:

```
S = (π/4)² · A² · (d/f)² · [1 − exp(−k·l)]        [µm²·sr]
```

- `(π/4)·A²` — the aperture collects light in proportion to its area
- `(π/4)·(d/f)²` — each receptor views this solid angle of visual space
- `[1 − exp(−k·l)]` — the fraction of incident light the receptor actually absorbs; this is where
  **membrane stacking** enters, and it saturates, which is why Nilsson's stacking gain caps at ~3
  log units

Then the photons absorbed per receptor per integration period:

```
N = S · L · Δt · T_water · T_ocular
```

where `L` = scene radiance (photons µm⁻² s⁻¹ sr⁻¹) from §6.1 attenuated to depth by §6.2,
`Δt` = integration time, `T` = transmission losses.

### 3A.5 Step 4 — Detection: the Rose criterion, and a very satisfying check

A signal is detectable when the contrast signal exceeds the photon shot noise. Shot noise on N
photons is √N, so for an object of contrast C:

```
SNR = C · N / √N = C · √N

DETECT if   C · √N  ≥  SNR_threshold        [Rose criterion; SNR_threshold = 2]
```

**Now check this against Nilsson's hand-tabulated contrast thresholds:**

| Class | Nilsson's photon sample N | Nilsson's stated contrast threshold | **2/√N** |
|---|---|---|---|
| I | 50 | 30% | **0.283** |
| II | 500 | 10% | **0.089** |
| III | 5,000 | 3% | **0.028** |
| IV | 5,000 | 3% | **0.028** |

**All three match.** Nilsson's contrast thresholds *are* the Rose criterion at SNR = 2. His four
classes are not independent assumptions — they are four points on one continuous physical curve.

**The consequence is exactly what you asked for: we do not code the classes at all.** There is no
`if class >= 3` anywhere. The simulation computes N from morphology and ambient light, applies
`C·√N ≥ 2`, and the four classes become *descriptive labels we apply afterwards when reading the
output*. Every threshold in §12.1 is derived, not chosen. This removes essentially all of our bias
from the perception layer.

### 3A.6 Step 5 — Apparent contrast of a real object

```
C_apparent(r) = C_inherent · exp(−c · r)                    (contrast attenuation, §6.3)

θ = object_size / r                                         (angular size, radians)

if θ < Δρ:   C_effective = C_apparent · (θ / Δρ)²           (unresolved point source — contrast
                                                             diluted across the receptor's field)
if θ ≥ Δρ:   C_effective = C_apparent
```

`C_inherent` is computed per viewing geometry from **one evolvable trait** — see §15.

Detection then requires `C_effective · √N ≥ 2`. **This single inequality produces detection range
as a function of eye morphology, ambient light, depth, water clarity, object size, object
contrast, and viewing geometry, with no free parameters.** It is the whole sensory model.

### 3A.7 Step 6 — What the animal is actually handed each tick

The perception module outputs a percept list. What is in it is determined by the morphology, not
by a class label:

| Morphology state | Resolvable directions = FOV/Δρ | **Percept the animal receives** |
|---|---|---|
| Flat patch, no pigment | 1 | **a single scalar: `intensity`**, with relative error `1/√N`. No direction. Can distinguish depth/time-of-day only if the intensity difference exceeds the noise. |
| Pigment on one side, no cup | 1, but modulated by body angle | `intensity` that **changes as the body turns**. Direction is recoverable only by scanning over time — which is why class II's integration time is 1 s and it requires body movement. |
| Cup, several receptors | 2–20 | a **coarse bearing** to bright/dark regions, angular error ≈ `Δρ / SNR` |
| Pinhole / weak lens | 20–500 | **a low-resolution image**: obstacles, patches, horizon, large shadows |
| Focused lens, many receptors | 10³–10⁶ | **a resolved image**: individual prey with bearing, angular size, contrast sign, and frame-to-frame motion |

Every one of these is the *same code path*. The difference is entirely how many directions Δρ
divides the field of view into, and how much noise `1/√N` puts on each.

### 3A.8 Step 7 — How perception reaches survival

The fitness link must be through behaviour and energy, never a direct term. The four pathways of
§3 become, concretely:

| Payoff | Physical chain, no thresholds |
|---|---|
| **Depth-holding** (class I) | `intensity` → estimate of depth with error `1/√N` → animal holds a depth with error σ_z → UV dose from §6.4 at its *actual* depth → mortality hazard. **A noisier eye means a worse depth estimate means more UV.** Continuous, no cutoff. |
| **Diel timing** (class I) | `intensity` → estimate of time-of-day with error `1/√N` → animal times its rise/descent → intersects the food gradient (§8.3) and the predator's diurnal activity window (§11.3) |
| **Phototaxis** (class II) | intensity difference across a body rotation → bearing estimate → swim up-gradient → arrive at the higher-food layer sooner → intake rate |
| **Shadow alarm** (class II) | a dark object above subtends θ; detected if `C·√N ≥ 2`; C_inherent ≈ 0.85 viewed from below (§11.5) → triggers escape → survives |
| **Patch finding / station-holding** (class III) | resolved image of the substrate → optic-flow drift estimate → station-holding error (§11.4) → time spent on a 3–8× enriched patch → intake rate |
| **Prey / predator detection** (class IV) | detection range from §3A.6 → time available to commit or flee (§11.6) → capture or escape → energy or death |

Every arrow in that table is arithmetic on quantities already defined. **Nothing in it reads Δρ,
acuity, or "class."**

---

## 3B. Behaviour — how decisions get made without us setting them

Your instinct is right, and the concern in §17 about hand-set decision numbers is the correct
concern. Here is the resolution.

### 3B.1 The governing principle

> **Physics and physiology are SET. Decisions are EVOLVED. Never mix them.**

A number belongs in the "SET" column if it is a fact about bodies, water, chemistry or light — it
can in principle be measured, and getting it wrong is an error we can fix with better research. A
number belongs in the "EVOLVED" column if it is a *choice an animal makes* — and if we set it, we
have decided the answer.

| **SET** (measured / estimated; §17 applies) | **EVOLVED** (in the genome; never a constant in the code) |
|---|---|
| Body mass, length, drag | **Strike initiation distance** |
| Top speed, acceleration, turning radius | **Which prey to attack / ignore** |
| Metabolic rate, assimilation efficiency | **Flee distance and flee direction** |
| Energy density of tissue | **Preferred depth, and how it shifts with time of day** |
| Handling time (jaw and appendage mechanics) | **Activity window — diurnal vs nocturnal** |
| Burst duration limit and recovery time constants | **Hunger threshold at which to resume foraging** |
| Starvation clock, gut capacity, evacuation rate | **Satiation threshold at which to stop** |
| Egg size ↔ number trade-off curve | **Where on that curve to sit** |
| All optics (§3A), all water optics, all light | **All eye morphology** (§12.3) |
| Primary production, patch statistics | **Body contrast / transparency** (§15) |
| Predator/prey encounter geometry | **Search tortuosity, aggregation tendency** |

**This directly answers the §11.7 alarm.** The numbers you flagged — strike initiation distance,
prey selection cutoff, hunger threshold, turn angles — **move out of the SET column entirely.**
They stop being biases we impose and become results the simulation discovers. Handling time stays
SET, because it is jaw mechanics, not a decision.

**And it answers the burst question directly:** *"would a predator burst at anything in sight, or
would it have judgement?"* We do not decide. The strike rule is an evolved weight. If bursting at
everything is optimal given the real burst cost (§3B.4), the population will evolve to do it and
we will have learned something. If selectivity is optimal, selectivity evolves. Given that a burst
costs ~12× SMR plus a recovery debt, and that a distant target is more likely to escape, my
expectation is that **strong distance-selectivity evolves** — but that is a prediction to test, not
a rule to write. **The same applies to §9.5's optimal-foraging rule: do not code it. Let the
controller decide what to attack, and then check whether it *discovers* optimal foraging. If it
does, that is a genuine validation of the energy model.**

### 3B.2 The controller architecture

Your option (b) — *"if x then add likelihood to action y"* — is the right instinct, and it has a
clean formalisation. Three candidates, in increasing order of freedom:

| | **(a) Threshold rules** | **(b) Evolved drive vector — RECOMMENDED** | **(c) Evolved neural network** |
|---|---|---|---|
| Form | `if predator within X: flee` | each percept contributes a **weighted vector** to a desired-velocity field; internal states gate the weights; all weights in the genome | small recurrent net, percepts in, action drives out, all weights in the genome |
| Multi-objective? | **no** — priority order decides, can't do "approach food while avoiding predator" | **yes** — vectors sum, so competing goals blend naturally | yes |
| Scales with stimulus count? | no | **yes** — 2 predators contribute 2 vectors automatically, no special case | yes |
| Parameters we must set | **many thresholds — all bias** | **zero** | **zero** |
| Evolvable parameters | few | **~25–40** | ~60–200 |
| Interpretable? | yes | **yes — you can read the weights** | no |
| Risk | bakes in our assumptions | search space is manageable | slow to evolve; hard to debug; may need many more generations |

**Recommendation: (b).** It is your idea with every weight made evolvable, which is precisely what
removes the bias. Concretely, each tick:

```
desired_velocity = Σ_percepts  w_type · g(internal_state) · shape(distance) · direction_unit_vector
                 + w_depth · (preferred_depth − current_depth) · vertical_unit
                 + w_noise · random_unit

discrete_actions (burst / attack / spawn / freeze) fire when their accumulated drive
exceeds an EVOLVED threshold, not a set one
```

Evolvable per animal (illustrative gene list, ~30 values): `w_food`, `w_predator`,
`w_conspecific`, `w_substrate`, `w_flow`, one distance-shape exponent each, hunger and satiation
gating coefficients, `preferred_depth_day`, `preferred_depth_night`, `attack_drive_threshold`,
`flee_drive_threshold`, `burst_commit_threshold`, `search_tortuosity`, `aggregation_weight`,
`spawn_energy_threshold`.

**Fall-back position if (b) proves too slow to evolve:** seed the initial population with
hand-chosen weights that produce sensible behaviour, then **let mutation act on them from
generation zero**. The bias then decays instead of persisting — which is the specific failure mode
you identified ("if I set them, they're set and they won't get more accurate"). Never leave a
decision parameter as a constant.

### 3B.3 Learning within a lifetime

You raised learning (running away, colour-as-warning). **Recommendation: exclude within-lifetime
learning from the first build**, and it is now in §18. Reason: everything the eye needs to be
selected for is available through *evolved* behaviour, and adding learning adds a second
adaptive timescale that will confound attribution — when the eye improves, you will not be able to
tell whether selection or learning did it. Add it only after the eye evolves reliably without it.

### 3B.4 The burst / recovery model — and why the "rest one second, burst again" exploit doesn't happen

You are right that a naive single recovery timer is exploitable. The physiologically correct model
is **two pools**, which is also what fixes it:

| Pool | Fuel | Powers | Capacity | **Recovery time constant** | Tier |
|---|---|---|---|---|---|
| **Fast** | phosphagen (ATP / phosphocreatine) | a single 3–8 s burst | **8 bursts' worth** | **τ = 10 min** | C |
| **Slow** | glycogen → lactate | refills the fast pool | **30 bursts' worth per day** | **τ = 5 h** (full EPOC recovery 4–6 h in salmon, up to 24 h) | C |

Both recover exponentially — so **partial recovery is real and correct**, which is what you
suspected. The exploit dies on its own arithmetic: with τ = 10 min, resting for 1 second returns
**0.17%** of one burst. There is no way to grind out free bursts. Meanwhile the slow pool caps
sustained bursting at ~30/day, which is comfortably above the ~16 attacks/day the energy budget
needs (§9.4) but low enough that wasted bursts genuinely hurt.

Additional: while the slow pool is below 30%, burst power scales linearly with what remains, and
non-predation mortality hazard rises. An exhausted animal is a dead animal.

*(This supersedes the "60–300 s recovery" figure in §5.1, which was too fast and would have
permitted exactly the exploit you were worried about.)*

### 3B.5 On degenerate-looking behaviour

You raised animals spinning in place or stacking on one spot. Position: **cosmetically ugly, and
only a problem if it changes the outcome.** Two cheap guards that are also physically real, so
they cost no realism:

- **Local resource depletion.** Food at a location is consumed and regrows at the §8.2 rate. An
  animal that sits still starves. This eliminates stacking without any anti-stacking rule.
- **Movement has a metabolic cost and stillness does not eliminate it** (SMR continues). Spinning
  in place costs energy and returns nothing, so it is selected against automatically.

If degenerate behaviour survives both of those, it is telling you something is wrong with the
energy model — treat it as a diagnostic, not a cosmetic bug.

---

## 4. Timeline

| Date (Ma) | Event | Tier |
|---|---|---|
| ~711–700 | Opsin family diversifies into ciliary / rhabdomeric / Go+RGR subfamilies in the last common ancestor of Cnidaria + Bilateria. **Light sensing predates the eye by ~180 Myr.** | B (molecular clock) |
| ~700–560 | Classes I → II → III. Small, soft, shell-less animals. **No fossil eyes exist from this interval.** | B |
| ~575–541 | Ediacaran oxygenation: modelled pO₂ rises to ~0.16–0.25 PAL. **Widespread carnivory becomes physiologically affordable.** | B |
| ~541–521 | Cambrian Stage 1–2. Small shelly fauna; first bioturbation. | A |
| ~521–520 | **First fossil compound eyes** — earliest trilobites (*Fallotaspis* and other olenellids) already have fully differentiated holochroal eyes with a narrow slit-like visual surface aimed forward and at the lateral horizon. | A |
| **~518** | **Chengjiang.** Deltaic, storm-influenced. **Myllokunmingid vertebrates with four camera-type eyes** (lateral pair + pineal + parapineal, each with lens and RPE). *Anomalocaris*, *Isoxys*, *Kunmingella*, *Cricocosmia*. **This is the primary simulation setting.** | A |
| ~515 | *Kunmingella douvillei* egg-carrying specimens (50–80 eggs, 150–180 µm). | A |
| ~514 | **Emu Bay Shale.** *Anomalocaris* eyes: ≥16,000 lenses, ~95 µm facets, Δφ <1.4°, eye parameter <2 → **diurnal, well-lit water**. *Isoxys*: >3,000 facets with a **bright zone**. | A |
| ~508 | Burgess Shale. *A. canadensis* — agile nektonic predator of soft-bodied prey in a well-lit water column. *Waptia* brooding up to 24 eggs >2 mm. *Metaspriggina*. | A |
| ~480 | *Ampyx* queues (Fezouata) — orderly collective locomotion in a **blind** trilobite using spine contact. | A |

### 4.1 The environment did NOT stay constant across the climb — and this matters enormously

Direct answer to "is the 518–514 window representative of the whole climb?": **No. It is
representative of the last ~5% of it, and using it for the whole run would build in a specific,
serious error.**

The Chengjiang world is a world of nektonic pursuit predators with acute eyes. **Classes I, II and
III evolved in a world that had none of those things.** Predation itself does not appear in the
fossil record until ~550 Ma — borings in *Cloudina* shells, with **>20% of specimens bored** in
southern Shaanxi, and prey selectivity (no borings on co-occurring *Sinotubulites*) implying a
choosy, neurally capable borer. Before that: **scavenging as a prelude to predation**, and before
*that*, essentially nothing eating anything mobile at all.

If you run the whole climb under Chengjiang conditions, you apply predation pressure to classes
I–III **that did not exist when those classes evolved.** The eye would then be climbing for the
wrong reason at the bottom of the ladder — which is the exact error §3 warns against, arrived at
from the other direction.

**Run the simulation as three epochs with a scheduled environment.** Each epoch runs until the
population's median eye reaches the class the epoch supports, or a generation cap.

| | **Epoch 1: pre-predation** | **Epoch 2: predation begins** | **Epoch 3: visual arms race** |
|---|---|---|---|
| Interval | ~700–560 Ma | ~560–530 Ma | ~530–510 Ma |
| **Eye classes built here** | **I → II → III** | **III → IV** | IV refinement |
| pO₂ | **0.05–0.16 PAL** | 0.16–0.25 PAL | 0.24–0.48 PAL |
| Dissolved O₂ (28 °C surface) | ~0.7 mg L⁻¹ | ~1.6 mg L⁻¹ | ~2.0–2.5 mg L⁻¹ |
| Aerobic scope | **very low — no pursuit possible at all** | low — short bursts only | moderate — bursts + brief pursuit |
| **Predators present** | **NONE** (or negligible) | **yes, but slow, non-visual, contact/chemical** (borers, ambush worms) | **yes, fast, nektonic, visual** |
| Predation mortality (fraction of adult deaths) | **0%** | **15%** | **45%** |
| Prey/animal body size | 1–10 mm, mostly sessile or slow-crawling | 5–50 mm, motile benthic | 5–500 mm, nekton present |
| Nekton (open-water swimmers) | **absent** | rare | **abundant** |
| Seafloor | matground, firm, sharp interface | matground, first burrows | matground → mixground |
| Water clarity K_d(PAR) | **0.12 m⁻¹** (clear — no bioturbation, low productivity) | 0.25 m⁻¹ | 0.4–0.7 m⁻¹ (deltaic) |
| Primary production | **30 g C m⁻² yr⁻¹** | 60 g C m⁻² yr⁻¹ | 100 g C m⁻² yr⁻¹ |
| Temperature | 20–25 °C (post-glacial) | 25–30 °C | 28 °C |
| **Dominant fitness pathway** | **depth-holding, UV avoidance, diel timing, patch-finding** (§3, classes I–III) | **shadow-alarm, escape from slow predators, patch competition** | **prey detection, predator escape, mate recognition** (class IV) |

**Two things this table gets right that a static environment cannot:**

1. **Epoch 1 has zero predation and still has a full fitness gradient for classes I–III.** That is
   the load-bearing claim of §3, and now the simulation can test it directly: if the eye climbs
   from class I to class III in epoch 1 — a world with **no predators at all** — then the payoffs in
   §6.4, §8.3, §8.4 and §11.4 are demonstrably sufficient. That is a far stronger result than
   watching an eye evolve in a world where predation is doing all the work.
2. **Epoch 1's water is clearer than epoch 3's** (K_d 0.12 vs 0.55). Lower productivity and no
   bioturbation means less suspended material. So the *early* rungs had a **longer contrast
   horizon** than the late ones, which is the opposite of the naive assumption and matters for
   where the payoff curve bites.

**Speculative but worth noting** (tier D, flagged as speculation): the opsin diversification at
~711–700 Ma falls inside the **Sturtian "Snowball Earth" glaciation (~717–660 Ma)**. Light under
sea ice is scarce and patchy. Whether that is coincidence or the reason animals first invested in
measuring light is unresolved and should not be built into the model — but the timing is at least
suggestive that light-sensing began as a *scarcity* problem, not an imaging one.

### 4.2 Was Chengjiang representative of everywhere?

Partly. The honest caveats:

- **Where animals lived: yes.** Shallow tropical/subtropical continental shelf is where essentially
  all Cambrian animal life was. The deep ocean was anoxic and uninhabitable. So "shallow, warm,
  well-lit shelf" is representative.
- **Water clarity: no.** Chengjiang is specifically a **delta front** — unusually turbid for a
  shelf. Emu Bay (inner-shelf basin) was much clearer, and the *Anomalocaris* eye parameter of <2
  independently confirms it. Since **water clarity is the master control on whether an eye pays at
  all** (§6.3), this is not a minor difference.
- **Therefore: sweep clarity as a primary axis, not a fixed value.** Run K_d(PAR) at 0.12 / 0.18 /
  0.35 / 0.55 / 1.0 m⁻¹. If a camera eye only evolves in the clearest quartile, that is itself a
  significant finding about where in the Cambrian ocean vision could have originated.

---

## 5. Earth-scale boundary conditions

### 5.1 Oxygen

| Quantity | Value | Tier |
|---|---|---|
| Late Ediacaran pO₂ | ~0.16 → ~0.25 PAL | B |
| Early Cambrian pO₂ | 0.10–0.50 PAL; models cluster 0.24–0.48 PAL | B |
| Threshold enabling widespread carnivory | pO₂ > 0.10–0.25 PAL | B |
| Marine redox structure | **Oxygenated shallow shelf over anoxic/ferruginous deep ocean**, redoxcline mobile on short timescales | B |
| Temporal pattern | **Dynamic and fluctuating, not a monotonic ramp** | B |
| Dissolved O₂, shallow shelf, 28 °C, 0.3 PAL | ~2.0–2.5 mg L⁻¹ (vs ~7.8 mg L⁻¹ at modern 28 °C seawater saturation) | D (derived: Henry's law × 0.3 PAL) |
| Benthic diel O₂ swing | Large; near-anoxic at night under mats | B |

**Causal chain (this is the single most important environmental lever):**

low pO₂ + warm water (low O₂ solubility) → **small aerobic scope** → **sustained pursuit is
unaffordable**. No animal can chase for minutes. Therefore vision is not selected to "see further
and chase longer." It is selected to **commit a short, expensive burst at exactly the right
moment.** Detection *reliability at strike distance* matters far more than detection *range*.

Sim form: predator burst is anaerobic and lasts **3–8 s**, drawing on the **two-pool model in
§3B.4** (fast phosphagen pool, τ = 10 min; slow glycogen pool, τ = 5 h, ~30 bursts/day ceiling).
A wasted burst is genuinely expensive. Then — and only then — accuracy of the commit decision is
something selection can grip. **Whether to commit is an evolved weight, not a rule (§3B.1).**

Second chain: the oxygenated-shallow / anoxic-deep structure **confines the entire arms race to
the photic shelf**. There is no dark habitable refuge. Prey cannot escape vision by going deep.

**Note on rising oxygen:** as pO₂ rises through the interval, aerobic scope rises, pursuit becomes
progressively more affordable, and the bottleneck shifts from "can I chase?" to "can I find and
identify a target worth chasing?" **The rise in oxygen is what promotes vision to the limiting
factor.** Model pO₂ as a slow ramp with noise across the run, 0.15 → 0.40 PAL, rather than a
constant.

### 5.2 Temperature

| Quantity | Value | Tier |
|---|---|---|
| Tropical/equatorial SST | **28–37 °C**, possibly to 40 °C | A/B (δ¹⁸O phosphate) |
| High-latitude SST (~65–70 °S), 514–509 Ma | 20–25 °C | A |
| **Simulation value (Chengjiang, low palaeolatitude)** | **28 °C**, diel range ±1.5 °C, no seasonal ice | B |
| Climate mode | Greenhouse, no polar ice | B |
| Q₁₀ for metabolic rate | **2.0–2.5** (use 2.25) | C |

Consequence: metabolic rates run ~2–3× a modern temperate benthos, food demand is correspondingly
high, and oxygen solubility is ~20% lower than at 15 °C. **Warm + low-O₂ + high demand = a
permanently hungry ecosystem operating close to its aerobic ceiling.** That is the pressure cooker.

### 5.3 Sea level, habitat, and where this happened

Cambrian greenhouse + high sea level → **very extensive shallow epicontinental seas on continental
shelves**. This is correct: the eye evolved in **shallow water near land, on the shelf** — not in
the open or deep ocean.

| Quantity | Value | Tier |
|---|---|---|
| Setting | Shallow epicontinental shelf / delta front | A |
| Water depth, simulation | **5–40 m**, modal 15 m | B |
| Habitat extent | Vast and well connected | B |
| Effective population size | Large → **selection dominates over drift** | B |

That last line matters for §14.2: a consistent 1% advantage can actually fix, which is the
assumption Nilsson & Pelger's timing rests on.

### 5.4 Substrate

Transition from Proterozoic **matgrounds** (firm, microbially bound, sharp sediment–water
interface) to Phanerozoic **mixgrounds** (soupy, bioturbated, few-cm mixed layer).

For this simulation the substrate matters in exactly one way: **it is the surface on which the
benthic food (microbial mats, §8.2) grows, and it sets the visual background contrast.** Use:

| Quantity | Value | Tier |
|---|---|---|
| Seafloor state at 518 Ma | predominantly matground, early mixground transition | A |
| Substrate reflectance | 0.10–0.20 (dark microbial mat) | D |
| Suspended sediment background | see turbidity, §6.2 | B |

Burrowing itself is **deliberately excluded** — see §18.

---

## 6. Light — the full specification

Keeping the complete light field, including moonlight and starlight. **Justification, which was
not obvious:** §3 shows the class-I payoff is depth-holding and diel timing. A class-I
photoreceptor's *only* function is telling light level. If the world has no diel cycle and no
vertical light gradient, class I has literally zero function and **the climb can never start**.
Moonlight and starlight set the night-time floor, which is what makes "night" a distinguishable
state rather than absolute zero, and they determine whether any visual behaviour is possible at
night. These are load-bearing, not decorative.

### 6.1 Ambient light levels

| Condition | Radiance (log quanta m⁻² sr⁻¹ s⁻¹) | PAR (µmol photons m⁻² s⁻¹) | Tier |
|---|---|---|---|
| Direct tropical sun, noon, surface | **20.3** (≈2×10²⁰) | 2000–2200 | C |
| Overcast day, surface | 19.3 | ~200 | C |
| Sunrise / sunset | 17.5 | ~10 | C |
| Deep twilight | 16.5 | ~0.5 | C |
| Full moon | **16.0** (≈1×10¹⁶) | ~4×10⁻³ | C |
| Quarter moon | 15.2 | | C |
| Starlight, moonless | **14.0** (≈1×10¹⁴) | ~1×10⁻⁴ | C |

### 6.2 Water optics

| Quantity | Value | Tier |
|---|---|---|
| K_d(PAR), clear shelf water | **0.10–0.30 m⁻¹** (use 0.18) | C |
| K_d(PAR), Chengjiang background (deltaic) | **0.4–0.7 m⁻¹** (use 0.55) | C |
| K_d(PAR), storm/flood plume | **1.0–2.5 m⁻¹** (use 1.6) | C |
| K_d(UV-B, 305 nm) | **2–4 × K_d(PAR)** (use 3×) | C |
| Beam attenuation coefficient c | **2–5 × K_d** (use 3.5×) | C |
| Euphotic (1% surface) depth, clear | 15–45 m | C |
| Euphotic depth, Chengjiang background | 6–11 m | C |
| Euphotic depth, in a plume | 1.8–4.6 m | C |
| Substrate reflectance | 0.10–0.20 | D |
| Water column scattering (background space-light) | isotropic; sets the contrast floor | C |

Irradiance at depth: `E(z) = E_surface · exp(-K_d · z)`.

### 6.3 Sighting distance — the hard ceiling on what any eye is worth

**This is the part that most simulations get wrong.** Water does not merely dim the image, it
**destroys contrast**, and contrast loss caps sighting distance regardless of how good the eye is.

The apparent contrast of an object at range r decays as:

```
C(r) = C0 · exp(-c · r)
```

where C0 is the object's inherent contrast against the background and c is the beam attenuation
coefficient. An animal detects the object when `C(r) ≥ C_threshold` for its Nilsson class (30% /
10% / 3% / 3%).

| Water state | c (m⁻¹) | Max sighting range, C0 = 0.8, class IV (C_th = 0.03) | Tier |
|---|---|---|---|
| Clear shelf | 0.63 | **~5.2 m** | C |
| Chengjiang background | 1.93 | **~1.7 m** | C |
| Storm plume | 5.6 | **~0.6 m** | C |

Rule of thumb cross-check: max range ≈ 4/c gives 6.3 m / 2.1 m / 0.7 m. Consistent.

**Three consequences, all of which are "environment" rather than "outcome":**

1. **A contrast horizon exists.** Beyond it, no eye of any acuity sees anything. Acuity has
   strictly diminishing returns past that point, and the *shape* of the payoff curve — steep, then
   flat — is what should decide where the eye stops improving. If the sim gives an unbounded payoff
   to acuity, it is unphysical.
2. **Turbidity is a time-varying forcing.** Water clarity swings by an order of magnitude on storm
   timescales at Chengjiang. During a plume an expensive eye is dead weight and chemosensory
   foraging wins. **Variance in the light field is itself a selective agent**, and it should set the
   equilibrium between visual and non-visual strategies rather than a hand-tuned constant.
3. **Depth is a light axis.** A vertical gradient plus a diel cycle gives diel vertical migration
   for free, as an emergent behaviour, without coding it.

### 6.4 UV — the class-I payoff

Cambrian pO₂ at 0.1–0.5 PAL means a **partial but real ozone shield** — UV-B flux higher than
today, not sterilising.

| Quantity | Value | Tier |
|---|---|---|
| Surface UV-B relative to modern | **1.5–3× modern tropical** (use 2×) | D (derived from pO₂ → ozone column) |
| K_d(UV-B) | 3 × K_d(PAR) | C |
| **Depth below which UV-B damage is negligible (<5% of surface)** | clear: **5.5 m**; Chengjiang background: **1.8 m** | D (derived) |
| DNA damage → fitness cost | **0.6% per day mortality hazard at the surface**, scaling as exp(−K_UV·z) | D |
| Time constant for accumulated damage | 3–7 days | D |

**This is the concrete class-I fitness payoff.** An animal that can measure ambient light can tell
how deep it is and stay below the damaging layer. An animal that cannot must either stay
permanently deep (giving up food, §8.3) or take the mortality hazard. That is a real, non-visual,
physically grounded reason to have a light-sensitive patch — and it is available on day one, with
a 600-second integration time and a 30% contrast threshold.

### 6.5 The diel cycle

| Quantity | Value | Tier |
|---|---|---|
| Day length, Cambrian (~518 Ma) | **~21.0 hours** (Earth's rotation was faster) | B |
| Daylight fraction, low latitude | 0.5 → **~10.5 h light, 10.5 h dark** | B |
| Twilight duration | ~40 min each end | C |
| Lunar cycle | 29.5 days modern; Cambrian synodic month ~**31 days** of 21 h | B/D |
| Tidal amplitude | Larger than modern (Moon closer); **1.5–2× modern** on this shelf | B |

Use a 21-hour day. It changes the number of foraging hours per day, which propagates directly into
the energy budget, and it costs nothing to get right.

---

## 7. The cast

### 7.1 Community composition (tier A)

Chengjiang, from field sampling of **18,406 individuals across 114 species**:

| Group | % of individuals | % of species |
|---|---|---|
| Arthropods | **51.8%** | 37% |
| Priapulid worms | **22.6%** | — |
| Brachiopods | **16.3%** | — |
| Everything else (incl. chordates) | ~9% | — |

Three species are ~53% of all individuals: *Kunmingella douvillei* **26.2%**, *Cricocosmia
jinningensis* **15.4%**, *Diandongia pista* **11%**.

**Seed the simulation with this skew, not with even abundances.** One small arthropod is a quarter
of everything alive. This is the shape of a real ecosystem and it matters: it determines what a
predator actually encounters.

### 7.2 Roster — pruned to the species that actually touch the eye-evolving lineage

Selection rule: a species is a **full agent** only if it directly eats, is eaten by, or directly
competes with the focal lineage. Everything below that is a **resource field** (a scalar density
per grid cell), not an individual. Everything with no causal path to the eye is dropped entirely
and listed in §18.

**Full agents — four species:**

| # | Taxon | Role in the eye story | Length | Wet mass | Habitat | Diet | Eyes |
|---|---|---|---|---|---|---|---|
| **1** | ***Haikouichthys / Myllokunmingia*** | **THE EYE-EVOLVING LINEAGE** | 25–28 mm | **0.20 g** | nektobenthic, 5–25 m | suspension/deposit: phytoplankton, floc, detritus, mesozooplankton | **camera** — evolvable; endpoint = lateral pair + pineal + parapineal |
| **2** | *Anomalocaris canadensis* | **apex visual predator of #1** — the class-IV pressure | 300–500 mm | **250 g** (100–700) | nektonic, well-lit column above the benthos | soft-bodied nekton **only** | compound, fixed (see below) |
| **3** | *Isoxys* | **visual mesopredator of #1, AND prey of #2** — this is what makes it a three-level arms race rather than a two-level chase | 20–40 mm | **1.0 g** | nektonic | small nekton, mesozooplankton | compound, fixed |
| **4** | Chaetognath (arrow worm, *Protohertzina*-grade) | **THE CONTROL** — a *non-visual* pelagic ambush predator of #1 | 10–30 mm | **0.05 g** | pelagic | ambush, grasping spines; **chemo/mechanosensory only** | **none** |

**Taxon 4 is included for a specific and important reason.** Chaetognaths are **the oldest known
pelagic predators**, present from the lowest Cambrian. They hunt the same prey as *Anomalocaris*
using purely non-visual senses. That makes them the **baseline that vision has to beat**: if the
visual predator does not out-compete the non-visual one, vision is not actually paying, and the
simulation will say so. Without a non-visual competitor in the model, "vision works" is
unfalsifiable.

**Resource fields — not agents:**

| Field | Represents | Units | Replaces |
|---|---|---|---|
| `phytoplankton` | acritarchs + picocyanobacteria in the water column | mg C m⁻³ | — |
| `benthic_mat` | cyanobacterial matground | g C m⁻² | — |
| `detritus` | sinking organic rain | g C m⁻² day⁻¹ | — |
| `mesozooplankton` | small swimming prey ≤0.5 mm | individuals m⁻³ | *Kunmingella*, larvae |
| `carrion` | see §7.5 | g wet m⁻² | — |

**Dropped from the earlier draft:** *Waptia*/*Canadaspis*, *Kunmingella* (folded into
`mesozooplankton`), *Cricocosmia*, *Diandongia*, trilobites. None of them eats or is eaten by the
focal lineage; keeping them meant inventing tier-D numbers for each with no mechanism attached.
Recorded in §18.

Mass estimates for taxa 1, 3, 4 are tier D, from length × taxon shape factor at soft-tissue density
1.05 g cm⁻³. Taxon 2 is tier D from a 350 × 100 × 40 mm streamlined body at 0.4 fill factor
≈ 560 cm³, taken as 250 g for a mid-sized adult.

**Only taxon 1's eye evolves.** Taxa 2 and 3 have fixed eyes at their measured fossil values. This
is a deliberate simplification for the first build: it isolates the question "does this environment
build a camera eye?" from the much harder question "what happens when both sides co-evolve?"
Co-evolving the predator's eye is a second experiment, worth running once the first works — and
§15 (prey contrast) already gives the arms race one live co-evolutionary axis without needing it.

### 7.2a Why did *Anomalocaris* evolve compound eyes and not camera eyes?

**Because it is an arthropod, and that decision was made long before it existed.** Arthropod eyes
develop as arrays of repeated ommatidial units — the same segmental, modular developmental toolkit
that builds their limbs and body segments. Once that architecture is established in the lineage,
every subsequent improvement is an improvement *to the array*: more units, bigger units, tighter
packing. There is no developmental route from an ommatidial array to a single-chambered lens eye.

It is path dependence, not optimisation. And the compound eye was a perfectly good answer to
*Anomalocaris*'s actual problem: at 30–50 cm body length, with **stalked eyes** giving
near-panoramic coverage and excellent motion detection, the quadratic size penalty had not yet
bitten. It reached Δφ < 1.4° — dragonfly-grade — without the eye becoming absurd. The wall that
makes compound eyes hopeless (§2.1) only matters at acuities far beyond anything in the Cambrian.

The chordates, meanwhile, started from a different place — a pigmented cup in the head of a small
soft-bodied swimmer — and that starting point leads to a lens.

### 7.2b Did eyes change what anything ate?

Partially answerable. What can be said (tier A/B):

- The appearance of acute vision coincides with the establishment of **macrophagous predation on
  nekton** — the pursuit of individual large prey in open water, which is a strategy that simply
  does not work without vision. *Anomalocaris*'s soft-prey, burst-attack ecology **is** the new
  niche that vision opened.
- Radiodonts subsequently **diversified back down the food chain** — at least one lineage evolved
  into a suspension-feeding microplanktivore, abandoning raptorial predation entirely.
- The **pelagic–benthic coupling** established in this interval (small benthic herbivores invading
  the water column to graze phytoplankton, creating the mesozooplankton link) restructured the
  entire food web.

What **cannot** be said: we cannot trace an individual lineage switching prey *because* its eyes
improved. Do not build a prey-switching mechanism as a modelled assumption. **Let diet composition
be an emergent output and check whether it shifts as acuity climbs** — that is a result worth
having, and V6/V17 test for it.

### 7.2c Scavenging

Yes, and it should be in the model. **Scavenging preceded predation** — it is interpreted as the
Ediacaran prelude to it — and in the Cambrian, *Ottoia* gut contents show a dietary generalist
feeding on **both living individuals and decaying organic matter**.

| Parameter | Value | Tier |
|---|---|---|
| Carrion produced | 100% of the wet mass of every animal that dies of non-predation causes | derived |
| Carrion energy density | **2.9 kJ g⁻¹ wet** (decayed; ~80% of fresh) | C |
| Carrion decay half-life at 28 °C | **1.5 days** | C |
| Carrion detection | chemical plume, 0.5–5 m, no vision needed | C |
| Who scavenges | all four agent taxa, opportunistically | A (generalist feeding) |

**Why this is not a throwaway:** carrion is food that **can be found without eyes**. It is
therefore part of the baseline that vision must beat, alongside taxon 4. If carrion is abundant
enough, foraging by smell is viable and the pressure for vision weakens. That makes the carrion
supply rate a real control knob on the strength of visual selection — worth sweeping.

### 7.3 What *Anomalocaris* actually ate — the correction that structures everything

The "*Anomalocaris* cracked trilobites" story is **refuted**. Finite-element analysis of the
frontal appendages shows the thin elongate endites would have been damaged attacking biomineralised
prey. What survives:

- an **agile nektonic predator** using **acceleration bursts**,
- appendages held outstretched to maximise swimming speed,
- targeting **soft-bodied swimming animals** in a **well-lit water column above the benthos** —
  isoxyids, hymenocarines (*Waptia*, *Canadaspis*), ctenophores, nectocaridids, vetulicolians,
- modelled swimming speeds **0.4 / 0.7 / 0.9 m s⁻¹**.

So the core loop is:

> **Nektonic visual predators (*Anomalocaris*, *Isoxys*) ↔ soft-bodied nektonic prey (*Isoxys*,
> *Waptia*, myllokunmingids), in a well-lit water column, via short burst attacks, over a benthic
> food base.**

Two structural consequences:

1. **The armoured benthos is outside the loop that built the eye.** Trilobite armour was a response
   to a *different* predator guild (durophages, priapulids, *Redlichia*). Do not wire armour to the
   visual predator.
2. ***Isoxys* is both a visual predator and *Anomalocaris* prey.** The arms race is a **visual
   predator eating a visual predator** — the configuration in which eye improvement pays on both
   sides simultaneously. Keep this three-level structure; it is the engine.

### 7.4 Spatial structure of the habitat — the class-III payoff

| Feature | Value | Tier |
|---|---|---|
| Setting | Delta front / prodelta, storm-flood influenced | A |
| Seafloor relief | low; microbial mats, scattered sponge/brachiopod thickets, small channels, ripple fields | A |
| Sponge/brachiopod thicket patches | **1–8 m across, covering 5–15% of the seafloor** | D |
| Ripple wavelength / height | 0.1–0.4 m / 0.01–0.05 m | A |
| Small channels | 1–5 m wide, 0.2–1 m deep | A |
| Current speed, background | **0.02–0.10 m s⁻¹** | D |
| Current speed, storm event | **0.3–1.0 m s⁻¹** | B |
| Storm/flood event frequency | **every 20–60 days**, lasting 1–4 days | B |
| Salinity | unstable, 25–35 PSU, freshening during floods | A |

**This structure is the class-III payoff.** Structured habitat means (a) things to collide with,
(b) patches worth finding and staying on, and (c) flow to hold station against. All three are
low-resolution-vision tasks, and none of them requires seeing prey.

---

## 8. The food base — primary production, growth, patchiness, respawn

This answers "what were they eating, how often did it grow, how was it distributed."

### 8.1 What the primary producers were

No land plants, no diatoms, no seagrass, no coral. Two sources:

1. **Planktonic algae** — acritarchs (organic-walled cysts of unicellular marine algae, largely
   prasinophycean green algae) plus picocyanobacteria, in the water column.
2. **Benthic microbial mats** — cyanobacterial mats on the seafloor (matgrounds).

Plus a third, derived source: **detritus and faecal rain** from the water column to the benthos —
the newly established biological pump. The invasion of small benthic herbivores into the water
column to graze phytoplankton is itself one of the key Cambrian innovations, and it is what
creates the mesozooplankton link that everything above it eats.

### 8.2 Production rates and standing stock

| Quantity | Value | Tier |
|---|---|---|
| Total primary production, shallow productive shelf | **100 g C m⁻² yr⁻¹** (range 50–200) | C |
| → daily | **0.274 g C m⁻² day⁻¹** | C (derived) |
| Energy conversion | **1 g C ≈ 45 kJ** (≈2.5 g dry organic matter) | C |
| → **daily energy input** | **12.3 kJ m⁻² day⁻¹** (range 6.2–24.7) | C (derived) |
| Split, water column : benthic mat | **60 : 40** | D |
| **Phytoplankton standing stock** | 60–400 mg C m⁻³ (use **150**) | C |
| Phytoplankton cell size | **5–200 µm** (acritarchs); picocyanobacteria 0.5–2 µm | A |
| Phytoplankton division rate at 28 °C | **0.8–2.0 doublings day⁻¹** (use 1.2) | C |
| → phytoplankton **regrowth time constant** | **~14 hours** to double | C (derived) |
| **Benthic mat standing crop** | **2.5 g C m⁻²** (range 1–5) | C |
| Mat production | 0.11 g C m⁻² day⁻¹ | C (derived from 40% split) |
| → **mat turnover / full regrowth time after total grazing** | **~23 days** (range 10–60) | C (derived) |
| Mat regrowth model | logistic to carrying capacity, r = 0.044 day⁻¹ | D (derived) |
| Detrital rain to seafloor | **15% of water-column production** = 1.1 kJ m⁻² day⁻¹ | C |
| Detritus energy density | **8 kJ g⁻¹ dry** (lower than flesh; refractory fraction) | C |

**Trophic transfer efficiency: 10%** per level (range 5–15%), tier C. This is what converts primary
production into how many predators the world can hold, in §9.6.

### 8.3 Vertical distribution — the class-I and class-II payoff

| Depth band | Phytoplankton (relative) | UV hazard | Predator risk | Tier |
|---|---|---|---|---|
| 0–2 m | **1.00** (maximum) | **high** (0.6%/day at surface) | high (brightest, most visible) | D |
| 2–6 m | 0.85 | low | high | D |
| 6–12 m | 0.45 | negligible | moderate | D |
| 12–25 m | 0.15 | negligible | low | D |
| >25 m | 0.04 | negligible | low; too dark to forage visually | D |

**This table is the reason class I and class II pay.** Food is shallowest, UV is shallowest,
predation risk is shallowest. There is an optimal depth band, it is narrow, and **it moves with
the diel cycle** — at night the UV hazard vanishes and the predation risk drops (visual predators
can't hunt), so the optimum moves *up*. An animal that can sense ambient light level can track it.
An animal that cannot must pick one depth and eat the average.

**That is diel vertical migration, and it should emerge, not be coded.** It is also the single
cheapest fitness payoff available to a bare light-sensitive patch — which is exactly why the eye
starts.

### 8.4 Horizontal patchiness — the class-III payoff

| Quantity | Value | Tier |
|---|---|---|
| Phytoplankton patch diameter | **5–50 m** | C |
| Patch concentration factor | **3–8×** background | C |
| Patch lifetime | **2–10 days** | C |
| Fraction of area in patches | **10–20%** | C |
| Mat quality patchiness | correlated with substrate; patch scale **1–10 m** | D |
| Mesozooplankton (prey of taxon 5) patch scale | 1–20 m, concentration 5–20× | C |

Finding and holding a patch that is 3–8× better than background is worth roughly a **2–4×
difference in intake rate**. That is a large, real, non-predatory fitness payoff for low-resolution
vision, available long before anything can see a predator.

---

## 9. The energy ledger

### 9.1 Energy density of tissue

| Material | Energy density | Tier |
|---|---|---|
| Marine invertebrate flesh | **21–23 kJ g⁻¹ ash-free dry weight** (tight across taxa) | C |
| Crustaceans | 7.1–25.3 kJ g⁻¹ DW — **bimodal: benthic species low, planktonic species high** | C |
| Polychaetes | 9.2–14.2 kJ g⁻¹ DW; 4.2–5.4 kJ g⁻¹ wet | C |
| **Soft-bodied nektonic prey, wet mass — SIM VALUE** | **3.6 kJ g⁻¹ wet** | C |
| **Benthic prey, wet mass — SIM VALUE** | **2.6 kJ g⁻¹ wet** | C |
| Biomineralised prey usable fraction | **0.45** of gross | D |

The crustacean bimodality is real and usable: **pelagic prey is worth ~40% more per gram than
benthic prey.** Encode it. It gives the water column an intrinsic energetic premium over the
seafloor — an independent reason (beyond light) for the arms race to be pelagic — and it falls out
of a measured pattern rather than a tuned constant.

### 9.2 Per-item calorie values

| Prey item | Wet mass | **Gross energy** | Usable (×0.66 assim.) | Tier |
|---|---|---|---|---|
| *Kunmingella* | 0.010 g | **36 J** | 24 J | C |
| Myllokunmingid | 0.20 g | **720 J** | 475 J | C |
| *Isoxys* | 1.0 g | **3.6 kJ** | 2.4 kJ | C |
| *Cricocosmia* | 1.0 g | **2.6 kJ** | 1.7 kJ | C |
| *Waptia* | 3.0 g | **10.8 kJ** | 7.1 kJ | C |
| *Diandongia* | 0.30 g | 0.78 kJ (×0.45 mineralised) | 0.23 kJ | C |
| Small trilobite (30 mm) | 2.0 g | 5.2 kJ (×0.45) | 1.5 kJ | C |

### 9.3 Metabolic rates

Scaling: **SMR ∝ M^0.70**. Measured exponent across 17 calcified marine invertebrate species:
**0.69 ± 0.02**, with no support for 0.75 over 0.67. Oxycalorific equivalent: **1 mL O₂ = 20.1 J**.

Mass-specific SMR at 28 °C (tier C, from mass-specific rates for marine ectotherms scaled to
temperature):

| Body mass | Mass-specific SMR (mL O₂ g⁻¹ h⁻¹) | **SMR (J day⁻¹)** | **FMR (J day⁻¹)** at 2.75× |
|---|---|---|---|
| 0.010 g (*Kunmingella*) | 0.85 | **4.1** | **11.3** |
| 0.20 g (myllokunmingid) | 0.50 | **48** | **132** |
| 1.0 g (*Isoxys*) | 0.30 | **145** | **399** |
| 3.0 g (*Waptia*) | 0.22 | **318** | **875** |
| 250 g (*Anomalocaris*) | 0.083 | **10,000** | **27,500** |

| Parameter | Value | Tier |
|---|---|---|
| FMR / SMR multiplier | **2.75** (range 2.5–3.0) | C |
| Assimilation efficiency, carnivore | **0.66** (range 0.60–0.75) | C |
| Assimilation efficiency, suspension/deposit feeder | **0.45** (range 0.35–0.60) | C |
| Cost of a burst (anaerobic) | **12× SMR rate** during the burst + a repayment debt of **3× the burst's cost** | D |
| Cost of cruising | **1.8× SMR** | C |
| Cost of digestion (SDA) | **12% of ingested energy** | C |

### 9.4 Daily requirements — and the check that they are right

| Animal | FMR | Required gross intake | As wet prey | **% body mass day⁻¹** |
|---|---|---|---|---|
| *Anomalocaris* 250 g | 27.5 kJ | **41.7 kJ** | 11.6 g | **4.6%** |
| *Isoxys* 1.0 g | 399 J | **605 J** | 0.17 g | **17%** |
| Myllokunmingid 0.20 g | 132 J | **293 J** (assim. 0.45) | 0.11 g | **55%** |
| *Kunmingella* 0.010 g | 11.3 J | **25 J** | 0.010 g | **100%** |

Cross-check against measured daily rations: zooplankton **4–15%** BW day⁻¹, cephalopods 1–4%, fish
1–2%, marine mammals 3–5%, seabirds 15–20%. A 250 g warm-water (28 °C) active invertebrate
predator at 4.6% sits exactly where it should. Very small animals at 50–100% BW day⁻¹ is also
correct — mass-specific metabolism rises steeply as size falls. **The budget closes.**

In items per day: *Anomalocaris* needs **~4 *Waptia*** or **~12 *Isoxys*** or **~1,160
*Kunmingella*** per day.

### 9.5 Prey selection — the rule, derived not tuned

At 36 J each, an *Anomalocaris* would need ~1,160 bradoriids/day: ~1,160 separate detections,
approaches, strikes and handling events. **Handling time alone makes small prey energetically
impossible for a large predator.**

**Do NOT code the foraging rule.** Per §3B.1, "what to attack" is a decision and must be evolved.
The classic optimal-foraging calculation —

```
profitability = usable_energy(prey) / (pursue_time + handle_time)
attack if profitability > current average intake rate
```

— should be used **only as a post-hoc analysis of what the population evolved**, never as code. If
the evolved controller converges on this rule, that is a strong independent validation of the
energy model (criterion V18). If it converges on something else, that is more interesting still.

The passive physical limits below **are** legitimate SET constraints, because they are mechanics,
not choices:

| Predator | Cannot physically handle prey above | Reason |
|---|---|---|
| *Anomalocaris* 250 g | **12.5 g** (5% of body mass) | soft-prey appendage failure limit, from the FEA result |
| *Isoxys* 1.0 g | 0.05 g | grasping appendage scale |

For calibration only — the diet the ledger *predicts* the population should discover, **not to be
coded**:

| Predator | Ignores prey below | Cannot handle prey above | Implied prey window |
|---|---|---|---|
| *Anomalocaris* 250 g | **0.75 g** (0.3% of body mass) | **12.5 g** (5% of body mass; soft-prey appendage limit) | mass ratio **20:1 to 330:1** |
| *Isoxys* 1.0 g | 0.003 g | 0.05 g | 20:1 to 330:1 |

If the evolved population lands in this window, the fossil-derived diet (large soft-bodied nekton,
not the superabundant small benthos) has been **reproduced rather than assumed**, and it sits inside
the modern invertebrate predator–prey mass-ratio range. That is criterion V4.

**Note on the eye's role here.** You asked whether the eye helps assess whether prey is worth
attacking, and whether prey is worth fleeing. It does, and it comes for free from §3A — no extra
mechanism needed. A better eye returns a more accurate **angular size** (hence a better mass
estimate) and a more accurate **bearing and range**, both with error ∝ `Δρ/SNR`. A class-II animal
knows only "something dark, roughly that way." A class-IV animal knows "a 3 g object, 1.4 m,
bearing 20°, closing." **Discrimination — knowing what you are looking at before you spend the
burst — is one of the main things acuity buys**, and it is measured by the noise on the percept,
not by a separate rule.

### 9.6 Population density and how big the world must be

Derived from §8.2 production and 10% trophic transfer:

| Level | Available energy | Individual demand | **Density** |
|---|---|---|---|
| Primary production | 12,300 J m⁻² day⁻¹ | — | — |
| Primary consumers (taxa 5,6,7,1) | ~2,460 J m⁻² day⁻¹ (20% accessible) | 25–293 J day⁻¹ | *Kunmingella* **~40 m⁻²**; myllokunmingid **~2 m⁻²** |
| Mesopredators (*Isoxys*, *Waptia*) | ~246 J m⁻² day⁻¹ | 605–875 J day⁻¹ | **~0.15–0.3 m⁻²** |
| Apex (*Anomalocaris*) | ~25 J m⁻² day⁻¹ | 41,700 J day⁻¹ | **1 per ~1,700 m²** |

**Design consequence, and it is a big one:** an *Anomalocaris* needs on the order of **10³ m² of
seafloor to support it**. A simulation arena must be **at least 100 × 100 m (10,000 m²)** to hold
even ~6 apex predators, and that arena will contain ~400,000 *Kunmingella* and ~20,000
myllokunmingids. If the arena is small, the apex predator either goes extinct immediately or has
to be given unrealistic prey density — which is exactly the "predators pinned at their cap"
symptom seen in the earlier run log.

Recommendation: **run the myllokunmingid population at full individual resolution and represent
lower trophic levels as a resource field**, with apex predators as a small number of full agents.
Otherwise the compute is untenable.

### 9.7 Starvation, hunger and death

You asked for a death clock. Derived from mobilisable energy reserve ÷ metabolic rate:

| Quantity | Value | Tier |
|---|---|---|
| Mobilisable reserve, healthy adult | **25% of wet body mass** (range 15–35%) | C |
| Energy in reserve | reserve mass × 3.6 kJ g⁻¹ | C (derived) |
| Metabolic down-regulation when starving | drops to **1.15 × SMR** after 24 h without food | C |

| Animal | Reserve energy | Down-regulated cost | **Days to death** | **Days to impairment** (reserve <35%) |
|---|---|---|---|---|
| *Anomalocaris* 250 g | 225 kJ | 11.5 kJ day⁻¹ | **~19.6 days** | **~12.7 days** |
| *Waptia* 3.0 g | 2.70 kJ | 366 J day⁻¹ | **~7.4 days** | **~4.8 days** |
| *Isoxys* 1.0 g | 900 J | 167 J day⁻¹ | **~5.4 days** | **~3.5 days** |
| Myllokunmingid 0.20 g | 180 J | 55 J day⁻¹ | **~3.3 days** | **~2.1 days** |
| *Kunmingella* 0.010 g | 9.0 J | 4.7 J day⁻¹ | **~1.9 days** | **~1.2 days** |

**This asymmetry is important and it is derived, not tuned: small prey must feed almost every day;
the apex predator can go nearly three weeks.** That single fact drives most of the ecosystem's
dynamics — predators can afford to be selective and wait for good opportunities; prey cannot afford
to stop foraging even when predators are around. **The prey's forced exposure is what makes the
predator's vision profitable**, and the prey's need to keep feeding under risk is what makes *its*
vision profitable. Neither side is tuned; both fall out of body size.

**Impairment model:** below 35% reserve, burst capacity scales linearly with remaining reserve
(down to 0 at 0%). A starving animal literally cannot escape or attack. This closes the loop
between energy and mortality without an arbitrary death rule.

**Hunger / satiation (tier C/D):**

| Quantity | Value | Tier |
|---|---|---|
| Maximum gut capacity | **6% of body mass** (range 4–10%) | C |
| Maximum single meal | 6% of body mass | C |
| Gut evacuation time at 28 °C | **14 hours** (range 8–24) | C |
| Digestion is | first-order: gut empties exponentially, τ = 14 h / ln2 ≈ 20 h | D |
| **Foraging trigger** (gut fullness at which to resume) | **EVOLVED** — §3B.1. Seed at 0.30. | — |
| **Satiation** (gut fullness at which to stop) | **EVOLVED** — §3B.1. Seed at 0.90. | — |
| Opportunistic override | **EVOLVED** as a weight on the attack drive | — |

### 9.8 Cost of the eye

You noted you will likely run with eye cost = 0 first. Good — but §3 argues the earlier failure was
a missing gradient, not an excessive cost, so setting cost to zero will not fix it on its own.

Grounding: photoreceptor and neural tissue is among the most metabolically expensive tissue in any
animal — roughly an order of magnitude more costly per gram at rest than muscle. Nilsson makes the
processing cost explicit: **information rate rises ~1000× per class** (I: 0.011 → II: 6.66 → III:
2.8×10³ → IV: 3.5×10⁶ bit s⁻¹). Paterson et al. note *Anomalocaris* would have required **optic
neuropils and a brain of complexity comparable to crown-group arthropods** — the brain is part of
the eye's price.

| Class | Eye + visual processing, as fraction of SMR | Tier |
|---|---|---|
| I | **0.1%** | D |
| II | **0.6%** | D |
| III | **3.0%** | D |
| IV | **10.0%** (range 5–15) | D |

Functional form: `eye_cost = a·(photoreceptor tissue mass) + b·(information rate)^0.33`, calibrated
to hit the table above. **The exponent on information rate is what creates a real optimum.** If the
cost is linear in acuity, class IV is always worth buying and you have engineered the outcome; §19
includes a falsifier run for exactly this.

---

## 10. Reproduction and life history

You asked how they bred, how many offspring, how they found each other. Real fossil data exists for
two of these, which is unusually lucky.

### 10.1 Documented Cambrian reproductive strategies (tier A)

**Two contrasting strategies are preserved in the same fauna.** This is a genuine fossil result and
both should be in the simulation as available strategies:

| | ***Kunmingella douvillei*** (r-strategy) | ***Waptia fieldensis*** (K-strategy) |
|---|---|---|
| Age of fossil | ~515 Ma, Chengjiang | ~508 Ma, Burgess Shale |
| **Eggs per clutch** | **50–80** | **up to 24** |
| **Egg diameter** | **150–180 µm** | **>2 mm** |
| Egg carrying | attached along **three pairs of posterior appendages**, gathered ventrally | held **under the carapace** |
| Embryos preserved? | no | **yes** — oldest known in situ embryos |
| Parental investment | low per egg, high count | **high per egg, low count; extended brood care** |

The coexistence of both suggests rapid evolution of modern-type life-history traits soon after the
Cambrian emergence of animals.

### 10.2 Life-history parameters for the simulation

| Parameter | Myllokunmingid (taxon 1) | *Anomalocaris* | *Isoxys* | *Kunmingella* | Tier |
|---|---|---|---|---|---|
| **Generation time** | **1.0 yr** | 2.0 yr | 0.75 yr | 0.5 yr | D |
| Age at maturity | 0.5 yr | 1.2 yr | 0.4 yr | 0.25 yr | D |
| Maximum lifespan | 3 yr | 6 yr | 2 yr | 1.5 yr | D |
| **Clutch size** | **400** (range 200–2,000) | 200 | 60 | **65** (A) | D except noted |
| Egg diameter | 0.35 mm | 1.0 mm | 0.3 mm | **0.165 mm** (A) | D except noted |
| **Spawning mode** | broadcast, external fertilisation | broadcast | egg-carrying | **egg-carrying, 3 posterior appendage pairs** (A) | D except noted |
| Parental care | none | none | carrying only | carrying only | D |
| **Spawning frequency** | **2× per year**, tied to the lunar cycle | 1× per year | 3× per year | 4× per year | D |
| Energy cost of a clutch | **20% of body energy** | 15% | 20% | 25% | C |
| **Larval / juvenile mortality to maturity** | **99.5%** | 99.0% | 99.3% | 99.2% | C |
| Adult annual mortality (non-predation) | 40% | 25% | 50% | 60% | D |
| Growth | indeterminate; adults keep growing until death | same | same (moulting) | same | A (trilobite analogue) |

**Nilsson & Pelger assumed one generation per year.** Keeping the focal lineage at 1.0 yr means the
sim's generation counts are directly comparable to their 364,000-generation figure, which is worth
preserving.

Note honestly: **trilobite lifespan and total moult count are genuinely unknown in the literature.**
Adult trilobites probably grew indeterminately, increasing in size at every adult moult until
death. Everything in the lifespan/maturity rows above is tier D by construction. It is on the §17
weak-joints list.

### 10.3 Mate finding — and why it is a class-IV payoff

| Quantity | Value | Tier |
|---|---|---|
| Primary mate-location channel | **chemical (pheromone plume)** at range 1–20 m | D |
| Secondary channel once vision exists | **visual recognition at <2 m** | D |
| Spawning aggregation size | 20–200 individuals | D |
| Aggregation trigger | lunar phase + local density threshold | D |
| Fertilisation success, broadcast | **35%** at aggregation density; falls as density⁻¹ | C |
| Visual-recognition bonus | up to **+25% fertilisation success** for class IV | D |

Mate recognition is one of Nilsson's explicit class-IV tasks, and it is the payoff that does **not**
depend on predation at all — worth having in the model precisely so the class-IV gradient is not
solely a predator/prey artefact.

---

## 11. Behaviour, movement and sensing

### 11.1 Swimming speeds

| Animal | Cruise | Cruise (BL s⁻¹) | Burst / attack | Burst (BL s⁻¹) | Burst duration | Tier |
|---|---|---|---|---|---|---|
| *Anomalocaris* (350 mm) | **0.40 m s⁻¹** | 1.14 | **0.70–0.90 m s⁻¹** | 2.0–2.6 | **3–8 s** | A (modelled speeds) |
| *Isoxys* (30 mm) | 0.045 m s⁻¹ | 1.5 | 0.30 m s⁻¹ | 10 | 1.5 s | D |
| *Waptia* (70 mm) | 0.08 m s⁻¹ | 1.1 | 0.55 m s⁻¹ | 8 | 2 s | D |
| **Myllokunmingid (26 mm)** | **0.052 m s⁻¹** | 2.0 | **0.52 m s⁻¹** | **20** | **0.4 s** | D |
| *Kunmingella* (5 mm) | 0.008 m s⁻¹ | 1.6 | 0.075 m s⁻¹ | 15 | 0.3 s | D |

**The critical asymmetry** (tier D, but grounded in universal fish/invertebrate escape mechanics):
the predator's top speed (0.9 m s⁻¹) *exceeds* the prey's (0.52 m s⁻¹). The prey does not escape by
being faster. It escapes by **acceleration and turning radius**:

| Quantity | *Anomalocaris* | Myllokunmingid | Tier |
|---|---|---|---|
| Peak acceleration | **4 m s⁻²** | **35 m s⁻²** | D |
| Minimum turning radius | **0.5 body lengths** (0.18 m) | **0.15 body lengths** (0.004 m) | D |
| Time to reach top speed | 0.22 s | 0.015 s | D (derived) |

Consequence: the predator **must commit early and accurately**, because once the prey reacts, the
predator cannot turn tightly enough to follow. **That is precisely the pressure that pays for
acuity**, and it is a geometric consequence of body size, not a tuned parameter.

### 11.2 Reaction latency

| Quantity | Value | Tier |
|---|---|---|
| Prey escape latency, **mechanosensory** (near-field flow) | **20 ms** | C |
| Prey escape latency, **visual** (class IV) | **50 ms** (= Nilsson class IV integration time) | A/C |
| Prey escape latency, **class III** | 100 ms | A |
| Prey escape latency, **class II** | 1,000 ms | A |
| Predator strike decision latency | **60 ms** | D |
| Mechanosensory detection range (near-field, prey side) | **1–3 body lengths** = 0.03–0.08 m | C |
| Chemosensory detection range | **0.5–5 m**, downstream only, latency 2–10 s | C |

**This is the whole competitive picture in one table.** Non-visual senses work at 0.03–0.08 m
(mechanosensory) or seconds-late and direction-poor (chemosensory). Vision works at 0.6–5.2 m
depending on turbidity (§6.3). **The gap between 0.08 m and 1.7 m is what vision is buying**, and
it collapses to almost nothing during a storm plume. That is a real, quantified, environment-driven
selection differential, and it needs no fitness term.

### 11.3 Search and movement patterns

| Quantity | Value | Tier |
|---|---|---|
| Predator search mode | **cruise-search** (continuous swimming, scanning) | A (nektonic, streamlined) |
| Predator search path | **EVOLVED** (`search_tortuosity`). Seed: correlated random walk, turn SD 25°/s | — |
| Area-restricted search after a capture | **EVOLVED**. Seed: turn SD → 70° for 120 s | — |
| Prey movement, foraging | **EVOLVED**. Seed: turn SD 40°/s | — |
| Prey movement, alarmed | **EVOLVED** (`flee_drive`, `freeze_duration`). Seed: dash away from threat bearing, freeze 5–20 s | — |
| Fraction of day spent active | **EVOLVED** (`activity_window`). Seed: predator 10.5 h, prey 14 h | — |
| Diel pattern | predator's is **constrained by physics**, not choice: eye parameter <2 means it cannot see at night (§3A.5 gives SNR < 2 below twilight), so diurnality is forced by the optics | **A** |
| Vertical excursion range, prey | **EVOLVED** (`preferred_depth_day`, `preferred_depth_night`) | — |

The predator's diurnality is worth dwelling on: **we do not set it.** It falls out of §3A — at
night the photon catch N collapses and `C·√N` drops below 2 for every target, so the predator
simply cannot detect anything. That hands the prey a **nocturnal refuge**, which is another
class-I payoff (you need to know it is night to use it), and it is derived rather than assumed.

**The predator being strictly diurnal is a fossil-derived constraint** (eye parameter <2 is
diagnostic of diurnal animals in well-lit water), and it hands the prey a real refuge: **night**.
An animal that can tell day from night can exploit that refuge — another class-I payoff.

### 11.4 Flow and station-holding

| Quantity | Value | Tier |
|---|---|---|
| Background current | 0.02–0.10 m s⁻¹ | D |
| Storm current | 0.3–1.0 m s⁻¹ | B |
| Cost of holding station against flow | scales with (flow speed)³ | C |
| **Displacement without visual station-holding** | drift at ~70% of current speed | D |
| **Displacement with class III optic-flow feedback** | drift reduced to ~10% of current speed | D |

Being swept off a 3–8×-enriched food patch (§8.4) by a 0.05 m s⁻¹ current costs a real fraction of
daily intake. Optic flow fixes it. **This is the cleanest class-III payoff in the model** and it has
nothing to do with predators.

### 11.5 Visual fields and eye geometry (tier A where fossils allow)

| Animal | Eye arrangement | Field of view | Acute zone | Tier |
|---|---|---|---|---|
| *Anomalocaris* | paired **stalked** eyes, 20–30 mm diameter | visual surface curves up to ~180° per eye; **near-panoramic combined** | forward/downward | A |
| *Isoxys* | large spherical eyes | wide | **"bright zone"** — a patch of enlarged facets | A |
| **Myllokunmingid** | **four camera eyes**: lateral pair + **pineal + parapineal** | reported as approaching **360°** combined | lateral eyes: lateral, small forward binocular overlap; **pineal pair: dorsal, looking up** | A |
| *Fallotaspis* (trilobite) | reniform holochroal | **narrow slit-like surface, forward + lateral horizon** | horizon band | A |

**The upward-looking pineal pair is a gift for this simulation.** An eye aimed at the sky, in an
animal that is prey to a nektonic predator hunting *above the benthos in a well-lit column*, is a
**shadow/silhouette detector**. Encode it as a separate low-resolution dorsal channel whose job is
detecting a dark object against a bright sky — which is the *highest-contrast detection task
available in the entire environment* (C0 approaching 1.0, versus ~0.2–0.5 for a sideways-viewed
object against scattered space-light).

That matters enormously: the **easiest** visual task in this world is spotting a silhouette from
below, and it is available at class II (shadow-alarm, 10% contrast). It is the natural first rung
where vision starts to matter for survival, long before anything can resolve an image. Sim form:
give each object an aspect-dependent inherent contrast:

| Viewing geometry | Inherent contrast C0 | Tier |
|---|---|---|
| Object viewed **from below against the surface** | **0.85** | D |
| Object viewed horizontally against space-light | **0.30** | D |
| Object viewed **from above against the dark seafloor** | **0.20** | D |
| Transparent/camouflaged prey (evolvable, see §15) | down to **0.03** | C |

### 11.6 The predation sequence — every stage with a number

| Stage | Parameter | Value | Tier |
|---|---|---|---|
| 1. Detect | range | from §6.3 contrast equation; class-dependent threshold | C |
| 2. Identify | mass/identity estimate error | **derived, not set** — error ∝ `Δρ/SNR` from §3A.6; no separate rule | A (physics) |
| 3. Approach | speed | cruise 0.40 m s⁻¹ | A |
| 4. Commit | **strike initiation distance** | **EVOLVED** (`burst_commit_threshold`) — §3B.1. Seed at 1.2 m and let it move. | — |
| 5. Burst | speed / duration | 0.90 m s⁻¹ / 3–8 s | A/D |
| 6. Prey reacts | at range | when prey detects: visual 1.7 m (clear), mechanosensory 0.08 m | C |
| 7. Grasp | **appendage reach** | *A. canadensis* frontal appendage **~130 mm**; effective strike envelope **0.15 m** | A |
| 8. Handle | see §11.7 | | |

**Capture success must be an OUTPUT, not an input.** It emerges from: detection range × prey
reaction range × relative acceleration × turning radii × strike envelope. Do not set it.

Expected emergent range for calibration only, **not to be coded**: modern visual invertebrate
predators span 5–30% (larval fish) to 90–97% (dragonflies, extreme acuity, uncluttered background).
A cluttered, turbid, contrast-limited Cambrian delta should land at the **low end, ~15–35%**.

**Fossil check (tier A):** healed, **preferentially right-sided** sub-lethal injuries on trilobites
prove that a substantial fraction of attacks made contact and **failed non-fatally**. Preferential
sidedness also implies a directional, lateralised attack — the predator was orienting on the prey.
**Any sim in which detection ⇒ capture is falsified by these fossils.**

### 11.7 Handling times

| Predator / prey | Handling time | Tier |
|---|---|---|
| *Anomalocaris* / *Waptia* (3 g) | **90 s** | D |
| *Anomalocaris* / *Isoxys* (1 g) | **45 s** | D |
| *Anomalocaris* / myllokunmingid (0.2 g) | **20 s** | D |
| *Isoxys* / *Kunmingella* (0.01 g) | **8 s** | D |
| Scaling rule | handling time = 30 · (prey mass / predator mass)^0.4 seconds | D |
| Post-capture vulnerability | predator cannot burst for **handling time + 30 s** | D |

Handling time is what makes small prey unprofitable (§9.5), so this table is load-bearing for the
diet result.

---

## 12. The eye itself — full parameterisation

### 12.1 Nilsson's four classes: the physical requirements

| | **I** Nondirectional | **II** Directional | **III** Low-res vision | **IV** High-res vision |
|---|---|---|---|---|
| **Integration time** | 600 s | 1 s | 0.1 s | **0.05 s** |
| **Acceptance angle Δρ** | 360° (unshielded) | 100–180° | 25–40° | **1–5°**, to fractions of a degree |
| **Contrast threshold** | 30% | 10% | 3% | 3% |
| **Photons per sample** | 50 | 500 | 5,000 | 5,000 |
| **Min. radiance, unspecialised cell** (log quanta m⁻² sr⁻¹ s⁻¹) | 11.7 | 15.8 | 20.0 | **23.1** |
| **Information rate** (bit s⁻¹) | 0.011 | 6.66 | 2.8×10³ | **3.5×10⁶** |
| **Membrane stacking** | none | 10s–100s of layers | 300–2,000 | **1,500–4,000** |
| **Optics** | none | screening pigment only | pit/cup; weak or under-focused lens | **focusing lens required** |
| **Aperture** | — | — | — | 3–15 mm gives night vision |
| Functional description | measure ambient intensity | phototaxis by body scanning | **the first true eyes** | image formation |

### 12.2 The constraint that should drive the whole simulation

**Class IV requires 23.1 log quanta — about 1,000× brighter than direct sunlight — for an
unspecialised photoreceptor.** It is *physically unreachable* at any time of day. The only route is
to buy sensitivity back:

| Compensation | Gain | Tier |
|---|---|---|
| Membrane stacking | **+2.5 log units** (max 3.0) | A (Nilsson) |
| Aperture / lens (3 mm) | **+5.5 log units** | A (Nilsson) |
| Combined | +8.0 log units → 23.1 − 8.0 = **15.1**, which is below moonlight | derived |

**Therefore high-resolution vision is impossible unless membrane stacking and focusing optics
evolve together.** This is a hard, physics-derived lockstep and it is the correct way to make the
eye evolve without rewarding acuity:

> **Make photon capture the only currency, and make acuity something that costs photons.**
> Narrowing Δρ throws photons away. The animal must recover them via stacking and aperture or it
> goes functionally blind. The optimum then falls out of the ambient light field — set by depth,
> time of day and turbidity — rather than from any fitness term.

### 12.3 Camera-eye morphology: the Nilsson & Pelger stage sequence

The eight-stage sequence, as continuous morphological parameters (**not** discrete stages — nothing
in the sim should snap between them):

| Genome parameter | Range | Starting value | Meaning |
|---|---|---|---|
| `patch_width` | 0.05–3.0 mm | 0.10 mm | diameter of the photoreceptive area |
| `invagination` | 0.0–1.0 | **0.0** | 0 = flat patch; 0.5 = hemisphere; 1.0 = sphere with a pinhole |
| `aperture_ratio` | 0.02–1.0 | **1.0** | aperture diameter / cup diameter; 1.0 = wide open, 0.05 = pinhole |
| `lens_index_gradient` | 0.0–0.35 | **0.0** | 0 = no lens; ~0.33 = Matthiessen graded-index lens (fully focused) |
| `lens_diameter` | 0–3.0 mm | 0 | |
| `focal_ratio f/D` | derived | — | in focus when ≈ 2.55 (Matthiessen's ratio) |
| `membrane_layers` | 1–4,000 | **1** | photoreceptor membrane stacking |
| `screening_pigment` | 0.0–1.0 | **0.0** | optical density of shielding pigment |
| `receptor_count` | 1–10⁶ | **4** | number of photoreceptor cells |
| `receptor_spacing` | derived | — | with focal length, sets sampling-limited resolution |

Derived optical quantities the sim computes each generation:

```
Δρ (acceptance angle)  = max( receptor_spacing / focal_length ,  λ / aperture_diameter )   [sampling vs diffraction]
photon_catch  ∝  aperture_area × membrane_layers × integration_time × Δρ²
resolvable_pixels      = field_of_view / Δρ
information_rate       ∝ resolvable_pixels / integration_time
Nilsson_class          = whichever class's requirements the current morphology satisfies
```

**Never let a fitness term read Δρ, acuity, or class directly.** They should only ever enter through
`photon_catch` and `contrast detection`, which then enter through behaviour, which then enters
through energy and survival. This preserves the constraint discipline already established in the
existing sim's C1/C2 rules.

### 12.4 Rate of change — how fast can this happen

Nilsson & Pelger's reconstruction, which the simulation should be able to reproduce:

| Quantity | Value |
|---|---|
| Morphological distance, flat patch → focused camera eye | **1,829 steps of 1%** across 8 stages |
| Heritability h² | **0.50** |
| Coefficient of intraspecific variation V | **0.01** |
| Selection intensity i | **0.01** |
| Response per generation R = h²·i·V | **5×10⁻⁵** (0.005% per generation) |
| Generations per 1% step | **200** |
| **Total** | 1,829 × 200 ≈ **365,800 generations ≈ 364,000 years** at 1 gen/yr |

Their conclusion is that this is *pessimistic* — a few hundred thousand years is geologically
instantaneous.

**Honesty requirement.** The earlier run log found the climb is **mutation-step-limited, not
gradient-limited** (no movement at σ=0.03, full climb at σ=0.25). That is *consistent with* Nilsson
& Pelger rather than a contradiction — 365,800 generations at 1% steps is simply not simulable at
any realistic tick budget, so σ must be inflated to compress the timeline. **Report the compression
factor explicitly:** given the σ used and the generations run, state the implied
generations-per-real-generation, so a reader can see how much time was fast-forwarded. This should
be printed with every run.

### 12.5 The alternative architecture (if you build option C)

Compound apposition eye genome, for the arthropod taxa or for a head-to-head:

| Parameter | Range | Note |
|---|---|---|
| `facet_count N` | 1–30,000 | |
| `facet_diameter D` | 5–120 µm | *Anomalocaris* measured **~95 µm** |
| `eye_radius R` | 0.1–15 mm | |
| `interommatidial_angle Δφ` | derived = D / R | *Anomalocaris* measured **<1.4°** |
| **`eye_parameter p = D · Δφ`** | derived | **<2 µm·rad = bright-light acuity specialist; >3 = dim-light specialist** |
| Size scaling | **eye radius ∝ (resolution)²** | the quadratic wall; Mallock: human acuity ⇒ 6 m radius |

---

## 13. Lockstep couplings

| Coupled pair | Direction | Encode as |
|---|---|---|
| **Acuity ↔ photon capture** | physically antagonistic — narrowing Δρ throws photons away | hard physics constraint, never a fitness term |
| **Eyes ↔ neural tissue** | 1000× information rate per class; *Anomalocaris* required crown-group-grade optic neuropils | superlinear metabolic cost in information rate |
| **Eyes ↔ locomotion** | detection is worthless without capture: swimming lobes + burst + outstretched appendages are one package | joint trait; neither pays alone |
| **Eyes ↔ oxygen** | pO₂ caps aerobic scope → caps pursuit → makes accurate commitment the thing vision buys | global forcing on the burst budget |
| **Eyes ↔ grasping appendages** | *Isoxys*'s prehensile frontal appendages are used for **recognition and capture** | capture apparatus must co-evolve |
| **Vision ↔ prey contrast/transparency** | in a lit pelagic race between soft-bodied animals, the cheapest counter to acuity is **being hard to see** | **evolvable prey contrast trait — see §15** |
| **Vision ↔ armour** | *Anomalocaris* did **not** eat biomineralised prey; armour answered a different guild | **do not** wire armour to the visual predator |
| **Vision ↔ depth/diel positioning** | ambient light varies with depth and time; darkness is a defence | emerges free from §6.5 + §8.3 |
| **Vision ↔ turbidity** | more suspended sediment → shorter contrast horizon → **less value in eyes** | coupled loop; storms periodically devalue the eye |

---

## 14. Schooling and collective behaviour — the honest answer

> **SCOPE NOTE: no migration. None.** The word "migratory" appears in the literature below only as
> one interpretation of why *Synophalos* formed chains. **We are not modelling migration**, long-
> distance or otherwise. It would add enormous complexity (a much larger world, seasonal drivers,
> navigation, homing) for no connection to eye evolution. The only collective behaviour in scope is
> **local aggregation within the simulation arena** — animals within metres of each other choosing
> to associate. That is it. Recorded in §18.

**What is actually preserved (tier A):**

- ***Synophalos xynos***, Chengjiang, **~520 Ma** — the earliest known collective behaviour. Bivalved
  euarthropods in **linear monospecific chains**, interpreted as reproductive or migratory queues,
  assembled in the water column and then deposited by passive sinking. Compared to spiny lobster
  migratory queues and processionary caterpillars.
- ***Ampyx priscus***, Fezouata, **~480 Ma** — ~20 mm trilobites in orderly same-direction queues.
  ***Ampyx* was blind.** Coordination was by **long stout frontal spines (tactile contact) and/or
  chemical cues**, not vision.
- Further trilobite queues in the Ordovician and Devonian; hydrodynamic analyses support genuine
  drafting benefits between leading and following individuals.

**What this means:**

1. Collective behaviour is **as old as the visual arms race** — ~520 Ma, in the same biota as the
   earliest eyes. The sim is entitled to expect grouping in this window.
2. **But every documented case is a *queue*, not a *school*, and the best-resolved one is a blind
   animal using contact and chemistry.** There is no fossil evidence for visually mediated
   three-dimensional schooling in the Cambrian.
3. If the sim evolves visual schooling, that is a **prediction, not a reconstruction**, and must be
   labelled as such. If it only ever produces tactile/chemical queues, that is arguably the **more
   faithful** result and is not a failure.

**Encode both benefits and let the population's sensory capability decide which it can access:**

| Mechanism | Benefit | Sensory requirement | Tier |
|---|---|---|---|
| **Queue** (single file, contact-maintained) | drag reduction **15–25%** for followers | tactile (spine contact, <1 body length) or chemical | A/C |
| **School** (3D aggregation) | predator **dilution** (1/N risk) + **confusion effect** (−20–40% predator capture success) | vision, class III+ | C |
| Aggregation cost | local food depletion; increased detectability of the group (**group detection range ×N^0.33**) | — | D |

Whether the population lands on queues or schools then becomes an **output of eye evolution rather
than an input**.

---

## 15. Prey counter-adaptation: contrast, not armour

This deserves its own section because it is the most underrated axis in the model.

In a well-lit pelagic arms race between soft-bodied animals, the prey's cheapest counter-adaptation
is **reduced contrast** — transparency, silvering, counter-illumination-analogue pigmentation — not
armour. And prey contrast is precisely the variable Nilsson's contrast thresholds (30% → 10% → 3%)
are denominated in.

### 15.1 Contrast is NOT one global number — and it does not need to be

You asked whether contrast differs by environment and viewing direction. It does, strongly — and
the clean resolution is that the animal has **one evolvable trait** and the geometry produces all
the different contrasts for free. No separate values to set.

The evolvable trait is the animal's **body radiance ratio ρ** — effectively how much light its body
returns relative to the water around it. ρ ≈ 1.0 is a perfectly transparent/matched animal
(invisible); ρ ≈ 0.15 is a dark opaque one.

Inherent contrast against any background is then the standard equation:

```
C_inherent = (L_body − L_background) / L_background       where L_body = ρ · L_ambient(depth)
```

and `L_background` depends entirely on **which way you are looking**:

| Viewing geometry | L_background | C_inherent for a dark animal (ρ = 0.15) | Why |
|---|---|---|---|
| **Looking up** — object silhouetted against the bright surface | full downwelling radiance | **−0.85** | the brightest background there is; a dark body is nearly black against it |
| **Looking horizontally** — object against scattered space-light | side-scattered radiance, ~30% of downwelling | **−0.30** | dimmer background, so less contrast |
| **Looking down** — object against the dark seafloor | substrate reflectance 0.10–0.20 × downwelling | **+0.20** | the animal is now *brighter* than its background — contrast flips sign |

**Three consequences worth having:**

1. **The easiest detection task in this entire world is looking up.** That is why the
   myllokunmingid's **upward-pointing pineal eye pair** (§11.5) is such a good detector, and why
   shadow-alarm is available at class II when nothing else is.
2. **The hardest is looking down.** A predator hunting benthic prey from above has a contrast of
   ~0.2 to work with — and the sign is inverted, so it needs a *different* detection polarity.
   This is a real, physically grounded reason the Cambrian visual arms race was **pelagic**, and it
   reinforces §7.3 from the optics side.
3. **Prey cannot minimise contrast in all directions at once.** Any ρ that hides you from below
   makes you visible from above, and vice versa. The optimum depends on where your predators are —
   which, since *Anomalocaris* hunts *above* the benthos looking down and around, is itself an
   evolving target. That is a genuinely non-trivial co-evolutionary problem and it emerges from one
   trait plus geometry.

### 15.2 Parameters

| Parameter | Range | Cost | Tier |
|---|---|---|---|
| `body_radiance_ratio ρ` | **0.15 → 0.95** (EVOLVED) | transparency costs muscle density: **−15% burst power at ρ > 0.85** | C/D |
| Effect | feeds `C_inherent` above, which feeds `C_effective` in §3A.6 | | C (physics) |
| Ambient-matching (counter-shading analogue) | allow ρ to differ dorsally vs ventrally — **2 evolvable values, not 1** | small extra pigment cost | D |

Splitting ρ into dorsal and ventral values costs one extra gene and lets counter-shading evolve on
its own. Given point 3 above, that is likely to happen, and it would be a satisfying emergent
result — countershading is one of the most widespread anti-predator adaptations in the modern
ocean and nobody would have coded it.

**Make prey contrast evolvable and the predator's contrast threshold the thing under selection, and
the arms race becomes a direct, physically grounded co-evolutionary chase with no tuned coefficients
anywhere in it.** The predator improves acuity; the prey lowers contrast; the predator must improve
again. That is a Red Queen loop built entirely from optics.

---

## 16. Things I will not bake in

| Claim | Status | Why it matters |
|---|---|---|
| "Vision caused the Cambrian explosion" (Parker's light-switch hypothesis) | **Contested**; specialists have called the claims exaggerated | Do not build the sim so vision *must* trigger a radiation — that assumes the conclusion. (We don't care about the explosion anyway; we care about the eye.) |
| "*Anomalocaris* cracked trilobites" | **Refuted** by appendage FEA | Wire the arms race to soft-bodied nekton, not armoured benthos |
| "Eyes evolved during the Cambrian explosion" | Misleading — classes I–III are Precambrian; largely complete by ~530 Ma | State the proxy relationship in the README |
| "Trilobites show gradual eye improvement in the fossil record" | The **earliest trilobites already have fully differentiated compound eyes** | There is no fossil sequence to fit against — only endpoints |
| "Oxygen rose steadily and permitted everything" | Oxygen was **low and dynamic**, not monotonic | Model pO₂ as a noisy ramp |
| "Cambrian schooling" | Only **queues** are documented; the clearest case is **blind** | §14 |

---

## 17. Weakest joints — attack these first if the sim misbehaves

Ranked by (how uncertain) × (how load-bearing):

1. **Eye cost scaling exponent** (§9.8) — tier D, and it alone determines whether there is a real
   optimum or runaway acuity.
2. **Lifespan, age at maturity, generation time** (§10.2) — tier D. *Trilobite lifespan and moult
   count are genuinely unknown in the literature.* Everything downstream of generation time (the
   whole timescale) rests on this.
3. **Clutch size and juvenile mortality for the chordate lineage** (§10.2) — tier D by analogy to
   modern agnathans; no fossil data.
4. **Acceleration and turning-radius asymmetry** (§11.1) — tier D, and it is what makes vision pay.
5. **Strike initiation distance** (§11.6, 1.2 m) — tier D, directly sets the required detection range.
6. **Inherent contrast values by viewing geometry** (§11.5) — tier D, and they set the entire
   detection-range calculation.
7. **The 60:40 water-column:benthic production split** (§8.2) — tier D, determines whether the
   pelagic or benthic pathway dominates.
8. **Trophic transfer efficiency 10%** (§9.6) — tier C but the range (5–15%) changes predator
   density threefold.

Everything in §12.1 (Nilsson's class requirements) and §12.4 (N&P rates) is tier A from the
literature and should be the last thing questioned. **Everything in §3A is physics and should never
be questioned as a parameter at all** — if it is wrong, it is wrong as an equation.

### 17.1 Where the tier-D numbers actually came from

Fair question, and it deserves a straight answer. Tier D is not one thing — it is five different
methods with very different reliability, and lumping them together makes the doc look weaker than
it is. Method used, per number:

| Method | How it works | Examples | Real reliability |
|---|---|---|---|
| **1. Allometric scaling** | Apply a measured, well-replicated scaling law (metabolic rate ∝ M^0.70, burst speed in body-lengths/s, gut capacity as % body mass) to a body mass estimated from fossil dimensions | SMR table §9.3, swimming speeds §11.1, starvation clocks §9.7, gut §9.7 | **Good** — these are among the most robust relationships in biology, often ±30% across whole phyla. Arguably tier C. |
| **2. Physical derivation** | Compute it from first principles | O₂ solubility, UV attenuation depth, sighting range, world size §9.6, contrast §15.1, everything in §3A | **Very good** — it is arithmetic on tier A/B/C inputs |
| **3. Budget closure** | Pick the value that makes two independent calculations agree | prey energy density, FMR multiplier, trophic transfer — validated by the 4.6% body mass/day cross-check against measured daily rations | **Good** — a wrong value shows up as a budget that doesn't close |
| **4. Modern analogue transfer** | Take a value from the nearest living functional equivalent | escape latency, EPOC constants, patch statistics, larval mortality | **Moderate** — depends on how good the analogue is; a Cambrian stem-chordate is not a modern fish |
| **5. Construction** | Nothing in the literature; I picked a defensible value | **handling times §11.7**, inherent contrast values (now superseded by §15.1), lifespan/maturity §10.2, eye cost exponent §9.8 | **Weak — this is the real tier D** |

**Only method 5 is genuinely arbitrary, and it is now a short list.** That list is the one to
worry about. Methods 1–3 would be better labelled C.

### 17.2 How to upgrade a number — four routes, in order of strength

**Route 1 — move it to EVOLVED (strongest; eliminates the bias entirely).**
This is now done for every decision parameter (§3B.1). It is the direct answer to your concern
that *"if I set them, they're set and they won't get more accurate relative to what the simulation
discovers."* An evolved parameter **does** get more accurate relative to what the simulation
discovers, because the simulation is what sets it. Anything that can be moved to this column
should be.

**Route 2 — sensitivity sweep (proves the number doesn't matter).**
If the headline result is unchanged across the full plausible range of a parameter, its tier is
irrelevant. This should be **mandatory, not optional** — see criterion V19. A number that has been
swept and shown not to matter is as good as a measured one.

**Route 3 — cross-constraint (find a second independent route to the same quantity).**
The §9.4 daily-ration check is the model: an energy budget built from metabolic scaling landed at
4.6% body mass/day, and that was independently checkable against measured rations for comparable
animals. Any tier-D number with two independent derivations that agree is effectively tier C.

**Route 4 — deeper literature (some of these really can be improved).**
Honest list of numbers where I believe better values exist and I have not yet found them:

| Number | Where to look |
|---|---|
| **Handling times** (§11.7) — the one you flagged | Functional-response studies of modern predatory crustaceans and cephalopods measure handling time directly against prey mass. This literature exists and I have not mined it. **Highest-value single upgrade in the document.** |
| Escape latency and turning radius for a 25 mm elongate swimmer | Larval-fish C-start kinematics is a large, quantitative literature |
| Anaerobic pool sizes (bursts per day) | Fish EPOC and white-muscle glycogen studies give this in measurable units |
| Eye/neural tissue metabolic cost | Blowfly photoreceptor energetics (Laughlin et al.) gives ATP cost per bit directly — this could convert §9.8 from a guess to a calculation |
| Cambrian chordate reproductive output | Modern basal chordate and agnathan fecundity, weighted by body size |

The Laughlin line is the most interesting: **cost per bit of information is a measured quantity in
insect photoreceptors.** If that transfers, §9.8's eye cost stops being tier D and becomes a
derivation from the information rate — which is already computed in §3A. That would remove the
single most load-bearing arbitrary number in the model.

### 17.3 On the specific §11.7 worry

You said: *"these numbers are mostly made up but have a huge impact on decision making... the bias
will stay the full time with huge influence."*

Correct as stated, and partially fixed. Handling time **cannot** be evolved — it is jaw and
appendage mechanics, a fact about bodies, so it stays in the SET column. But:

- The **decisions** that used to depend on it (what to attack, when to commit) are now evolved
  (§3B.1), so handling time no longer directly determines behaviour — it only shapes the payoff
  landscape that behaviour evolves against.
- It is now **route-4 upgradeable** — the functional-response literature measures exactly this.
- It must be **swept** under V19, so if the result depends on it we will know.

That converts it from a silent bias to a known, bounded, testable one. That is the most that can
honestly be done with it.

---

## 18. Deliberately excluded — the "if it doesn't work, add these back" list

Recorded so that if the simulation fails to produce an eye, there is a list of what was knowingly
left out rather than a blank.

| Excluded | Reason for exclusion | Reconsider if... |
|---|---|---|
| **Burrowing / infaunality as an evolvable strategy** | Judgement call: the agronomic revolution is largely a *consequence* of the Cambrian radiation, and infaunality is a defence that makes vision irrelevant rather than one that shapes it. Researching and parameterising it would divert effort from things that plausibly drive the eye. | prey populations collapse under visual predation with no viable refuge; or the arms race runs away because prey has no escape axis |
| **Bioturbation → turbidity feedback loop** | Same reason; depends on burrowing | turbidity turns out to be the dominant control on whether eyes pay |
| **Species with no trophic connection to the focal lineage**: *Waptia*/*Canadaspis*, *Kunmingella* (folded into the `mesozooplankton` field), *Cricocosmia*, *Diandongia*, all trilobites, sponges, hyoliths, chancelloriids | They were in the environment but have no measurable pathway to eye evolution in taxon 1. Including them means inventing tier-D numbers for each with no mechanism attached. See §7.2. | the food web proves too thin to be stable, or the primary-production budget doesn't close |
| **Migration of any kind** | You flagged this and you are right. Requires a far larger world, seasonal or lunar drivers, navigation and homing — enormous complexity, zero connection to eye evolution. The *Synophalos* "migratory queue" interpretation is one reading of a chain of fossils, not a modelled requirement. **Only local aggregation within the arena is in scope.** | never, realistically |
| **Within-lifetime learning** (learned avoidance, learned prey preference, warning-colour association) | Adds a second adaptive timescale that will confound attribution — when the eye improves you could not tell whether selection or learning did it. Everything the eye needs is reachable through evolved behaviour (§3B.2). | the eye evolves reliably without it and you want to explore what learning adds on top |
| **Co-evolution of the predator's eye** | Taxa 2 and 3 have eyes fixed at measured fossil values, isolating "does this environment build a camera eye?" from "what happens when both sides co-evolve?" §15's prey-contrast axis already supplies one live co-evolutionary loop. | the arms race stalls because the predator cannot respond to prey counter-adaptation |
| **Genome, genes, gene duplication, developmental genetics** | A rat's nest with no payoff here. Nilsson's I→II driver is "gene duplication frees a receptor copy," but the *effect* is what matters: a second receptor lineage becomes free to specialise. Model that as a **plain mutable trait**, not as genes. | the exaptation route (§3 corollary) can't be expressed as continuous traits |
| **Biomineralised armour as an evolvable defence** | *Anomalocaris* couldn't eat armoured prey, so armour is orthogonal to the visual arms race (§7.3) | the prey contrast axis (§15) proves insufficient as a counter-adaptation |
| **Multiple predator guilds beyond the nektonic visual one** (durophages, priapulid ambushers) | Not on the path to eye evolution | prey mortality is unrealistically dominated by visual predation alone |
| **Seasonality** | Greenhouse climate, low palaeolatitude, no ice — seasonal signal was weak | populations show unrealistic year-round stability |
| **Larval dispersal and metapopulation structure** | Large connected shelf → treat as one well-mixed population | genetic structure or local extinction becomes an issue |
| **Spectral / colour vision** | Colour is a class-IV refinement, not a driver of the climb; Cambrian opsin spectral tuning is unconstrained. **But your point is well taken and worth recording:** colour would make contrast *wavelength-dependent*, so a prey animal matched to its background under one opsin could become highly visible the moment a predator gains a second spectral channel. That is a real mechanism — a predator could break camouflage not by seeing more sharply but by seeing in a new colour, and prey would then have a much harder optimisation problem (match the background across *all* channels, not one). It would add a genuine new dimension to §15, and monochrome contrast is a real simplification, not a neutral one. Filed, not built. | the prey contrast race in §15 saturates — i.e. prey reaches a ρ that hides it from everything and the arms race dies. Adding a spectral channel is the natural way to restart it. |

**Kept despite seeming irrelevant** (per §0.2), with the justification that emerged:

| Kept | Why it turned out to matter |
|---|---|
| Moonlight, starlight, full diel light curve | Class-I payoff is diel timing and depth-holding (§3, §8.3). Without a light cycle, class I has zero function and **the climb cannot start**. |
| 21-hour Cambrian day | Sets foraging hours per day, which propagates into the whole energy budget |
| UV-B flux and depth attenuation | The other half of the class-I payoff (§6.4) |
| Tidal amplitude, storm frequency | Drives the episodic turbidity that periodically devalues vision (§6.3) |

---

## 19. Verification criteria

| # | Criterion | Check method |
|---|---|---|
| V1 | **Classes I–III each have a non-zero fitness gradient in isolation** | disable class-IV payoffs entirely; confirm the eye still climbs from class I to class III. If it does not, §3 has not been implemented |
| V2 | Evolved eye reaches **class IV** (Δρ ≤ 5°, focused lens, ≥1,500 membrane layers) in the clear-water config | read final genome, 3 seeds |
| V3 | In the turbid/plume-dominated config, the eye **stalls at class II–III** | same, turbid config |
| V4 | Emergent predator:prey mass ratio in **20:1 – 330:1** | log predator mass and consumed prey mass |
| V5 | Predator daily intake sits at **4–7% body mass/day** without being set | log g consumed / predator mass / day |
| V6 | Small prey (<0.3% predator mass) is **not** a viable diet despite being most abundant | diet composition by item mass |
| V7 | **Capture success < 1 and failed non-fatal contacts are common** (matches healed trilobite injuries) | log attacks / contacts / captures; expect 15–35% success |
| V8 | Acuity shows **diminishing returns beyond the contrast horizon** | invasion-gradient sweep of Δρ at fixed clarity; plot fitness vs Δρ; expect a knee near 4/c |
| V9 | **Class IV is unreachable without both membrane stacking and focusing optics** | disable stacking; verify no genome reaches Δρ < 5° with a viable photon budget |
| V10 | With eye cost **linear** rather than superlinear in information rate, acuity runs away | falsifier run; confirms the superlinear cost creates the optimum |
| V11 | **Diel vertical migration emerges** without being coded | log mean population depth vs time of day |
| V12 | Predator is **diurnal**; prey shifts activity toward night | activity logs by hour |
| V13 | Prey contrast **declines** as predator acuity rises (Red Queen) | plot mean C0 and mean Δρ over generations |
| V14 | Grouping, if it emerges, is classified as **queue** or **school** and the sim reports which sensory channel it depends on | classify aggregations by dependency |
| V15 | Blind founders remain viable (non-visual senses work) — a blind world is not auto-lethal | run fully blind, confirm persistence ≥100k ticks |
| V16 | **The compression factor is reported** — implied generations-per-real-generation given σ | printed with every run |
| V17 | **Epoch 1 (zero predators) still climbs class I → III** | run epoch 1 with predation disabled entirely; read final morphology. This is the strongest possible test of §3 |
| V18 | The evolved controller **discovers optimal foraging** rather than being given it | compare realised diet against the §9.5 profitability prediction; agreement validates the energy model |
| V19 | **No headline result depends on a single tier-D value** | mandatory sensitivity sweep over every method-5 number in §17.1 (handling times, lifespan, eye-cost exponent). Any result that flips inside the plausible range must be reported as contingent, not as a finding |
| V20 | **Nothing in the codebase reads a Nilsson "class"** | `grep -n "class_I\|classIV\|nilsson_class\|eye_class"` outside logging/analysis returns nothing. Classes are output labels only (§3A.5) |
| V21 | **No decision constant remains in the SET column** | audit against the §3B.1 table: strike distance, prey choice, flee distance, depth preference, activity window, hunger/satiation must all be genome entries |
| V22 | Countershading (dorsal ρ ≠ ventral ρ) emerges without being coded | plot the two evolved ρ values over generations (§15.2) |

**V1 and V17 are the most important criteria in this document.** They are the direct test of the
diagnosis in §3 — that the bottom of the ladder is climbed for non-predatory reasons — and if they
fail, nothing else matters. **V20 and V21 are the discipline checks**: they verify that we encoded
the environment and not the outcome.

---

## 20. Sources

**Eye evolution, physics and rates**
- [Nilsson, D-E. (2013), *Eye evolution and its functional basis*, Visual Neuroscience 30:5–20](https://pmc.ncbi.nlm.nih.gov/articles/PMC3632888/) — the four classes; all photon, integration-time, acceptance-angle, radiance and information-rate figures; class transition drivers; timing
- [Nilsson & Pelger (1994), *A pessimistic estimate of the time required for an eye to evolve*, Proc. R. Soc. B](https://royalsocietypublishing.org/doi/10.1098/rspb.1994.0048) — 1,829 × 1% steps, h²/i/V assumptions, ~364,000 generations
- [Kirschfeld, K., *The Resolution of Lens and Compound Eyes*](https://link.springer.com/chapter/10.1007/978-3-642-66432-8_19) and [Snyder, *Acuity of compound eyes: physical limitations and design*](https://link.springer.com/article/10.1007/BF00605401) — quadratic size scaling; Mallock's 6 m calculation
- [Feuda et al. (2012), *Metazoan opsin evolution reveals a simple route to animal vision*, PNAS](https://www.pnas.org/doi/10.1073/pnas.1204609109) — opsin subfamilies complete by ~700 Ma

**Perception physics (§3A)**
- [Land, M.F., *Optical sensitivity equation* — as reviewed in "Optical Sensitivity of Camera-Like Eyes to White Light"](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8544683/) — S = (π/4)²A²(d/f)²[1−exp(−kl)]; validated experimentally as a tool for comparing eyes
- [*The optical sensitivity of compound eyes: theory and experiment compared*](https://pmc.ncbi.nlm.nih.gov/articles/PMC2614179/)
- [Rose, A. (1948), the Rose criterion — CNR ≥ 3–5 for detection; SNR ≈ 2–3 at threshold](https://radiologykey.com/4-signal-detection-theory-a-brief-history/) — the photon-noise detection rule that reproduces Nilsson's contrast thresholds exactly
- [*The adjustable "pinhole camera" eye of Nautilus*, Hurley (1978), J. Exp. Zool.](https://onlinelibrary.wiley.com/doi/abs/10.1002/jez.1402050106) and [Britannica, *Single-chambered eyes*](https://www.britannica.com/science/photoreception/Single-chambered-eyes) — >2° per receptor; resolution/sensitivity trade-off unique to lensless eyes

**Ediacaran background and the onset of predation (§4.1)**
- [Bengtson & Zhao (1992), *Predatorial borings in late Precambrian mineralized exoskeletons*, Science 257:367](https://www.science.org/doi/10.1126/science.257.5068.367) and [*Ecological interactions in Cloudina from the Ediacaran of Brazil*, Scientific Reports](https://www.nature.com/articles/s41598-017-05753-8) — ~550 Ma borings, >20% of specimens, prey-selective
- [*Ediacaran scavenging as a prelude to predation*](https://www.researchgate.net/publication/327947415_Ediacaran_scavenging_as_a_prelude_to_predation)
- [Bowyer et al. (2017), *Controls on the evolution of Ediacaran metazoan ecosystems: a redox perspective*, Geobiology](https://ncbi.nlm.nih.gov/pmc/articles/PMC5485040)
- [*The latest Ediacaran Wormworld fauna: setting the ecological stage for the Cambrian explosion*, GSA Today](https://www.geosociety.org/gsa-today/november-2016/the-latest-ediacaran-wormworld-fauna-setting-the-ecological-stage-for-the) — motility from ~560 Ma

**Non-visual predators (taxon 4)**
- [Vannier et al. (2007), *Early Cambrian origin of modern food webs: evidence from predator arrow worms*, Proc. R. Soc. B](https://pubmed.ncbi.nlm.nih.gov/17254986/) — chaetognaths as the oldest pelagic predators, from the lowest Cambrian
- [*A giant stem-group chaetognath*, Science Advances](https://www.science.org/doi/10.1126/sciadv.adi6678)

**Burst physiology (§3B.4)**
- [*Recovery metabolism of skipjack tuna white muscle: rapid and parallel changes in lactate and phosphocreatine after exercise*](https://www.researchgate.net/publication/239926221_Recovery_metabolism_of_skipjack_tuna_Katsuwonus_pelamis_white_muscle_Rapid_and_parallel_changes_in_lactate_and_phosphocreatine_after_exercise) — the two-pool basis
- [*Excess postexercise oxygen consumption decreases with swimming duration in a labriform fish*, J. Exp. Zool.](https://onlinelibrary.wiley.com/doi/10.1002/jez.2322) and [*Acid-base and ion balance, metabolism, and their interactions after exhaustive exercise in fish*, J. Exp. Biol.](https://dx.doi.org/10.1242/jeb.160.1.285) — EPOC 4–6 h in salmon, to 24 h for full recovery

**Fossil eyes**
- [Wang et al. (2026), *Four camera-type eyes in the earliest vertebrates from the Cambrian Period*, Nature 650:150–155](https://www.nature.com/articles/s41586-025-09966-0) — myllokunmingid lateral + pineal + parapineal camera eyes with lens and RPE, ~518 Ma
- [Paterson et al. (2011), *Acute vision in the giant Cambrian predator Anomalocaris and the origin of compound eyes*, Nature 480:237–240](https://www.nature.com/articles/nature10689) — ≥16,000 lenses, ~95 µm facets, Δφ <1.4°, eye parameter <2
- [Lee et al. (2011), *Modern optics in exceptionally preserved eyes of Early Cambrian arthropods from Australia*, Nature](https://pubmed.ncbi.nlm.nih.gov/21720369/) — *Isoxys*, >3,000 facets, bright zone
- [Clarkson et al. (2006), *The eyes of trilobites: the oldest preserved visual system*](https://www.sciencedirect.com/science/article/abs/pii/S146780390600048X) — holochroal ancestral; *Fallotaspis* slit-like visual surface
- [Schoenemann et al. (2017), *Structure and function of a compound eye, more than half a billion years old*, PNAS](https://www.pnas.org/doi/10.1073/pnas.1716824114)

**Environment**
- [Saleh et al. (2022), *The Chengjiang Biota inhabited a deltaic environment*, Nature Communications](https://www.nature.com/articles/s41467-022-29246-z) — delta front, storm floods, salinity and sedimentation stress
- [Emu Bay Shale (Wikipedia)](https://en.wikipedia.org/wiki/Emu_Bay_Shale) — age, restricted inner-shelf basin, fauna
- [*Low oxygen but dynamic marine redox conditions permitted the Cambrian Radiation*, Science Advances](https://pmc.ncbi.nlm.nih.gov/articles/PMC11759046/)
- [Sperling et al. (2013), *Oxygen, ecology, and the Cambrian radiation of animals*, PNAS](https://historical-geobiology.stanford.edu/sites/g/files/sbiybj25131/files/media/file/sperling_2013_pnas_cambrian_oxygen_and_ecology_final.pdf) — carnivory threshold
- [*A tectonically driven Ediacaran oxygenation event*, Nature Communications](https://www.nature.com/articles/s41467-019-10286-x)
- [Hearing et al. (2018), *An early Cambrian greenhouse climate*, Science Advances](https://www.science.org/doi/10.1126/sciadv.aar5690)
- [*Isotopic evidence for temperate oceans during the Cambrian Explosion*, Scientific Reports](https://www.nature.com/articles/s41598-019-42719-4)
- [Cambrian substrate revolution (Wikipedia)](https://en.wikipedia.org/wiki/Cambrian_substrate_revolution)
- [MDPI, *A New Algorithm to Estimate Diffuse Attenuation Coefficient from Secchi Disk Depth*](https://www.mdpi.com/2077-1312/8/8/558) and [Frontiers, euphotic zone compression in turbid coastal waters](https://www.frontiersin.org/journals/marine-science/articles/10.3389/fmars.2022.967627/full) — K_d ranges

**Ecology, diet, food web**
- [Bicknell et al. (2023), *Raptorial appendages of the Cambrian apex predator Anomalocaris canadensis are built for soft prey and speed*, Proc. R. Soc. B](https://pmc.ncbi.nlm.nih.gov/articles/PMC10320336/) — FEA; 0.4/0.7/0.9 m s⁻¹; soft-bodied nektonic diet; well-lit column
- [Usami (2006), *Theoretical study on the body form and swimming pattern of Anomalocaris based on hydrodynamic simulation*, J. Theor. Biol. 238:11–17](https://pubmed.ncbi.nlm.nih.gov/16002096/) — lobe swimming mechanics
- [Zhao et al., *Community structure and composition of the Cambrian Chengjiang biota*](https://www.researchgate.net/publication/225106056_Community_structure_and_composition_of_the_Cambrian_Chengjiang_biota) — 18,406 individuals, 114 species, guild percentages
- [Vannier et al., *Gut Contents as Direct Indicators for Trophic Relationships in the Cambrian Marine Ecosystem*, PLOS ONE](https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0052200) — *Ottoia* diet
- [Dunne et al. (2008), *Compilation and Network Analyses of Cambrian Food Webs*, PLOS Biology](https://journals.plos.org/plosbiology/article?id=10.1371%2Fjournal.pbio.0060102)
- [*A new bilaterally injured trilobite presents insight into attack patterns of Cambrian predators*](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9558619/) — healed, lateralised injuries
- [Butterfield (1997), *Plankton ecology and the Proterozoic–Phanerozoic transition*, Paleobiology 23:247](https://ui.adsabs.harvard.edu/abs/1997Pbio...23..247B) — origin of mesozooplankton; benthic herbivores invading the water column
- [Servais et al. (2016), *The onset of the 'Ordovician Plankton Revolution' in the late Cambrian*](http://macroecointern.dk/pdf-reprints/Servais_PPP_2016.pdf) — acritarch phytoplankton; bradoriids as microphagous suspension feeders capturing items ≤0.5 mm
- [*New suspension-feeding radiodont suggests evolution of microplanktivory in Cambrian macronekton*, Nature Communications](https://www.nature.com/articles/s41467-018-06229-7)

**Energetics and life history**
- [Brey et al., *Energy content of macrobenthic invertebrates*, JEMBE](https://www.sciencedirect.com/science/article/abs/pii/0022098188900627) and [Weil et al. (2019), *Percent ash-free dry weight as a robust method to estimate energy density across taxa*](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6912885/) — 21–23 kJ g⁻¹ AFDW; crustacean bimodality
- [Watson et al. (2013), *Low global sensitivity of metabolic rate to temperature in calcified marine invertebrates*](https://pmc.ncbi.nlm.nih.gov/articles/PMC3884134/) — mass exponent 0.69 ± 0.02
- [*Food webs in the ocean: Who eats whom and how much?*](https://www.researchgate.net/publication/278363086_Food_webs_in_the_ocean_Who_eats_whom_and_how_much) — daily ration by group
- [Caron & Vannier (2016), *Waptia and the Diversification of Brood Care in Early Arthropods*, Current Biology](https://www.cell.com/current-biology/fulltext/S0960-9822(15)01367-6) — up to 24 eggs, >2 mm, brooded under the carapace
- [Duan et al. (2014), *Reproductive strategy of the bradoriid arthropod Kunmingella douvillei*](https://www.sciencedirect.com/science/article/abs/pii/S1342937X13001111) — 50–80 eggs, 150–180 µm, on three posterior appendage pairs
- [Dai et al. (2023), *Developmental traits and life strategy of redlichiid trilobites*, Biological Reviews](https://onlinelibrary.wiley.com/doi/full/10.1111/brv.12895) and [*Recognising moulting behaviour in trilobites*](https://pmc.ncbi.nlm.nih.gov/articles/PMC5042052/) — indeterminate adult growth; **lifespan and moult counts unknown**
- [*Feeding ability and survival during starvation of marine fish larvae*, JEMBE](https://www.sciencedirect.com/science/article/abs/pii/S0022098187800308) — starvation point-of-no-return timings
- [*Ecology of intertidal microbial biofilms*](https://www.sciencedirect.com/science/article/abs/pii/S1385110114001166) — benthic biofilm production 29–314 g C m⁻² yr⁻¹

**Collective behaviour**
- [Vannier et al. (2019), *Collective behaviour in 480-million-year-old trilobite arthropods from Morocco*, Scientific Reports](https://www.nature.com/articles/s41598-019-51012-3) — *Ampyx* queues (blind, spine/chemical); *Synophalos* chains ~520 Ma
- [*Trilobite "pelotons": possible hydrodynamic drag effects between leading and following trilobites*](https://arxiv.org/pdf/1704.04553) — drafting benefit

**Contested / rejected**
- [Parker, A., *In the Blink of an Eye* / the light-switch hypothesis](https://www.researchgate.net/publication/287592368_'The_Light-Switch_Hypothesis'_and_the_Cambrian_explosion) — included for completeness; the claims are contested by specialists and are not built into this model
