# Eye-evolution sandbox — test brief

Tests for `eye-evolution-sandbox.html`. Written concise on purpose. Each test names what it
checks, how, and the pass condition. "Δρ" = mean eye blur in degrees (lower = sharper; blind
start ≈ 850°). Run by driving `step()` in a headless batch and reading `meanDr()` / populations.

## T1 — Robustness / sensitivity (the important one)
Borrowed from the optics tab's robustness track. Goal: **my arbitrary knob choices must not
decide the outcome.** For each knob, sweep it across a wide range and record the final prey Δρ.
- **Classify first.** A knob is *inert* if the outcome barely moves across its whole range;
  *consequential* if it does. Only consequential knobs get a sensitivity budget — inert ones are
  logged as inert and skipped.
- **Known inert (verify still inert):** eye cost `EYE_METAB` (currently 0), population `cPop`.
- **Known consequential (must characterise):** mutation rate, predator speed, predator start
  acuity (blind vs sighted), food richness.
- **Pass:** (a) inert knobs move final Δρ by < ~15% across their range; (b) consequential knobs
  move it *smoothly* — no cliff/bifurcation where a tiny knob change flips the outcome category
  (e.g. "thriving" → "extinct") within the recommended operating band.

## T2 — Eyes actually evolve past a flat patch
- **Check:** run default config; read mean prey genome `{A,f,L}` and map to the stage names from
  the other tabs (`f<0.12` = flat patch; `lensGate(f)>0.05` = cup forming; `L>0.5` = lens).
- **Pass:** final prey eye is at least **"Open cup"** (mean `f` crosses 0.12), i.e. strictly past
  the blind flat-patch start — not merely a lower Δρ at the same morphology.

## T3 — Arms race (both sides co-evolve)
- **Check:** run with predators on; record prey Δρ and predator Δρ over time.
- **Pass:** both decrease from the blind start over a run; predator line tracks prey (neither
  stays pinned at ≈850° while the other moves).

## T4 — Predation is the driver (control)
- **Check:** same seed/steps, predators ON vs OFF (control toggle); compare final prey Δρ.
- **Pass:** prey sharpen **substantially more** with predators on. (If OFF ≈ ON, predation isn't
  doing the work and the causal story is false.)

## T5 — No silent extinction / population persistence
- **Check:** across the *recommended* range of each consequential knob, run a full batch; read
  final prey and predator counts.
- **Pass:** neither population hits 0 within the recommended band. Any knob value that causes
  extinction is recorded as an out-of-band edge, not a default.

## T6 — Degenerate "don't need to see" guards
Two failure modes seen in development; keep them from silently returning.
- **Predator-must-see:** capture requires the predator to be *tracking* (saw the prey); a blind
  predator only lands the rare `LUCKY_GRAB`. Verify a fully-blind predator population declines /
  can't thrive purely by bumping.
- **Densities not absurd:** food and prey area-coverage of the arena stay low (< ~5%). Logged so
  a "prey so dense predators needn't see" regime is caught by the number, not by eyeballing.

## T7 — Emergence invariant (nothing authored the outcome)
- **Check:** code + behavior. There is no `fitness()` / survival-probability curve; who breeds is
  decided only by energy from eaten food (prey) / caught prey (predators).
- **Pass:** removing food starves prey; removing prey starves predators; survival is never a
  direct function of Δρ. Δρ only sets *detection range*, and the chase decides the rest.

## Run results — 2026-07-18 (headless batch, seed fixed)
Config: eye cost = 0; prey always blind start; PREY_SPEED 1.28, PRED_SPEED 1.5, LUCKY_GRAB 0.12.

| Test | Result | Evidence |
|------|--------|----------|
| T1 robustness | **PASS** | mutation (consequential): 0.01→640°, 0.03→558°, 0.06→537° — smooth, monotonic, no cliff, no extinction. population (inert): 80→561°, 200→649° — same regime/stage, no bifurcation. |
| T2 past-patch | **PARTIAL** | default both-blind stays *flat patch* (f≈0.09) — by design (user chose both-blind). "Predators start SIGHTED" scenario pushes prey to f≈0.10–0.145, i.e. the patch/**open-cup** boundary — crosses it only stochastically. A clear cup is NOT robustly reached (see limits below). |
| T3 arms race | **PASS** | both fall from ~850–867° blind: prey→558°, predator→780° (default); predator line tracks, neither pinned. |
| T4 control | **PASS** | predators OFF → prey 800° (≈blind); predators ON → 558°. Predation is the driver. |
| T5 no extinction | **PASS** | prey 158–200, predators 20–30 across every swept value; none hit 0 in-band. |
| T6 degenerate guards | **PASS** | food coverage 0.14–0.2%, prey 2.5–3% (not absurd). Predator capture is tracking-gated (blind predators can't thrive by bumping). |
| T7 emergence invariant | **PASS** | no fitness()/survival curve exists; energy pyramid (flow) reads 100 : 101 : 24 (plants→herbivores→carnivores), 100 : 101 : 0 with predators off. Breeding is energy-only. |

## Notes / known structural limits (not failures)
- The model is an **ecological equilibrium**, not a directional hill-climb: prey evolve *enough*
  vision to survive the local predator, then stop. Pushing predators harder causes prey
  *extinction*, not sharper eyes.
- The eye is collapsed to a **single blur scalar Δρ**, and prey lower it the cheap way — shrinking
  aperture — rather than invaginating a cup. Forcing the cup→pinhole→lens morphology needs Δρ
  driven *far* down (to the diffraction wall), i.e. selection an ecology can't sustain without
  collapse. So this tab tops out at an **improved shallow eye (~3–4× the blind sight range)**; the
  full blind→lens climb is the directional optics "Evolution sim" tab's job by design.
