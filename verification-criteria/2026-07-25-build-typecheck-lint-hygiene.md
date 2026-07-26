# 2026-07-25 — Build/typecheck/lint hygiene

## Task
Vercel's production build was failing on `bun run build`. Fix the type and lint errors,
make `evolutionary-sim/` genuinely type-safe rather than excluded, and stop eslint from
linting scratch worktrees.

## User's answers driving this
- "fix type errors and push. dont wait for approval just push. fix until npm lint is good
  and github actions for vercel or rather the check succeeds"
- "yes make it type safe then go for it" — the first-round `tsconfig` exclude of
  `evolutionary-sim/` was a mute, not a fix; the sim must actually be type-checked.
- "no reason to ignore worktrees right?" — confirm the eslint ignore is justified rather
  than a convenient way to hide errors.

## Criteria

| # | Criterion | Check method | Result |
|---|---|---|---|
| 1 | `bun run build` exits 0 | `if bun run build; then PASS` | **PASS** |
| 2 | `bun run lint` exits 0 (0 errors) | `if bun run lint; then PASS` | **PASS** — 0 errors, 6 warnings |
| 3 | `evolutionary-sim/` is type-checked, not skipped | `bun run typecheck:sim` exits 0 | **PASS** |
| 4 | That typecheck is not a no-op | Append `const __bad: number = "nope"` to `log-server.ts`; command must exit **non-zero**, then pass again once reverted | **PASS** — `WITH_ERROR: FAILED`, `CLEAN: PASSED` |
| 5 | Bun globals actually resolve (not silently `any`) | Criterion 4's clean pass covers `Bun.serve`, `Bun.file`, `import.meta.dir`, all used in `log-server.ts`; without `"types": ["bun"]` these are errors | **PASS** |
| 6 | The `leaflet.markercluster` stub is only kept if genuinely needed | Delete `types/`, rerun build. If it passes, the stub was masking something else and must not be committed | **PASS** — build passed without it; root cause was a stale `bun.lock`. Stub deleted. |
| 7 | The eslint ignore hides no real errors from linted code | Ignore must be justified per-entry (below), and lint of the actual repo must still run — confirmed by criterion 2 still reporting findings in `evolutionary-sim/*.mjs` | **PASS** |
| 8 | The stale worktree holds no unrecoverable work before any deletion is proposed | `git archive` its commit to a temp dir, `diff -rq --strip-trailing-cr` against it; and `git merge-base --is-ancestor <sha> main` | **PASS** — only unique file is generated `next-env.d.ts`; commit `92ccc7f` is already an ancestor of `main` |

## Ignore-entry ledger (criterion 7)
Every eslint ignore needs its own justification, or it is just hiding errors.

| Pattern | Justification | Could it hide a real error? |
|---|---|---|
| `**/.next/**` | Generated build output. The eslint-config-next default is root-anchored (`.next/**`), so nested copies were being linted. | No — regenerated from source that *is* linted. |
| `**/node_modules/**` | Third-party code, not ours. Same root-anchoring gap. | No. |
| `.claude/worktrees/**` | Full second checkouts of this repo at a detached HEAD. Linting them double-reports every finding against code that isn't on `main`. Already excluded via `.git/info/exclude`. | No — the same source on `main` is linted. Scoped to `worktrees/` specifically, so the rest of `.claude/` is untouched. |

## Known remaining warnings (not errors, deliberately left)
`evolutionary-sim/run-exp.mjs` (4) and `evolutionary-sim/tmp/*.mjs` (2) have unused-var
warnings. These are sandbox scratch scripts; `tmp/` is gitignored. Left alone rather than
editing the user's simulation scratch work.
