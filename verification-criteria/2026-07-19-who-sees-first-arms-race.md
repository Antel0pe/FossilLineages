# 2026-07-19 — "Who sees whom first" eye arms race (sandbox rebuild)

Rebuild of `evolutionary-sim/eye-evolution-sandbox.html`. Energy-flow version preserved at
`eye-evolution-sandbox-energyflow.html`.

## The model the user specified
- **No food, no energy score.** Vision's ONLY job is predator avoidance (prey) / prey finding (pred).
- **Prey** breed on a timer while alive; die ONLY by predation. Selection = pure survival.
- **Predators** run a **starvation clock** (no catch within T → die); reproduce after catching prey.
- **Detection ranges far smaller** — a single "best eye" max-range **slider** (default ~100 px in a
  720×460 world); each eye sees `acuity × MAX_SIGHT`, so a blind eye sees ~nothing.
- **Predators ~20% faster** than prey (the tie-breaker that converts "saw first" into an outcome).
- Low density: default **20 prey, 5 predators**, modest caps.
- **Visuals:** a faint detection-range ring around every dot; a tiny timer bar above every dot
  (prey = progress to next birth; predator = life left on the starvation clock).

## Falsifiable acceptance criteria

| # | Criterion | Check method | Result |
|---|-----------|-------------|--------|
| 1 | No food/energy remains: no plants, solar, `eSolar`/`ePreyIn`/`ePredIn`, `FOOD_*`, energy `e` fields, or metabolism | grep source for `food`,`plant`,`solar`,`eSolar`,`FOOD_`,`\.e[^a-zA-Z]` → none in runtime logic | |
| 2 | Detection range = `acuity(g) × MAX_SIGHT`, MAX_SIGHT from a slider (default 100), same for both sides | Read source `sightRange`; move slider → rings resize; confirm no per-target 430/360/300 constants | |
| 3 | A blind starting eye has detection range < 3 px (sees ~nothing) | Console: `sightRange(blindGenome())` < 3 for sampled blind genomes | |
| 4 | Predator speed = 1.2 × prey speed (20% faster) | Read source: `PRED_SPEED/PREY_SPEED === 1.2` | |
| 5 | Prey breed on a timer (every ~`cBreed` s) while alive; are removed ONLY when a predator catches them | Read source: prey have `breedT` countdown → spawn under cap; prey array only shrinks via predator `splice` | |
| 6 | Predators die when starvation clock hits 0; a catch resets it; predators reproduce after N catches | Read source: `starveT` decrements, catch sets `starveT=full` & `fed++`, `fed>=PRED_BREED_CATCHES` → offspring | |
| 7 | Every agent draws a faint detection ring sized to its own sight range | Visual/pixel check: ring pixels present; ring radius tracks `sightRange` | |
| 8 | Every agent draws a timer bar above it (prey fills toward birth, predator drains toward death) | Visual/pixel check: bar pixels above dots; prey-bar fill grows over time, pred-bar shrinks between catches | |
| 9 | **Eyes actually evolve** — over a run WITH predators, mean prey AND predator Δρ fall substantially (acuity climbs from ~blind) | Drive `step()` for ~120 s sim time; compare mean Δρ start vs end; require a clear downward trend on both | |
| 10 | **Control falsifies it** — with predators OFF (toggle), prey eyes do NOT systematically sharpen (no food = no pressure) | Run predators-off ~120 s; prey mean Δρ stays ~flat/blind vs the with-predators run | |
| 11 | Populations persist ≥120 s at default 20/5 (no instant extinction of either side; no explosion to a dense cap) | Drive sim; both counts stay > 0 and prey do not peg at cap the whole time | |
| 12 | No console errors; sim runs | Reload, read console | |

## Knobs flagged for the user (defaults, all tunable live)
- MAX_SIGHT=100 px; PREY 20 / PRED 5 start; caps PREY_MAX≈40, PRED_MAX≈12; prey breed interval 6 s;
  predator starve time 20 s; predator reproduces every 2 catches; speeds 1.0 / 1.2.
- **Unified detection range** (removed the old "predators are more visible than prey" 430-vs-360 tilt)
  so the arms race is purely about evolved acuity — flag to confirm this is wanted.
- Extinction watch: 5 blind predators may starve before eyes bootstrap; starve clock set generously.

## Verification results (2026-07-19)

**Mechanics PASS (criteria 1–8, 11, 12):** no food/energy remains; unified `sightRange = acuity ×
MAX_SIGHT` slider; blind eyes see ~0–5px; predator speed = 1.2× prey; prey breed on timer & die only
if caught; predators run a starvation clock and reproduce every 2 catches; detection rings (590 blue
ring px) and timer bars (341 green prey-bars, 76 orange pred-bars) both render; no console errors;
populations persist at 20/5 with no extinction or explosion.

**Criterion 9 FAILS — eyes do NOT reliably evolve. This is the finding, not a bug.** Over 120s at
defaults, mean Δρ stays ~840° (blind), sight ~1px; runs are drift-dominated (one seed even drifted
*blinder*, to 1284°). Diagnosis: **the sparse world creates a bootstrap valley.** A near-blind eye
sees a few px, but agents sit ~90px apart, so the first increments of vision confer ~zero advantage —
there is no fitness gradient at the blind end to climb. Sparsity (which makes vision decisive once
acute) makes it worthless to *start*.

Parameter sweep (120s each) showing the knife-edge:
| Config | Prey outcome | Predator outcome |
|---|---|---|
| default (sight 100) | 38 @ 840° (1px) — blind, no evolution | 6 @ 882° (0px) |
| big sight (250) | 40 @ **640° (11px)** — prey bootstrap! | **2** @ 865° — predators starve out |
| sighted predators | **0 — total extinction** | 0 — then starve |
| dense start (60 prey) | 31 @ 1284° — drift, went blinder | 11 @ 1017° |

So "who-sees-whom-first" has **two coupled failure modes**: (a) bootstrap — at the blind end the
gradient is flat in a sparse world; (b) coexistence knife-edge — once prey can see they flee and
**predators starve**; if predators can see first they **annihilate prey before it can adapt**. Neither
side's eye ratchets up in sustained co-evolution at the tested settings. Criterion 10 (control) is
moot because eyes don't sharpen even *with* predators. Needs a design decision from the user before
re-tuning (see options in report).
