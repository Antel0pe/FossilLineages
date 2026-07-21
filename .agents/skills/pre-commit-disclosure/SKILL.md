---
name: pre-commit-disclosure
description: Before running ANY git commit in this repo, stop and give the user a decision disclosure — the choices you're not confident in, made autonomously, changed from what they asked, or aren't proud of. Use every time you are about to commit, whether the user asked you to commit or you were about to on your own. Do not commit until the user has seen the disclosure.
---

# Pre-commit disclosure

The user cannot review every line you write. What they need instead is visibility into
**the decisions behind the lines** — especially the ones you made without them, weren't
sure about, or that quietly diverged from what they asked for. This skill is the gate:
before any commit lands, the user gets a short, honest account of what you actually
decided, so nothing consequential slips through unreviewed.

## When this fires

**Before every `git commit` in this repo — no exceptions.** This includes:
- Commits the user explicitly asked for.
- Commits you were about to make on your own initiative (e.g. after finishing a task).
- The first commit of a batch, and any later commit in the same session that contains
  new decisions not already disclosed.

If you are about to type `git commit`, you owe the disclosure first. Do not commit,
then disclose. **Disclose, wait for the user, then commit.**

## What to produce

Post a disclosure to the user covering the work that is about to be committed (staged +
unstaged changes going into this commit). Answer each of these honestly. Empty sections
are allowed and good — say "nothing" explicitly rather than omitting the heading, so the
user can see you actually considered it.

### 1. Choices I'm not confident in
List every decision where you genuinely aren't sure you made the right call — design,
naming, data, structure, wording, an approach you picked among alternatives, a fact you
couldn't fully verify. For each: what you chose, and *why you're unsure* (what the other
option was, what could be wrong). Do not pre-filter this to "big" ones — err toward
listing it. This is the most important section.

### 2. Decisions I made autonomously
Choices the user did not specify and you resolved yourself. Things you filled in, assumed,
inferred, or picked a default for without asking. Even if you're confident it's right —
the point is the user gets to know it was *your* call, not theirs.

### 3. Places I changed what you asked for
Anywhere the result diverges from the user's stated instruction or intent — you did
something different, skipped part of it, added something unasked, reinterpreted an
ambiguous request, or hit a constraint that forced a deviation. Be specific about the
delta: what they asked vs. what you did, and why.

### 4. Anything I'm not proud of
Shortcuts, hacks, incomplete bits, TODOs, things you'd want to redo with more time,
copy-pasted patterns you didn't fully understand, tests you didn't write, verification
you skipped. The stuff that's fine-for-now but you'd rather the user know than discover.

## How to write it

- **Concrete and specific.** Reference `file:line`, the actual choice, the actual
  alternative. "Named the function `parseNode` instead of `parseBranch` — unsure which
  matches your mental model" beats "some naming decisions."
- **Rank by consequence.** Most consequential / most-likely-wrong first within each
  section. The user is scanning; put what could bite them at the top.
- **No self-absolution.** Do not talk yourself out of listing something because you
  decided it's probably fine. If the thought "should I mention this?" occurred, mention it.
- **Short.** Bullets, not paragraphs. This is a checklist for the user's judgment, not an
  essay.

## After the disclosure

Wait for the user. They may approve as-is, ask you to change something, or want detail on
a specific item. Only commit once they've responded. If, while addressing their feedback,
you make *new* decisions that fit the four categories above, disclose those too before the
final commit — the gate applies to what actually gets committed, not just the first draft.

If the user has explicitly told you in this session to skip the disclosure and just commit,
honor that — but the default is always to disclose.
