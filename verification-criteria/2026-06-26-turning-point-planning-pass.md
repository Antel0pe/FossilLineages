# Verification Criteria — Turning-Point Skill Planning Step + Megadont-Jaw Re-write (2026-06-26)

## Direction (from Stage 1)
Megadont-jaw already passed full structural/content/POV verification
(`2026-06-25-megadont-jaw-scene.md`) but the user judges it "decent but not fantastic" — not
because of structure, stakes, or missing lineage-split drama (all explicitly ruled out this
session), but because **the sentence-level writing/word choice isn't good enough yet**.

The user's diagnosis of *why*: the `turning-point-scene` skill jumps straight from the locked
structural skeleton to prose, with no step where the writer deliberately chooses the right
tone and the strongest available concrete material for THIS specific turning point before
drafting. Without that planning step, prose ends up generically competent rather than
sharply fitted — a weak base that word-choice polish can't fully rescue.

Decided approach (no external literary reference point — iterate blind via direct reaction):
1. Add an explicit **planning step** to `.claude/skills/turning-point-scene/SKILL.md`,
   positioned before the writing skeleton, that forces concrete, scene-specific choices
   (not generic restatements of the skeleton) before any prose is drafted.
2. Apply that new planning step retroactively to megadont-jaw, then do a full prose rewrite
   (word choice / sentence craft only — skeleton, beats, sourcing, and stakes are unchanged
   and explicitly NOT in scope for this pass).
3. Get the user's direct reaction to the rewrite and extract concrete rules from it back into
   the skill file.

## A. Planning step added to the skill
- [ ] `.claude/skills/turning-point-scene/SKILL.md` has a new section preceding the
      structural skeleton that requires, for any new scene, explicit written answers to (at
      minimum): what register/tone fits this specific trait and pressure (e.g. grim
      attrition vs. quiet endurance vs. sudden danger — named, not left implicit); the single
      strongest concrete sensory anchor available for voice 1's struggle; the single
      strongest concrete sensory anchor available for voice 2's advantage; which real fact
      is the echo. (Check: read the section — FAIL if any prompt could be answered with a
      generic restatement of the skeleton rather than a scene-specific choice.)
- [ ] The section makes clear this plan must be produced and is checkable *before* prose
      drafting starts, not inferred after the fact from finished prose.

## B. Megadont-jaw re-plan + rewrite
- [ ] A concrete plan for megadont-jaw exists (in the response, not necessarily committed to
      a file) covering the four prompts in A, specific to megadont-jaw's actual trait/pressure
      (tough fibrous fallback vegetation, dry-season scarcity) — not generic.
- [ ] Full rewritten prose for `app/story/megadont-jaw/page.tsx`, all 6 beats, produced from
      that plan. Same skeleton, same sourced claims, same stakes/structure as the
      already-passed version (`git diff` should show prose changes only — no new/changed
      claims, no structural reordering, no new images).
- [ ] Re-run the existing format/content/POV checklist from
      `2026-06-25-megadont-jaw-scene.md` against the rewrite — FAIL this pass if any
      previously-passing item regresses.

## C. User reaction + rule extraction
- [ ] User has given a direct, specific reaction to the rewrite (beat-by-beat or whole-scene)
      — captured verbatim in this doc's Outcome section, not paraphrased into a vague verdict.
- [ ] At least 2 concrete, nameable word-choice/craft rules are extracted from that reaction
      and appended to `.claude/skills/turning-point-scene/SKILL.md`'s craft-rules section.
      (Check: each rule must name a specific phrasing pattern to do or avoid, with the
      rejected/accepted example pair, matching the existing style of that section's other
      rules — "write better" or "more vivid" does not count as a rule.)

## Verification method
Read the rewritten `page.tsx` against the re-run checklist from the 2026-06-25 doc; read the
new SKILL.md planning section and confirm it asks for scene-specific (not generic) answers;
confirm the Outcome section below contains the user's actual words, not a summary, and that
each extracted rule has a before/after example pair.

## Outcome

### A. Planning step
Added to `.claude/skills/turning-point-scene/SKILL.md` ahead of the structural skeleton:
four forced, scene-specific questions (register/tone named, strongest sensory anchor for
voice 1, strongest sensory anchor for voice 2 distinct from voice 1's, the echo fact) —
generic/copy-pasteable answers explicitly fail.

### B. Megadont-jaw re-plan + full rewrite
Ran the planning step fresh (ignoring the prior draft per user instruction): tone = grim
attrition (outlast, not outrun); voice 1 anchor = fiber resisting the jaw past the point the
cheek muscle "stops answering"; voice 2 anchor = the same fiber instead collapsing in "a few
quick pulls"; echo = the Nutcracker Man misnomer (unchanged choice, judged strongest
available fact). All 6 beats rewritten end-to-end; skeleton, sourced claims, image, and CSS
unchanged (confirmed via `git diff` — prose-only).

### C. Independent verification (separate cold subagent, per verify-turning-point's
no-self-grading rule — corrected after the user flagged that the first round of this task
skipped this step entirely)
First pass: **FAIL**.
- Tier 0: skeleton-compliance hit — echo beat (naming-history/misnomer correction) read as
  not satisfying "downstream **biological** consequence."
- Tier 1 #4 (forced fact-squeezing): borderline FAIL — closing line "got its nickname
  backward" stated the punchline instead of letting facts imply it.
- Tier 1 #10 (anatomical vs. behavioral plausibility): FAIL — jaw/molar size is a fixed
  anatomical trait; verifier read the voice 1→voice 2 gradient as too clean a within-scene
  split.
- All other Tier 0/Tier 1 checks: PASS, each with a quoted example (full ledger in transcript).

User resolution on the two re-litigated items:
- **Echo-beat content rule**: keep the Nutcracker Man misnomer — "it's the strongest fact we
  have." Resolved by loosening the skill's echo-beat wording to explicitly allow a
  non-obvious historical/epistemic twist as well as a biological consequence (see SKILL.md
  edit above), rather than rewriting the scene to chase a stricter reading.
- **Anatomical-binary criticism**: "already decided, don't re-open" — the gradient fix from
  the 2026-06-25 pass stands; this verifier being stricter doesn't override a call already
  made deliberately.

Fixed the one unambiguous finding: cut the closing punchline-naming sentence from the echo
beat ("One of the most recognizable skulls in human evolution got its nickname backward.")
so the beat ends on the stated facts themselves. Confirmed via the live dev server
(`localhost:3000/story/megadont-jaw`) that the page renders the corrected text with no
layout regression.

**Status: addressed per user judgment — echo-beat and anatomical-binary findings
intentionally not re-opened; punchline-naming line removed; skill files updated to reflect
both the new planning step and the loosened echo-beat rule.**

### D. Word-choice reaction (pending)
User has not yet given a direct reaction to the rewritten prose itself — criterion C of this
doc (≥2 concrete word-choice rules banked from that reaction) is still open.
