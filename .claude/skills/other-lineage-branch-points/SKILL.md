---
name: other-lineage-branch-points
description: General method for researching and filtering evolutionary-lineage content — what to keep, what to cut, how to structure a panel — for ANY lineage (human or otherwise), whether the node branches, runs straight, or dead-ends in extinction. Use before researching a new lineage, writing a new branch/evolution-point panel, or auditing an existing one.
---

# Researching and filtering lineage content — general method

## The unit of content: the lineage panel

Every ancestor node in a lineage graph gets exactly one panel, built the same way regardless
of how many direct descendants it has:

- **1 descendant** — baseline vs. that one descendant.
- **2+ descendants** — baseline vs. each descendant, each descendant also contrasted against
  its siblings.
- **0 descendants, taxon went extinct** — baseline vs. this taxon's own terminal fate (see
  "Dead ends" below).

Use the same method in all three cases: state the baseline, name what changed relative to
it, name the concrete evolutionary reason, then go one layer deeper on that reason. A
straight single-descendant edge gets the same depth of treatment as a multi-way branch — no
known branch does not mean no story.

A panel covers exactly one ancestor and its direct descendants — never more than one
generation. Do not summarize a multi-generation sequence ("taxon A led to B which led to C
which led to D") inside a single bullet or panel; each generation gets its own panel.

## Output format: a plain txt file per panel

Write each panel's research as one plain `.txt` file. No JSON, no code, no schema-fitting —
just the content, in this order:

1. **Baseline** — one or two sentences: the ancestor lineage's relevant state before the
   change.
2. **What changed + Why**, one block per descendant (or, for a dead end, one block for the
   terminal fate) — the concrete trait change and the concrete selection pressure that
   plausibly drove it, named against the baseline (and against siblings, if there are any).
3. **Why-of-the-why** — the deeper causal layer, wherever a real one exists: why the pressure
   in #2 existed, intensified, or took that form at that time.
4. **Confidence line** — how certain this reasoning is, and why.
5. **Citations** — a plain numbered list of real sources (title, author/organization if
   known, a real URL or DOI), each tagged with which claim above it backs up. Every
   why-of-the-why claim and every non-obvious factual claim needs one; don't cite things that
   are common knowledge.

Nothing here needs to match any particular data shape — write it so a human (or a later pass)
can read straight through it and lift out exactly these five things.

## What → Why → Why-of-the-why (the depth ladder)

Write every panel bullet by answering three questions, in this order:

1. **What changed** — the observed, concrete trait-level fact: got bigger, shrank teeth, lost
   a toe bone, shifted diet, went extinct. Anatomy is evidence for this layer, not the payload
   itself.
2. **Why** — the concrete evolutionary/selection pressure that plausibly drove the change,
   stated as an actual mechanism: predation pressure and being harder to kill, competition for
   a shrinking food source, a new physical barrier, a climate shift closing off a habitat.
   Name a real pressure — an outcome restated as if it were a cause does not count (e.g. "it
   changed because it needed to adapt" names nothing).
3. **Why-of-the-why** (the `additionalContext` field) — one layer deeper than #2: why did
   that pressure exist, intensify, or arrive in that particular form, at that particular
   time? If #2 is "predators became a bigger threat, so size became a defense," #3 asks why
   predators became more of a threat right then — did a competing/buffering prey species
   disappear, did a climate shift push predator and prey into the same shrinking range, did a
   new predator arrive from elsewhere? Draw #3 from a different evidence stream than #2
   (paleoclimate proxies, habitat/faunal reconstruction, isotopes, another species' fossil
   record from the same layer) — it must be a genuine second causal link, not a rewording of
   #2.

**The filter for `additionalContext` is narrow: does this fact answer why the stated
pressure itself happened?** That is the only test — not whether the fact adds doubt,
nuance, or complication. Some good why-of-the-why facts turn out to reveal a genuine dispute
or messier reality (e.g. two siblings with near-identical jaw anatomy whose isotope data
shows very different actual diets); when the honest evidence is like that, say so. But plenty
of good why-of-the-why facts are perfectly clean — a paleoclimate proxy that plainly explains
why a predator's range shifted needs no manufactured complication to qualify. Do not add
uncertainty that the evidence doesn't support, and do not skip this layer — depth here always
means "does this answer the why of the why," never "restate #2 in more words."

A fourth layer — **How** (the genetic/developmental mechanism) — is deliberately secondary
and mostly folds into "What" (e.g. "teeth thickened" belongs in What, not a separate How
bullet). Spend research effort on Why depth, not mechanism depth.

## Comparison is the engine — name the selection pressure

Listing several taxa in chronological order ("taxon A did X, then B did Y, then C did Z")
does not produce a causal explanation even when every fact is true and sourced — it's a
timeline, not a "why." The move that produces an actual causal account is comparing two
related lineages that faced different (or the same) pressures and asking: what pressure, how
did it concretely produce the observed change, and why did that pressure apply to this
lineage, at this time, in this form? Check every bullet in a multi-descendant panel against:
- What selection pressure is this bullet naming?
- How did that pressure concretely produce the observed change — not merely correlate with
  it?
- Why did that pressure apply to *this* lineage, at *this* time, in *this* form — as opposed
  to a sibling that faced something different, or nothing?

For siblings under one ancestor, the highest-value move is contrasting what pressure each one
experienced differently, not just what trait each one ended up with: same starting point,
different pressures, different outcomes.

## Dead ends: extinct taxa with no descendants get a panel too

A taxon with zero surviving lineages is a valid outcome of a selection-pressure story, not a
gap in the graph — build its panel the same way:

- **Baseline**: the lineage state that produced this taxon.
- **What changed**: any trait(s) this taxon evolved before its line ended, plus its terminal
  fact — extinction.
- **Why**: the concrete pressure that plausibly drove the extinction — preyed to
  unsustainable levels by a named threat, out-competed for a shrinking resource by a named
  rival lineage, a habitat/range collapse from a climate shift, a bottleneck event. Name an
  actual mechanism; "it went extinct" alone is not a Why.
- **Why-of-the-why**: one layer deeper on that specific extinction pressure, from the same
  broader-evidence categories as any other panel (paleoclimate proxies, a competitor's
  fossil-abundance trend, habitat reconstruction). Extinction-cause attribution is frequently
  genuinely contested in the literature (climate vs. competition vs. overkill debates are
  common) — when that's the real state of the evidence, state it as a live specialist debate
  rather than asserting one cause as settled; still include the layer.
- **Confidence line**: address whether the stated extinction cause itself is well-supported
  or one hypothesis among several live ones — a distinct question from whether the taxon's
  existence/dating is well-supported.

When siblings under one ancestor have different fates — some persisting, some dead-ending —
write that contrast directly: same starting point, different pressures, one line continues
and one doesn't. Do not write the extinct sibling's story as a foil that only exists to make
the surviving sibling look better (see teleology rule below) — its own causal chain stands on
its own.

## No lineage gets framed as "the winner"

Don't frame any lineage's still-living member as the outcome the whole tree was building
toward. If the lineage is horses, Equus surviving is not the point the other ~90% of the
radiation existed to set up. If whales, neither toothed nor baleen whales are the "better"
branch. Every branch's fate — persisted or extinct — is its own outcome to explain on its own
causal terms, not a stepping stone toward whichever branch happens to still be around.

## Ban list for any bullet (mechanical — fails if any of these hold)

- Doesn't name what it's being contrasted against ("unlike its sibling X…", "compared to the
  ancestral baseline…") — a free-floating trait or fate with no named comparison point fails.
- Restates the anatomical trait list already on the taxon's own card without saying what that
  trait let the animal *do* differently (or, for extinction, what it *couldn't* do).
- Uses "different," "changed," or "adapted" with no object — must say different/adapted
  *from what, in favor of what*.
- States the Why layer as a single flat mono-causal fact ("X evolved because of Y, full
  stop") when the real evidence is plural, contested, or messier than that (see next
  section). A confident one-cause claim is fine only when the evidence actually is that
  clean — otherwise carry the same honesty/confidence framing the rest of the panel uses.

## Don't flatten a causal chain into one clean cause

This concerns how the Why layer is phrased, independent of how many taxa are in the panel — a
two-taxon panel and a five-taxon panel can each get this right or wrong. The failure mode:
compressing "this species evolved trait X because of pressure Y" into a flat, single-link,
mono-causal sentence when the actual sourced evidence is plural or disputed. Examples of the
right level of honesty:
- Two siblings with near-identical jaw anatomy but isotope evidence showing very different
  actual diets — the same trait doesn't imply the same lived reality.
- A habitat call for one taxon that a later re-analysis of the same physical evidence
  disputed — the bullet can't assert the original reading as settled fact.
- A single small-brained fossil found alongside larger-brained individuals from the same
  population, used by its describers to question whether several "clean" successive species
  were really one variable lineage instead.

None of these conclude "so nothing can be said" — each still lands a specific, sourced fact.
When the real evidence genuinely does point at one dominant cause, state it plainly — just
carry the same confidence-line honesty every panel requires, rather than writing it as flat
unqualified fact by default.

## Evidence bar and sourcing discipline

- Every `additionalContext` fact needs a real, checkable citation (a real DOI/URL), added to
  a sources registry and cross-checked so it actually resolves. Zero invented citations.
- Prefer hard-evidence categories: isotopes, microwear, trabecular bone/biomechanics,
  trackways, dated tool/cut-mark finds, paleoclimate proxies, or a documented specialist
  dispute over an existing claim. For extinction-cause why-of-the-why specifically, also
  consider: a competing/rival lineage's fossil-abundance trend over the same interval, and
  range-contraction evidence from the taxon's own fossil distribution.
- A more specific/mechanistic true cause beats a shallower one — but only if it's true. A
  fabricated exciting story is worse than a plain true one; truth ranks above excitement.
- One causal link (change → pressure → lifestyle) is the ceiling for a single claim within a
  layer. Adding more precision to an existing claim dilutes it; a genuinely separate,
  already-evidenced new fact about the same taxon adds value. Before adding anything, check:
  is this a new dimension, or just more volume on a dimension already covered?

## What not to spend effort on

- Visual/anatomical spectacle is not the hook — causal "why" text is the payload; physical
  change made visible is secondary, a UI/UX detail, not something to optimize for.
- "We're animals too" kinship framing is not the hook — fine as an incidental aside, never the
  pitch for why a lineage or panel matters.
- Deep-time-vertigo / scale-of-time awe is not the hook — "millions of years, isn't that
  wild" is incidental, not the draw.
- Ambient, always-visible labels are the wrong interaction shape for this content — gate it
  behind a deliberate click (a nav pill, a graph marker), never a floating always-on tag.

## Applying this to a new lineage: research process

1. Pick a lineage with real deep-time diversification or well-evidenced sustained change —
   not a within-population trait oscillation over a few decades (e.g. Grant's finches: real
   and well-evidenced, but no lineage-splitting, just one population's trait wobbling under
   alternating pressure — not a fit for this method). Weight toward lineages with
   already-synthesized fossil + habitat + causal literature; that synthesis, not raw species
   count, is what makes a lineage buildable.
2. Map the tree as a set of ancestor→descendant(s) edges. For each ancestor node, record
   whether it has 0 (extinct dead end), 1 (straight edge), or 2+ (branch) direct descendants.
   This mapping is exhaustive and mechanical — every node gets exactly one panel plan.
3. For each node, draft the panel using the ladder above: baseline → what changed per
   descendant/outcome, each named against a comparison point → Why (a concrete selection
   pressure) → why-of-the-why (`additionalContext`, a genuinely deeper layer) → confidence
   line (on the taxon/edge's own certainty, and for dead ends, on whether the stated
   extinction cause is settled or a live specialist debate).
4. Run every bullet through the ban list and the flattening check before treating a panel as
   done.
5. Verify sourcing: every fact traces to a real, checkable citation registered in the sources
   file; no invented mechanism; hard-evidence categories preferred over inference.
6. Check for teleology: confirm no descendant, surviving or not, is framed as the point the
   rest of the tree existed to set up.
7. Write the finished draft as a `.txt` file following "Output format" above — baseline, one
   what-changed+why block per descendant/outcome, why-of-the-why, confidence line, citations.

