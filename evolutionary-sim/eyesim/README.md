# eyesim — Cambrian eye-evolution simulator

Implements [eye-sim-build-spec.md](../eye-sim-build-spec.md). Results and honest
limitations in [REPORT.md](REPORT.md).

## Design rule

**The environment is encoded; the outcome is not.** Nothing in the energy, survival,
reproduction or capture path may read acuity, and no Nilsson "class" appears in any
branch — classes are labels applied when reading output. `verify.mjs` enforces both by
source inspection (I1, I3).

Perception is pure physics: Land's sensitivity equation for photon catch, quadrature blur
for angular resolution, and the Rose criterion (`|C|·sqrt(N) >= 2`) for detection. There
is no detection-range parameter anywhere.

## Layout

| File | Contains |
|---|---|
| `core/constants.mjs` | Every SET value, transcribed from the build spec |
| `core/genome.mjs` | Every EVOLVED value — eye morphology and behaviour |
| `core/optics.mjs` | Perception. Land equation, blur, contrast, Rose criterion |
| `core/light.mjs` | Diel cycle, depth attenuation, background radiance by view direction |
| `core/resources.mjs` | Phytoplankton, mat, carrion fields with depletion and regrowth |
| `core/spatial.mjs` | Uniform grid hash |
| `core/world.mjs` | The simulation: episodes, agents, predation, reproduction |
| `run.mjs` | CLI runner and sweeps |
| `verify.mjs` | Invariants and acceptance criteria |
| `analyze.mjs` | Reads traces, reports trajectories, gene ordering, sparklines |

## Quick start

```bash
bun evolutionary-sim/eyesim/run.mjs --generations 900 --nobearing --tag test
```

```bash
bun evolutionary-sim/eyesim/verify.mjs && bun evolutionary-sim/eyesim/analyze.mjs
```
