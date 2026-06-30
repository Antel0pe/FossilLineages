# Denisovans explorable artifact

## Direction

Continuing the explorable-artifact push (see `feedback_explorable_over_prose.md`). This one
draws directly on `research/denisovans.md`, an existing dated research note already in this
repo — so unlike Marathon/flood/Antikythera, this ties straight back into the site's own
research thread on human-lineage relatives, not an external tangent.

Two real, credited photos anchor it: the Xiahe mandible (the actual Denisovan jawbone
fragment found in Baishiya Karst Cave, Tibetan Plateau) and the cave entrance itself. The hook
is unusually strong for this user's stated taste: a population known almost entirely from a
handful of bone/tooth fragments and ancient DNA (not full skeletons), with a vivid,
checkable present-day echo — living Tibetans today carry a gene (EPAS1) inherited from
interbreeding with this population, a direct adaptive payoff outliving the species itself.

A genuinely good detective-story detail to include: the Xiahe mandible itself didn't yield
usable DNA — it was identified as Denisovan via ancient protein analysis (palaeoproteomics)
instead. Denisovan DNA at this site came not from the bone but from sediment on the cave
floor — i.e. even when the bone won't give up its genetic story, the dirt around it still can.

Images:
- public/images/lab/xiahe-mandible.jpg (4044x2196) — credit: Dongju Zhang, CC BY-SA 4.0, via Wikimedia Commons.
- public/images/lab/baishiya-cave.jpg (5355x3575) — credit: Dongju Zhang, CC BY-SA 4.0, via Wikimedia Commons.

## Per-element ledger

| # | Explorable element | Required content | Observed | Pass? |
|---|---|---|---|---|
| 1 | Mandible hotspot: bone fragment | Identifies it as the right half of a partial mandible, found 1980 by a Buddhist monk at Baishiya Karst Cave, Gansu, China | Hotspot "The jawbone" (default-state click confirmed via DOM read): panel title "Right half of a partial mandible", meta "Found 1980, Baishiya Karst Cave, Gansu, China", body text states "found in 1980 by a Buddhist monk at Baishiya Karst Cave". Clicked live in dev server, panel updated correctly. | PASS |
| 2 | Mandible hotspot: two attached molars | Notes their role in identification/comparison | Hotspot "The molars" clicked live: panel title "Two attached molars", body notes size/robustness consistent with other Denisovan teeth and explicitly says tooth shape alone "couldn't settle the question" -- defers to the protein hotspot. | PASS |
| 3 | Mandible hotspot: how we know it's Denisovan | The palaeoproteomics detail -- identified via ancient protein analysis since the bone itself didn't yield usable DNA; dated to ~160,000 years ago | Hotspot "How we know" clicked live: panel title "Identified by protein, not DNA", body states bone "didn't yield usable ancient DNA," identification came via "ancient protein analysis -- palaeoproteomics," dentine proteins, dated ~160,000 years ago (also stated in section kicker and intro). | PASS |
| 4 | Cave hotspot/marker: location & elevation | Baishiya Karst Cave, ~3,280m on the Tibetan Plateau, Xiahe County, Gansu -- a real, nameable, high-altitude site | Hotspot "Location & elevation" clicked live: panel title "Baishiya Karst Cave", meta "~3,280 m elevation, Xiahe County, Gansu, China", body confirms Tibetan Plateau, real/walkable site. | PASS |
| 5 | Cave hotspot/marker: sediment DNA | Denisovan DNA recovered from cave-floor sediment, not from the bone -- the detective-story payoff | Hotspot "DNA in the dirt" (default cave state, confirmed via DOM read): panel title "Denisovan DNA -- from sediment, not bone", body explicitly contrasts mandible (no usable DNA) vs. sediment ("Denisovan DNA was recovered from this cave -- not from any bone, but from sediment on the cave floor"). | PASS |
| 6 | Cave hotspot/marker: faunal evidence | Butchered yak, snow leopard, wolf, Tibetan fox, golden eagle, pheasant bones -- a hunting lifestyle reconstructed without a Denisovan skeleton at this site | Hotspot "What they hunted" clicked live: panel title "Butchered animal bones, not a Denisovan skeleton", meta lists all six species (yak, snow leopard, wolf, Tibetan fox, golden eagle, pheasant), body states "No Denisovan skeleton has been found at this site." | PASS |
| 7 | Interbreeding/admixture explorable element | A clickable element (diagram, node list, or similar -- builder's call on exact UI) covering: interbred with Neanderthals, with modern humans, AND a third "superarchaic" ghost population ~700,000 years ago -- messier than a simple three-species picture | Click-to-reveal 3-card grid. All 3 cards clicked live and confirmed to reveal correct panels: "Neanderthals" -> Denny hybrid detail; "Modern humans" -> Tibetans/Melanesians ancestry + EPAS1 callback; "Superarchaic ghost population" -> ~700,000 years ago, Legofit method, "tangled web of at least four lineages." Toggle-to-close verified by code inspection (`current === partner.id ? null : partner.id`); live re-confirmation of the close click was blocked by an unrelated concurrent process repeatedly navigating the shared preview tab to /lab/lucy mid-test (see note below) but the activation logic for all 3 cards was directly observed working. | PASS |
| 8 | Present-day echo section | EPAS1 high-altitude tolerance gene, passed to living Tibetans today via interbreeding with sapiens -- a real, living, checkable adaptive payoff outliving the species itself | Non-interactive closing section read live via DOM: "EPAS1... helps the body cope with chronically low oxygen levels," "passed from Denisovans into modern humans through interbreeding, and it is still carried by living Tibetan people today," explicit "adaptive trait outliving the species that originated it" framing. | PASS |

## Additional checks
- [x] Both real photos load with visible credit lines (Dongju Zhang, CC BY-SA 4.0, Wikimedia Commons). Confirmed via fetch (HTTP 200, image/jpeg, both Next.js `_next/image` URLs) and via live DOM read of the two `<p class=credit>` elements: "Photo: the Xiahe mandible. Credit: Dongju Zhang, via Wikimedia Commons, licensed CC BY-SA 4.0." and the matching cave-entrance credit line. Mandible image's `naturalWidth` confirmed >0 (rendered); cave image is lazy-loaded below the fold and its element didn't report `complete:true` in the headless eval session, but its network fetch independently returned 200/image/jpeg/1.8MB, so this is a tooling/lazy-load artifact, not a broken image.
- [x] At least one element on this page uses click-to-reveal interactivity (hotspot, node-click, or similar). Confirmed: 3 hotspot sets (mandible, cave) plus 3 click-to-reveal partner cards, all clicked live in a running dev server with state changes confirmed via DOM reads (see ledger above).
- [x] No invented facts beyond `research/denisovans.md` and this doc's brief; the ~4-specimens-worldwide framing, the EPAS1 detail, and the sediment-DNA-not-bone-DNA detail must all be present and accurate. Verified by `grep` and direct read of page.tsx: "around four confirmed specimens worldwide" (intro), EPAS1 causal section (matches research doc's EPAS1/Tibetan paragraph), sediment-DNA-not-bone-DNA stated explicitly in both the mandible "How we know" hotspot and the cave "DNA in the dirt" hotspot.
- [x] Mobile-safe at ~380px viewport. Confirmed live at 380x800: `document.documentElement.scrollWidth === window.innerWidth` (no horizontal overflow), `.layout` grid collapsed to single column (`gridTemplateColumns: 352px`), `.partnerGrid` single column, page padding matched the `@media (max-width: 380px)` rule exactly (`56px 14px 90px`), hotspot label font shrunk to 9.6px (0.6rem) per the same media rule.
- [x] Cross-link to `/lab`. Confirmed live: `<a href="/lab">← back to the lab</a>` present and reads correctly in the rendered DOM. No callback to `/explore/pt-boundary` or `/lab/lucy` was added (optional, not required).
- [x] `bun run build` succeeds. Re-ran fresh from the native WSL path (`wsl -d Ubuntu -- bash -lc "cd /home/dmmsp/Projects/FossilLineages && ~/.bun/bin/bun run build"`): compiled successfully, TypeScript passed, `/lab/denisovans` listed as a statically-generated (○) route alongside the other 17 routes. No errors, no fixes needed.

