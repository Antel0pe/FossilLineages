  # Project Vision & Understanding

  > Living document. **Read this at the start of any task, and update it whenever you learn
  > something new about the vision or direction of this project.** Append new understanding
  > with a date; correct stale entries rather than letting them drift.

  ## Status
  **2026-06-22 — first rebuild shipped** (see `verification-criteria/2026-06-22-lineage-rebuild.md`).
  The graph is now a branching, figure-dominant, body-size-scaled view of 20 forms (incl. gorilla
  & chimp living anchors and interesting siblings), with a change-focused modal. Images are
  best-available real images, downloaded locally; AI-standardisation of the figure set is the
  agreed next phase. **Image priority order = full-body-with-face > full-body > face > fossil**
  (fossils only as a true last resort). 18/20 are now reconstructions/photos; the good
  reconstructions for deep forms come from Smithsonian Human Origins (Gurche, educational use)
  since Wikimedia lacks CC ones. Only Nakalipithecus (jaw-only) and Denisovans (DNA/fragments)
  remain fossils — genuine exceptions where no non-fossil image exists. "Roughly the same area"
  (e.g. a Proconsul restoration for Ekembo) is acceptable. Data lives in `data/lineage.json` (schema v2); UI in
  `app/evolution-explorer.tsx` + `app/explorer.module.css`. Old `data/human-lineage.json` is now
  unused.

