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
