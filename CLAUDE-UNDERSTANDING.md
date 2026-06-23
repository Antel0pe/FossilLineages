# Project Vision & Understanding

> Living document. **Read this at the start of any task, and update it whenever you learn
> something new about the vision or direction of this project.** Append new understanding
> with a date; correct stale entries rather than letting them drift.

## Status
**2026-06-22 — first rebuild shipped** (see `verification-criteria/2026-06-22-lineage-rebuild.md`).
The graph is now a branching, figure-dominant, body-size-scaled view of 20 forms (incl. gorilla
& chimp living anchors and interesting siblings), with a change-focused modal. Images are
best-available real images, downloaded locally; AI-standardisation of the figure set is the
agreed next phase. Data lives in `data/lineage.json` (schema v2); UI in
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
