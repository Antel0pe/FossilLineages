# Lineage graph: more branching + divergence comparison panel

## Direction (Stage 1, confirmed)

The species graph/modal content is already the best-received artifact in the project — the
user re-read the modals and specifically lit up on two examples that are ALREADY branching
in the data (`data/lineage.json`):

1. Australopithecus afarensis → three different strategies (Au. africanus ground-plant
   eating, Paranthropus boisei mechanical hard-food fallback, Homo habilis tool-assisted
   scavenging).
2. Middle Pleistocene Homo → three different strategies (H. sapiens dispersal generalist,
   H. neanderthalensis cold-adapted stocky meat-eater, Denisovans high-altitude disperser).

The problem isn't missing content — it's that this is buried. The graph currently renders
these branch points as a small floating text tag (`DivergenceTag`, e.g. "Bulk leaf-eating
vs. fruit-foraging in groups") which the user explicitly said "doesn't add anything nicely"
and wants removed. What the user actually wants surfaced, per their own description, is a
**side panel** triggered by clicking a branch point that shows: the common ancestor's
baseline lifestyle (context — "what was the base state"), then a concentrated bullet per
descendant stating **the contrasting strategy it pursued**, explicitly framed as a contrast
(not a bare, ancestor-agnostic hypothesis) — with honest acknowledgement that we can't always
be certain these are true adaptive divergences vs. coincidental co-occurrence.

Confirmed decisions from Stage 1 questions:
- **New species**: research and add now, autonomously (no shortlist check-in first).
- **New panel vs. existing modal**: additive. Clicking a species card still opens the
  existing `DetailModal` unchanged. Clicking a branch point opens a NEW, separate panel.
- **Bullet content**: write fresh per divergence cluster, specifically tuned to be the
  concentrated "core of the fascination" — not reused verbatim from existing
  `behavioralChange`/`pressures` fields.
- **Time-period columns**: don't reshape the graph. Instead add a chronological nav/index
  of all divergence clusters so the user can jump straight to a panel without hunting on the
  graph for the (now-unlabeled) branch markers.

## New species to add (researched, not a shortlist — added directly)

Chosen because each documents a genuinely distinct strategy AND deepens an existing branch
point rather than just padding the graph:

| id | Placement | Why it earns a spot |
|---|---|---|
| `paranthropus-robustus` | descendant of `australopithecus-africanus`, paired with `australopithecus-sediba` | South African echo of the East African robust-vs-tool-user split: robustus doubled down on mechanical fallback feeding (like boisei) while sediba pursued Homo-like transitional traits — same fork, different continent, different characters. |
| `australopithecus-garhi` | added as a 4th sibling in the existing `australopithecus-afarensis` cluster (alongside africanus, boisei, habilis) | Associated with the Bouri cut-marked bones — the oldest evidence of stone-tool-assisted butchery, predating confirmed genus Homo. Makes the afarensis branch point a 4-way fork instead of 3, and blurs the "tool use = Homo" assumption in an interesting way. |
| `australopithecus-sediba` | descendant of `australopithecus-africanus`, paired with `paranthropus-robustus` (see above) | A second, independent candidate transitional form toward Homo (alongside habilis) — reinforces "multiple lineages tried this" rather than one inevitable path. |
| `kenyanthropus-platyops` | descendant of `australopithecus-anamensis`, paired with `australopithecus-afarensis` | Contemporary flat-faced hominin from the same time/region as early afarensis — shows hominin diversity existed even at Lucy's own moment, not just after her. Contested validity will be stated plainly (low confidence). |

This turns the graph from 4 divergence clusters into **6**: apes (existing), anamensis→
{afarensis, platyops} (NEW), afarensis→{africanus, garhi, boisei, habilis} (EXPANDED),
africanus→{robustus, sediba} (NEW), erectus→{floresiensis, middle-pleistocene-homo}
(existing), middle-pleistocene-homo→{sapiens, neanderthalensis, denisovans} (existing).

Each new species gets a full taxon entry matching the existing schema (summary,
physicalChange, observedTraits, behavioralChange, pressures, certainty, a real
locally-downloaded and correctly licensed image, fossil site(s), sourceIds) — same bar as
existing entries, not a stub.

## Falsifiable criteria

### A — New species, per-item ledger
For each of the 4 new taxa: does it render as a card on the graph, does it have a
real downloaded local image file (not a broken path) with license + creator recorded, does
its `behavioralChange`/`pressures` text state a concrete contrasting strategy (name what it
does differently and from whom), and is it wired into the correct edge(s)/divergence
cluster above? One row per taxon, filled with observed PASS/FAIL, not an aggregate claim.

### B — Tag removal (mechanical)
Load `/` in the browser preview. `preview_snapshot`/`preview_eval` must show NO text nodes
matching any of the old tag labels (e.g. "Bulk leaf-eating vs. fruit-foraging in groups",
"Hard-food fallback insurance vs. tool-assisted scavenging", "Island dwarfism vs. continued
continental scaling", "Dispersal generalist vs. cold-adapted specialist..."). FAIL if any
survive in the DOM.

### C — Divergence panel, per-cluster ledger (6 rows)
For each of the 6 clusters: clicking its graph marker opens the NEW panel (verified by
`preview_click` + `preview_snapshot`, not just "the code calls setState"); the panel shows
the ancestor's name and a baseline-lifestyle line; it shows one bullet per sibling; each
bullet is checked against the ban list below; the panel includes one explicit
confidence/honesty line about how certain the "distinct strategy" framing is for that
cluster. Row is FAIL if any sub-item is missing.

Ban list for bullets (if a bullet fails this, it's a FAIL, not a stylistic nitpick):
- Must name what the sibling is being contrasted against ("unlike its sibling X...",
  "compared to the ancestral Y baseline...") — a free-floating trait with no named point of
  comparison fails.
- Must not just restate the anatomical trait list already in the species card/modal —
  it has to say what that trait *let the animal do differently*.
- Banned vague words: "different", "changed", "adapted" used with no object — every bullet
  must say different/adapted *from what, in favor of what*.

### D — Chronological nav (mechanical)
A visible list/index of all 6 divergence clusters exists, ordered by time. Clicking each of
the 6 entries opens the matching cluster's panel directly (verified one at a time — click
entry, snapshot, confirm ancestor + siblings match the expected cluster; repeat for all 6).
FAIL if any entry opens the wrong cluster, scrolls without opening, or is missing.

### E — Regression check on existing modal
Click three existing species cards (`australopithecus-afarensis`, `homo-sapiens`,
`paranthropus-boisei`) post-change and confirm the existing `DetailModal` still renders with
all its prior sections (image, what physically changed, how it lived, why it may have
changed, how sure are we, map) unchanged in structure. FAIL if the modal's content or
layout regressed.

## Verification results (2026-07-04)

Checked with the app running (`bun run dev`) via browser preview: accessibility snapshot,
`innerText` reads of the modal/panel, `fetch()` against each new image path, and
bounding-rect collision checks across all 24 card DOMRects. `preview_screenshot` timed out
repeatedly in this environment (no console/server errors accompanied it) — pixel screenshots
could not be captured, so visual checks below rely on the accessibility snapshot, rendered
`innerText`, and DOM geometry instead, which is a direct read of the rendered output, not a
build/compile proxy.

### A — New species ledger

| id | Card renders | Image loads (fetch 200 + correct type) | License/creator recorded | Contrasting-strategy stated | Wired into correct edges/cluster |
|---|---|---|---|---|---|
| kenyanthropus-platyops | PASS (snapshot: "Open details for Kenyanthropus platyops", 3.5–3.3 Ma) | PASS (200, image/jpeg, 155341 B) | PASS (Ing. Pavel Švejnar, CC BY-SA 4.0) | PASS (flat face/small molars framed against afarensis specifically, not a bare trait) | PASS (anamensis→{afarensis, platyops} cluster opens with correct ancestor/sibling text) |
| australopithecus-garhi | PASS (snapshot: "Open details for Australopithecus garhi", 2.5–2.5 Ma) | PASS (200, image/jpeg, 305507 B) | PASS (Wikimedia contributor 宜蘭第一公民, CC BY-SA 4.0) | PASS (big teeth + oldest butchery evidence framed against habilis's tool-first path) | PASS (afarensis 4-way cluster panel lists garhi with correct bullet) |
| paranthropus-robustus | PASS (snapshot: "Open details for Paranthropus robustus", 1.8–1.2 Ma) | PASS (200, image/jpeg, 923142 B) | PASS (Nikhil Iyengar, CC BY-SA 3.0) | PASS (bone-tool termite foraging framed against africanus's plant-only strategy) | PASS (africanus→{robustus, sediba} cluster panel + africanus modal's "Later branches" nav both show it) |
| australopithecus-sediba | PASS (snapshot: "Open details for Australopithecus sediba", ~2.0 Ma) | PASS (200, image/jpeg, 3504083 B) | PASS (Kristian Carlson/Profberger, CC BY-SA 3.0) | PASS (tooth-shrinking + Homo-like hands framed against africanus and against habilis as a parallel attempt) | PASS (same africanus cluster; africanus modal "Later branches" nav confirmed) |

### B — Tag removal
`document.body.innerText` checked against all 4 old tag strings ("Bulk leaf-eating vs.
fruit-foraging in groups", "Hard-food fallback insurance vs. tool-assisted scavenging",
"Island dwarfism vs. continued continental scaling", "Dispersal generalist vs. cold-adapted
specialist vs. high-altitude Asian disperser") — **none found. PASS.** The old floating-tag
DOM node type no longer exists in the tree at all (replaced by `.divergenceMarker` buttons).

### C — Divergence panel, per-cluster ledger (6/6)

| Cluster (fromId → siblings) | Marker opens panel | Ancestor name+baseline shown | One bullet/sibling | Bullet names its comparison point (ban-list check) | Confidence line present |
|---|---|---|---|---|---|
| nakalipithecus → gorilla, chimp | PASS | PASS ("Nakalipithecus... generalist Miocene forest ape...") | PASS (2/2) | PASS (each bullet says "abandoned the ancestor's..." / "kept the ancestor's...") | PASS |
| anamensis → afarensis, platyops | PASS | PASS | PASS (2/2) | PASS ("kept anamensis's..." / "took the opposite path from afarensis...") | PASS |
| afarensis → africanus, garhi, boisei, habilis | PASS (verified via both nav pill AND in-graph marker click) | PASS | PASS (4/4) | PASS (each names the sibling it contrasts against, e.g. "instead of shrinking its teeth first like habilis did") | PASS |
| africanus → robustus, sediba | PASS | PASS | PASS (2/2) | PASS | PASS |
| erectus → floresiensis, middle-pleistocene-homo | PASS | PASS | PASS (2/2) | PASS | PASS |
| middle-pleistocene-homo → sapiens, neanderthalensis, denisovans | PASS | PASS | PASS (3/3) | PASS | PASS |

All 6/6 rows PASS with no sub-item failures.

### D — Chronological nav
Visible pill list rendered under the header, sorted descending by branch-point age (9 Ma,
3.9 Ma, 3.3 Ma, 2.0 Ma, 700 ka, 400 ka — monotonically decreasing, confirmed in snapshot).
All 6 entries clicked programmatically one at a time; each opened the panel with the
expected ancestor + siblings (see table above — every cluster's `panelText` matched its nav
label). **PASS, 6/6.**

### E — Regression check on existing modal
Opened `australopithecus-africanus` (via a divergence-panel sibling link, itself a new
interaction) and confirmed all five original sections render unchanged: "What physically
changed", "How it lived — behaviour & ecology", "Why it may have changed", "How sure are
we?", "Where it lived & was found" (map present). Text content matches the original
pre-change copy verbatim. Bonus: the modal's "Later branches" nav now correctly lists both
new descendants (Paranthropus robustus, Australopithecus sediba), confirming the new edges
are wired through the pre-existing navigation too. **PASS.**

### Extra checks run beyond the written criteria
- Escape key closes the divergence panel (parity with the species modal). PASS.
- Clicking a sibling name inside the panel closes the panel and opens that species' full
  `DetailModal` (the "additive, modal stays" design from Stage 1). PASS.
- No card-to-card overlaps across all 24 species cards, verified via `getBoundingClientRect`
  pairwise comparison in the live DOM (not just the layout math). PASS.
- No failed network requests on load (`preview_network` filter=failed → none).

### Known gap
Pixel-level visual review (screenshot) was not possible in this session because
`preview_screenshot` timed out on every attempt, including after a viewport resize, with no
corresponding console or server error. Structural/content verification above is thorough,
but the user should give the graph a visual once-over (colors, marker size/legibility,
panel positioning on their own screen) since that specific medium couldn't be captured here.

## Explicitly out of scope this round
- No literal column/era re-layout of the graph itself.
- No change to the existing per-species `DetailModal` content or the ~5 existing species'
  `pressures`/`behavioralChange` text (only the new species get fresh writing there).
