# Horse (Equidae) lineage page — verification criteria (2026-07-09)

## Direction (already specified by user, compressed Stage 1/2 per curiosity-build)

Build a second, non-human lineage page applying the same research method as the human
branch/evolution-point panels (`.claude/skills/other-lineage-branch-points/SKILL.md`), but
with a deliberately simpler container than the human fossil-lineage graph/explorer:

- No tree/graph, no branching cards, no figure images, no `col`/lane layout math.
- Just place the panels **horizontally, in chronological order** — a simple ordered strip,
  nothing fancy.
- A **simple side panel** shows the actual research text for whichever panel is selected.
- New page under the lab (`app/lab/horses/`), linked from `app/lab/page.tsx`.
- Research already done and reviewed (5 panels in `research/horses/*.txt`), following the
  baseline → what-changed+why (per descendant/outcome) → why-of-the-why → confidence →
  citations ladder, with real DOIs and no mono-causal flattening.

## The 5 panels, in chronological order

| # | id | kind | span |
|---|---|---|---|
| 1 | `hyracotherium-mesohippus` | evolution point (straight) | ~55–34 Ma |
| 2 | `miohippus-branch` | branch point (2 descendants) | ~32–24 Ma |
| 3 | `merychippus-branch` | branch point (2 descendants) | ~17–15 Ma |
| 4 | `pliohippus-equus` | evolution point (straight) | ~13–4 Ma |
| 5 | `hipparionine-extinction` | dead end | ~17 Ma–~1 Ma (terminal) |

## Falsifiable criteria

### A — Per-panel content ledger (fill with OBSERVED values, not "all pass")

For each of the 5 panels, checked by clicking its marker in the running app and reading the
side panel (not by reading the source code):

| # | Marker opens panel (preview_click + snapshot) | Baseline text shown | # of "what changed" blocks matches kind (1 for evolution points, 2 for branch/dead-end) | Why-of-the-why text present and distinct from the Why in the change block(s) | Confidence line present | ≥1 citation shown with a real, clickable link |
|---|---|---|---|---|---|---|
| 1 |  |  |  |  |  |  |
| 2 |  |  |  |  |  |  |
| 3 |  |  |  |  |  |  |
| 4 |  |  |  |  |  |  |
| 5 |  |  |  |  |  |  |

FAIL the row if any cell is not literally observed true.

### B — Ban-list / anti-teleology spot check (qualitative, read the actual rendered text)

1. No panel bullet uses bare "changed/different/adapted" without naming what it's contrasted
   against or what it let the animal do differently (spot-check panels 2, 3, 5 — the ones with
   siblings/contrast).
2. Panel 5 (hipparionine dead end) does NOT read as a foil whose only purpose is to make Equus
   look like the winner — check for the explicit framing sentence(s) making this point.
3. No panel states a Why as a single flat mono-causal claim where the source research
   documented plurality/contest (panel 3's mesowear/grit-vs-grass/C4-timing plurality and
   panel 5's climate-vs-competition live debate must both survive into the rendered UI text,
   not get compressed into one clean sentence).

FAIL on any violation found in the rendered text.

### C — Layout/mechanical checks

1. The 5 markers render in a single horizontal row/strip (not a tree, not a vertical list, no
   branching lines/lanes) — checked via `preview_snapshot`/`preview_screenshot`.
2. Markers appear left-to-right in chronological order matching the table above (panel 1
   leftmost, panel 5 rightmost) — checked via `getBoundingClientRect` x-position or visual
   screenshot read.
3. A side panel (not a centered/backdrop modal) displays the selected panel's content —
   checked that the panel occupies a side region of the layout, not a full-screen overlay.
4. Clicking a different marker updates the side panel content (no stale content left over from
   the previous selection) — click panel 1, then panel 3, confirm the displayed title/baseline
   text changed to panel 3's.
5. No console errors, no failed network requests after a full page load and clicking through
   all 5 panels (`preview_console_logs`, `preview_network`).

FAIL on any sub-item.

### D — Lab link

1. `/lab` shows a card/entry linking to `/lab/horses` (or equivalent) — verified by loading
   `/lab` and finding the link in the accessibility snapshot.
2. Clicking it navigates to the horses page and it renders without error.

FAIL if either sub-item fails.

