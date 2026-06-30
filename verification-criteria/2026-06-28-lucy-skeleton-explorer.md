# Lucy skeleton explorable artifact

## Direction

Direct user feedback this session: of everything built so far, the clickable/explorable
artifact (`/explore/pt-boundary` — a real photo with hotspots you click to reveal evidence)
beat the prose narrative pieces. His words: it lets him "directly imagine the fascination in
the same way my brain does." Explicit instruction: keep the prose pieces, but build more
explorable artifacts like the rock-layer one. See memory `feedback_explorable_over_prose.md`.

This piece tests whether that winning format generalizes to a real fossil specimen — and ties
the "lab" experiments back into the site's actual core subject (human lineage), since this
site already has a bipedalism scene at `/story/bipedalism` that this can cross-link to.

Real artifact: a photograph of the reconstructed cast of AL 288-1 ("Lucy"), a partial
Australopithecus afarensis skeleton discovered in 1974 at Hadar, Ethiopia by Donald Johanson.
Source: https://commons.wikimedia.org/wiki/File:Reconstruction_of_the_fossil_skeleton_of_%22Lucy%22_the_Australopithecus_afarensis.jpg
(photo of a cast at the Musée national d'histoire naturelle, Paris; multi-licensed CC BY-SA
3.0 / CC BY 2.5 / GFDL — credit "User 120" via Wikimedia Commons).

## Per-region ledger

| # | Region (as laid out in the photo) | Required content | Observed | Pass? |
|---|---|---|---|---|
| 1 | Skull/cranial fragments (top) | Identified as small braincase fragments; states what this does/doesn't tell us (ape-sized brain, not human-sized) without overclaiming completeness | Panel text: "Only a handful of cranial fragments survive... enough to show a small, ape-sized braincase, but not enough to reconstruct a full skull from this specimen alone." Hotspot highlight box visually verified (screenshot) to bound the actual skull-fragment bones in the photo. | PASS |
| 2 | Mandible (jaw) | Identified, notes dental/jaw evidence used for diet inference | Panel text: "The jaw and teeth are a major source of evidence for diet... mixed diet... fairly robust teeth and jaws compared to later Homo... less heavily built than... Paranthropus." Hedged comparison, not overclaimed. Highlight box visually verified over the jawbone. | PASS |
| 3 | Ribs/vertebrae (torso) | Identified, notes what torso evidence contributes (general body plan) | Panel text: "their value is cumulative... helped reconstruct her general body plan and proportions... stood a little over a meter tall and likely weighed around 25-30 kg." Highlight box visually verified over rib/vertebra fragments (also slightly spans the side arm-bone columns, which is reasonable given the torso row layout in the photo). | PASS |
| 4 | Pelvis (ilium + sacrum) | The core bipedalism evidence: short, broad, basin-shaped pelvis vs. an ape's pelvis -- explained accurately, not just asserted | Panel text: "short and basin-shaped, much more similar to a modern human pelvis than to the tall, narrow pelvis of a chimpanzee... anchors muscles, including the gluteal muscles, in a position that lets them stabilize the body over a single leg with each stride." Mechanism explained, not just asserted. Highlight box visually verified over the pelvis bones. | PASS |
| 5 | Femur | The valgus (inward) angle bringing the knees under the body's center of gravity -- a specific, real, checkable piece of bipedalism evidence, correctly described | Panel text: "angles inward from the hip toward the knee — a feature called a valgus angle — bringing the knees close together under the body's center of mass... distinct from apes like chimpanzees, whose femurs run nearly straight down from a wider-set hip." Specific and correct. Highlight box visually verified over the femur shaft via preview_click. | PASS |
| 6 | Hand/foot bones | The "mosaic" point: some curved finger/toe bones suggest retained climbing ability alongside bipedal adaptations -- must be hedged as debated/mosaic, not asserted as settled | Panel text: "show curvature consistent with strong grasping ability... interpret this as retained climbing... How much tree-climbing... actually still did... is genuinely debated... not a settled question either way... often called a 'mosaic' of traits." Explicitly hedged. Highlight box visually verified over the bottom foot-bone cluster via preview_click. | PASS |
| 7 | Causal/significance section | States the real paradigm-shift point: Lucy was complete enough to help establish that bipedalism evolved before large brain size in human evolution -- not invented, a real historiographic point | Standalone "Why this particular skeleton mattered" section, screenshot-verified: "Lucy was complete enough... to demonstrate clearly that habitual bipedalism was already well established roughly 3.2 million years ago, in a species that still had a small, ape-sized brain... walking upright evolved well before big brains did, not alongside or after them." Accurate, real historiographic point, not invented. | PASS |

