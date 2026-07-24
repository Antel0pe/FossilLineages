# 2026-07-22 — Rebuild the eye sim on physics; engineer the environment, not the outcome

**Task (user's words):** "run experiments to help the eye move towards real evolution from light
sensitive patch to real eye. keep simple equations, avoid engineering specific situations or
functions that make it obvious that the eye would get selected for… the majority of effort should
go to engineering the environment such that the eye gets selected for… see if you can do this via
the eye acuity turns into detection range but i suspect that is not true to nature."

## Non-negotiable design constraints (these are the contract, not the results)

| # | Constraint | Check method | Result |
|---|---|---|---|
| C1 | No survival, breeding, or capture rule anywhere references Δρ, acuity, or sharpness | `grep -nE "dr\b\|drho\|acuity\|sharp" core/sim.mjs` restricted to the energy/birth/death/capture blocks returns nothing | |
| C2 | There is no "sight range" parameter of any kind | `grep -n "sightRange\|MAX_SIGHT\|BASE_SIGHT" core/sim.mjs` returns nothing | |
| C3 | Δρ is a physically possible angle for every genome in the search space | sample the genome box, assert `Δρ ≤ π` for all | |
| C4 | Detection is graded — no distance threshold — so there is no flat interval on the eye axis | `pResolve` is continuous and strictly decreasing in Δρ at every d; verify numerically at 6 distances | |
| C5 | Gait choice (sprint vs cruise) uses fixed distances, not the animal's Δρ | read `strikeDist`/`panicDist` use sites; neither reads `dr` | |
| C6 | Blind animals are viable (non-visual senses exist), so a blind world is not auto-lethal | run with a fully blind founder population: prey and predators both persist ≥100k ticks | |
| C7 | The balance search scores only persistence/turnover, never eye quality | read `score()` in balance.mjs — no Δρ term | |

## Experiment criteria

| # | Criterion | Check method | Result |
|---|---|---|---|
| E1 | A headless core exists that runs without a browser | `bun run-exp.mjs --config baseline` completes | |
| E2 | Runs are cheap enough to sweep: ≥1 run of 30k ticks per minute per core | wall-clock printed per run | |
| E3 | Log capture exists for headless runs (not only the browser button) | report .md + .csv appear in `evolutionary-sim/logs/` | |
| E4 | Ecology is stable: prey and predators both persist to the end of a 100k-tick run | population trace, neither hits 0 | |
| E5 | Ecology is not degenerate: neither population sits pinned at its cap | population trace stays below cap | |
| E6 | **Selection gradient is measured by invasion, not inferred from a single run** | `gradient.mjs` seeds 2 fixed morphs, mutation OFF, reports birth share ± sd over seeds | |
| E7 | The gradient is reported honestly including flat/negative rungs | every rung in the table, none omitted | |
| E8 | Falsifier run exists: a world where eyes should NOT be selected | glut-food condition, expect share ≈ 0.5 | |

## RESULTS (filled 2026-07-23)

### Constraints
| # | Result |
|---|---|
| C1 | **PASS** — grep over energy/birth/death/capture lines for `dr`/`drho`/`acuity`/`sharp`/`z`: no hits |
| C2 | **PASS** — `sightRange\|MAX_SIGHT\|BASE_SIGHT` returns nothing |
| C3 | **PASS** — 4851 sampled genomes, max Δρ = 174.275°, zero violations of the 180° limit |
| C4 | **PASS** — p(resolve) strictly increasing as Δρ falls at all 6 test distances; no flat interval |
| C5 | **PASS** — `strikeDist`/`panicDist`/`turnRate` are fixed constants; none reads `dr` |
| C6 | **PASS** — fully blind founders (Δρ 164.1°, mutation OFF): prey 402, pred 138 alive at tick 100,001 |
| C7 | **PASS** — `score()` in balance.mjs uses only persistence, population size and generation count |

### Experiments
| # | Result |
|---|---|
| E1 | **PASS** — `bun run-exp.mjs` runs headless |
| E2 | **PASS** — 60k ticks in 86–125 s per run, 7 in parallel |
| E3 | **PASS** — reports + CSVs land in `evolutionary-sim/logs/` |
| E4 | **PASS** — blind world stable 100k ticks; prey ~400, pred ~140 |
| E5 | **PARTIAL** — prey never pinned; **predators sit at their cap** in most runs even after raising it to 400. Predator statistics are truncated by this. |
| E6 | **PASS** — `gradient.mjs`, 8 rungs × 3 seeds, mutation OFF, fixed morphs |
| E7 | **PASS** — all rungs reported including negative ones (three separate measurements below) |
| E8 | **NOT RUN** — the glut-food falsifier config exists but was not executed. Outstanding. |

### The headline run — prey, σ=0.25, seed 2 (60k ticks)
Δρ 162.6° → 1.78°, monotone, no plateau: class I at gen 0, **II by gen 20, III by gen 36, IV by gen 80**.
Evolved morphology: A 0.104, f 3.596, L 0.379 — a deep, stopped-down, lensed pit. Nothing in the
code rewarded any of that.

**Caveats that must travel with this result:**
- Predators went extinct by ~gen 8 in that run, so this is a **foraging-driven climb, not an arms race**.
- Prey population collapses at the sharp end (421 → 6 between gen 48 and 80); the class IV reading
  comes from 6 individuals and is not a stable equilibrium.
- It required σ=0.25. At σ=0.03 the eye does not move at all (164° → 165°/158°).

### The reachability finding (sweep `mutation`, 2 seeds each)
| σ | prey Δρ end (2 seeds) | verdict |
|---|---|---|
| 0.03 | 165.3°, 158.3° | no movement |
| 0.08 | 91.2°, 62.6° | class I → II |
| 0.15 | 85.1°, 1.51° | one stalls, one reaches class III/IV |
| 0.25 | 1.66°, 0.97° | both reach class III/IV |

Monotone in σ. The climb is **mutation-step-limited, not gradient-limited** — consistent with
Nilsson & Pelger needing ~364,000 generations at 1% steps, which is not simulable here.

### The uncomfortable finding: behaviour rules dominate the gradient
Three gradient measurements, same optics, same ecology, differing only in behaviour rules:

| Δρ rung | class | (a) flee-or-forage | (b) blended avoidance | (c) blended + bounded turn |
|---|---|---|---|---|
| 164→158 | I | 0.282 | 0.415 | 0.475 |
| 149→137 | I | 0.311 | 0.277 | 0.590 |
| 123→105 | I | 0.350 | 0.213 | **0.714** |
| 86→58 | II | 0.574 | **0.716** | **0.085** |
| 37→22 | II | **0.731** | 0.569 | 0.396 |
| 12.8→6.6 | III | **0.076** | **0.707** | 0.593 |
| 3.0→0.89 | III | — | 0.683 | 0.659 |

The sign of selection at a given Δρ **flips** between defensible behaviour rules. This is the most
important negative result in the exercise: in this model the eye's payoff is set less by the optics
than by how the animal is allowed to use what it sees. Hand-authored behaviour is doing most of the
work, which is exactly the kind of hidden engineering this doc exists to catch.

**Implication for next step:** the behaviour weights should be evolved rather than authored, so an
animal is not forced to act on information it cannot use.

## What would count as SUCCESS vs. an honest negative

- **Success**: birth share > 0.5 by more than 2 se at a run of consecutive rungs spanning
  Nilsson class I → III, for at least one side (prey or predator).
- **Honest negative** (still a valid deliverable): the gradient is flat or negative over some
  interval. That must be reported as a measured property of the environment, with the rung table,
  NOT hidden by tuning until the number comes out right.

**Explicitly disallowed**: adding any term that rewards Δρ directly in order to make E6 pass.
If the gradient is flat, the fix must be an environmental fact (patch size, density, clarity,
predator size, sense ranges) that is independently defensible as a feature of the real world.
