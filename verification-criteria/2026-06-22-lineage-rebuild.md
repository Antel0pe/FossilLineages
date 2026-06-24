# Verification Criteria — Lineage Rebuild (2026-06-22)

Task: Rebuild the content backbone + graph + modal so the site shows human (and
surrounding-lineage) evolutionary change well. This doc is the acceptance contract;
implementation is verified against every checkbox before reporting back.

## IMAGE QUALITY FIX (2026-06-22) — user rejected fossil thumbnails
User priority restated: full-body-with-face > full-body > face > fossil (last resort);
"roughly the same area" is acceptable. Replaced fossil/skull thumbnails with real
reconstructions. Wikimedia Commons has almost no CC life reconstructions for the deep forms,
so the good ones came from Smithsonian Human Origins (John Gurche, educational use, attributed
+ source-linked) and Commons life models. Now 18/20 are reconstructions/photos:
- Ekembo → Proconsul life restoration (representative early ape)
- Sahelanthropus → Gurche facial reconstruction
- Orrorin, Au. anamensis → representative early-hominin reconstruction (too fragmentary for
  species-specific faces — same approach the Smithsonian uses)
- Ardipithecus kadabba & ramidus → Ardipithecus facial reconstruction (kadabba was the
  specific complaint — no longer teeth)
- Au. afarensis → fleshed full-body museum model (was a skeleton)
- H. floresiensis → facial approximation (was a skeleton cast)
- Genuine fossil exceptions (nothing non-fossil exists, openly licensed): Nakalipithecus
  (jaw-only taxon) and Denisovans (DNA/fragments) — kept as fossils with explicit caveats.
All 6 new images verified to DECODE in-browser via next/image (not just 200). Orphaned
fossil downloads removed. Build + lint green.

## BROWSER RE-VERIFICATION (2026-06-22)
Launched the dev server through `wsl` so the Preview tool could drive a real browser, then
inspected the live DOM (stronger than a screenshot for these checks):
- Card text is literally name+age (e.g. "Ekembo nyanzae20 Ma – 17 Ma"); 0 role/posture nodes.
- Figures scale to body size: Ekembo 0.5 m → 89px, floresiensis 1.06 m → 126px,
  gorilla/sapiens 1.7 m → 169px. Growth + the Hobbit's dwarfism are visibly real.
- 9 distinct lane heights → branching confirmed.
- Modal opens with all 5 sections (physical / behaviour / why-pairs / confidence / map),
  trait chips, and lineage nav (earlier+later). Living anchors show the "living species" note
  instead of a map (gorilla: 0 map markers). 0 console errors.
- **BUG FOUND & FIXED in the browser:** the modal reconstruction image and the map `<Image>`
  defaulted to lazy and never received a `src` (intersection observer didn't fire for
  modal-mounted images) → they rendered blank. Added `priority` to both; re-verified the
  modal image (natW 380) and map (natW 759) now load. Build + lint still green.

## RE-AUDIT FIX (2026-06-22)
- Criterion B miss found & fixed: cards had shown a role chip + posture label on top of
  name+age. Now cards render **figure + name + age ONLY** (verified in rendered HTML:
  0 cardRole/cardPosture/cardMeta classes; 20 cardName; 20 cardAge). Figure area enlarged
  (186px) and scale ceiling raised so the figure is even more dominant.
- Criterion A strengthened: added the discovery papers (Berger 2015 for naledi, Brown 2004
  for floresiensis, Dart 1925 for africanus) so each sibling cites a primary source, not
  just the generic Smithsonian index. All sourceIds still resolve (0 unresolved).

## VERIFICATION RESULT (2026-06-22) — PASS
- 20 taxa incl. Chimpanzee + Gorilla anchors and 5 interesting siblings (Paranthropus,
  africanus, naledi, floresiensis, Neanderthal, Denisovan). Start = Ekembo (early Miocene ape).
- Graph: figure-dominant cards, sized to real body height on a shared ground line, data-driven
  branching layout (split/gene-flow edges), 0 card overlaps (checked programmatically).
- Modal: physical change + observed-trait chips, behaviour/ecology, change→pressure pairs,
  fossil-site map, confidence, references. Lineage nav works.
