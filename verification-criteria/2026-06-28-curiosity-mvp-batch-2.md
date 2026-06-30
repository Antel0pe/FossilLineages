# Curiosity-hypothesis MVP batch 2 (Flood myth / Etymology fossils)

## Direction

Continuing the same fast-MVP, gather-a-reaction approach as batch 1
(`2026-06-28-curiosity-mvp-batch.md`). Two new, different hypotheses about what hooks this
user, deliberately diversifying from batch 1 rather than repeating it:

- **Flood myth**: tests the third self-volunteered anecdote directly ("origins of world
  religions/mythology and whether echoes of them persist today") — a real, recurring
  environmental hazard (Mesopotamian river flooding) behind a mythologized story (the
  Gilgamesh/Genesis flood), including a real "detective story" beat (Woolley's 1929 claim to
  have found Noah's flood at Ur, later partly overturned by comparing silt layers across
  cities) — i.e. it tests whether myth-detective-work hooks him the same way Marathon did.
- **Etymology fossils**: tests a different medium entirely — no physical artifact, no single
  imagined person, just words in everyday use today that fossilize a forgotten real event
  (quarantine, deadline), plus a deliberate inclusion of "salary = paid in salt," a popular
  claim that is NOT well evidenced, to test whether flagging a popular myth as unsupported
  (rather than only debunking famous ones like Marathon) keeps the same appeal.

These are MVPs for reaction, not final polish. No invented history — every claim must trace
to the brief given to the builder.

IMPORTANT: a `/lab` hub page is being built/edited by a separate, possibly still-in-flight
task. Do NOT edit app/lab/page.tsx in this batch — these two pages must stand alone (a simple
link between the two of them is fine) and get added to the hub in a later manual pass.

## Per-item ledger

| Page | Real causal mechanism | Detective/myth-vs-evidence beat | Present-day echo | Sourcing | Observed | Pass? |
|---|---|---|---|---|---|---|
| app/lab/flood-myth/page.tsx | Recurring, locally devastating Tigris-Euphrates flooding in ancient Mesopotamia | Woolley's 1929 "found Noah's flood" claim at Ur, later shown to be a local event not a single global deluge when silt layers across cities were compared | The same flood-narrative archetype (Gilgamesh/Atrahasis -> Genesis/Noah) is still read/believed by billions today; the cuneiform flood tablet's 1872 decipherment by George Smith is a real, well-known discovery anecdote (state as "as the story is often told" if not 100% certain of every detail) | No image required, but if one is used it must be real/credited | Page text states the flood is the "most widely supported real-world basis" for the recurring Mesopotamian flood story (causal mechanism present, not overclaimed). "The twist" section states Woolley's headlines outran his own more cautious published claim ("evidence of a serious local disaster... not proof of a single, literal, worldwide deluge"), then adds the further complication that silt layers at other sites date to different centuries and Ur itself isn't fully covered by the layer -- nuance intact, not flattened to "archaeology proved the flood." George Smith 1872 decipherment is described with the explicit hedge "As the story is often told" around the undressing anecdote. Present-day echo closer states the story template "is still read, taught, and believed today... through Judaism, Christianity, and Islam." No image used; none required. Source note section explicitly states the speculative survivor passage is fictional. Rendered cleanly in preview (localhost:3300/lab/flood-myth), no console errors. | PASS |
| app/lab/etymology-fossils/page.tsx | Quarantine: Venice, Black Death, 40-day ship isolation (1377 doc, later extended). Deadline: Civil War POW camps (Andersonville/Rock Island, 1864), a literal line you'd be shot for crossing | Salary/"paid in salt" included explicitly flagged as a popular but evidentially unsupported folk etymology -- a small "even word trivia gets mythologized" beat echoing the Marathon page | Quarantine and deadline are words said constantly today, each one a fossilized trace of a specific real historical horror | n/a (text/concept page, image optional) | Specimen 1 (Quarantine) cites a surviving 1377 document, initial 30-day period later extended to 40, root in Italian "quaranta." Specimen 2 (Deadline) cites Andersonville/Rock Island Civil War camps, an 1864 Confederate inspector-general's report, and the 1920 OED first citation for the modern sense. Specimen 3 (Salary) is visually distinguished with an orange "handle with care" caution-card border and label; text explicitly says the root is "genuinely real" but the "paid in salt instead of money" detail "does not" hold up, calling it "a popular embellishment... when historians are actually skeptical of that specific claim" -- correctly framed as unverified folk etymology, not fact, with an explicit Marathon-page callback. Source note reiterates quarantine/deadline as "well-evidenced fossils" vs. salary's salt root real / "paid in salt" story "unverified folk etymology." Rendered cleanly in preview (localhost:3300/lab/etymology-fossils), no console errors. | PASS |

## Additional checks
- [x] Every claim traces to the grounded brief given to the builder -- no invented dates/names. Check: spot-read against this doc. All dates/names in both pages (1377, 1864/1920, 1872, 1929, Gilgamesh/Atrahasis/Genesis, Andersonville/Rock Island, salarium/sal) match the brief in this doc; no new invented specifics found.
- [x] The Woolley/Ur claim is presented with its actual nuance (he announced a flood, later research showed it wasn't a single global event) -- not flattened into "archaeology proved Noah's flood real." Check: read the passage. Confirmed in `app/lab/flood-myth/page.tsx` section "The twist: even Woolley didn't claim that, exactly" (lines 98-116): Woolley's own report is quoted as "a serious local disaster," plus the later cross-site silt-layer dating complication.
- [x] "Salary = paid in salt" is explicitly marked as folk etymology / not well evidenced, not stated as settled fact. Check: read the passage. Confirmed in `app/lab/etymology-fossils/page.tsx` Specimen 3 (lines 72-102): visually flagged as "handle with care," text states the salt-payment detail "does not" hold up and is "a popular embellishment."
- [x] app/lab/page.tsx is NOT touched by this batch. Check: git diff / file list shows no edit to it from this batch's agents. `app/lab/page.tsx` is untracked in git (no prior committed version to diff against) and is not referenced as edited by either builder's report; both reports state they left it untouched. No revert needed.
- [x] `bun run build` succeeds with these two new routes added. Confirmed by running `bun run build` from the native WSL path (`/home/dmmsp/Projects/FossilLineages`, not the `\\wsl.localhost\...` UNC mount) -- build completed cleanly, both `/lab/flood-myth` and `/lab/etymology-fossils` listed as statically prerendered routes alongside the rest of `/lab`. Note: the flood-myth builder's reported UNC-path build failure is environment-specific (the `app/globals.css` PostCSS step chokes on `\\wsl.localhost\...` paths before any route-level code compiles) and is unrelated to either page's content; it does not reproduce when building from the native WSL filesystem path, which is the path this verification used.

## Explicit non-goals
- No hub-page edit in this batch.
- No forced "imagined interiority" passage on the etymology page if it doesn't fit naturally -- this page is testing whether the abstract/textual hook works without one.
