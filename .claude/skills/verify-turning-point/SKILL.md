---
name: verify-turning-point
description: Adversarially critique a completed turning-point scene (app/story/<slug>/page.tsx) against mechanical and qualitative craft criteria, calibrated against the user's own past critiques. Run this as a SEPARATE agent from whoever wrote the scene — never let the writer grade their own output. This is the final gate before a scene is considered publishable: default assumption is the scene is NOT good enough until every check is explicitly verified against the text.
---

# Verify turning point

## Who runs this and why
You are grading a piece of content someone else wrote. You did not write it and have no
stake in it being good — your only job is to find out whether it's actually good, using the
standard below, not whether it's plausible-sounding. **Default stance: FAIL until proven
otherwise.** A check only passes if you can quote the exact text that earns it. "Seems fine"
is not a pass. This skill is the last gate before a scene is considered done — there is no
partial credit and no rounding up.

## How the calling agent must invoke this — no contamination
If you are the agent spawning the subagent that will run this skill (not the subagent
itself): the verifier must get a **cold, first-look read** of the scene. Do not include any
of the following in the spawn prompt, even in passing:
- That a previous verify pass happened, what it found, or that issues were "already fixed."
  Telling the verifier "pass 1 failed on X, I fixed it, please re-check" primes it to confirm
  your fix instead of independently hunting for problems — it stops being adversarial.
- Your own rationale for any choice in the scene ("I softened this paragraph because...", "I
  used a root instead of a stalk here to vary the imagery"). Pre-justifying your work to your
  own grader is the same contamination in a different shape.
- Any framing that the scene is "done," "final," or "ready for verification" beyond stating
  the file path to check.
Give the spawn prompt only: the file path(s) to verify, the instruction to run this skill,
and the minimum factual grounding it needs to check sourcing (e.g. which data files to
cross-reference) — nothing about prior rounds, edits, or intent. If a FAIL requires a second
pass after a fix, spawn a fresh verifier with the same cold-start prompt — never a "re-check
this" framing that references the previous round's verdict.

## Setup — read these four things before grading anything
1. The target scene: `app/story/<slug>/page.tsx`. Extract the prose only (ignore JSX/CSS);
   group it by beat: kicker+headline, scene-setting, Voice 1, time-skip+Voice 2, echo, source
   note.
2. `.claude/skills/turning-point-scene/SKILL.md` — the structural contract the writer was
   given (locked 6-beat skeleton, POV rules, logical-continuity rules). You are checking
   compliance with this contract, not inventing your own standard.
3. `.claude/skills/verify-turning-point/calibration/bipedalism.md`, specifically its
   scene-setting paragraph. This is the one passage the user has never criticized across
   three separate critique sessions and explicitly used as the comparison standard for the
   other two scenes. Treat it as the closest thing to ground truth for "what a passing image
   looks like" — a more reliable anchor than the abstract criteria language below.
4. `.claude/skills/verify-turning-point/calibration/_cross-story-themes.md` — the user's own
   explicit framing of what matters most (see "Painting a picture" below). The other two
   calibration files (`endurance-running.md`, `hands-and-grip.md`) are optional deeper
   background if you want more worked bad-examples, but are not required reading.

## The core lens: "painting a picture"
The user has stated, independently, in every calibration session, that emotional vividness
and readability are not two different things to them — they're the same test applied at two
different scales: **does this prose put a concrete, immediate image in the reader's head,
with zero lag for parsing or inference?** Apply this as your default lens for every sentence
before running the itemized checks below. If a sentence makes you pause, re-read, or
mentally reconstruct what's happening — even if it's grammatically correct — it fails this
lens, regardless of which specific criterion you eventually file it under.

---

## Tier 0 — Mechanical checks (run first, cheap, pattern-based)
These are pattern-matches, not judgment calls. A hit doesn't automatically fail the scene —
it routes the sentence into the Tier 1 judgment pass below for a verdict. Report hits even if
you ultimately judge them harmless; don't silently filter.

| Check | What to scan for |
|---|---|
| Em-dash overuse | Any sentence using a *flanking double em-dash* construction ("X — Y — Z"). This specific pattern is the user's named AI-tell — not em-dashes generally, this construction specifically. |
| Skeleton compliance | All 6 beats present, in this order: kicker+headline, scene-setting (3rd person), Voice 1 (1st person), time-skip marker + Voice 2 (1st person), echo (non-voice-specific, factual register), source note (3rd person). Exactly two first-person voices — never a third. No named individuals anywhere. |
| Time-skip marker | A real elapsed-time figure ("two million years later"), not a vague hand-wave ("many generations later"). |
| POV-leakage phrases | Voice 2 text containing "used to," "before," "no longer," "anymore," or any verb implying personal memory — applied to the narrator's own past capability. Voice 2 was born with the adaptation and has no such memory; any hit here is a likely criterion-6 violation (worked example: "around me a few others are still doing what I used to" — flagged in `hands-and-grip.md`). |
| Retrospective-narration phrases | Constructs that report an event with hindsight framing instead of rendering it as it happens: "I did X before the others did," "I did X myself" used as a completed-comparison marker, "it wasn't until [later] that [Y]" used to retroactively summarize rather than narrate. (Worked example: "I catch movement before the others do... I move away from that side myself" — flagged in `bipedalism.md`.) |
| Species/terminology consistency | The same animal/species referred to by more than one name across the piece (worked example: "kudu" introduced after "antelope" was already used, in `endurance-running.md`). |

---

## Tier 1 — Qualitative criteria (grade each independently; quote evidence for every verdict)

1. **Emotional vividness.** Does the prose pull you into the animal's body and the scene? Apply the "painting a picture" lens above. Quote the strongest and weakest sentence.
2. **Immersion breaks.** Any sentence that doesn't parse, or an action/thought implausible for this specific animal in this moment? Zero flags is the only pass.
3. **Logical flow.** Trace the cause→effect chain in order and check every link. Explicitly check these four recurring failure shapes (found in every calibration story so far, not hypothetical):
   - *Missing-setup continuity gap*: a sentence assumes an earlier state that was never shown (e.g. "twice I dropped to a walk" with no established prior running; "she'd been working at the femur... by the time the hyenas circled back" with unclear sequencing). This is the single most-repeated failure across all three calibration scenes — weight it accordingly.
   - *Motivation/connective tissue between beats*: why is the group moving, why does it turn back, why does arriving somewhere matter — beats can each individually pass and still feel disconnected from each other.
   - *Epistemics*: does the animal have a plausible basis for what it's reacting to or seeking (how would it know there's marrow in that bone, or a predator at that treeline)?
   - *No effect before its cause, no unearned "anyway"/"again," spatial/causal claims that actually hold up* — see the writing skill's own "Logical continuity check" section and re-run it adversarially; the writer may have missed their own error.
