# Verification Criteria — Endurance Running / Hairlessness Turning-Point Scene (2026-06-24)

## Direction (from Stage 1)
User wants a second turning-point scene, in the same format as `app/story/bipedalism/`, still
within physical human/lineage evolution (not yet expanding to deferred scopes like Beringia or
Marathon). Narrowed through direct questions:
- Type of change: **loss of body hair + sweat-based cooling for endurance running**, not fire,
  stone tools, or brain growth.
- Causal angle: **persistence hunting** — a hairless, heavily-sweating hominin runs prey down
  to heat exhaustion over hours in the midday heat, something a furred predator/competitor
  cannot sustain. (Explicitly NOT the "owning the hottest hours of the day" framing — that was
  offered and rejected in favor of the chase.)
- Species/era: **Homo erectus** (~1.9–0.1 Ma per `data/lineage.json`), the first hominin with
  the modern long-legged, short-armed running body plan and (per fossil evidence) the first
  nuchal ligament — already in the lineage data with a "heat management in open country"
  pressure on record.

This is the second scene of the format-testing pilot. It must follow
`.claude/skills/turning-point-scene/SKILL.md` exactly — that skill is itself locked in from
direct user correction on the bipedalism prototype, so this doc does not re-litigate format
rules already covered there. It adds only the criteria specific to THIS scene's content.

## A. Format compliance (per SKILL.md, checked against this specific scene)
- [ ] Route is `app/story/endurance-running/page.tsx` + `scene.module.css`, additive only —
      does not edit `app/page.tsx`, `evolution-explorer.tsx`, `explorer.module.css`, or
      `data/lineage.json`. (Verify: `git diff --stat` shows only new files under
      `app/story/endurance-running/`.)
- [ ] All 6 structural beats present in order: kicker+headline, third-person scene-setting,
      voice 1 (unadapted, witnesses a cost, makes a rudimentary insufficient attempt that pays
      off at least once), voice 2 (adapted, after an explicit elapsed-time kicker, population
      split visible live, a second independent instance of the same pressure, advantages shown
      incidentally not explained, no closing summary line), echo (non-obvious factual
      consequence), source note.
- [ ] Headline states the animal's pre-adaptation problem as felt, not as science-summary
      (style-matched to "The forest is running out of trees.").
- [ ] Voice 1's rudimentary attempt is a real, evolution-plausible precursor behavior — NOT
      "trying to grow less fur" (an animal cannot will that). Acceptable shape: an early,
      partial behavioral attempt the body isn't yet built to sustain — e.g. trying to keep
      chasing prey past the point a furred body should reasonably quit, overheating, and
      having to break off — that nonetheless pays off at least once (prey also flags from heat,
      providing one successful kill/near-kill before the limit is hit).
- [ ] Voice 2 shows the SAME chase scenario succeeding to completion (prey collapses from heat
      exhaustion) through incidental sensory detail (sweat, panting prey, the chase outlasting
      a furred competitor/scavenger who drops out), not through the narrator explaining why
      sweating/hairlessness helps.
- [ ] No sentence states cause via "because"/"so that"/a want-statement (per SKILL.md's
      show-don't-explain rule) — spot-check every paragraph in voices 1 and 2.
- [ ] No named individuals; protagonist only ever saves/serves themself, not the group.
- [ ] Spacing/CSS classes reused exactly from the bipedalism template (`.scene`, `.beat`,
      `.kicker`, `.headline`, `.body`, `.imageBeat`, `.heroImage`, `.sourceNote` — no new
      classes, no card grid).

## B. Content grounding (must trace to real evidence, not invented mechanism)
- [ ] Species is Homo erectus, matching `data/lineage.json`'s existing entry (long legs, short
      arms, tall narrow body; pressure already on record: "heat management in open country").
- [ ] Named, real hypothesis backing the chase: Lieberman & Bramble's endurance running
      hypothesis (2004, *Nature*) — citing the specific adaptations it identifies (enlarged
      gluteus maximus and nuchal ligament for trunk/head stabilization while running, long
      Achilles tendon and arched foot for elastic energy return, eccrine sweat glands and loss
      of body fur for evaporative cooling).
- [ ] Persistence hunting itself is named as a real, evidence-backed model — cite Liebenberg's
      ethnographic documentation of persistence hunting among San hunters (Kalahari) as the
      modern analog used to infer the ancestral behavior, not a purely speculative scenario.
- [ ] The "cost paid by the unadapted" in voice 1 is physiologically real (heat
      exhaustion/overheating cutting a chase short), not an invented danger unrelated to heat.
- [ ] Echo beat states a specific, non-obvious, real, traceable fact — candidate: humans'
      heat-dissipating endurance lets them outlast a horse over long hot distances despite
      losing any sprint (real-world evidence: Man versus Horse Marathon, Wales, where humans
      have won on hot years) — or an equivalent real, citable fact if this one doesn't hold up
      on a final source check. Must NOT be a vague "we're still good runners today."

## C. Build health
- [ ] `bun run build` succeeds with no new TypeScript errors. (This project uses bun —
      `bun.lock` at the repo root — never npm.)
- [ ] Route renders, no console errors, hero image loads (not blank/broken).
- [ ] Image used is an existing, already-sourced Homo erectus reconstruction from
      `public/images/lineage/` (e.g. `erectus-body.jpg`) — no new unsourced image introduced
      without a verified license, per the project's existing image-sourcing standard.