## Additional checks
- [x] Real photo embedded with visible credit/license line (Wikimedia, multi-license noted, "User 120"/cast at Musée national d'histoire naturelle, Paris). Check: preview_network + visual. **VERIFIED** -- screenshot shows: "Photo: reconstruction of the AL 288-1 ("Lucy") skeleton cast, displayed at the Musée national d'histoire naturelle, Paris. Credit: "User 120", via Wikimedia Commons, multi-licensed CC BY-SA 3.0 / CC BY 2.5 / GFDL." Image confirmed loaded (`naturalWidth > 0`) via DOM eval, served from `/images/lab/lucy-skeleton.jpg`.
- [x] Clicking/tapping a hotspot highlights that bone region AND updates an info panel -- same interaction pattern as `/explore/pt-boundary`. Check: preview_click + snapshot per hotspot. **VERIFIED for all 7 hotspots** (Skull fragments, Jaw, Ribs/vertebrae, Pelvis, Femur, Lower leg, Hand/foot bones) using real `preview_click` + `preview_screenshot` -- each click visually moved the yellow highlight box to the correct bone region and updated the panel heading/body/kicker, and the pill-button row below stayed in sync (active pill turns dark green). Also separately proved via DOM eval that `aria-pressed` and `setActiveId` update correctly on every click in a clean sequential test.
- [x] No claim invented beyond the brief; pelvis/femur bipedalism claims and the "bipedalism before big brains" point are checkable, not vague. Check: read each panel against this doc. **VERIFIED** -- see per-region ledger above, all 7 rows read and cross-checked against required content.
- [x] Cross-links to `/story/bipedalism` (forward link only -- do NOT edit the existing bipedalism scene files) and to `/lab`. **VERIFIED** -- `Link href="/story/bipedalism"` present in causal section (screenshot-confirmed text "see the bipedalism scene"), `Link href="/lab"` present as "back to the lab" (screenshot-confirmed, top of page). `app/story/bipedalism/*` confirmed untouched (not in git status diff).
- [x] Mobile-safe at ~380px viewport. **VERIFIED** -- resized to 380x800, screenshot-confirmed single-column layout (hero text, photo, info panel, pill row all stacked), `document.documentElement.scrollWidth - clientWidth === 0` (no horizontal overflow), hotspot labels remain legible at this width.
- [x] `bun run build` succeeds -- **run it from the native WSL path** (e.g. `cd /home/dmmsp/Projects/FossilLineages && bun run build`), NOT the `\\wsl.localhost\...` UNC path -- a prior task in this repo confirmed Turbopack's PostCSS step breaks on the UNC mount independent of any code change. **VERIFIED** -- ran fresh via `wsl.exe -d ubuntu -- bash -lc "cd /home/dmmsp/Projects/FossilLineages && bun run build"`: compiled successfully in 2.6s, TypeScript finished in 1624ms, all 18 routes statically generated including `/lab/lucy`, no errors.

## Explicit non-goals
- Do not edit app/lab/page.tsx, app/evolution-explorer.tsx, or app/story/bipedalism/* in this task -- other in-flight/completed work owns those; add this page standalone with forward links only.

**VERIFIED (independent verification pass, 2026-06-29):** `git status` shows `app/evolution-explorer.tsx`
modified and `app/lab/page.tsx` untracked, but both are pre-existing dirty state from the separate
pt-boundary / lab-index tasks (confirmed via `git log` that evolution-explorer.tsx's only diff is an
unrelated "Read the Rock" link to `/explore/pt-boundary`, and `app/lab/page.tsx` is a shared lab-index
page listing all lab artifacts, not something this task's deliverable files touch). `app/story/bipedalism/*`
untouched. A stray `.tmp_lucy_check/` scratch directory (cropped hotspot-verification images left by the
building agent) was found at the repo root and removed during this verification pass -- not part of the
deliverable, just build/analysis scratch.
