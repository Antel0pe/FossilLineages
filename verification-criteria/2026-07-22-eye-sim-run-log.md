# 2026-07-22 — Diagnostic run log for the eye-evolution sandbox

**Task (user's words):** "add a button that will create a log file… in the eye evolution sim folder
and the logs folder will be gitignored. This file will have all relevant info from this simulator
including initial parameters, how long prey/predator lived, what eye resolution they had, how eye
resolution/acuity evolved — anything and everything that you need to diagnose the simulation…
everything you need to understand so you can see what's actually happening."

**Purpose:** the user reports acuity does not improve. The log exists so the *cause* is readable
from a file rather than guessed at.

## Acceptance criteria

Every row must be checked by opening the produced file, not by reasoning about the code.

Verified against a 40 000-tick run (666 s sim time, 1496 agents, 64 generations, 1419 captures),
dumped as `logs/20260722-203235-*`.

| # | Criterion | Check method | Result |
|---|---|---|---|
| 1 | A button labelled for logging exists in the controls bar | read_page of running page | **PASS** — `button [ref_15]` "Dump parameters, per-generation ledger…" present |
| 2 | Clicking it writes files into `evolutionary-sim/logs/` | `ls` after a real click with server up | **PASS** — 4 files, 724 KB |
| 3 | `evolutionary-sim/logs/` is gitignored | `git check-ignore -v` | **PASS** — `.gitignore:47` matched, exit 0 |
| 4 | `git status --porcelain` shows no log files | run after generating | **PASS** — no `evolutionary-sim/logs/` entries |
| 5 | Summary contains every slider value **as of reset** | read section 1 | **PASS** — all 11 keys present |
| 6 | Summary flags params changed mid-run | set bestEyeRangePx 100→200 without reset, log | **PASS** — `!! parameters changed mid-run` + at-reset/now table |
| 7 | Constants incl. Δρ / acuity / sightRange formulas | read section 2 | **PASS** — 26 rows incl. all three formulas |
| 8 | One agent row per agent ever born | `wc -l` vs `ARCHIVE.length` | **PASS** — 1496 rows + header (wc reports 1496; no trailing newline) |
| 9 | Agent rows carry lifetime, acuity, Δρ, A/f/L, offspring, catches, gen, parentId | read header + row 1 | **PASS** — 25 columns incl. `death` cause and behaviour tallies |
| 10 | Per-generation mean acuity for BOTH sides | read sections 5 & 6 | **PASS** — prey gen 0–64, predator gen 0–33 |
| 11 | Time series ≥1 row per 15 ticks with acuity mean **and sd** | header + row count | **PASS** — 2400 rows, 28 cols incl. `acuPreySd`/`acuPredSd` |
| 12 | Price term Cov(w,z)/w̄ present for both sides | read section 4 | **PASS** — prey −0.0003, pred +0.0009 |
| 13 | Mutational bias measured separately from selection | read section 4 | **PASS** — prey +0.0002 (n=1432), pred +0.0008 (n=39) |
| 14 | Capture mechanism split vision-driven vs blind, with fractions | read section 7 | **PASS** — 100.0% tracked / 0.0% lucky |
| 15 | Behaviour time budget | read section 8 | **PASS** — prey 21.9% fleeing, predator 45.0% pursuing |
| 16 | Saturation table across acuity 0→1 | read section 9 | **PASS** — P(≥1 in ring) 39.4% → 95.6% |
| 17 | Auto-verdict states pass/fail per diagnostic | read section 0 | **PASS** — 14 `OK`/`!!` lines |
| 18 | One capture row per capture with both acuities | `wc -l` vs `captures` counter | **PASS** — 1419 rows, cols incl. `predAcu`,`preyAcu`,`mode` |
| 19 | No console errors | read_console_messages onlyErrors, 3× | **PASS** — none |
| 20 | Logging does not perturb the sim | two clicks at the same tick, byte-diff the agent CSVs; `_seed` and `tick` unchanged | **PASS** — files IDENTICAL, tick stayed 40000 |
| 21 | Log matches on-screen HUD at click time | HUD vs section 3 | **PASS** — prey 33 / pred 12 / stage "flat patch" match exactly |

### Known limitation (found by criterion 11, fixed in the verdict)
`HIST` is capped at 2400 samples, so on runs longer than 36 000 ticks the **timeseries CSV covers
only the tail**. The verdict now emits an explicit `!!` line saying so, and the acuity trend in
section 0 is computed from the *generation ledger* (complete, untruncated) rather than from `HIST`.

## Notes on escape hatches
- Criterion 2 fallback: if the log server is not running (page opened over `file://`), the button
  downloads instead. That is a *fallback*, not a pass — criterion 2 must be verified with the
  server running.