## Verification log (2026-06-24)
- **A (route/additive):** `git status --short` shows only `app/story/endurance-running/`
  (new) and this doc (new) as untracked; `git diff --stat` against tracked files shows zero
  changes to `app/page.tsx`, `evolution-explorer.tsx`, `explorer.module.css`, or
  `data/lineage.json`. PASS. (Two unrelated tracked files changed this session —
  `.claude/launch.json` and `AGENTS.md` — both are the bun/npm fix requested directly by the
  user, not part of this scene's scope.)
- **A (6 beats in order):** kicker+headline ("By midday, the chase always gives out before
  the prey does.") → 3rd-person scene-setting (heat, retreating predators/prey) → voice 1
  (witnesses a group member collapse from heat mid-chase, then makes a rudimentary
  not-yet-adequate attempt — closes half the gap before her own legs give out, a real partial
  payoff) → kicker "two hundred thousand years later" + voice 2 (adapted individual, others
  visibly peel off into shade around her, a jackal independently drops out of the same chase
  with different concrete detail, completes the kill via sweat/endurance shown incidentally)
  → echo (Man vs. Horse Marathon fact, factual/clinical register) → source note. PASS.
- **A (headline register):** states the felt problem ("the chase always gives out"), not a
  science summary. PASS.
- **A (voice 1 rudimentary attempt):** a behavioral attempt (push past the point a furred
  body should quit), not a willed physical change; pays off once (closes half the distance)
  before failing overall (kudu escapes). PASS.
- **A (voice 2 incidental advantage):** sweat/cooling shown via "sweat runs freely down my
  bare arms," "barely breathing hard," not explained via "because I could sweat..."; no
  closing summary sentence after the kill — beat ends on the concrete action (hand closing
  on the foreleg). PASS.
- **A (no "because"/explaining):** reread both voice beats sentence by sentence — no
  "because," "so that," or want-statement found. PASS.
- **A (no named individuals, solitary action only):** protagonist never steers or warns the
  group; "we left her... and kept moving" is the group's collective action in voice 1, not
  the protagonist directing it — re-checked, this is the one borderline line; it describes
  what "we" did together rather than the protagonist alone. Read in context it matches the
  cost being witnessed (collective retreat from a failed hunt), not the protagonist leading —
  judged acceptable, but flagging for the user's own read since the skill's strictest framing
  is "protagonist only ever saves themself."
- **A (CSS reuse):** `scene.module.css` is byte-for-byt structurally copied from the
  bipedalism template — same class names, same spacing values, no new classes added. PASS.
- **B (species/grounding):** Homo erectus, matches `data/lineage.json`'s existing entry
  (long legs, short arms, "heat management in open country" pressure already on record).
  PASS.
- **B (named hypothesis):** Lieberman & Bramble 2004 *Nature* endurance-running hypothesis,
  with the specific traits named (gluteus maximus, nuchal ligament, Achilles tendon/arched
  foot, eccrine sweat glands, fur loss). PASS.
- **B (persistence hunting grounding):** Liebenberg's San-hunter fieldwork named explicitly
  as the real-world analog. PASS.
- **B (voice 1 cost is physiologically real):** heat exhaustion/collapse mid-chase, not an
  invented unrelated danger. PASS.
- **B (echo fact):** Man versus Horse Marathon (Wales) — real annual race; humans have won
  it on hot years despite losing any sprint to a horse. This is a real, citable, non-obvious
  fact (verified by general knowledge of the event's existence and record; not independently
  re-fetched from a live source in this session — flagging that the specific claim "humans
  have won on hot years" rests on background knowledge rather than a freshly checked citation,
  consistent with the project's existing standard of citing named real sources rather than
  inventing one).
- **C (build):** `bun run build` (via WSL, since this session's Bash tool is Windows Git
  Bash and bun lives in WSL) — compiled successfully, TypeScript clean, `/story/
  endurance-running` listed as a new static route alongside `/`, `/story/bipedalism`. PASS.
- **C (live render):** hit the already-running dev server on `localhost:3000` (could not
  attach the preview tool without killing the user's existing server, so this is curl/grep
  DOM-level verification, not a screenshot — flagging honestly, same caveat as the
  bipedalism prototype's verification): `GET /story/endurance-running` → 200; headline text
  present in the rendered HTML; hero image `/images/lineage/erectus-body.jpg` → 200; source
  note text ("Lieberman and Bramble", "Liebenberg", "Man versus Horse Marathon") present in
  DOM. PASS.
- **C (image reuse):** reused `erectus-body.jpg`, already in the verified, licensed image
  set (public-domain illustration, per `data/lineage.json`'s existing entry) — no new
  unsourced image introduced. PASS.

**Open / not self-gradable:** same as the bipedalism prototype — whether this specific scene
(the chase, the heat, the kill) actually lands emotionally for the user, and whether two
scenes now read as a series worth continuing, is the user's call, not mine.

## What this does NOT test
Whether a second scene in the same format still delights the user, and whether two scenes
together start to feel like a series worth continuing, is the user's call — not self-gradable.
Everything above is a floor (real, grounded, built correctly to spec), not a claim that it
lands emotionally.
