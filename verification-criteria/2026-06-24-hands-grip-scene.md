# Verification Criteria — Hands & Grip Turning-Point Scene (2026-06-24)

## Direction (from Stage 1)
Third turning-point scene, same format as `app/story/bipedalism/` and
`app/story/endurance-running/`. Narrowed through direct questions:
- Trait: **precision grip of the hand** (not brain growth, skin color, or teeth/jaw — those
  were offered and not chosen).
- Causal angle, confirmed directly: **Homo habilis develops a strong, precise thumb-and-finger
  grip to deliberately strike stone flakes (Oldowan toolmaking), then uses those flakes to get
  at meat/marrow in carcasses faster than rival scavengers can.** This is the OH 7 hand-fossil
  story already on record in `data/lineage.json`'s `homo-habilis` entry ("Lived alongside
  stone tools and cut-marked bones, gaining access to meat and marrow").

Must follow `.claude/skills/turning-point-scene/SKILL.md` exactly (locked-in structural
skeleton, POV rules, visual template) — this doc adds only the criteria specific to THIS
scene's content, not a re-statement of the general format rules already covered there.

## A. Format compliance (per SKILL.md, checked against this specific scene)
- [ ] Route is `app/story/hands-and-grip/page.tsx` + `scene.module.css`, additive only — no
      edits to `app/page.tsx`, `evolution-explorer.tsx`, `explorer.module.css`,
      `data/lineage.json`, or the `app/story/page.tsx` scene list, EXCEPT that the new scene
      must be added to the `scenes` array in `app/story/page.tsx` so it's reachable from the
      stories homepage (this is the one intentional, expected edit outside the new route's own
      folder — added 2026-06-24 after the stories homepage shipped).
- [ ] All 6 structural beats present in order: kicker+headline, third-person scene-setting,
      voice 1 (unadapted, witnesses a cost, makes a rudimentary insufficient attempt that pays
      off at least once), voice 2 (adapted, after an explicit elapsed-time kicker, population
      split visible live, a second independent instance of the same pressure, advantage shown
      incidentally not explained, no closing summary line), echo (non-obvious factual
      consequence), source note.
- [ ] Headline states the animal's pre-adaptation problem as felt (style-matched to "The
      forest is running out of trees." / "By midday, the chase always gives out before the
      prey does.") — e.g. the frustration of a carcass already there but unopenable.
- [ ] Voice 1's rudimentary attempt is a real, plausible precursor behavior, not a willed
      anatomical change — e.g. bashing a found stone against bone/another stone clumsily,
      losing grip, glancing blows — that nonetheless cracks one bone or strikes one usable
      flake at least once before the attempt fails or the hand can't sustain it.
- [ ] Voice 1's witnessed cost is a real, plausible consequence of lacking the grip — e.g.
      losing a carcass to a hyena/rival hominin who got there and ate while voice 1 was still
      fumbling with an unworkable stone — kept oblique per SKILL.md (no graphic kill
      narration).
- [ ] Voice 2 shows deliberate, controlled flake-striking and butchery succeeding through
      incidental sensory/action detail (the stone splitting along a clean line, the edge
      catching hide, marrow coming free) — never narrated as "because my thumb was strong
      enough to..." (show-don't-explain rule).
- [ ] Second independent instance of the same pressure in voice 2 (per SKILL.md): another
      scavenger (hyena, or another hominin without the grip) failing at the same or a nearby
      carcass, described with fresh concrete detail, not a repeat of voice 1's imagery.
- [ ] No sentence states cause via "because"/"so that"/a want-statement — spot-check every
      paragraph in voices 1 and 2.
- [ ] No named individuals; protagonist only ever acts/succeeds for themself, not the group.
- [ ] CSS classes and spacing reused exactly from the existing template (`.scene`, `.beat`,
      `.kicker`, `.headline`, `.body`, `.imageBeat`, `.heroImage`, `.sourceNote`) — no new
      classes, no card grid.

## B. Content grounding (must trace to real evidence, not invented mechanism)
- [ ] Species is Homo habilis, matching `data/lineage.json`'s existing entry (OH 7 hand bones,
      Olduvai Gorge, ~1.85–1.75 Ma; "curved finger bones" alongside the grip-relevant traits;
      behavioral note on stone tools and cut-marked bones already on record).
- [ ] Names the real anatomical change: a robust, more human-like thumb (longer relative to
      fingers, strong flexor pollicis longus / opponens pollicis muscle attachments inferred
      from OH 7 hand bones) enabling a forceful, controlled "precision grip" (pad-to-pad
      thumb-finger contact) distinct from the power-only grasp of earlier hominins/apes.
- [ ] Names the real technology: Oldowan stone tools (~2.6 Ma onward), made by controlled
      hard-hammer percussion (striking a core with a hammerstone to detach sharp flakes) —
      not a vague "used rocks."
- [ ] Names the real archaeological evidence tying tools to diet: cut-marked and
      percussion-marked animal bones found alongside Oldowan tools at sites like Olduvai
      Gorge, indicating deliberate access to meat and marrow.
