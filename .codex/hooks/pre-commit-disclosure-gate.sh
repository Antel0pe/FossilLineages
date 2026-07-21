#!/usr/bin/env bash
# PreToolUse gate: blocks `git commit` until the pre-commit-disclosure skill has run.
# Enforcement model: one-shot token file. Claude posts the disclosure to the user,
# and only after the user has seen it does Claude create .claude/.disclosure-ok.
# This hook consumes (deletes) that token on the next commit, so every commit needs
# a fresh disclosure. No jq dependency — greps the raw stdin payload.

input=$(cat)

# Only gate actual `git commit` invocations. Matches `git ... commit` where the
# words are on the same command (no ; | & separator between them), so global flags
# like `git -c user.name=x commit` are caught but `git log --grep=commit` is not.
if ! printf '%s' "$input" | grep -Eq 'git[[:space:]]([^;|&]*[[:space:]])?commit([[:space:]"]|$)'; then
  exit 0
fi

token=".claude/.disclosure-ok"
if [ -f "$token" ]; then
  rm -f "$token"
  exit 0
fi

printf '%s\n' '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"BLOCKED by pre-commit-disclosure gate. Before committing you MUST invoke the pre-commit-disclosure skill: post the four-section decision disclosure to the user (1: choices you are not confident in, 2: decisions you made autonomously, 3: places you changed what they asked for, 4: anything you are not proud of) and WAIT for their response. Only after the user has seen it, run: touch .claude/.disclosure-ok  then retry the commit."}}'
exit 0
