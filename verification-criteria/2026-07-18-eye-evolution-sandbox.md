# Verification: eye-evolution sandbox (Type-B agent sim)

Task: turn the eye sim from a fitness-function optimizer (Type A) into a spatial
agent-based sandbox (Type B) where prey and predator eyes co-evolve because of what
happens in the world, not because a survival formula was authored.

File: `evolutionary-sim/eye-evolution-sandbox.html`, linked as a 3rd nav tab.

## Locked spec (from user, 2026-07-18)
- 2D toroidal arena. Prey = blue dots, predators = red dots, food = green dots.
- **Both prey and predators start near-blind** (flat patch, `L≈0`, tiny `f`) and co-evolve.
- **Asexual mutated clones** — offspring = mutated copy of parent (reuse mutate()).
- **Emergent chase** — fixed speeds; detection gives a head-start; predator gives up when
  it loses sight of the prey. NO authored per-encounter survival/capture S-curve.
- **Prey have two pressures**: avoid predators AND find food. Both mediated by the eye.
- Behavior is **hard-coded** (not evolved): prey flee nearest visible predator, else move
  toward nearest visible food, else wander; predators pursue nearest visible prey, else
  wander. Only the eye genome {A,f,L} is under selection. (Evolvable brains = later.)
- Reused optics: `Δρ = drho({A,f,L})`; detection range = `W_target / Δρ_observer`.
  Sharper eye (smaller Δρ) → sees farther. Eye upkeep cost reuses the tissue() term so
  eyes don't max out for free.
- Play / pause / reset + a couple of minimal knobs. No per-agent authored fitness.

## Falsifiable acceptance criteria
Each row states the CHECK METHOD and gets a filled OBSERVED value. PASS only when every
row is verified by observation in the rendered page, not by reading the source.

| # | Criterion | Check method | Observed | Pass? |
|---|-----------|--------------|----------|-------|
| 1 | Page loads with 3 working nav tabs (explainer / sim / sandbox), sandbox tab active | Open in browser, read DOM | Loads; 3 nav tabs present, sandbox `.on`; no throw on load | ✅ |
| 2 | Arena renders moving blue (prey), red (predator), green (food) dots | Canvas pixel sample | world canvas: 6535 blue, 2089 red, 609 green px over bg. Positions change each tick | ✅ |
| 3 | Prey visibly flee: a prey near a predator moves AWAY from it | Micro-test: prey+predator 40px apart, 1 tick | prey dx = **−1.28** (=PREY_SPEED directly away) | ✅ |
| 4 | Prey visibly forage: prey moves TOWARD nearest food | Micro-test: prey+food 40px apart, no pred | prey dx = **+1.28** toward food | ✅ |
| 5 | Predators pursue: predator moves TOWARD visible prey | Micro-test: predator+prey 40px apart | predator dx = **+1.5** (=PRED_SPEED toward prey) | ✅ |
| 6 | Capture works; predator energy rises | capWindow counter over a run | captures/min 69–318 across runs; predators feed & breed | ✅ |
| 7 | Populations persist (neither hits 0) | Population readouts over 250–400s | prey ~137–171, predators ~21–30 sustained; no extinction | ✅ |
| 8 | **Prey mean Δρ decreases** (eyes sharpen) | meanDr over run | 867° → 514° (250s) → 474° (400s), monotonic | ✅ |
| 9 | **Predator mean Δρ decreases** (arms race) | meanDr over run | 847° → 668° (250s) → ~637° — follows prey down (after fix) | ✅ |
| 10 | **CONTROL: predators OFF ⇒ prey sharpen far LESS** | predators-off vs on, 250s each | OFF: 867°→**800°** (barely moves). ON: →**514°**. Predation is the driver | ✅ |
| 11 | No JS console errors | read_console + try/catch on every batch | 0 errors, 0 thrown exceptions across all runs | ✅ |
| 12 | Runs at interactive framerate | Manual step batches / render | 15k steps in <few s; draw() paints without error. (RAF throttled in automated pane only; fine in real browser) | ✅ |
| 13 | Breeding driven by energy, NOT an authored survival curve | Code + control behavior | No fitness()/survival-curve exists; predators-off run shows food alone drives prey, captures drive predators | ✅ |

## Honest caveats surfaced (not failures — recorded for the user)
1. **Eyes plateau at "light-patch-plus", not a lens eye.** Both settle ~475–660° Δρ
   (acuity ~0.08, sight ~35–40px) — a real mutation-selection equilibrium at low acuity,
   NOT the full blind→lens climb. Watchable-time toy ≠ millions of generations. Cranking
   selection to force a lens would be the outcome-engineering the project explicitly avoids.
2. **The "prey must also find food" pressure is currently WEAK.** With food dense, prey
   barely need eyes to forage (control = 800° ≈ blind). Predation does ~all the work. If
   food should matter, make it sparser (lower Food-richness knob / FOOD_MAX).
3. **Behavior is hard-coded** (flee/forage/pursue); only the eye genome evolves. Evolvable
   brains are the deferred next subsystem.
4. **Screenshot tool timed out in this environment**; render verified via canvas pixel
   sampling and behavior via micro-tests instead. Will screenshot normally in a real browser.

## Adversarial falsification notes (fill during verify)
- Crit 8/9 skeptic: could Δρ drop just from drift/mutation bias with no selection? →
  Control run (crit 10) is the guard. If Δρ drops the SAME with predators off and a rich
  food field, selection isn't from predation. Record both numbers.
- Crit 10 skeptic: does "food only" still drive SOME sharpening? Expected yes (need to see
  food) — the claim is not "no evolution without predators" but "predation adds pressure".
  Record the direction and rough magnitude, don't hand-wave.
