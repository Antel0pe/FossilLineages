# Writing branch/evolution-point content for a new (non-human) lineage — calibration notes

Not a skill yet — this is raw calibration material for whoever eventually writes the skill (or
writes the content directly). It captures how the user actually judges this specific kind of
content, distilled from real corrections made while building the human/hominin lineage
(`data/lineage.json`, the divergence-cluster panels, the `evolutionPoints` panels). Read this
before writing a single bullet for a new lineage — the failure modes below have each already
happened once; don't re-discover them the expensive way.

## The shape of the artifact you're replicating

Two related but distinct UI objects, both already built and working for the hominin graph:

1. **Divergence-cluster panel** (`data/lineage.json` schema, see
   `verification-criteria/2026-07-04-lineage-branching-and-comparison-panel.md`): triggered by a
   branch point (an ancestor with 2+ children). Shows the ancestor's own baseline lifestyle first,
   then one bullet per descendant, each bullet explicitly naming what it's being contrasted
   against (the ancestor, or a specific sibling) — never a free-floating trait. Ends with a
   confidence line about whether this is *really* a meaningful divergence vs. coincidental
   co-occurrence, separate from ordinary per-species uncertainty.
2. **Evolution-point panel** (see `verification-criteria/2026-07-06-evolution-points-second-row.md`):
   same baseline→change→confidence shape, but for a single-parent→single-child edge where nothing
   branches — the lesson locked in there is "no known branch ≠ no story"; a straight edge can
   still carry real change worth the same depth-on-demand treatment.
3. Every sibling/edge additionally carries an `additionalContext` field: one hard-evidence fact,
   sourced to a real, checkable citation, that **complicates rather than restates** the existing
   bullet (see `verification-criteria/2026-07-07-evidence-mining-pass-evolution-points.md` for the
   full worked ledger — isotopes, trabecular bone, trackways, dated tool finds, paleoclimate
   proxies, or a specialist dispute are the categories that have worked so far).

Replicating this pattern for a new lineage means: baseline stated, comparison named, confidence
line present, one real complicating fact per branch — not a new format, the same one.

## The single most important, freshest correction (2026-07-08) — don't oversimplify to one clean cause

An assistant once summarized a past rejection (the "connected chain" prototype, 2026-07-07) as
being about *stringing too many taxa together in sequence*. The user corrected this directly:
that was never the actual problem. The real problem — and the thing to watch for on every single
causal bullet you write, whether it's about two taxa or five — is **compressing a causal chain
down to something this simple: "this species, millions of years ago, was directly causally
responsible for this specific downstream thing."** That flat, single-link, mono-causal framing is
the failure mode. It has nothing to do with how many species are in view.

What resisting this looks like, using content that's already shipped and already correct:
- **Boisei vs. robustus** (near-identical "nutcracker" jaws): isotopes show boisei's actual diet
  was >75% C4 grass/sedge, far more than robustus, despite the same anatomical solution. The old,
  simple story ("big jaw evolved because of hard-food fallback insurance") doesn't hold up as one
  clean line once you look at what they actually ate — two siblings with the same trait, doing
  different things with it. (Cerling et al. 2011 — already cited in this project's source
  registry.)
