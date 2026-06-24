# Verification Criteria — Bipedalism Turning-Point Scene Prototype (2026-06-23)

Task: Build ONE standalone "turning-point scene" — a prototype to test whether
causal/narrative storytelling (not the graph+modal) is the format that actually delights the
user. Subject: the emergence of bipedalism. Image-forward, vivid text carries the "aha"
(video is the eventual ideal but is explicitly deferred — text-only is the test for now).
This does not replace or modify the existing graph (`/`) — it is additive, at a new route.

## A. Format (locked in via direct user answers, 2026-06-23)
- [ ] New route, does not alter `/` (the existing graph) or its data/components.
- [ ] Scene is **image-forward**: one strong reconstruction image is the visual lead, not a
      thumbnail. (Verify: image occupies the dominant visual area on first view, not a small
      inset.)
- [ ] Text is **vivid and scene-setting**, written to evoke a concrete moment (an ape/hominin
      acting, choosing, fleeing, reaching) — not a textbook summary paragraph. (Verify by
      reading the copy aloud: does it read like narration of a moment, or like an
      encyclopedia entry? Encyclopedia tone = FAIL.)
- [ ] The causal "aha" is explicit and tied to **reproductive/survival advantage** (more
      surviving offspring), per the user's own framing: advantage must cash out as one of
      resource access, predator avoidance, or attractiveness — not a vague "it was better."
- [ ] Scientific honesty preserved: the dramatized moment is clearly a dramatization of a
      real, sourced hypothesis (e.g. Lovejoy provisioning hypothesis, savanna-mosaic /
      energetics hypothesis), not invented mechanism. A short factual/source note must be
      present (need not be prominent) so the dramatization isn't presented as literal proven
      history.
- [ ] No graph card, no modal — a single continuous scene a visitor reads top to bottom.

## B. Content grounding
- [ ] Tied to real fossil evidence already in `data/lineage.json` (Orrorin femur, Ardipithecus
      ramidus, Au. afarensis) rather than invented species/dates.
- [ ] At least one named real hypothesis cited (e.g. Lovejoy 1981 provisioning hypothesis,
      Rodman & McHenry 1980 energetics) backing the reproduction-advantage causal claim.

## C. Build health
- [ ] `npm run build` succeeds.
- [ ] Route renders with no console errors; image loads (not blank/broken).

## Verification log (2026-06-23)
- Built `app/story/bipedalism/page.tsx` + `scene.module.css`. Does not touch `app/page.tsx`,
  `evolution-explorer.tsx`, `explorer.module.css`, or `data/lineage.json` — A confirmed.
- `npm run build`: compiled successfully, TS clean, `/story/bipedalism` listed as a static
  route alongside `/`. F confirmed.
- Hit the route on the already-running dev server (localhost:3000, same project dir, hot
  reloaded): `GET /story/bipedalism` → 200; headline `<h1>` renders ("The forest is running
  out of trees."); hero image `/images/lineage/afarensis-model.jpg` → 200; `advantageCard`
  elements present in DOM. B/C confirmed via curl+grep (no live screenshot taken — the
  preview tool couldn't attach to the user's already-running external dev server without
  killing it, so this is DOM/HTTP verification, not a visual screenshot. Flagging this
  honestly rather than claiming a screenshot was taken).
- Content: image is `afarensis-model.jpg` (full-body Au. afarensis reconstruction, already in
  the verified image set) — dominant visual section, not a thumbnail (full-width imageBeat
  section, max 560px centered). A confirmed.
- Copy reads as narrated moments ("a few individuals stand up... just to cross the gap"),
  not encyclopedia tone — self-assessed against the FAIL bar in the criteria; final call on
  whether it actually feels vivid belongs to the user, not self-grading.
- Reproductive-advantage "aha" stated explicitly, cashed out into the three named categories
  (resource/carrying, energy efficiency, predator detection) → tied to "more surviving
  offspring." Matches user's own framing.
- Source note names two real hypotheses (Lovejoy 1981 provisioning; Rodman & McHenry 1980
  energetics) and the three real fossils or finds (Orrorin femur, Ardipithecus ramidus,
  Au. afarensis) already present in `data/lineage.json` — grounding confirmed, not invented.

**Open / not self-gradable**: whether this format is actually the thing that delights the
user (the entire point of the prototype) — that verdict is the user's, not mine. Everything
above is a floor (it's real, it's built, it's grounded) — not a claim that it has landed
emotionally.