- Images: 20/20 local & self-contained; Next image optimizer returns 200 image/* for all
  sampled paths. Build + lint + static generation all green.
- All `sourceIds` resolve against the sources registry.

## A. Content backbone
- [ ] Story starts at the **best-known common ancestor of modern apes & humans** (an early
      Miocene ape) and steps to present-day *Homo sapiens*.
- [ ] **~20–26 forms** total — not capped at 24 if big changes warrant more. Selected by
      **"interesting evolutionary change" first, evidence second**. Capture the **big step
      changes** + **surprising sibling branches**.
- [ ] **Chimpanzee + Gorilla** present as living outgroup anchors at their split points, so
      the graph visibly **branches** (the "we share an ancestor with them" surprise lands).
- [ ] At least 3–4 genuinely "interesting sibling" forms beyond the direct spine
      (e.g. Paranthropus, Neanderthal, Denisovan, H. floresiensis, H. naledi).
- [ ] Every form is **web-researched**: dates, traits, behavior, and pressures backed by
      cited sources (Smithsonian/museum/papers). Sources stored and surfaced.

## B. Graph (physical change, figure-dominant)
- [ ] Each card is **dominated by a full-body figure**; only **name + age** as text. No
      trait-delta labels on the graph.
- [ ] **Posing convention** honored where the image allows: bipeds = frontal full-body,
      face-first; quadrupeds = side-on body with face toward camera.
- [ ] Figures **scaled to approximate real body size** across the sequence (or, if not
      feasible with real images, a clearly-implemented fallback: consistent frame + height
      side-cue). Body-size growth must be perceivable.
- [ ] Stepping across the graph, the **physical morph is perceptible from figures alone**
      (posture, proportions, head/brain) without opening anything.
- [ ] Layout is an **evolution of the current horizontal time-scroll** (taller figure cards,
      branch rows for anchors) — not a from-scratch paradigm.
- [ ] Reads as **branching, not a ladder.**

## C. Modal (depth on demand)
- [ ] Modal opens from a card and shows, for that form:
  - [ ] **Behavioral/ecological change** (diet, tools, habitat, social, range).
  - [ ] **Evolutionary "why" as explicit change → pressure pairs**, tied to traits.
  - [ ] **A map** of where its key fossils were found ("where it changed").
- [ ] No standalone fossil-specimen tab (fossil location data still powers the map).
- [ ] Lineage navigation (earlier ancestor / later branches) still works.

## D. Images  (MEASURABLE — priority: full-body-with-face > full-body > face > fossil)
- [ ] Real images, no AI generation this phase.
- [ ] **Per-taxon image ledger below is filled with the observed image TYPE, and every
      `fossil` row has a logged reason proving no reconstruction exists.** (A fossil is a
      FAIL unless its reason column proves exhaustion.)
- [ ] Sources to exhaust before any fossil fallback: Wikipedia lead → Wikimedia Commons
      category → **Smithsonian Human Origins (Gurche)** → broader web. Log per fossil.
- [ ] Image source + license recorded for each.

| taxon | image type | acceptable? | if fossil: why no recon |
|---|---|---|---|
| ekembo | life reconstruction (Proconsul, representative) | ✅ | — |
| nakalipithecus | **fossil jaw** | ✅ exception | jaw-only taxon; no body/face is scientifically reconstructable; Commons cat + SI checked |
| gorilla | photograph | ✅ | — |
| chimpanzee | photograph | ✅ | — |
| sahelanthropus | facial reconstruction (Gurche) | ✅ | — |
| orrorin | representative early-hominin recon | ✅ | — |
| ardipithecus-kadabba | Ardipithecus facial recon | ✅ | — |
| ardipithecus-ramidus | facial reconstruction (Gurche) | ✅ | — |
| au-anamensis | representative early-hominin recon | ✅ | — |
| au-afarensis | full-body life model | ✅ | — |
| au-africanus | face reconstruction | ✅ | — |
| paranthropus-boisei | life reconstruction | ✅ | — |
| homo-habilis | forensic face reconstruction | ✅ | — |
| homo-erectus | full-body life reconstruction | ✅ | — |
| homo-naledi | face reconstruction | ✅ | — |
| homo-floresiensis | facial reconstruction | ✅ | — |
| mid-pleistocene-homo | forensic face reconstruction | ✅ | — |
| neanderthalensis | full-body life reconstruction | ✅ | — |
| denisovans | **fossil jaw** | ✅ exception | known from DNA/fragments; only life recon (Harel) is copyrighted; Commons cat = 0, SI = none |
| homo-sapiens | photograph | ✅ | — |

Result: 18/20 reconstructions or photos; 2 fossils, both with logged exhaustion. PASS.

## E. Tone & honesty
- [ ] Best evidence → best image → presented plainly as the best current reconstruction.
- [ ] Candidate vs supported relationships still visually distinguished; not over-hedged.

## F. Build health
- [ ] `npm run build` succeeds and `npm run lint` passes.
- [ ] No broken images / missing data references at runtime.

## Draft curated backbone (curate-and-review; subject to research)
Spine + siblings + anchors (final set finalized during research):
Ekembo/Proconsul (early ape) → [Gorilla anchor] → [Chimp anchor] → Sahelanthropus →
Orrorin → Ardipithecus ramidus → Au. anamensis → Au. afarensis → Au. africanus →
Paranthropus boisei (sibling) → Homo habilis → Homo erectus → Homo heidelbergensis /
Middle Pleistocene → Homo neanderthalensis (sibling) → Denisovans (sibling) →
Homo floresiensis (sibling) → Homo naledi (sibling) → Homo sapiens.
