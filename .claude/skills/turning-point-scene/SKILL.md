---
name: turning-point-scene
description: Write and build a "turning-point scene" page for FossilLineages — an image-forward, animal-POV narration of one evolutionary turning point (bipedalism, fire, language, etc). Use whenever creating a new scene or rewriting an existing one.
---

# Turning-point scene: writing & build guide

## What this is
Confirmed via direct user testing (2026-06-23, see `CLAUDE-UNDERSTANDING.md` → "Major
direction signal" and "Scope decision") that **this format — not the graph+modal — is the
thing that actually delights the user.** A turning-point scene dramatizes ONE evolutionary
change as a short sequence of beats, mostly narrated from the animal's own point of view,
grounded in real fossil evidence and named scientific hypotheses. `app/story/bipedalism/` is
the canonical reference implementation — read it before writing a new scene.

## The locked structural skeleton
Do not deviate from this order or invent new beats without checking with the user first.

1. **Kicker + headline.** `~X million years ago, somewhere in <place>` as the kicker, then a
   punchy headline stating the animal's PRE-evolution motivating problem — phrased as what
   the animal felt/faced, not a scientific summary (e.g. "The forest is running out of
   trees."). This is the single most load-bearing line in the piece. Spend the most craft
   here — it sets the tone for everything that follows.
2. **Scene-setting.** Third person. Establishes the ecological/environmental backdrop that
   makes beat 1's problem real and pressing. NOT narrated from inside the animal's head.
3. **Voice 1 — the unadapted individual.** First person. Two parts in the same beat, no
   section break between them:
   - First, witness an unnamed other paying the cost of not having the trait yet. Keep the
     loss oblique — not graphically specific (don't name the predator or narrate the kill),
     but not so vague the reader can't tell something happened either. A change in headcount,
     a silence, an absence is the right register (e.g. "there were three of us where there
     had been four").
   - Then, the protagonist **recognizes the problem and makes a rudimentary, partial attempt
     at a solution that the body isn't built for yet** — NOT a full version of the eventual
     trait, and NOT a verbal wish or resolve statement. For bipedalism this looked like
     briefly, laboriously rearing up on the back legs — straining, the body fighting joints
     and muscle that aren't built for it — for half a breath, before dropping back down. The
     shape is: *recognize the problem through the body's own attempt at it, and have that
     attempt be real but insufficient* — effortful, brief, unstable. Generalize this shape to
     other traits: a small, plausible, not-yet-adequate version of the eventual adaptation,
     arrived at by the animal trying something in the moment, not by the animal articulating
     a desire.
   - **This attempt must pay off at least once, concretely, in this same beat — show the
     selection pressure actually selecting, don't just narrate failure.** A rudimentary
     attempt that only ever fails gives the reader no reason to believe it would ever be
     favored by evolution. The accepted version: that half-breath of height is once enough to
     spot a real danger and dodge it, before the animal drops back down — immediately
     followed by acknowledging it usually doesn't work ("most days I don't even get that half
     breath"). The attempt needs to be a coin that comes up heads at least once on the page,
     not a coin that only ever comes up tails.
4. **Voice 2 — the adapted individual, after a time-skip.** Mark the jump explicitly with a
   `.kicker` line right before this beat, using an actual elapsed-time figure (e.g. "two
   million years later") rather than a vague "many generations" — it doesn't need to be
   precisely accurate, but it should read as a real span, not a hand-wave. This is a
   genuinely different, unnamed individual — write ONLY what this individual would know from
   their own body and senses. Never let knowledge belonging to voice 1 (an ache, a memory of
   struggling) leak into voice 2's narration — voice 2 was born with the adaptation and has
   no memory of lacking it. The contrast with voice 1 must be shown through what voice 2
   currently observes around them, not through voice 2 referencing a past they never had:
   - **Make the population split visible in the same moment**, e.g. others nearby still on
     their knuckles, falling behind — not a remembered then-vs-now comparison.
   - **Show a second, independently-described instance of the same selective pressure from
     beat 3** (e.g. another individual caught out by danger) so the pressure reads as
     ongoing, not a one-off origin story — but describe it with fresh, different concrete
     detail (a different color/shape/sound) rather than reusing beat 3's specific imagery.
     For this to be plausible the group typically needs to be spread out/fanned across the
     terrain, not clustered — set that up in the same sentence if needed.
   - Weave in every real advantage that has credible evidence (resource access, energy
     efficiency, predator detection, etc.) as **incidental details of the action itself** —
     show the hands carrying fruit home, not "my hands were free because I didn't need them
     for walking." If you can point to the sentence where you explained *why* something was
     good, cut the explanation and trust the image.
   - **Don't manufacture a sentimental gesture that isn't implied by the evidence** (an
     earlier draft had the narrator hand food to "the youngest one, waiting in the shade" —
     cut as forced; the real, sourced behavior is carrying surplus food back to a home base,
     full stop, no invented emotional beat layered on top).
   - **No closing summary line stating the evolutionary outcome**, even obliquely (an earlier
     draft ended with "Seasons later, more of the troop crosses this stretch the way I did...
     Fewer of them put their knuckles down at all" — cut; this was still a narrator's
     after-the-fact tally, just disguised as observation). The beat should simply end on the
     scene's last concrete action. The split shown live in the beat (bullet above) already
     carries the implication; don't add a second, summarizing one.
   - **Exactly two voices, not three.** A user explicitly considered and rejected adding a
     third "everyone now has the adaptation" stage — voice 1 (struggle) and voice 2 (resolved)
     is the complete arc; a third stage added nothing.
5. **Echo.** A specific, NON-OBVIOUS, factual downstream consequence of this exact trait —
   something a reader wouldn't already know or expect, not "you're still doing this today."
   Tonally, this beat is ALLOWED to shift register — brief, factual/clinical, "did you know"
   delivery rather than continued narration. **Tried and reverted:** a lighter, chattier
   "fun fact" narrator voice ("here's the part nobody tells you...") — the user preferred the
   plainer factual register back. Default to factual/clinical for this beat; don't retry the
   chattier tone without being asked. Must be real and traceable to a named hypothesis or
   established science (e.g. the obstetric dilemma, lower-back vulnerability from lumbar
   lordosis) — never invented.
6. **Source note.** Third person, low-prominence, factual. Names the real fossils/finds and
   the named hypotheses the dramatization is grounded in.

## POV & voice rules
- The majority of the prose is 1st-person animal POV (beats 3 and 4) — this is what makes it
  land, per direct user feedback. Beats 2 and 5 are deliberately NOT 1st person.
- No named individuals, ever. Reference others only by description ("another," "the one with
  the longer stride") — introduced and gone within the same beat, no backstory, no invented
  family/relationships. This is a compressed vivid moment, not a short story.
- Don't write a fictional plot. No dialogue, no invented characters beyond the unnamed
  protagonist and unnamed others who appear for a sentence and vanish.
- **Let fear/jealousy/relief/whatever the moment calls for register as a felt bodily
  sensation, not a stated emotion label.** A predator sighting that's described only as
  spatial/tactical ("a shape at the treeline, and I moved away") reads flat and pulls the
  reader out of the animal's body. Don't write "I was terrified" either — that's a label, not
  a sensation. Wanted register: something visceral and involuntary that the animal feels
  before or as it acts — a chest dropping, a gut lurching, legs moving before the decision to
  move has been made. The emotion should arrive through the body, in the same incidental,
  non-explained way physical advantages do (see the rule below). Watch for phrasing that
  sounds clever but is actually unclear: "I was down and moving away from it before I'd even
  decided to" was rejected because "before I'd even decided to" doesn't land as a concrete
  image — readers don't know what it means. The fix was a plain, fast, physical action: "I
  was down and bolting away from it as fast as my legs would carry me." Prefer the
  unambiguous physical version over an abstract one every time, even if the abstract version
  sounds more literary on its own.
- **Show, don't explain — the single most-corrected failure mode.** Any sentence that names
  *why* a detail matters ("my hands were free because...", "I wish I could...", "she would
  have more children because...") reads as on-the-nose and gets rejected. Write the detail,
  the sensation, the action — trust the reader to feel the cause. If a sentence contains the
  words "because," "so that I could," or a direct want/wish statement, rewrite it to show the
  thing happening instead of explaining it.
- **Write only what this specific animal would actually notice, in the words it would
  actually think — never a human narrator's analytical description of the animal's
  situation, even when the sentence is grammatically first person.** This is a distinct,
  recurring failure mode from the one above: the sentence can avoid "because" entirely and
  still be on-the-nose if it states the *point* of a detail in analytical language rather
  than the animal's own raw sensation of it. Concrete example actually rejected: "watching
  our hands instead of the grass ahead of us" — this correctly identifies that low visibility
  is the problem, but no animal experiences its own visual field by narrating what it isn't
  looking at; it's a human explaining the animal's limitation FROM OUTSIDE, dressed in first
  person. The fix that was accepted: "the grass closing in over our backs, the trail ahead
  nothing but green for the next few strides and then nothing at all" — same fact (you can't
  see far), delivered as the lived sensory experience of being inside it. Test for every
  sentence: could this sentence only make sense if someone OTHER than the animal had written
  it to make a point? If yes, rewrite it as a direct sensation, sight, sound, or bodily
  feeling instead. This applies to action description too, not just internal thought — "I'm
  already drifting wide around it before the thought of it has caught up with me" was
  rejected for the same reason (no animal experiences a predator sighting as a delayed
  thought-catch-up; the natural version is the immediate bodily fear response — chest going
  tight — followed by the avoidance action, not a clever description of reaction time).

## Logical continuity check (do this pass explicitly, sentence by sentence)
A separate failure mode from "on-the-nose phrasing" — a sentence can sound vivid and still be
broken because the literal sequence of events doesn't hold up. Before finishing a beat, trace
through it as a chain of cause → effect and check each link:
- **No effect before its cause.** Rejected example: "I'd already turned us the other way
  before my knuckles hit the dirt" — turning away is described as completing before the body
  that triggers the turn (dropping back down) has finished happening. Fix: the turn happens
  as part of or after the drop, not before it.
- **No "anyway"/"again" implying established history the page hasn't shown yet.** If this is
  the first time a behavior appears, introduce it as a fresh, specific event ("the next time
  we crossed it, I tried standing up partway, just to see"), not as a habitual aside that
  assumes the reader already knows the animal does this sometimes.
- **Spatial/causal claims have to actually work.** Rejected example: a predator "reached" the
  narrator's group after the narrator says they'd "already turned away" — if they'd turned
  away, the danger logically shouldn't reach them. Fix: keep the danger at a real distance the
  whole time (heard, not encountered) and have the narrator's early detection be the reason
  they were never in its path, not something they escaped after the fact.
- **If the protagonist saw the danger early and moved away, the consequence to someone else
  needs real separation in time and/or distance — not "a moment later," right next to them.**
  Rejected example: narrator spots movement, moves away, and "the shriek starts a moment
  later" right behind them — that's too close in time/space to be consistent with having had
  a real warning and having actually moved away. Fix: put real gap in ("it isn't until a few
  minutes later that one of the knuckle-walkers near that same dip jerks upright and
  shrieks") so the timeline only makes sense if the protagonist's early reaction genuinely put
  distance between them and what happened.
- **An unnamed other's fate stays oblique (per the POV rules above) AND physically plausible**
  — a shriek cut off at a distance is fine; a specific creature reaching a narrator who claims
  to have already evaded it is not.
- **The protagonist only ever saves themself — never narrate them guiding, steering, or
  warning "us"/the troop in a split-second reaction.** This was a recurring, repeated
  correction: lines like "I dropped back down already steering us the other way" or "I'm
  already steering us away" don't hold up — a half-second glimpse cannot plausibly produce
  group-leading behavior, and group-protection isn't the point of the scene anyway. The
  selection pressure in this skeleton is on the individual protagonist (voice 1 and voice 2),
  not on group/altruistic behavior. Write the avoidance as a solitary action ("I angled myself
  away from it" / "I move away from that side myself"), and let what happens to others be
  heard about only as a loss — that's the entire extent of their role in the scene.
- If a beat is doing real work showing an advantage (e.g. carrying more food because hands are
  free), it's fine for that beat to run longer than a single sentence to let the comparison
  land concretely (time spent, amount carried, what others can't manage) — don't compress a
  beat's evidence at the cost of making the advantage hard to picture.

## Scientific honesty (non-negotiable — this is an AGENTS.md-level project value)
- Every dramatized beat must trace to real fossil evidence or a real, named hypothesis already
  in `data/lineage.json` / the sources registry. Read the relevant taxa entries before writing
  — never invent a mechanism wholesale.
- The source note at the end is mandatory and must name real sources, not just gesture at
  "scientists believe."

## Visual template — reuse exactly; only image placement is a judgment call
- File layout: `app/story/<slug>/page.tsx` + `app/story/<slug>/scene.module.css`, structurally
  copied from `app/story/bipedalism/`.
- Reuse these CSS classes as-is — do not redesign typography/spacing per scene; visual
  consistency across scenes is the point: `.scene`, `.back`, `.beat`, `.kicker`, `.headline`,
  `.subhead`, `.body`, `.imageBeat`, `.heroImage`, `.sourceNote`.
- **Spacing values are part of the template, not a free choice.** `.scene` uses a 56px gap
  between top-level sections; `.beat` uses a 20px gap between paragraphs within one section.
  An earlier draft used 88px/16px — a 5.5x jump that read as "weird spacing" between
  paragraphs that were part of the same continuous thought. Keep the ratio closer to ~2.5–3x:
  loose enough to separate distinct beats, tight enough that multi-paragraph beats still read
  as one continuous passage.
- There is no card-grid pattern in the current template (an earlier draft's `.advantageGrid`/
  `.advantageCard` was removed — beat 4 is flowing prose, not cards). Don't reintroduce a card
  grid for the advantage beat.
- **Image placement is explicitly NOT templated.** Choose where in the sequence the strongest
  available image lands based on what's most impactful for THIS scene. In the bipedalism
  scene it sits right after beat 2 (scene-setting) and before beat 3 (the 1st-person
  narration begins) — the reader sees the creature before they're asked to inhabit it. That
  is one valid placement, not a rule; a different scene may want the image elsewhere.
- Building a scene is **additive only** — never edit `app/page.tsx`, `evolution-explorer.tsx`,
  `explorer.module.css`, or write to `data/lineage.json` (reading from it for grounding is
  fine and expected).

## Worked example
`app/story/bipedalism/page.tsx` is the canonical example. Read it before writing a new scene
to calibrate tone and length.