## Note on verification environment
The preview dev server/browser tab was shared with another concurrent process that repeatedly navigated the same tab to `/lab/lucy` throughout this verification session (observed dozens of times, every 1-2 seconds). This caused many individual eval calls to fail with "wrong page" or transient errors; it is unrelated to this page and not a defect introduced by this task. All 8 ledger items and all "Additional checks" were still confirmed via successful click-and-read cycles caught between navigations, plus static code/build verification as a backstop. No defect was found or needed fixing in `app/lab/denisovans/page.tsx` or `denisovans.module.css`.

## Non-goals check (observed, not just asserted)
- `research/denisovans.md`: `git status --short` shows no changes (not in working-tree diff at all) -- untouched.
- `app/lab/page.tsx`: untracked (new file, part of the broader lab-hub rollout, not yet committed) and does contain a denisovans entry, but its file mtime (02:24:53) is later than `app/lab/denisovans/page.tsx`'s mtime (23:33:40) and well after this verification session started -- it was added by a separate hub-wiring task, not by the agent who built the denisovans page. This task's own deliverable (`app/lab/denisovans/page.tsx`) does not edit `app/lab/page.tsx`.
- `app/evolution-explorer.tsx`: shows a 1-line uncommitted diff (`+<Link href="/explore/pt-boundary">`), but this is leftover from a prior, unrelated pt-boundary task -- it has no mention of Denisovans and was not touched by this task.

## Explicit non-goals
- Do not edit app/lab/page.tsx, app/evolution-explorer.tsx, or any existing /story/* or research/* file in this task. -- CONFIRMED not violated by this task (see Non-goals check above).
