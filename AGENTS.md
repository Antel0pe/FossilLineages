# Project vision
Before doing any work, read `CLAUDE-UNDERSTANDING.md` — it holds the project's vision and
direction. **Whenever you learn something new about the vision or direction, update that
file** (append dated understanding, correct stale entries). The short version: this site
illustrates human (and surrounding-lineage) evolution to show **that** change happened,
**what** changed, and **why** it may have changed — with the change itself as the primary
subject, grounded in best-guess, reasonably scientific reasoning.

# Curiosity signal log
This project's direction is being discovered empirically, from how the user actually
reacts across many conversations, not decided once. **Whenever the user reacts to an
idea (liked/disliked/bored/excited), floats a tentative direction, corrects a framing,
or is thinking out loud about what to work on next, use
`.claude/skills/log-curiosity-signal/SKILL.md`** to append a dated entry to
`.claude/skills/log-curiosity-signal/CURIOSITY-SIGNAL-LOG.md`. Read that log at the start of any
exploratory/curiosity-driven conversation before proposing directions. A single logged
entry is evidence, not a confirmed preference — see the skill for the full method.

# Verification-driven implementation
The user is the **judgment provider**; you are the **implementor**. Each time the user asks
you to implement something:
1. **Front-load questions** until you can build and self-check without further input.
2. Create a **new dated verification doc** under `verification-criteria/` capturing the
   user's answers as concrete, checkable acceptance criteria for that task.
3. Implement autonomously, then **verify your work against that doc**. Iterate until every
   criterion passes before reporting back. The verification doc is the contract.

## Writing criteria (so verification can actually fail)
- **Every criterion must be falsifiable and state its check method.** Banned vague verbs:
  "follows", "honored", "good", "where possible", "best-effort". If you can't name the
  command or observation that would prove it FALSE, rewrite it until you can.
- **Per-item work gets a per-item ledger, never an aggregate boolean.** When the deliverable
  is a set (taxa, images, pages, endpoints), the doc must contain one row per item that you
  fill with the OBSERVED value (e.g. taxon → image type: reconstruction / face / fossil →
  acceptable?). The filled table IS the verification; "all N have a file" is not.
- **Escape hatches require per-instance evidence.** Any "unless genuinely nothing exists" /
  fallback clause must (a) enumerate the sources to exhaust first, and (b) log, for each
  time you invoke it, what you searched and why nothing better was found.

## Writing turning-point scenes
The primary content format for this project is the **turning-point scene** (e.g.
`app/story/bipedalism/`) — an image-forward, mostly-animal-POV narration of one evolutionary
turning point. This replaced the graph+modal as the format the user actually wants (see
`CLAUDE-UNDERSTANDING.md`, 2026-06-23 entries). **Before writing or rewriting any scene, read
and follow `.claude/skills/turning-point-scene/SKILL.md`** — it locks in the section
skeleton, POV rules, and visual template derived directly from the user's critique. Do not
freelance a different structure without checking with the user first.

## Verifying (so PASS means 100%, not "probably")
- **Verify the artifact in the medium the user cares about — never a proxy.** For visual
  work you MUST look at the rendered result (screenshot / DOM inspect), not just confirm
  bytes load. "HTTP 200", "it decodes", and "it builds" are NOT evidence the content is
  correct. If the normal tool fails, find another way to SEE it; do not substitute a proxy
  and move on.
- **Adversarially try to FALSIFY each checkbox** before marking it PASS — ask "how would a
  skeptic show this isn't met?" — rather than confirming it.
- **Surface the per-item ledger to the user when reporting done**, so a 5-second human scan
  can catch what self-grading missed.

# Pre-commit disclosure (mandatory before every commit)
The user cannot review every line, so they require visibility into the **decisions** behind
the work before it lands. **Before running ANY `git commit`, follow
`.claude/skills/pre-commit-disclosure/SKILL.md`**: post a four-section disclosure — (1) choices
you are not confident in, (2) decisions you made autonomously, (3) places you changed what the
user asked for, (4) anything you are not proud of — and WAIT for the user's response before
committing. This applies whether the user asked you to commit or you were about to on your own.
A `PreToolUse` hook (`.claude/hooks/pre-commit-disclosure-gate.sh`) enforces this: it blocks
`git commit` until you create the one-shot token `.claude/.disclosure-ok` (do that only after
the disclosure has been posted and seen).

# Visualizations always ship with their explanation
When you produce a visualization (diagram, chart, widget), **the visual and the prose that
explains it must appear in the SAME message**. Never render a visual at the end of one message
and explain it in the next, and never explain something first and render the visual in a
follow-up message. The user has to scroll between messages to connect them, which defeats the
point of the visual.

Also: **state what the visual is showing before or immediately after it** — the viewing angle,
what each axis means, what a bar's length encodes. A diagram whose frame of reference is
unstated is unreadable, even when the content is correct.

# Answering a block of questions
When the user asks several questions in one message:
- **Restate each question simply, as its own heading, before answering it.** By the time they
  read answer four they will not remember what question four was. Never answer a barrage as
  flowing prose with no markers.
- **Keep the user's original order.**
- **Each answer must be complete and self-contained.** Do NOT reference a previous answer,
  patch one detail, and move on ("I explained that badly, here is the fix"). When a question
  shows the earlier explanation did not land, REBUILD it from the context they actually need —
  even if that repeats ground already covered. A patch assumes they retained the thing that
  did not work.
- **Answer the guesses they made, explicitly.** If they proposed a mechanism in the question,
  say whether it is right or wrong and why, by name. Do not silently supply a different answer
  and leave their hypothesis hanging.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

Use bun DO NOT USE npm

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