- **Ramidus's own habitat call**: the describing team read it as closed woodland; a later
  isotope re-analysis of the same soils argued for open wooded grassland instead. The bullet
  doesn't get to just assert "ramidus lived in dense woodland, therefore X" as settled — the
  underlying evidence is itself disputed among specialists who looked at the same rocks.
  (Cerling et al. 2010 vs. White et al.'s response — both real, both cited.)
- **Dmanisi Skull 5**: a small-brained individual found in the same population as much
  larger-brained ones, which its describers used to argue habilis/rudolfensis/early-erectus might
  be one variable lineage, not three clean species handing off to each other one at a time.

None of these say "and therefore we can't say anything" — they still land a real, specific,
sourced fact. They just refuse to flatten it into a single tidy mono-causal sentence when the
actual evidence is plural, contested, or messier than that. **When the real evidence genuinely
does point to one dominant cause, that's fine to state — but still carry the same honesty/
confidence framing the panels already require, rather than writing it as flat unqualified fact.**

## The What → Why → How framework, and where depth is actually wanted

Distilled directly from the user (2026-07-07): **What** (the observed trait-level change,
anatomy included) → **Why** (the evolutionary pressure — this is the priority layer, and the one
where more depth is wanted) → **How** (genetic/anatomical mechanism — secondary, mostly folds
into "What"). On the "Why" layer specifically:
- **Depth means comparison, not narration.** A prototype that just chained true, sourced facts
  about several species in chronological order ("species A did X, then B did Y... ending in Z")
  was rejected: "it kinda just stated a species did this then b species did that. but no causal
  effect." What actually produced the causal "why" feeling was asking why two *related* taxa that
  faced different conditions ended up different — not narrating a sequence.
- **One causal link (change → pressure → lifestyle) is the ceiling for a single claim** — see
  `feedback_causal_depth_ceiling.md` in the user's persistent memory. Adding more precision to an
  *existing* claim dilutes it. A genuinely separate, already-evidenced new fact about the same
  taxon adds value. Test before adding anything: is this a new dimension, or just more volume on
  a dimension already covered? (The `feedback_dilution_vs_addition_test.md` memory names this
  explicitly as an emerging, not-yet-strict lens — apply it as a real question, not a hard rule.)
- **A more specific/mechanistic true cause beats a shallower one — but only if it's true.** A
  fabricated exciting story is explicitly worse to this user than a plain true one. Truth is
  ranked above excitement, stated directly by the user more than once.

## No sapiens-equivalent teleology, generalized to any new lineage

The user rejected framing hominin "outcome" around whether a branch led to modern humans — most
hominin branches didn't, and humans aren't even the only surviving ape lineage (gorillas, chimps
persisted too). **This generalizes directly**: whichever new lineage gets built, don't frame its
extant/surviving member as "the winner" the story was building toward. If picking horses: Equus
surviving isn't the point the other 90% of the radiation existed to set up. If picking whales:
neither odontocetes nor mysticetes are the "better" branch, just a different one. Frame every
branch's fate — persisted or went extinct — as its own outcome, not a stepping stone to whichever
one happens to still be around.

## What doesn't matter as much here (don't spend effort chasing it)

- **Visual/anatomical spectacle is not the hook for this content type.** In a direct rating
  exercise the user scored "physical change made visible" 5/10 — "cool but secondary" — and
  explicitly said it's a UI/UX detail, not what to optimize for. That's a bigger deal for the
  turning-point-scene format (`app/story/*`), which is image-forward by design; for the
  branch/evolution-point panels specifically, causal "why" text is the actual payload.
- **"We're animals too" kinship framing rated 0/10.** Don't reach for a kinship/relatability angle
  as the selling point of a new lineage pick (e.g. don't pitch camels on "did you know camels are
  secretly American" as the emotional hook — that's a fun fact, not the causal "why" this content
  type exists to deliver. Fine as a side detail, not the spine).
- **Deep-time vertigo / scale-of-time awe rated 2/10.** Don't lean on "millions of years, isn't
  that wild" as the pitch either — it's incidental, not the draw.
- **Always-visible ambient labels are the wrong interaction shape.** An earlier version put a
  floating text tag directly on the graph at branch points; the user said it "doesn't add
  anything nicely" and had it removed in favor of click-to-open panels + a chronological nav
  strip. Any new-lineage content should be interaction-gated the same way, not ambient.

## Evidence bar and sourcing discipline

- Every `additionalContext` fact needs a **real, checkable citation** (a real doi/url), added to
  a sources registry the same way `data/human-lineage-sources.json` works — cross-checked so
  every reference actually resolves, zero invented citations. The 2026-07-07 mining pass found a
  real fact for every single edge/sibling it touched (11/11, then 4/4) without ever needing a
  "nothing found" fallback — treat that as the expected bar, not a lucky run.
- A fact must **complicate, not restate**, the existing bullet — if it just says the same thing
  in more words, it doesn't count.
- Prefer **hard-evidence categories** that have worked before: isotopes, microwear, trabecular
  bone/biomechanics, trackways, dated tool/cut-mark finds, paleoclimate proxies, or a documented
  specialist dispute over an existing claim. These are the categories that produced every real
  worked example above.

## Ban list for any comparison bullet (mechanical, from the divergence-panel verification doc)

A bullet fails if it:
- Doesn't name what it's being contrasted against ("unlike its sibling X…", "compared to the
  ancestral baseline…") — a free-floating trait with no named comparison point fails.
- Just restates the anatomical trait list already on the taxon's own card/modal, without saying
  what that trait let the animal *do differently*.
- Uses "different," "changed," or "adapted" with no object — every bullet must say
  different/adapted *from what, in favor of what*.

## Why this lineage-expansion idea passed the dilution-vs-addition test, provisionally

Logged for context, not as a final verdict: the first-pass read on "expand to a new lineage" was
that it risked being pure breadth/volume rather than depth (see `CLAUDE-UNDERSTANDING.md`'s
2026-07-07 "real bottleneck" entry, which named evidence-mining on *existing* edges as the
higher-leverage move). The user's refinement — deliberately excluding short-timeframe,
non-diversifying examples like Grant's finches, and requiring unusually well-evidenced deep-time
diversification instead — reframes this as closer to "a new domain with the same hard-evidence
density this project already requires," not padding. Still worth re-confirming with the user
once a specific lineage and specific branch points are chosen, rather than assuming the general
green light covers every candidate equally.