## North star
  Illustrate the **evolutionary history of humans (and the surrounding lineages)** in an
  interesting, scientifically grounded way. The site exists to answer three questions for a
  visitor, in order of emphasis:

  1. **That change happened** — make the fact of evolutionary change unmistakable.
  2. **What changed** — show the actual changes between forms (anatomy, behavior, ecology).
  3. **Why it (may have) changed** — explain a defensible portion of the evolutionary
    pressures behind each change. Best-guess but reasonably scientifically backed; we do
    not have perfect knowledge and should not pretend to.

  **The primary subject is the CHANGE itself — where and how lineages changed — not just a
  catalog of species.** "How did this form differ from its predecessor, and why?" should be
  the easiest thing to perceive on the site.

  ## Known direction & constraints (2026-06-22)
  - The current version feels **too sparse and too linear** — it reads like a ladder of
    direct ancestors rather than a branching bush.
  - We are **missing sister lineages** (e.g. gorillas, chimps, monkeys) that would give
    context and show branching rather than linear progression.
  - Current reconstruction images are **not lifelike enough**.
  - The user wants **more depth**: richer species coverage AND richer treatment of change.
  - We are effectively **restarting** the content/approach to get this depth.
  - Scientific honesty about uncertainty (candidate vs supported relationships, fossils ≠
    proven direct ancestors) is a core value and must be preserved.

  ## Decisions locked in (2026-06-22)
  - **#1 gap to fix: the changes aren't visible.** The deltas between forms are buried in
    modal prose. Making change perceptible is the top priority — not adding more species for
    their own sake.
  - **Scope: human-centric with context branches.** Keep humans as the spine; add sister
    lineages (gorilla, chimp, monkey) as outgroups/context so the path reads as branching,
    not linear. Not telling fully parallel equal stories.
  - **Two-level model for kinds of change:**
    - **Broad graph view → PHYSICAL change, shown emotionally.** Faces (ideally full frontal
      body views) so a visitor feels these were real animals and can see the morphological
      progression. Full-body reconstructions are aspirational but limited by fossils.
    - **Modal → behavioral/ecological change + evolutionary pressures (the "why")** for both
      physical and ecological change. Behavioral change is the more interesting story but is
      hard to convey in a thumbnail, so it lives in the modal.
  - **Core tension flagged by user:** lifelike/emotional reconstructions vs. scientific
    grounding. Which reconstruction do we trust? More scientifically grounded is ideal;
    reconstruction is hard and sometimes impossible from the fossils we have.

  ## Decisions locked in (2026-06-22, round 2)
  - **Show change via consistent full-BODY reconstructions, not just faces.** The visitor
    perceives the morph from the sequence; standardized posing is what makes them comparable:
    - **Bipedal forms → frontal, full-body, face-first.**
    - **Quadrupedal forms → side view of the body with the face turned toward the camera.**
    - (Idea parked: placing quadrupeds in an arboreal/tree environment for accuracy/context.)
  - **Reconstruction philosophy (this is NOT a serious scientific project):** accuracy means
    "not lying or ignoring the best evidence." Process: review the best evidence from the
    most credible papers → find the best-matching image, or **generate one with AI that aligns
    with the evidence** → present it as the best reconstruction current science supports.
    - No accuracy grading / confidence visual for now. A small red/yellow/green confidence
      dot may be added later — explicitly deferred.
  - **Outgroups = living anchors at divergence points.** Gorilla/chimp/monkey appear with a
    face at the point they split off, to prove branching and give a "compared to us"
    reference. They are context, not deeply explorable (no full modal for them for now).

  ## Decisions locked in (2026-06-22, round 3)
  - **Density: moderate (~18–24 forms)** on the human spine — enough intermediates that the
    morphological progression reads as gradual/continuous, not big leaps.
  - **Images: start with best-available REAL images** during this experimentation phase. Once
    the direction is confident, switch to AI-generated images to standardize pose/style and
    make figures directly comparable. (Standardization is a later step, not now.)
  - **Layout: evolve the current layout** — keep the horizontal time-scroll, but use taller
    full-body figure cards and add branch rows for the outgroup anchors. Lower-risk iteration,
    not a from-scratch rebuild.

  ## Decisions locked in (2026-06-22, round 4)
  - **Selection gate = "interesting evolutionary change," accuracy second.** We are showing
    interesting evolutionary CHANGE, not precise cladistic accuracy. Prioritize the **big step
    changes** plus **surprising sibling connections** (the "oh shit, gorillas/chimps and us came
    from the same branch" reaction). Secondary gate: amount of evidence (prefer the
    better-known of two similar forms).
  - **Story start = best-known common ancestor of modern apes and humans**, then stepwise
    changes through the important forms between there and us, plus a few sibling species.
  - **Count is not hard-capped at 18–24** — the user expects that may be too small once the
    human line + interesting siblings are included. Use as many as the "big changes" warrant.
  - **Outgroup anchors: Chimpanzee + Gorilla** (closest living relatives). Not adding
    orangutan/gibbon/Old-World-monkey for now.
  - **Grounding: web-research each form** for dates, traits, and pressures; cite sources.
  - **List sign-off: curate-and-review** — build immediately, user judges the final site.
  - **Graph card is figure-dominant: figure + age only, no delta labels.** The full-body
    figure is the main focus; all "what changed" naming lives in the modal.

  ## Decisions locked in (2026-06-22, round 5)
  - **Figure sizing: highly prefer scaling to REAL body size** across the sequence (size growth
    is itself a headline change). Fallback if impractical with real images: consistent frame,
    or a small side cue (height number / silhouette-vs-human).
  - **Image sourcing descent order** (something is always found — user is confident every form
    has at least a usable image): academic/published life reconstruction → Google-findable
    reconstruction image → best available face/color reconstruction → most complete fossil
    image. Prefer reconstructions over bare fossils.
  - **Modal contains:** (1) behavioral/ecological change, (2) evolutionary "why" as explicit
    **change → pressure pairs**, (3) a **map of where** key fossils were found. The standalone
    "fossil specimens" tab is dropped (fossil locations still feed the map).
  - **"Why" format: linked change → pressure pairs** (e.g. "smaller gut ← higher-quality
    cooked/meat diet"), tied to specific traits.

  ## Major direction signal (2026-06-23) — read before next rebuild
User did a gut-check rating exercise on the current graph+modal build. Verdict: directionally
correct but not the real target. Ratings of what actually delights him, when asked "what do
you want to feel":
- Physical change (size/teeth/stance) made visible: **5/10** — cool but secondary; he
  explicitly said this is a UI/UX detail he doesn't want us optimizing for right now.
- Geographic spread (Africa → world): **3/10**.
- "We're animals too" / kinship-with-apes gut-punch: **0/10** — does not resonate at all.
- Deep-time vertigo / scale-of-time awe: **2/10** — incidental, not a focus.
- **Detective story of WHY change happened (causal pressure → trait): 6.5/10 standalone**,
  and identified as the core of the thing he actually wants (see below).

**What he actually wants, in his words: "I want a story... blurring the lines between
software website, YouTube video, and Wikipedia article. The story of how we came to be...
probably the biggest thing would be the factors that caused us to change."** Rated this
framing **9/10** — by far the highest signal in the conversation.

**The clue anecdotes (his explicit instruction: these are the best clues to deeper
curiosity, weight them heavily)**:
1. **Battle of Marathon** — a history professor's telling of how Athens (a "nothing city")
   beat Persia (the biggest empire), and how that victory got mythologized into Athenian
   identity for generations afterward — the moment a place became "worth talking about."
2. **Peopling of the Americas / Beringia** — fascination with the mystery of *when* humans
   reached the Americas (15,000–60,000 years ago, contested), via boats along the coast or
   through the ice-free corridor. He specifically described **vividly imagining a young
   First Nations adult standing in Beringia, looking up at the stars, not knowing he was
   about to become part of a new continent's human story** — wondering if that person had
   the same kinds of thoughts (family, friends, games, hunting, a partner, kids, what
   happens after death) that we do now.
3. **Origins of religion/mythology** — curiosity about the first gods and first languages,
   and how they evolved into today's Christianity, Islam, Hinduism, Sikhism, Judaism — and
   whether **echoes of those origins are still visible today**.

**Common thread across all three**: a *specific person, at a specific causal turning point*,
rendered vividly enough to imagine their interior life — paired with an explicit causal
thread running from that moment to something that still exists/matters now. Scale of time
and physical/visual transformation are NOT the hook; **causal narrative + human-scale
imagined interiority + "this echoes into today"** is the hook.

**Implication for this project**: hominin/lineage evolution may be too narrow a frame for
what he's actually chasing. The underlying curiosity looks like "the story of how we — as a
species and as cultures — became what we are, told through specific turning points and the
forces (survival pressure, social dynamics, chance) that drove each one, with a thread
forward to the present." Human physical evolution (the current site's literal subject) might
be one chapter of that bigger story, not the whole story. **This needs to be confirmed with
the user before any rebuild** — do not assume the scope has expanded to all of human
history/culture without him explicitly signing off; it's a hypothesis to test with him next,
not a decision yet.

**Content gap as currently rated**: directionally right but thin on causal "why" depth, and
the visual presentation (images hard to compare, inconsistent full-body coverage) undercuts
even the secondary physical-change goal. Both content (more "why") and presentation need
work, per his own assessment — but "why" is the priority, not images.

## Scope decision (2026-06-23) — pilot stays narrow, on purpose
User confirmed: the project stays scoped to **physical human/lineage evolution** for now —
not because the bigger "story of how we became what we are" idea is wrong, but because he
wants to test, in the narrowest possible slice, whether **turning-point/causal storytelling**
is really the thing that delights him before expanding scope. Migration (Beringia), cultural
turning points (Marathon-style), and religious/mythological origins are **noted as valid
future directions, explicitly deferred** — do not build them now, but don't lose them either.

**Format locked in: one vivid scene per turning point, sequenced** (not a continuous
scroll-narrative, not the current graph-of-cards). This replaces the figure-dominant-graph +
modal paradigm from the 2026-06-22 rebuild as the primary interaction model. The graph/modal
work isn't necessarily thrown away (the data/sourcing backbone may still be reusable) but the
**presentation layer is being re-architected around scenes**, pending format-detail
questions (asked next, not yet answered as of this entry).

## How to judge this site (distilled success criteria)
  A version is better than the last when:
  1. **Change is the first thing you see.** Stepping along the graph, the physical
    transformation (posture, body plan, proportions, head/brain) is immediately perceptible
    from the full-body figures — without opening anything.
  2. **It reads as branching, not a ladder.** Outgroup anchors (gorilla/chimp/monkey) make
    the human path visibly one branch among several.
  3. **Figures are comparable.** Consistent posing/framing (frontal full-body for bipeds,
    side-with-face for quadrupeds) lets you visually diff adjacent forms.
  4. **Depth on demand.** The modal delivers the behavioral/ecological change and the
    evolutionary "why," tied to the physical change — without cluttering the graph.
  5. **Honest, not hedged to death.** Best evidence → best image → presented plainly as the
    best current reconstruction. Uncertainty about relationships is preserved (candidate vs
    supported), but we don't drown the emotion in disclaimers.
  6. **Enough depth to feel rich, not sparse.** ~18–24 human-spine forms plus anchors; each
    step feels earned, the record feels populated.

## Graph divergence labels (2026-06-27) — small, deliberate re-investment in the graph
User floated a "canvas-based evolutionary change thing" idea: instead of (or alongside)
lineage, show *why* two sibling species differ. Talked through it — landed on something
narrower than it first sounded:
- The graph stays the structural backbone, unchanged; this is an **addition**, not a redesign.
- At a handful of pilot split points (where a taxon has 2+ children), add an always-visible,
  short contrastive label naming the diverging strategies (e.g. "Fruit-foraging vs. leaf/stem
  fallback diet") — a tag, not prose.
- Explicitly checked against the 2026-06-23 pivot (scenes are the primary "why" vehicle now):
  user confirmed this is "still the graph, deliberately" — a lightweight overview/index layer,
  not a reversal of the scenes decision. Today's per-taxon `pressures` data is one-sided and
  doesn't supply this contrast on its own; new comparative content has to be written per fork.
- See `verification-criteria/2026-06-27-graph-divergence-labels.md` for the pilot fork list
  and falsifiable criteria.

## Branch-point comparison panel (2026-07-04) — the always-visible tag didn't survive contact
User re-read the existing modals unprompted and specifically lit up on content that was
already there and already branching (afarensis → 3–4 strategies, Middle Pleistocene Homo →
3 strategies) — confirming the graph/modal backbone genuinely works and the earlier "scenes
are the primary format" pivot (2026-06-23) doesn't mean this content is unloved, just under-
surfaced. Two corrections to the 2026-06-27 entry above:
- **The always-visible floating tag was the wrong shape.** User: it "doesn't add anything
  nicely." Replaced with a click-to-open side panel (a small marker button at the branch
  point, plus a chronological nav strip so you don't have to hunt the graph for it) —
  interaction-gated depth, not ambient text clutter. Lesson for future graph additions: don't
  default to an always-visible label for comparative/interpretive content; gate it behind a
  click the same way the species modal already does.
- **A contrast needs its baseline stated, not just the two endpoints.** User's own framing:
  "the base might be like tree swinging mainly fruit eater or some simple background... this
  should be relative to the change described." The panel always states the ancestor's own
  baseline lifestyle first, then each descendant's bullet is written to name what it's being
  contrasted against (the ancestor, or a specific sibling) — never a free-floating trait.
- **Uncertainty about "is this really a divergence" has to be its own explicit line**, separate
  from uncertainty about the underlying anatomy. User was explicit that they weren't sure
  contrasting traits were "explicitly different to ancestor and sibling species" vs. just
  presented as if they were — each panel now ends with a dedicated confidence line about the
  *comparison framing itself* (e.g. whether the siblings really share that exact ancestor),
  distinct from the existing per-species "how sure are we" in the modal.
- New species get added specifically to deepen existing/plausible branch points (not to pad
  the timeline) — e.g. Paranthropus robustus/Australopithecus sediba added as a second,
  independent africanus-descended fork that echoes the afarensis-descended fork one region
  over. See `verification-criteria/2026-07-04-lineage-branching-and-comparison-panel.md`.

## Evolution points (2026-07-06) — the branch-point pattern extended to non-branching change
User confirmed the "branch points" interaction (nav pill → panel with baseline → what changed
→ confidence) isn't specific to forks — plenty of real change happens on a straight,
single-parent→single-child edge too (their example: Ardipithecus ramidus → Australopithecus
anamensis), and they want the same depth-on-demand treatment for those. Added a second nav row,
"Evolution points," directly under "Branch points," covering the (exhaustive, derived from the
data, not curated) 4 edges where the ancestor has exactly one child: Ekembo→Nakalipithecus,
A. kadabba→ramidus, ramidus→anamensis, H. habilis→erectus. Both rows position their pills by
the taxon's real graph `col` (same mapping the era labels use) with a deterministic
collision-avoidance pass, so an evolution-point pill never renders directly under a branch-point
pill, and the combined two-row strip scrolls horizontally as one unit. See
`verification-criteria/2026-07-06-evolution-points-second-row.md`.
**Implication for future content additions**: this "no known branch ≠ no story" distinction is
now a standing pattern — when adding a new taxon to the human spine, check whether the edge
into it branches (→ branch-point panel candidate) or doesn't (→ evolution-point panel
candidate); either way there's a baseline/change/confidence panel worth writing, not just a
species card.

## Correction (2026-07-07) — the "stories are a 9/10" reading from 2026-06-23 is now in doubt
User pushed back, unprompted, on the 2026-06-23 rating exercise: they're no longer sure the
turning-point scenes (`app/story/*`) actually rated 9/10 because that format is the real hook,
versus the rating being inflated simply because they were excited *while building* those scenes
at the time. **Treat that rating as unconfirmed, not settled** — do not use it to justify further
investment in the scene format (e.g. cross-linking scenes into the graph) without re-checking
with the user first. The three-part framing itself (what forced a change / what changed / what
result it had) still stands as his stated core interest; it's specifically the *scene format's*
claim to being the best vehicle for that which is now in question.

**Real bottleneck identified this session**: when asked what to work on next, the user said the
actual constraint isn't a missing feature/format — it's that the existing branch/evolution-point
panels (`data/lineage.json`'s `evolutionPoints` + divergence clusters) are limited by how much
*specific, hard* causal/change evidence has been mined for each transition. His words: "if I had
more info about what caused them to evolve and more specific changes... I would [add it] in a
heartbeat, but it seems that is the bottleneck." **Implication**: the highest-leverage work going
forward is a research/sourcing pass — mining real papers for hard, surprising, per-taxon evidence
(isotopes, microwear, trackways, biomechanics, dated tool/cut-mark finds, paleoclimate proxies)
not yet reflected in the existing bullets — rather than new UI/features on top of the current
content. This is content-bottlenecked, not format-bottlenecked. Two verified examples found and
proposed to the user this session (not yet built in): (1) Paranthropus boisei vs. robustus isotope
divergence — despite near-identical "nutcracker" jaws, boisei's enamel carbon isotopes show a much
higher C4/sedge diet than robustus (Cerling/Sponheimer et al., PNAS), directly complicating the
existing boisei bullet's "bigger jaw as fallback insurance" framing; (2) Skinner et al. 2015
(Science) trabecular bone evidence that Australopithecus africanus's hand already shows human-like
forceful-grip bone loading, predating that species' known tool industry — complicates the existing
habilis-as-first-toolmaker framing. Both are exactly the "genuinely new life-fact" the causal-depth-
ceiling test (see memory) says adds value, as opposed to more narrative depth on an existing claim.

## Correction round 2 (2026-07-07) — the "connected chain" prototype failed, and why
Tested a prototype: string 4-5 existing evolution/branch-point taxa into one chronological
sequence, each step's baseline→change bullet reused verbatim, ending in a stated outcome
(persisted vs. went extinct). User's verdict: **rejected**. Two specific problems:
1. **It read as narration, not explanation**: "it kinda just stated a species did this then b
   species did that. but no causal effect maybe isn't there." Reusing true, sourced content and
   merely sequencing it chronologically does not produce the causal "why" feeling — there was no
   genuine reasoning connecting adjacent steps, just facts in order.
2. **Sapiens-outcome bias**: the prototype implied "persisted → became us" as the good outcome
   and "went extinct" as the bad one. User pushed back directly — humans are far from the only
   successful branch (chimps, gorillas also persisted; most *other* hominin lineages didn't).
   Any "how did this turn out" framing must be about persistence/extinction generally, never a
   this-led-to-humanity teleology.

**What actually worked, tried live on `ardipithecus-ramidus` → `australopithecus-anamensis`**:
not narrating what each did in turn, but asking why they differed — "was there a ramidus
descendant that stayed in the trees... maybe forests were patchy for ramidus and then anamensis
they had fully disappeared?" That guess turned out close to already-true and already sitting in
each taxon's own `pressures` field in `data/lineage.json` (ramidus: denser/patchy woodland
rewarding both ground+tree life; anamensis: habitat opened further into grassland mosaic) — just
never surfaced as an explicit **comparison** between the two. Comparative reasoning between two
related taxa that faced different conditions, not chronological narration, is what produces the
causal "why" feeling.

**Distilled framework**: **What** (observed trait-level change, incl. anatomy) → **Why**
(evolutionary pressure — the priority, and where more *comparative* depth is wanted) → **How**
(genetic/anatomical mechanism — secondary). On depth: a more specific/mechanistic true cause beats
a shallow one (e.g. climate-driven forest fragmentation vs. bare "could see predators better") —
but only if true; a fabricated exciting story is explicitly worse than a plain true one to this
user. Checked the existing `bipedalism` scene against this: it already opens on climate-driven
canopy fragmentation (line ~21, "the climate has been drying") *and* uses predator-visibility as a
secondary beat (line ~99) — so the deeper cause the user was reaching for is already present in
that scene's setup, just not the most foregrounded line.

**Implication for future content work**: before adding a chain/sequence view, or any new causal
content, the higher-leverage move is auditing existing edges (branch points, evolution points,
scenes) for cases where two related taxa's own `pressures`/`behavioralChange` text already
contains an implicit comparison that isn't yet surfaced explicitly side-by-side. This is likely
cheaper than new research (as the ramidus/anamensis case showed) and directly targets the
comparative-causation hook rather than narrative sequencing.

## Correction round 3 (2026-07-08) — round 2's flaw was causal oversimplification, not chain length
User corrected a misreading of round 2 above: an assistant restated round 2's "read as narration,
not explanation" problem as being about *longer taxa sequences* (more species strung together).
User's direct correction: that's wrong — the actual flagged problem is **compressing a causal
chain with far too much simplicity, e.g. "this species, millions of years ago, was directly
causally responsible for this specific [downstream] thing."** That mono-causal, single-link
compression is the failure mode, independent of how many taxa are in view — a two-taxon comparison
can commit it just as easily as a five-taxon chain, and a longer sequence isn't automatically
guilty of it either. Re-reading round 2's own worked examples through this corrected lens, the
already-good, already-shipped content resists this exact oversimplification: the boisei/robustus
isotope divergence (near-identical jaws, very different diets — Cerling/Sponheimer, see
`verification-criteria/2026-07-07-evidence-mining-pass-evolution-points.md`) and the ramidus
habitat dispute (Cerling vs. White's competing reads of the same soils) both refuse to collapse
into "trait X → caused by pressure Y, done." **Standing rule going forward**: when writing any
change→pressure claim, actively check whether it's being flattened into a single clean
mono-causal line where the real evidence is messier/plural/contested — and if the evidence really
does support one dominant cause, still carry the honesty/certainty framing the branch-point panels
already require rather than stating it as flat unqualified fact.

## 2026-07-20 — Simulation direction: measure selection before adding mechanisms

For the eye sandbox, the user wants every added system to earn its place. Food, movement costs,
stamina, hiding, and a staged morphology-to-behaviour mapping are not presumed justified merely
because they could increase eye selection. The immediate direction is diagnostic: visualize each
individual's birth optical resolution against lifespan and reproductive/hunting outcome, so the
simulation can show whether earlier detection is actually associated with differential survival.

## 2026-07-22 — Eye sim rebuilt on physics; the environment is the deliverable

User's brief: move the eye sim toward *real* evolution from light-sensitive patch to real eye,
with **simple, truthful equations**, and explicitly **"the majority of effort should go to
engineering the environment such that the eye gets selected for"** — not to engineering functions
that make selection obvious. They also flagged, correctly, that mapping acuity straight onto a
"detection range" is probably not true to nature.

**What replaced it.** Detection is now physics, not a slider:
- `Δρ = min(π, √((2·atan(A/2f)·(1−lens))² + (λ/A)²))` — the old `A/f` was a small-angle
  approximation used at ~7 rad, so 100% of agents in earlier runs had physically impossible
  eyes (Δρ of 312°–499°). `2·atan(A/2f)` is a real angle and saturates at π.
- `S = (θ/Δρ)²·exp(−d/atten)`, `p = S/(1+S)` where `θ = targetDiameter/d`. There is no sight
  range. Detection is graded, so every reduction in Δρ pays at every distance — no threshold,
  no flat valley. p = ½ exactly when θ = Δρ.
- A visually resolved bearing carries error ±Δρ. Contact senses do not. This is Nilsson I→II
  falling out of the optics instead of being coded as a stage.

**Environmental facts that had to be added for any of it to matter** (each is a real feature of
the world, none references the eye):
- Resources are **patchy** and regrow. A 3px particle is invisible until you touch it; a 190px
  drift of them is a big target a crude eye can steer toward. Two scales of the same act of seeing.
- **Visual size ≠ reach**: a predator is big (visible far) but catches only at mouth range.
- **Short-range non-visual senses** (`preyTouch`/`predTouch`). Chemo- and mechanoreception are why
  a blind animal can make a living at all; they never improve with Δρ, so everything the eye is
  worth is the distance beyond them. Without this, blind worlds are uninhabitable and the
  experiment is rigged.
- **Water clarity** (`atten`, Beer–Lambert) is an environmental knob, not an eye property — the
  sweepable Cambrian variable.

**Method rule established.** Whether an eye improved in one run confounds selection with whether
mutation could reach the better morph. The honest instrument is an **invasion test**: seed two
fixed genomes one step apart, mutation OFF, measure the shift in birth share. That is the
selection coefficient at that point on the axis; sweeping it maps the gradient the environment
actually provides. `evolutionary-sim/gradient.mjs`. Balance searches (`balance.mjs`) score only
persistence and generation turnover, never eye quality, so they cannot bias what they set up.

## 2026-07-23 — Result: the eye climbs all four Nilsson classes; behaviour rules are the weak point

Under the physics rebuild above, a prey lineage starting as a flat patch (Δρ 162.6°) evolved
monotonically to Δρ 1.78° — Nilsson class I → II (gen 20) → III (gen 36) → IV (gen 80) — with no
rule anywhere rewarding acuity. Evolved morphology: deep stopped-down lensed pit (A 0.104,
f 3.596, L 0.379). See `verification-criteria/2026-07-22-eye-physics-and-environment.md`.

**Two findings that matter more than the headline:**

1. **The climb is mutation-step-limited, not gradient-limited.** At σ=0.03 the eye does not move
   (164°→165°); at σ=0.25 it crosses all four classes. Monotone in σ. This is the expected shape
   given Nilsson & Pelger's ~364,000 generations at 1%-per-step — that many generations is not
   simulable, so step size is the honest computational dial. It does not bias direction (mutation
   is symmetric in log space), only traversal speed.

2. **Behaviour rules dominate the selection gradient — more than the optics do.** Measuring the
   same world with three defensible behaviour rules (flee-or-forage / blended avoidance / blended
   + bounded turn rate) FLIPS the sign of selection at individual points on the eye axis. E.g. the
   86°→58° rung reads 0.574, 0.716, then 0.085. This is hidden authorship: hand-written behaviour
   is doing most of the work that "the environment" is being credited with. **Next step is to
   evolve the behaviour weights rather than author them**, so an animal is never forced to act on
   information it cannot actually use.

**Open**: predators never climbed (155–169°) — they get 7–16 generations to the prey's 83–161 and
sit pinned at their population cap, so predator evolution is generation-starved, not
gradient-starved. The prey climb is therefore foraging-driven, not an arms race. The prey
population also collapses at the sharp end (421→6), so the class IV endpoint is not a stable
equilibrium. The glut-food falsifier config exists but has not been run.

## 2026-07-23 — The two-sided arms race is in genuine tension with coexistence (negative result)

User observed predators were visually everywhere and evolving no eyes, and asked whether lowering
the cap (e.g. to 200) would help, then "try what you think." Findings, all measured:

- **Predator cap is NOT the lever.** Cap 200 alone: predGen stays 7, predΔρ ~154° (blind),
  predStarved 0. Lowering the cap just pins fewer predators; they still don't die, so no turnover.
- **The real bottleneck is predator generation TIME**: ~7000 ticks/gen vs prey ~675. Predators are
  long-lived and slow-breeding (must accumulate several catches). Selection needs generations;
  predators barely get any.
- **Making predators turn over fast enough to evolve eyes drives the prey extinct.** A turnover-only
  search (scored on generations/mortality, never eye quality) found that EVERY config where the
  predator eye climbed to class III/IV collapsed the prey to extinction; the only long-run-stable
  configs were ones where predators stayed blind (Δρ 126–164°). This is the **paradox of
  enrichment**: a predator efficient enough to evolve good eyes overexploits its prey. In collapse
  runs the prey had ALSO evolved sharp eyes (Δρ 1–2°) and still went extinct — not a tuning miss.
- **Predator satiation** (a full predator rests; `predSatiated`, gated on hunger not vision) was
  added as a real stabiliser. It did not resolve the collapse: the system stays **bistable**
  (predators evolve eyes then crash prey, OR stay blind and coexist). Left in as a documented knob,
  **default 10 = no-op** so the verified baseline is unchanged.

**Interpretation & next step (not yet done):** the fix that is both standard AND thematically
perfect for this project is a **prey refuge** — the Cambrian "agronomic revolution", i.e. burrowing:
prey that can escape where vision doesn't work. That decouples predator efficiency from total prey
annihilation and is exactly the real anti-vision defence. Awaiting user steer on whether to pursue
the refuge (research-y, no guarantee) or accept the stable, watchable foraging-driven PREY climb as
the deliverable, with predators as a non-evolving environmental pressure.
