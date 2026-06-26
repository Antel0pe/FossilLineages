# Verification Criteria — Megadont Jaw Turning-Point Scene (2026-06-25)

## Direction (from Stage 1)
Fourth turning-point scene, same format as `app/story/bipedalism/`, `app/story/endurance-running/`,
and `app/story/hands-and-grip/`. User explicitly raised the bar on rigor: rejected brain
growth/cooking, birth/pelvis, and speech as candidates because the trait↔pressure pairing
wasn't clean/falsifiable enough. Confirmed instead:

- **Trait:** megadont molars, thick enamel, and the sagittal crest (anchoring massive chewing
  muscles) of *Paranthropus boisei* — already on record in `data/lineage.json` (id
  `paranthropus-boisei`) with `observedTraits` including "sagittal crest in males" and a named
  pressure: "Relying on abundant but tough, hard-to-chew vegetation, especially in lean
  seasons."
- **Pressure:** reliance on tough, fibrous, low-quality fallback vegetation (grasses/sedges,
  per isotope evidence) during lean/dry seasons when preferred soft fruit is unavailable —
  **NOT** hard-object nut-cracking, despite the popular "Nutcracker Man" nickname. This
  distinction is load-bearing for the echo beat (see below) and must not be blurred in beats
  3–4.
- **Baseline/ancestor for voice 1:** an earlier, smaller-toothed australopith-grade ancestor
  (afarensis-grade dentition/jaw, not specifically named as afarensis on the page) encountering
  the same seasonal food scarcity without the adaptation yet.
- **Branching/sibling angle** (Homo solving the same scarcity with tools instead of teeth,
  and *P. boisei* eventually going extinct ~1.2 Ma while Homo didn't) is real and sourced but
  is **context for the source note only** — per the locked skeleton, "exactly two voices, not
  three," so this does not become a dramatized third voice or beat.

Must follow `.claude/skills/turning-point-scene/SKILL.md` exactly (structural skeleton, POV
rules, visual template). This doc adds only the criteria specific to this scene's content.

## A. Format compliance (per SKILL.md)
- [ ] Route is `app/story/megadont-jaw/page.tsx` + `scene.module.css`, additive only. (Verify:
      `git diff --stat` shows only new files under `app/story/megadont-jaw/` plus the one
      expected edit to `app/story/page.tsx`'s `scenes` array.)
- [ ] All 6 structural beats present, in order: kicker+headline, third-person scene-setting,
      voice 1 (unadapted, witnesses an oblique cost, makes a rudimentary insufficient
      chewing/feeding attempt that pays off at least once), voice 2 (adapted *P. boisei*, after
      an explicit elapsed-time `.kicker`, population split visible live, a second independent
      instance of the scarcity pressure with fresh concrete detail, advantage shown
      incidentally not explained, no closing summary line), echo, source note.
- [ ] Exactly two first-person voices — no third "everyone has it now" stage, and no
      dramatized Homo/tool-use counter-storyline inside beats 3–4.
- [ ] Reuses existing CSS classes (`.scene`, `.back`, `.beat`, `.kicker`, `.headline`,
      `.subhead`, `.body`, `.imageBeat`, `.heroImage`, `.sourceNote`) with the template spacing
      values (56px between sections, 20px within a beat) — no new classes invented for layout.
- [ ] Hero image is `/images/human-lineage/paranthropus-boisei.jpg` (already in
      `data/lineage.json`, Smithsonian CC0), placed at the point of maximum impact for this
      scene (judgment call, not templated) — used once, not duplicated.

## B. Content grounding (falsifiable against fossil record / named sources)
- [ ] Voice 1's scarcity/struggle beat does NOT depict successful hard-object cracking (no nut,
      shell, or hard seed described as being crushed open) — the rudimentary attempt is
      chewing/processing tough fibrous plant matter the jaw isn't yet built for, consistent
      with the isotope/microwear evidence below.
- [ ] Voice 2's beat shows volume/ease of processing tough fibrous vegetation (sedges, tubers,
      grasses) as the advantage — explicitly NOT hard-shelled nuts as the headline food, per
      Ungar et al. 2008 (`ungar-2008`) finding boisei's microwear pattern is inconsistent with
      habitual hard-object feeding.
- [ ] Echo beat states the "Nutcracker Man" misnomer as the non-obvious factual twist: the
      famous nickname is wrong — dental microwear (Ungar 2008) and carbon-isotope data
      (Cerling et al. 2011, `cerling-2011`) point to a diet of grasses/sedges, not hard nuts —
      sourced, not invented.
- [ ] Source note names: the OH 5 "Zinjanthropus" skull (Mary Leakey, 1959, Olduvai Gorge),
      Ungar et al. 2008 dental microwear study, Cerling et al. 2011 isotope study, and the
      Smithsonian Human Origins synthesis (`si-paranthropus-boisei`) — matching IDs already in
      `data/human-lineage-sources.json`.
- [ ] No invented species, dates, or mechanisms — elapsed-time figure in voice 2's `.kicker`
      stays within `paranthropus-boisei`'s recorded range (olderMa 2.3 → youngerMa 1.2) relative
      to a pre-2.3 Ma ancestor baseline.

## C. POV / craft rules (per SKILL.md, re-verified per-sentence on this scene)
- [ ] No named individuals; others appear only by brief description, gone within the beat.
- [ ] Emotion (hunger, fatigue, relief) registers as bodily sensation, never a label
      ("I was hungry" / "I was relieved" = FAIL).
- [ ] No sentence explains *why* a detail matters (banned: "because," "so that," direct
      want/wish statements) — show the chewing, the ache, the volume eaten; don't state the
      evolutionary point.
- [ ] Logical-continuity pass done: no effect before cause, no "again"/"anyway" implying
      unshown history, oblique-but-physically-plausible fate for unnamed others, protagonist
      only ever acts for themself (never steers/warns "the troop").

## Verification method
Read the finished page top to bottom against this checklist; for the misnomer/isotope claims,
re-check against `ungar-2008` and `cerling-2011` entries in `data/human-lineage-sources.json`
rather than trusting memory of the abstract.

## Outcome (2026-06-25)
Verified via an independent `verify-turning-point` subagent (writer and verifier run as
separate agents, per the skill's requirement). Three passes:
1. **FAIL** — flanking double-em-dash in the source note; unearned "anyway" in voice 1
   implying unshown prior history. Both fixed.
2. **FAIL** — criterion 10 (anatomical vs. behavioral plausibility): voice 2's
   population-split beat read as a stark two-camp binary for a fixed anatomical trait
   (jaw/sagittal crest), understating how gradual real structural change is. User decision:
   soften to a spectrum without altering the locked skeleton. Fixed — voice 2 now shows a
   multi-point gradient (narrator fastest → some keeping pace → a couple lagging → one
   extreme-tail failure → "most" giving up as a separate data point).
3. **PASS** — all Tier 0 mechanical checks and all 11 Tier 1 qualitative criteria passed,
   re-graded from scratch. Source grounding re-verified directly against
   `data/human-lineage-sources.json` (`ungar-2008`, `cerling-2011`, `si-paranthropus-boisei`)
   and `data/lineage.json` (`paranthropus-boisei` dates/traits), not from memory.

**Status: PASS — scene is publishable.**
