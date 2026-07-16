---
name: log-curiosity-signal
description: Append a dated entry to CURIOSITY-SIGNAL-LOG.md whenever the user reacts to an idea (liked it, disliked it, bored by it, excited by it), floats a tentative new direction, corrects a framing/goal, or is thinking out loud about what to work on next. Use during any exploratory or curiosity-driven conversation in this repo — not only when the user explicitly says "log this." Read the log at the start of such a conversation to check for existing patterns before making design recommendations.
---

# Logging curiosity signal

This repo's direction (what to build, what makes it worth the user's time) is being
discovered empirically, over many conversations, from how the user actually reacts —
not decided once and then executed. This skill keeps a durable, append-only record of
that discovery process so a future conversation has the full history of reactions, not
just the current session's.

## The core rule: a reaction is evidence, not truth

**Never write a logged entry as a confirmed, settled preference — write it as a data
point.** The user is actively figuring out what they like; a single reaction can be
shaped by mood, the specific example used, what was discussed right before it, or plain
inconsistency, not just by some fixed underlying preference. Some logged entries will
turn out to be noise and should eventually be weighed against, or superseded by, other
entries — that's expected and healthy, not a sign the log is broken.

This means:
- When **writing** an entry, note the reaction and its immediate context, but do not
  editorialize it into a general rule ("user likes X") unless the user stated it as a
  general rule themselves.
- When **reading** the log to inform a recommendation, look for a *pattern across
  multiple entries*, not a single hit. One entry saying "liked geographic speciation"
  is weak evidence on its own; three independent entries across different sessions all
  pointing at "contingent links across a long time gap" is a real signal.
- If a new entry seems to contradict an older one, log the new one anyway — do not
  resolve the contradiction by silently treating the newer one as correct. Append a
  note flagging the tension so a future reader (or the user, if asked) can adjudicate.

## Append-only — never delete or edit past entries

If something logged earlier turns out to be wrong, outdated, or reversed, **append a
new dated entry saying so** ("2026-08-01 — correction to 2026-07-15 entry: ..."). Never
delete, rewrite, or silently remove a past entry. The record of *how the user's
understanding of their own preferences changed over time* is itself valuable — erasing
old entries destroys that.

## What counts as a loggable moment

- An explicit reaction: "that's cool", "I don't like that", "this feels wrong", "not
  sure about this."
- An unprompted tangent where the user is thinking out loud about what excites or
  bores them, even without a direct verdict.
- A stated correction to a goal or framing (e.g. rejecting a term or reframing what
  "success" means for a piece of work).
- A tentative idea floated with visible uncertainty ("maybe something there, not
  sure") — these are worth logging precisely *because* the user hasn't committed to
  them; the log is where half-formed ideas get to persist instead of evaporating.
- A piece of self-aware tension the user flags themselves (e.g. "this idea is a bit
  against my own stated principle, but I still find it interesting") — these are
  high-value entries, since they surface cases where two of the user's own criteria
  point in different directions.

Do not log routine implementation decisions, technical clarifications, or anything
that's just answering a factual question — this log is for signal about what the user
finds worth their curiosity, not a general conversation transcript.

## Entry format

Append to `CURIOSITY-SIGNAL-LOG.md` in this skill's directory
(`.claude/skills/log-curiosity-signal/CURIOSITY-SIGNAL-LOG.md`), under a `## YYYY-MM-DD` heading
(reuse the day's heading if one already exists in this session). Each entry:

```
- **[tag]** Tight paraphrase or short quote of what was said. Context: what prompted
  it, in one clause. (Optional) Claude's read on why, explicitly marked as a guess if
  it is one, not stated as fact.
```

Tags: `liked`, `disliked`, `uncertain`, `idea`, `correction`, `tension`, `meta`.

## When to read this file

At the start of any exploratory or curiosity-driven conversation in this repo (design
discussions, "what should I work on" conversations, brainstorming) — skim it for
recurring patterns before proposing directions, so recommendations build on what's
already been discovered rather than re-deriving it from scratch or contradicting it
without noticing.