4. **Forced fact-squeezing.** Any sentence where the animal says/thinks/does something that reads as engineered to mention an evolutionary pressure or advantage, rather than something the animal would actually do — including a sentence that states the evolutionary *comparison* directly instead of letting the juxtaposed actions imply it. (Worked example, confirmed independently twice: "whichever of them that was, they never saw it coming the way I did.") The reader should connect the dots; the text should never connect them for the reader.
5. **AI-tell prose.** Generic-AI cadence: hedging, listy parallelism, abstract nouns doing the emotional work, a vaguely inspirational close. Cross-reference the Tier 0 em-dash hits here — that's the concrete instance of this criterion, not a separate concern.
6. **POV knowledge leakage.** Cross-reference Tier 0's POV-leakage scan. Beyond the lexical hits: does Voice 1 know/feel anything only Voice 2's era would have? Does Voice 2 reference anything only Voice 1 could have known? Check scene-setting and echo too — confirm they stay out of first person per the skeleton.
7. **Readability.** Could a tired, distracted reader parse each sentence on one pass and immediately picture what's happening? Two distinct failure types, both count:
   - *Syntactic*: re-reading needed to resolve grammar, pronoun reference, or buried clauses.
   - *Conceptual immediacy*: the sentence parses fine grammatically but the reader still has to stop and work out *what's happening* (worked example: the endurance-running headline "by midday, the chase always gives out before the prey does" — grammatically clean, situationally opaque). Hold the headline/kicker to an even higher bar than body prose — it's the single most load-bearing line in the piece.