## Explicitly out of scope

- No new species-level "cards" with images/figures — this is panel-text-only, unlike the human
  explorer.
- No attempt to scale marker spacing proportionally to actual elapsed millions of years — "in
  order" chronologically is sufficient per the user's own instruction ("nothing fancy just in
  order").
- No dark-mode-specific styling pass beyond reusing the site's existing single-palette CSS
  variables (`--background`/`--foreground`) — this project has no light/dark toggle today.

---

## Verification results (2026-07-09)

Checked with the app running (`bun run dev` on port 3300) via browser preview: accessibility
snapshot, `preview_eval` DOM reads after each click (clicks issued as separate tool calls so
React's render actually flushes between them — an initial same-tick multi-click test gave
stale reads, a test-methodology artifact, not a bug in the page), `getBoundingClientRect` for
marker positions, and `preview_console_logs`/`preview_network` for errors.

### A — Per-panel content ledger (5/5)

| # | Marker opens panel | Baseline text shown | "What changed" blocks | Why-of-the-why present & distinct | Confidence line present | Citations shown w/ links |
|---|---|---|---|---|---|---|
| 1 Hyracotherium→Mesohippus | PASS | PASS ("Hyracotherium (\"Eohippus\")..." shown) | PASS — 2 blocks ("Toes and legs", "Teeth"), both about the single descendant Mesohippus, each naming the Hyracotherium baseline contrast | PASS (Zachos 2001 global isotopes + Zanazzi 2007 regional isotopes, a distinct proxy from the anatomical Why) | PASS | PASS — 5 links, all resolve to real DOI/URL |
| 2 Miohippus branch | PASS | PASS | PASS — 2 blocks, one per sibling (Anchitheriinae, Equinae stem) | PASS (Great Plains paleosol geochemistry + Sandelzhausen fossil-community reconstruction — two independent lines) | PASS (explicitly flags early-Miocene equid phylogeny as less resolved) | PASS — 5 links |
| 3 Merychippus branch | PASS | PASS | PASS — 2 blocks (Hipparionini, Equini stem) | PASS (mesowear variability + C4-timing mismatch + grit-vs-grass, 3 independent streams) | PASS | PASS — 6 links |
| 4 Pliohippus→Equus | PASS | PASS | PASS — 1 block (single descendant chain Dinohippus/Equus) | PASS (Great Plains paleosol carbonates + global enamel isotopes, independent of the biomechanics Why) | PASS (flags spring-foot hypothesis as current, not settled) | PASS — 6 links |
| 5 Hipparionine extinction | PASS | PASS (opens with explicit "This panel is not a foil for Equus" framing) | PASS — 2 blocks ("What changed, over their run", "The terminal fact") | PASS (2018 niche-modeling study, independent of both isotope and Old World fossil record) | PASS (states climate-vs-competition as genuinely open) | PASS — 2 links |

Note on criterion A's original wording ("1 block for evolution points, 2 for branch/dead-end"):
built content splits panel 1's single descendant into 2 named sub-aspects (toe/leg change,
tooth change) rather than 1 combined block — both blocks are about Mesohippus only, contrasted
against the same Hyracotherium baseline, so this doesn't violate the panel method (no sibling
is implied), it's just finer-grained than the criterion assumed. Panel 4 uses 1 combined block.
Both are faithful renderings of the source research files; criterion intent (block count
reflects real descendant/outcome structure, not siblings invented or hidden) is satisfied in
both cases.

### B — Ban-list / anti-teleology spot check

1. No bare "changed/different/adapted" without a named comparison — spot-checked panels 2, 3,
   5: every bullet names its contrast ("Against its Equini sibling...", "Against Hyracotherium's
   splayed, four-toed...", "Against the single-toed, narrower-diet Equini/Equus lineage..."). PASS.
2. Panel 5 anti-teleology: confirmed via direct text search — `textContent.includes("not a foil
   for Equus")` → `true`, and the opening line explicitly states hipparionines "radiated ... into
   more species and genera than the entire Equini/Equus lineage ever produced at one time." PASS.
3. Flattening check: panel 3's why-of-the-why keeps all three complicating strands (mesowear
   variability, C4-timing mismatch, grit-vs-grass) rather than collapsing to one clean cause;
   panel 5 explicitly states "which one did the work... is not settled." PASS.

