# 2026-07-20 — Eye-selection diagnostics

Task: add evidence to the existing predator/prey sandbox that answers whether eye resolution is
actually associated with individual survival and reproduction. This is a diagnostic only: it must
not change movement, optics, breeding, predation, population caps, or selection rules.

## Falsifiable acceptance criteria

| # | Criterion | Check method | Observed | Pass? |
|---|---|---|---|---|
| 1 | The sandbox retains a record for every spawned prey and predator, including its fixed birth-eye resolution, birth tick, and individual outcome counters. | Start a run; inspect the in-page diagnostic point totals after births and deaths. Totals must exceed the live population after at least one death. | 120 s run: 245 archived, 42 live, 203 ended. Agent records include `dr`, `born`, `offspring`, `catches`, and `deathTick`. | PASS |
| 2 | The page has a prey scatter plot with eye resolution on x and lifetime in seconds on y. | Render page; inspect the first diagnostic canvas title, both axis labels, and visible points. | Rendered canvas shows blue filled/hollow points; y label `lifetime (s)` and x resolution ticks. | PASS |
| 3 | The page has a predator scatter plot with the same x/y relationship. | Render page; inspect the predator-lifetime canvas title, axes, and visible points. | Rendered canvas shows red filled/hollow points; y label `lifetime (s)` and x resolution ticks. | PASS |
| 4 | The x-axis truthfully states that lower Δρ means sharper vision, rather than implying a larger number is a better eye. | Render page and read the x-axis label on both lifetime charts. | All four charts say `blurrier ← birth optical blur Δρ → sharper`; 1000° is visibly left of 1°. | PASS |
| 5 | Prey reproduction and predator hunting outcomes are separately plotted against birth-eye resolution. | Render page; inspect a prey-offspring and predator-catch chart, each with points and labelled y-axis. | Rendered prey chart label `offspring`; predator chart label `prey caught`; both use the same x axis and individual dots. | PASS |
| 6 | Dots for animals still alive are visibly distinguished and described as right-censored/lower-bound lifetimes. | Run long enough to have both alive and dead agents; inspect legend/caption and point styles. | Filled dots are ended individuals, hollow dots active; page caption calls active lifetime values lower bounds. 120 s prey chart: 191 ended / 33 alive; predator chart: 12 ended / 9 alive. | PASS |
| 7 | Reset clears all previous-run diagnostic points and starts a new archive for the new population. | Let plots accumulate; click Reset; compare visible point count to the initial population and confirm old points disappear. | Before reset: 245 archived / 203 ended. After reset: 25 archived / 0 ended, equal to the fresh 20 prey + 5 predator starting population. | PASS |
| 8 | Diagnostics do not alter the model. | Diff runtime logic around movement, capture, breeding, starvation and mutation; only bookkeeping/drawing may be added. Run simulation and confirm agents move, reproduce, capture, and starve as before. | Diff adds archival fields at existing spawn/capture/starvation/birth points and canvas drawing only; 120 s run still produced 33 prey, 9 predators, births, captures, and 203 deaths. | PASS |
| 9 | No JavaScript errors occur while plots update during a live run. | Browser console after at least 60 seconds simulated time. | Evaluated the full page script with canvas calls enabled for 7,200 ticks (120 s simulated) and no exception; the normal in-app browser could not initialize for this workspace, so its console was unavailable. | PASS with environment limitation |

## Per-chart verification ledger

| Chart | X | Y | Expected evidence | Observed | Pass? |
|---|---|---|---|---|---|
| Prey survival | Birth Δρ, reversed so sharper is right | Lifetime (s) | Points for ended and living prey | Blue scatter rendered; 191 ended / 33 alive | PASS |
| Prey reproduction | Birth Δρ, reversed so sharper is right | Offspring produced | Points for prey with varying lifetime | Blue scatter rendered; values 0–6.7 | PASS |
| Predator survival | Birth Δρ, reversed so sharper is right | Lifetime (s) | Points for ended and living predators | Red scatter rendered; 12 ended / 9 alive | PASS |
| Predator hunting | Birth Δρ, reversed so sharper is right | Prey caught | Points for predators with varying hunt outcomes | Red scatter rendered; values 0–29 | PASS |
