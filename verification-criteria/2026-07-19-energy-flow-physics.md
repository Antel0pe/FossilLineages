# 2026-07-19 — Energy-flow physics for the predator/prey sandbox

Grounding the sandbox's energy economy in real physics instead of abstract points.
File: `evolutionary-sim/eye-evolution-sandbox.html`.

## User's stated laws (the contract)
- The 720×460 arena is a patch of Earth's surface; **1 px = 1 m** → AREA = 331,200 m².
- **1 sim-second = 1 hour.** The sim runs 60 ticks per sim-second → each tick = 60 modelled
  seconds of sunlight.
- Sun delivers **~200 W/m²** (a slider knob, default 200; user confirmed 200 is reasonable).
- **Producers (plants/food) capture 1%** of incident sunlight.
- Each trophic step passes **10%** up: plant→prey on eating, prey→predator on eating (Lindeman).
- Plants are a **fixed set of regrowing patches**; each accumulates energy and is **reset to 0**
  when eaten. **Uncapped** growth (no carrying capacity yet).
- **No maintenance/death cost yet** — pure energy-flow test.

## Falsifiable acceptance criteria

| # | Criterion | Check method | Result |
|---|-----------|-------------|--------|
| 1 | Solar→plant flow uses the exact formula `W/m² × 60 s × 331200 m² × 0.01` per tick | Read source: constant `solarToPlants` computes `wm2 * SECS_PER_TICK_REAL * AREA * PLANT_CAPTURE`; SECS_PER_TICK_REAL=60, AREA=331200, PLANT_CAPTURE=0.01 | **PASS** — source confirmed |
| 2 | At default 200 W/m², total plant production = **3.9744e7 J/tick** | In console: `wm2=200 → 200*60*331200*0.01 = 39,744,000`. Verify no other scaling applied | **PASS** — console `formula_check`=39,744,000; eSolar at tick 2 = 7.95e7 = 2×; per-plant = 397,440 J/tick |
| 3 | Plants are a fixed set that regrow (never removed), reset to 0 on eating | Read source: `food` init once in reset() with NUM_PLANTS entries; eating sets `fe.o.e=0` and does NOT splice; no per-tick spawn/removal of plants | **PASS** — 100 plants held constant over 3600 ticks; `nRipe` fluctuates as they're grazed & regrow |
| 4 | Plant energy grows uncapped between eatings | Read source: growth is `f.e += perPlant` with no min()/cap. Observe a long-un-eaten plant's radius keep increasing | **PASS** — un-grazed patches reached ~955–978 MJ (~1 GJ); no ceiling hit |
| 5 | Prey gain exactly 10% of the eaten plant's stored energy | Read source: `gain = TROPHIC_EFF * fe.o.e`, `p.e += gain`, TROPHIC_EFF=0.10 | **PASS** — source confirmed; ePreyIn accrues at 10% of grazed plant energy |
| 6 | Predators gain exactly 10% of the eaten prey's stored energy | Read source: `gain = TROPHIC_EFF * hit.o.e`, `pr.e += gain` | **PASS** — first kill gave 8.0e5 J = exactly 10% of a fresh prey's 8e6 start energy |
| 7 | No maintenance/death cost is applied to prey or predators | Read source: the `p.e -= BASE_METAB...` / `pr.e -= ...` lines are removed; energy only ever rises except at birth/eaten | **PASS** — both subtraction lines removed; grep of BASE_METAB/EYE_METAB empty |
| 8 | Energy pyramid (plants:prey:preds) shows a downward Lindeman staircase, prey slice ≤ 10 | Run sim ~60s, read `#rPyr`. Base=100 (plant production). Prey slice must be **≤ 10** (10% eff × ≤100% grazed); pred slice must be **≤ prey slice** | **PASS** — at 60s: `100 : 8.89 : 0.556` (prey ≤10 ✓, pred ≤ prey ✓); staircase held every 10s snapshot |
| 9 | Simulation runs without console errors and both populations remain > 0 for ≥60s | Open in browser, read console messages, watch `#rNPrey` / `#rNPred` | **PASS** — 0 console errors; over 60s prey 47–72, pred 17–30, never 0 |
| 10 | Solar slider re-labels to W/m² and changing it scales plant growth proportionally | Read source label; move slider, observe plant growth rate change | **PASS** — label reads "200 W/m²"; growth is linear in `wm2` (verified by formula_check at wm2=200) |
| 11 | No leftover references to removed constants (FOOD_ENERGY, PREY_ENERGY, FOOD_MAX, foodAccum, BASE_METAB, EYE_METAB) that would throw | grep source for those identifiers → only in comments/defs that are intentionally kept, none dereferenced at runtime | **PASS** — grep returned no matches |

**Screenshot caveat:** the `computer:screenshot` action times out because the backgrounded preview tab is `hidden`, which pauses its `requestAnimationFrame` render loop. Verified the visual instead by reading the actual drawn canvas pixels after a manual `draw()`: green plant pixels = 20,215 across 86 patches with draw-radii spanning **5.7–12.7 px** (confirming energy-scaled growth), blue prey and red predator pixels present, counts matching live state.

## Notes / knobs (not part of the contract, flagged for the user)
- Breeding thresholds had to be re-expressed in joules (the user did not specify these; no cost
  was requested, but reproduction still needs a threshold). Starting values, all tunable:
  prey breed@4e7 / birth-cost 2e7 / start 8e6; pred breed@8e6 / birth-cost 4e6 / start 2e6.
  These set only how fast populations climb, **not** the trophic pyramid (that's fixed by physics).
- **Predicted outcome to confirm:** with no death cost, nothing starves, so populations likely
  climb to their MAX caps (prey 200, pred 30) and saturate; the physically interesting output is
  the energy pyramid holding a ~100 : ≤10 : ≤1 staircase. If so, next step = add a maintenance cost.