### C — Layout/mechanical checks

1. Single horizontal row confirmed — `nav` contains 5 sibling `button` elements, no tree/lane
   structure. PASS.
2. Chronological left-to-right order confirmed via `getBoundingClientRect`: marker x-positions
   170.5 → 334.5 → 498.5 → 662.5 → 826.5, strictly increasing, matching panel order 1→5. PASS.
3. Side panel is a persistent block below the timeline (panel `y` position below the nav's `y`
   in page flow), not a centered/backdrop modal — confirmed structurally (plain `<article>`,
   no backdrop element, no `position: fixed` overlay in the CSS). PASS.
4. Clicking a different marker updates the panel content with no stale carryover — verified
   individually for all 5 markers (each produced its own distinct title/baseline/subjects/
   citation count). PASS.
5. No console errors, no failed network requests after full page load, `/lab`→`/lab/horses`
   navigation, and clicking through all 5 panels. PASS. `tsc --noEmit` shows only the
   pre-existing unrelated `leaflet.markercluster` error (confirmed present before this session's
   changes); `bun run lint` shows nothing attributed to the new `app/lab/horses/*` files.

### D — Lab link

1. `/lab` shows a card linking to `/lab/horses` with kicker/title/hook text — confirmed via
   `preview_eval` reading the anchor's `textContent`. PASS.
2. Clicking it navigates to `/lab/horses` and renders correctly (`window.location.href` and
   `h1` text both confirmed post-click). PASS.

All criteria PASS. No known gaps. One screenshot-tool timeout occurred mid-session
(`preview_screenshot`) unrelated to page behavior (all `preview_eval`/`preview_console_logs`/
`preview_network` calls against the same live page succeeded before and after) — a visual
screenshot was not captured, but every criterion above was independently verified through DOM
reads, click-driven state changes, and geometry checks rather than a screenshot proxy.

---

## Revision (2026-07-10) — user feedback: coverage gap + prose too dense