- [ ] Echo beat states a specific, non-obvious, real, traceable fact about this trait's
      legacy — candidate: the human thumb's strength/dexterity is still measurably distinct
      from a chimpanzee's (chimps cannot achieve the same forceful pad-to-pad precision grip
      because they lack the equivalent thumb muscle/length proportions), or an equivalent real
      citable fact if this one doesn't hold up on a final source check. Must not be a vague
      "we still use our hands today."

## C. Build health
- [ ] `bun run build` succeeds with no new TypeScript errors. (Never `npm` — `bun.lock` is the
      project's lockfile.)
- [ ] Route renders, no console errors, hero image loads (not blank/broken).
- [ ] `/story` homepage lists the new scene as a third card, linking correctly to
      `/story/hands-and-grip`.
- [ ] Image used is an existing, already-sourced Homo habilis reconstruction from
      `public/images/lineage/` (`habilis-recon.png`) — no new unsourced image introduced.

## Verification log (2026-06-24)
- **A (route/additive):** `git status --short` shows only `app/story/hands-and-grip/` (new),
  `app/story/page.tsx` (the anticipated, pre-approved edit adding the third card), and this
  doc as the changes from this task. No edits to `evolution-explorer.tsx`,
  `explorer.module.css`, or `data/lineage.json`. PASS.
- **A (6 beats in order):** kicker+headline ("There's meat in that bone, and no way in.") →
  3rd-person scene-setting (lions/hyenas strip a carcass, marrow locked in bone) → voice 1
  (witnesses another's carcass lost to hyenas while she fumbled with an unworkable stone,
  then her own clumsy hammerstone strikes — mostly failing, but one glancing strike snaps off
  a usable sliver that smears marrow onto her fingers before the stone and the morning give
  out) → kicker "four hundred thousand years later" + voice 2 (deliberate hammerstone choice
  and strike angle, a clean flake on the third strike opens the bone in one cut; a hyena
  independently gives up on a similar bone nearby with fresh concrete detail) → echo (human
  vs. chimp thumb/precision-grip fact, factual register) → source note. PASS.
- **A (headline register):** states the felt problem (meat present, inaccessible), not a
  science summary. PASS.
- **A (voice 1 rudimentary attempt):** clumsy repeated stone-on-bone strikes, not a willed
  anatomical change; pays off once (one usable flake, one taste of marrow) before failing
  overall (the stone splits wrong, the rest of the strikes go nowhere). PASS.
- **A (voice 2 incidental advantage):** grip/dexterity shown via "turning it until one edge
  sits right against my thumb," "the same low angle each time," not explained via "because my
  thumb was strong enough"; ends on the hyena trotting away, no summary sentence about the
  evolutionary outcome. PASS.
- **A (second independent instance):** the hyena giving up on a different bone is fresh,
  distinct imagery from voice 1's hyenas-circled-back line. PASS.
- **A (no "because"/explaining):** reread both voice beats sentence by sentence — no
  "because," "so that," or want-statement found. PASS.
- **A (no named individuals, solitary action):** protagonist acts and succeeds alone in both
  voices; no group-steering language. PASS.
- **A (CSS reuse):** `scene.module.css` structurally identical to the prior two scenes' —
  same class names, same spacing, no new classes. PASS.
- **B (species/grounding):** Homo habilis, OH 7 hand bones, Olduvai Gorge — matches
  `data/lineage.json`'s existing entry. PASS.
- **B (named hypothesis/sources):** Susman's analysis of OH 7 hand-bone precision-grip
  capability, Marzke's biomechanical hand-morphology work, Toth's experimental Oldowan
  knapping replications, and FLK Zinj cut-marked/percussion-marked bones all named explicitly
  in the source note. PASS.
- **B (echo fact):** human vs. chimpanzee thumb strength/length and pad-to-pad precision-grip
  capability — a real, well-established comparative-anatomy fact (chimps lack the equivalent
  thumb muscle/proportions for a human-style forceful precision pinch); not independently
  re-fetched from a live source this session, consistent with the same standard applied to the
  endurance-running scene's echo fact.
- **C (build):** `bun run build` (via WSL) — compiled successfully, TypeScript clean,
  `/story/hands-and-grip` listed as a new static route alongside the other two scenes and
  `/story`. PASS.
- **C (live render):** hit the already-running dev server on `localhost:3000` (curl/grep, not
  a screenshot — same disclosed caveat as the prior two scenes): `GET /story/hands-and-grip`
  → 200; headline text and all four named sources (Susman, Marzke, Toth, FLK Zinj) present in
  rendered HTML; hero image `/images/lineage/habilis-recon.png` → 200. PASS.
- **C (story homepage lists it):** `GET /story` → contains `href="/story/hands-and-grip"`
  alongside the other two scene links, in addition order. PASS.
- **C (image reuse):** reused `habilis-recon.png`, already in the verified, licensed image
  set (CC BY-SA 4.0, Cícero Moraes, per `data/lineage.json`'s existing entry) — no new
  unsourced image. PASS.

**Open / not self-gradable:** whether this third scene lands for the user, and whether three
scenes now read as a real, ongoing series, is the user's call, not mine.

## What this does NOT test
Whether this third scene lands for the user, and whether three scenes now feel like a
real, ongoing series, is the user's call — not self-gradable.
