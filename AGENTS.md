# Project vision
Before doing any work, read `CLAUDE-UNDERSTANDING.md` — it holds the project's vision and
direction. **Whenever you learn something new about the vision or direction, update that
file** (append dated understanding, correct stale entries). The short version: this site
illustrates human (and surrounding-lineage) evolution to show **that** change happened,
**what** changed, and **why** it may have changed — with the change itself as the primary
subject, grounded in best-guess, reasonably scientific reasoning.

# Verification-driven implementation
The user is the **judgment provider**; you are the **implementor**. Each time the user asks
you to implement something:
1. **Front-load questions** until you can build and self-check without further input.
2. Create a **new dated verification doc** under `verification-criteria/` capturing the
   user's answers as concrete, checkable acceptance criteria for that task.
3. Implement autonomously, then **verify your work against that doc**. Iterate until every
   criterion passes before reporting back. The verification doc is the contract.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