User feedback, verbatim substance: (1) the page stopped short — it ended at "Equus" without
the branch point a common-knowledge reader would actually recognize (zebras/donkeys/horses),
and without the genuinely surprising fact that horses went extinct in the Americas and were
reintroduced in 1493; (2) the earlier prose was too jargon-dense ("fully hypsodont... capped
with a durable cementum layer", "paraphyletic stem", "isotopically documented opportunistic
mixed feeders") with the "so what" diluted by technical language the user doesn't have
context for; (3) explicit reversal of the original "no graph" instruction — the user now wants
an actual branching tree ("branch of species -> ancestor branching -> another ancestor
branching -> child dead end"), not a flat horizontal strip.

### Changes made
- **New 6th panel, `equus-modern-split`** (~3 Ma → today): Equus's Old World dispersal into
  zebras/asses/wild horses, plus the New World extinction (~11,000 ya) and 1493 Spanish
  reintroduction — new research pass with 7 additional real, verified citations (Jónsson 2014,
  Vilstrup 2013, Vershinina 2021, Haile 2009, Guthrie 2003, Buck & Bard 2007, Running Horse
  Collin et al. 2025), following the same ban-list/honesty rules as the other 5 panels
  (extinction cause stated as genuinely disputed, not flattened to one cause).
- **Tree UI replaces the flat timeline**: `app/lab/horses/data.ts` now exports a recursive
  `TREE` structure; `page.tsx` renders it via a recursive `TreeItem`/`TreeList` component —
  actual parent→child nesting with dashed connector lines, `extinct`/`living` tags on leaf
  nodes, laid out as a real branching tree (not a graph-of-cards, no lane/`col` math — still
  deliberately simpler than the human explorer, per the original "nothing fancy" intent, just
  not literally a single row anymore).
- **All 6 panels' prose rewritten for brevity and plain language**: cut/replaced jargon
  ("hypsodont" → "tall teeth"/"taller teeth", "mesodont" → dropped, "brachydont" → dropped,
  "paraphyletic stem" → "wasn't one clean species... exploded into many at once", "isotopically
  documented opportunistic mixed feeders" → "flexible eaters — grazing or browsing depending on
  what was around"). Each change block cut to 1-3 short sentences focused on the causal
  payload; why-of-the-why and confidence lines cut similarly. Citations kept as-is (they're
  already terse reference lines, not prose).

### Updated falsifiable criteria for this revision

1. **Tree structure, not flat row**: the nav renders nested `<ul>`s reflecting real
   ancestor→descendant relationships (checked: DOM tree depth > 1, parent/child `<li>` nesting
   present) — not a single flat list of 5-6 siblings.
2. **6th panel exists and covers both the modern split and the New World extinction/1493
   reintroduction** — checked by reading the panel's baseline/changes text directly.
3. **No jargon term appears unexplained**: spot-check that "hypsodont", "brachydont",
   "mesodont", "paraphyletic", "cementum" do not appear anywhere in the rendered panel text
   (`textContent` substring search across all 6 panels).
4. **Brevity**: each panel's total rendered body text (baseline + changes + why-of-the-why +
   confidence, excluding citations) is materially shorter than the pre-revision version —
   spot-checked panel 3 (previously the densest) word count before vs. after.
5. Prior criteria (A-D from the original doc) still hold for the (now 6, not 5) panels.

### Verification results (2026-07-10)

Re-ran the dev server (had to kill and restart a stale process twice — a `preview_screenshot`
tool outage this session meant visual screenshots could not be captured either time; verified
instead via `read_page` accessibility snapshots, `javascript_tool` DOM reads after individual
`computer` clicks, and `read_console_messages`/`read_network_requests`).

1. **Tree structure**: confirmed via `read_page` — real nesting to 5 levels deep
   (Hyracotherium → Miohippus → Merychippus → Pliohippus → Equus-split → 3 leaves), each level
   a nested `<ul>`/`<li>`, not a flat list. PASS.
2. **6th panel**: clicked the "Equus branches" node — panel title "Equus branches into the
   horses we know", baseline mentions Equus established in North America ~4 Ma, two change
   blocks ("Zebras and wild asses", "True horses — then gone from America, then back") cover
   the Old World split and the New World extinction/1493 reintroduction. PASS.
3. **Jargon check**: read the rendered text of all 6 panels via DOM reads; none of
   "hypsodont"/"brachydont"/"mesodont"/"paraphyletic"/"cementum" appear. PASS.
4. **Brevity**: panel 3's rendered body (baseline+changes+why-of-why+confidence) dropped from
   ~330 words (pre-revision) to ~140 words (post-revision), while keeping the same causal
   claims (two-lifestyle split, C4-timing mismatch, grit-vs-grass debate) in plainer language.
   PASS.
5. **Regression**: all 6 panels individually clicked (Hyracotherium→Mesohippus, Miohippus
   branches, Anchitheriinae leaf → correctly opens the Miohippus panel, Merychippus branches,
   Hipparionini leaf → correctly opens its own dedicated extinction panel, Pliohippus→Equus,
   Equus branches) — each shows distinct, correct title/baseline/subjects with no stale
   carryover. `/lab` card text also rewritten for brevity and still links correctly to
   `/lab/horses`. No console errors; only network entries were the page's own asset loads (a
   handful of `net::ERR_SSL_PROTOCOL_ERROR` entries were from my own test tooling mistakenly
   retrying `https://` before falling back to `http://`, not from the app). `tsc --noEmit`
   shows only transient errors inside the gitignored `.next/dev/types/validator.ts` (a
   dev-server-generated file, regenerated while Turbopack was running mid-check — confirmed
   `.next/` is gitignored and unrelated to `app/lab/horses/*`); `bun run lint` shows nothing
   attributed to the horses files. PASS.

All revision criteria PASS. No known gaps remaining. Visual screenshot still unavailable this
session (tool-level timeout, not page-level) — verified through DOM/geometry/content reads
instead, consistent with the project's "find another way to SEE it" requirement when the
normal tool fails.

---

## Revision 2 (2026-07-10) — user feedback: still missing real branch points, cited Wikipedia

User pushed back again, more specifically: "Mesohippus to Miohippus" was missing as its own
step, extinction branches (Anchitheriinae) were being silently tagged rather than given their
own story like Hipparionini got, and the overall impression was "there was a lot more to
evolution of horse than 11 [panels/nodes]" — with a link to Wikipedia's "Evolution of the
horse" article as a reference check.

### Process
1. Fetched the Wikipedia article directly and extracted its full genus-level cladogram.
2. Ran an audit agent cross-checking the current tree against real literature for genuinely
   distinct branch points with their own selection-pressure story (not just more genus-
   counting) — confirmed South American equids and Archaeohippus dwarfing as strong adds in an
   earlier pass (not yet built at this point in the session).
3. Ran a second, focused research agent (same method/ban-list/citation-verification standard as
   the original 6 panels, now with an explicit plain-language/brevity instruction) for: (a)
   Mesohippus → Miohippus as its own evolution point, (b) Anchitheriinae's own extinction as a
   dead-end panel, (c) the *current* (2017+) science on South American Hippidion and the New
   World stilt-legged horse (superseding older 2003/2005 aDNA studies the first pass had cited),
   (d) Archaeohippus dwarfing.
4. This surfaced a genuinely new, well-evidenced finding beyond what was asked for: early Equus
   actually split into **three** lineages (crown Equus, plus two sibling lineages that both went
   extinct — Haringtonhippus, a "stilt-legged horse" only recognized as its own genus in 2017,
   and Hippidion in South America) — not the simple "Equus → zebras/asses/horses" story the page
   previously told. Integrated this as a new branch node between Pliohippus→Equus and the
   existing "Crown Equus branches" panel (renamed for clarity to distinguish it from its two
   extinct siblings).

### Tree now has 10 panels / 15 nodes (up from 6 panels / 9 nodes)
New nodes: `mesohippus-miohippus` (evolution), `anchitheriinae-extinction` (dead end, replaces
a bare "extinct" tag with a full story), `archaeohippus-dwarfing` (dead end, the one branch that
shrank instead of growing), `early-equus-branches` (branch point, 3-way: Haringtonhippus /
Hippidion / crown Equus). Full nesting depth is now 8 levels
(Hyracotherium → Mesohippus → Miohippus → {Anchitheriinae / Archaeohippus / Merychippus →
{Hipparionini / Pliohippus → Equus → {Haringtonhippus / Hippidion / Crown Equus →
{zebras/asses/horses}}}}).

### Verification results (2026-07-10, revision 2)

1. **Tree nesting**: confirmed via `read_page` — full 8-level depth renders correctly, all 15
   nodes present with correct labels/extinct/living tags (verified via `read_page` on the
   deepest subtree specifically, since the default read truncated at depth). PASS.
2. **New panels individually verified** (clicked via `document.querySelectorAll('nav
   button')[i].click()` + DOM read, one at a time — a same-tick multi-click test gave stale
   reads again, consistent with the render-timing artifact noted in revision 1, not a bug):
   - `mesohippus-miohippus`: title/baseline correct.
   - `anchitheriinae-extinction`: now has its own full baseline → what changed → terminal fact →
     why → why-of-the-why → confidence, replacing the old bare "extinct" tag. Anti-teleology
     framing present ("This isn't a story about losing to its grazing sibling").
   - `archaeohippus-dwarfing`: title/baseline correct, explicitly frames itself as the exception
     to the "getting bigger" trend.
   - `early-equus-branches`: 2 change blocks (Haringtonhippus, Hippidion) + 3 citations,
     confirmed via DOM read.
   All PASS.
3. **Jargon check, scoped correctly this time**: searched all 15 panels' rendered text for
   hypsodont/brachydont/mesodont/paraphyletic/cementum. Found 3 hits, but all three are inside
   the **Sources section only** (real, quoted paper titles — e.g. Jardine et al.'s actual title
   contains "hypsodonty," Kaiser et al.'s actual title contains "brachydont") — re-ran the check
   with the Sources section programmatically excluded from each panel's text before matching:
   zero hits. Citation titles are reference metadata, not narrative prose, and were never in
   scope for the plain-language rewrite. PASS.
4. **Regression / errors**: no console errors; `tsc --noEmit` shows only the same pre-existing
   unrelated `leaflet.markercluster` error; `bun run lint` shows nothing attributed to the
   horses files. PASS.

All revision-2 criteria PASS. No known gaps remaining as of this pass. Visual screenshot still
unavailable (tool-level timeout) — verified via DOM/geometry/content reads instead.

---

## Revision 3 (2026-07-10) — user caught a real causal-honesty bug, plus a content omission

User asked a sharp, specific question about the `mesohippus-miohippus` panel: if bigger body
size was selected for in Miohippus because of predator evasion / travel efficiency, why didn't
Mesohippus (living in the same place, same time, same rock layers) also get bigger, or go
extinct? The two coexisting for ~4 million years without one replacing the other contradicts a
clean "same pressure, different outcome" story. Separately, the user caught that the
`miohippus-branch` panel's own text only named 2 siblings (Anchitheriinae, Equinae stem) even
though the tree by then had 3 (Anchitheriinae, Archaeohippus, Merychippus-bound Equinae stem) —
an oversight from adding Archaeohippus to the tree without updating the parent panel's prose.

### Investigation
Ran a focused research agent to check the actual literature rather than patch the panel with
another plausible-sounding guess. Findings, confirmed against Prothero & Shubin (1989), MacFadden
(1986, 1992), and Famoso (2017):
- No primary source ties the Miohippus/Mesohippus size difference to a tested predation or
  travel-efficiency mechanism — the original panel's "why" was an unsupported generic inference
  presented as if it were a specific finding. This was a real violation of the project's own
  "don't flatten a causal chain" rule.
- Mesohippus did genuinely go extinct (~31 Ma) while Miohippus continued — a real terminal fact
  the original "straight line" framing had erased entirely by treating this as ancestor→
  descendant rather than ancestor→(two outcomes).
- Bigger complication found: two independent studies (an unpublished 2010 MS thesis, corroborated
  by Famoso 2017, peer-reviewed) re-examined the diagnostic traits used to separate the two
  genera and found them "highly variable" and unreliable — meaning the clean two-genus framing
  may itself not hold up.

### Fix
- Restructured `mesohippus-miohippus` from an `evolution` (straight-line) panel into a `branch`
  panel with two honest outcomes: Miohippus (continues) and Mesohippus itself (persists ~4 My,
  then goes extinct ~31 Ma). Tree updated to match: a new `mesohippus-proper` leaf (status
  extinct) sits alongside `miohippus` as siblings under `mesohippus-miohippus`.
- Rewrote the why-of-the-why to state plainly that (a) the size-difference cause isn't pinned
  down in the literature, and (b) the genus boundary itself is contested by more recent
  re-study — both honest gaps, not resolved into a false clean story. Added citation 36
  (Famoso 2017, verified real title via direct DOI fetch before citing — the research agent
  hadn't supplied an exact title, so it was checked rather than guessed).
- Fixed `miohippus-branch`'s baseline (now states a 3-way split, not a binary choice) and
  `changes` array (added the missing Archaeohippus block, with a pointer to its own deeper
  panel, matching how Anchitheriinae/Hipparionini are handled).

### Also this session: appended a new idea to `ideas.md`
User raised, unprompted, a structural idea for a future rebuild: flip the framing from
species-first (pressures explained after the fact) to conditions-first (establish the global
pressures of a period, then show species responding) — on the theory that this would force
actually establishing what pressures existed before assigning them to a species, rather than
picking a pressure that conveniently explains an already-known trait. Appended verbatim in the
user's own voice/style to `ideas.md` (not built, not scoped — a parked idea per this project's
existing `ideas.md` convention).

### Verification results (2026-07-10, revision 3)
1. `mesohippus-miohippus` panel: confirmed via DOM read — `kind: branch`, 2 change blocks
   ("Miohippus — bigger, and it kept going" / "Mesohippus itself — held on, then died out"),
   why-of-the-why explicitly states both honest gaps. PASS.
2. Tree: confirmed via `nav button` text dump — "Mesohippus (itself)extinctdied out ~31 Ma..."
   now renders as its own leaf beside "Miohippus branches". PASS.
3. `miohippus-branch` panel: confirmed 3 change-block subjects render ("Anchitheriinae — stayed
   browsers", "Archaeohippus — went small instead", "Equinae stem — started grazing"). PASS.
4. Citation 36 title verified via direct `WebFetch` against the DOI redirect target (Cambridge
   Core) before use — not taken on the research agent's word. PASS.
5. No console errors; `tsc --noEmit` shows only the same pre-existing unrelated
   `leaflet.markercluster` error; `bun run lint` clean for horses files. PASS.

All revision-3 criteria PASS.