8. **Payoff specificity.** The skeleton requires Voice 1's rudimentary attempt to pay off once, concretely. Beyond "does it pay off" — does that payoff moment actually demonstrate the *specific* trait this scene is about, or an adjacent/incidental mechanism? (Worked example: hands-and-grip's success moment is a stone accidentally fracturing into a sharp flake — that demonstrates tool serendipity, not grip/dexterity, which is what the scene is supposed to be about.)
9. **Same-species comparison device.** In the time-skip beat, is the adapted/unadapted contrast shown via a directly comparable individual of the *same species*, visible in the same scene — not an unrelated animal used as a foil? (Confirmed failure, independently, twice: a jackal in endurance-running, a hyena in hands-and-grip — neither tells the reader anything about the population split the beat is supposed to show.)
10. **Anatomical vs. behavioral plausibility.** If the trait is a fixed anatomical/structural feature (hand/thumb proportions, pelvis shape) rather than a learned behavior or skill, does showing "some individuals have it, some don't" as a clean binary within one generation hold up? Real structural change is gradual and population-wide, not a coin-flip presence/absence. Flag this distinctly from criterion 3's general plausibility check — it's specific to anatomical traits and may require the skeleton to be applied differently for them than for behavioral/capability traits (bipedalism's balance, endurance-running's pacing read as a spectrum more naturally than a fixed anatomical feature does).
11. **Source grounding.** Per the writing skill's non-negotiable scientific-honesty rule: does every dramatized beat trace to a real fossil/hypothesis named in the source note? Is the source note itself naming real sources, not gesturing at "scientists believe"?

---

## Tier 2 — Logged notes (not pass/fail)
Some real, valid observations aren't this skill's call to grade. Log them in your output
under a separate "Notes (not scored)" heading rather than discarding them or forcing them
into a PASS/FAIL verdict:
- **Writer-skill-level critiques** — e.g. "is this the strongest possible illustrative
  example for this trait at all," which is a choice made before any prose was written. Surface
  it; don't score it.
- **Out-of-scope plausibility questions** this skill structurally can't verify because it only
  reads prose, not images or deep biomechanical literature — e.g. whether a chosen reference
  image is era-appropriate, or whether a specific biomechanical claim (a pinch grip driving a
  hammerstone strike) is anatomically correct. Flag these explicitly as open questions for the
  user to resolve, rather than silently passing or silently failing on them.

---

## Output format
One ledger, never a one-line summary verdict.

```
## <slug> — verification ledger

### Tier 0 — mechanical hits
| Check | Hit? | Quote |
|---|---|---|
| Em-dash overuse | yes/no | ... |
| Skeleton compliance | yes/no | ... |
| Time-skip marker | yes/no | ... |
| POV-leakage phrases | yes/no | ... |
| Retrospective-narration phrases | yes/no | ... |
| Species/terminology consistency | yes/no | ... |

### Tier 1 — qualitative criteria
| # | Criterion | Verdict | Evidence |
|---|---|---|---|
| 1 | Emotional vividness | PASS/FAIL | "<quote>" — why |
| 2 | Immersion breaks | PASS/FAIL | "<quote>" or "none found" |
| 3 | Logical flow | PASS/FAIL | chain traced; name which sub-check broke, if any |
| 4 | Forced fact-squeezing | PASS/FAIL | "<quote>" or "none found" |
| 5 | AI-tell prose | PASS/FAIL | "<quote>" or "none found" |
| 6 | POV knowledge leakage | PASS/FAIL | "<quote>" or "none found" |
| 7 | Readability | PASS/FAIL | "<quote>" or "none found" — note syntactic vs. conceptual |
| 8 | Payoff specificity | PASS/FAIL | does the payoff demonstrate the actual trait? |
| 9 | Same-species comparison device | PASS/FAIL | "<quote>" or "none found" |
| 10 | Anatomical vs. behavioral plausibility | PASS/FAIL/N-A | only applies to fixed traits |
| 11 | Source grounding | PASS/FAIL | named sources present and real? |

**Overall: PASS / FAIL**

### Notes (not scored)
- Writer-skill-level or out-of-scope observations, if any.

If FAIL: list the specific sentence(s) to rewrite and what's wrong with each, in priority
order — weight Tier 0 hits and criterion 3's "missing-setup" sub-check highest, since those
are the most-repeated real failures across calibration. Don't write the replacement prose
yourself unless asked — diagnosis is your job, not the fix.
```

## Guardrails against rubber-stamping
- No PASS without a quote. If you can't quote it, go find the sentence that earns it or
  change the verdict to FAIL.
- Criteria are graded independently and never averaged. A scene can read beautifully on 1, 5,
  and 7 and still be an overall FAIL because of one logic break or one POV leak in criterion 3
  or 6 — craft polish never excuses a structural or logical failure.
- Re-read scene-setting and echo specifically for criterion 6 — they're third-person/non-voice
  beats and easy to skip, but can still leak POV-specific knowledge or drift into first person.
- Tier 0 hits are not automatically failures and Tier 1 verdicts are not automatically passes
  just because no Tier 0 hit fired — the two tiers inform each other but don't replace each
  other. Always do both passes.
