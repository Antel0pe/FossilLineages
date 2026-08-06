# Verification criteria — Lactase persistence interpolated map (2026-08-05)

## Task
From `lactase-persistence/data/LP_genotype_frequencies_2017.csv` (GLAD, Old World), build a map
that colours geography by lactase-persistence level, interpolates between sampled points, and puts
dots on the places actually sampled so measured is never confused with guessed.

## User's answers
- **Value:** column 12, `LP phenotype calculated from Genotype` (share of adults predicted lactase
  persistent). Not the allele sum.
- **Extrapolation:** land only, with a distance cutoff — far-from-any-sample land is explicit
  "no data", not an invented value.
- **Medium (mid-task correction):** *"just make it a python script that displays a plot or
  something"* — a matplotlib script, not an HTML page. The half-built HTML/JS version was deleted.

## Deliverable
`lactase-persistence/lp_map.py` → interactive matplotlib window (falls back to PNG with no display)
plus `lactase-persistence/lp_map.png`.

## Acceptance criteria and observed results

| # | Criterion | Check method | Observed | Pass |
|---|-----------|--------------|----------|------|
| A1 | Every row with parseable lon/lat/phenotype is mapped | script prints count; independent CSV scan | 434 populations, matches the independent scan | ✅ |
| A2 | Dropped rows are reported with a reason, and none is a real population | script prints each drop | 2 drops, both footnote lines ("Note that many studies…", "Please notify d.swallow@ucl.ac.uk…"); 16 blank rows | ✅ |
| A3 | No lat outside [-90,90], lon outside [-180,180], phenotype outside [0,1] | `assert` in `load_points`; run fails loudly | run completes, no assertion raised | ✅ |
| A4 | Co-located populations are not silently stacked under one dot | count coordinate collisions | 434 populations → 343 sites; 65 sites pool ≥2 populations (Israel: 8, spanning 7%–50%). Site value = chromosome-weighted mean; hover lists every member | ✅ |
| B1 | Interpolation uses great-circle distance, not Euclidean degrees | read `idw()` | lon/lat → 3-D unit vectors, chord distance ×6371 km | ✅ |
| B2 | At an isolated sampling site, interpolation returns that site's measured value | test every site >25 km from any other | 297/297 within 0.01 | ✅ |
| B2b | Sites closer than 25 km blend with their neighbour | report max shift | 46 sites, max shift 0.020 — by design, disclosed | ✅ |
| B3 | IDW never overshoots [0,1] | scan raster | 0.000..0.998 over 221,757 cells | ✅ |
| B4 | Land past the cutoff renders as "no data", not gradient | look at the PNG | 11,666 land cells left grey; Australia, interior Greenland, NE Siberian tip visibly grey in the render | ✅ |
| B5 | Ocean is never coloured by the gradient | look at the PNG | raster masked to land polygons; Mediterranean/Indian Ocean/Atlantic render as sea | ✅ |
| C1 | Sequential = one hue, light→dark, no rainbow | read `RAMP` | 13-step single-hue blue ramp from the reference palette | ✅ |
| C2 | Legend shows value→colour with % ticks plus a no-data key | look at the PNG | colourbar 0/25/50/75/100%, legend keys for site, no data, sea | ✅ |
| C3 | Sample dots read as discrete marks over the field | look at the PNG | each dot has a 1.1 px surface-coloured ring; dense European cluster still resolves as separate dots | ✅ |
| C4 | Sea and no-data are distinguishable | look at the PNG | FAILED first render (`#eeedea` vs `#cbcac4`, too close) → changed to `#f3f2f0` / `#bab8af`, re-rendered, now clearly distinct | ✅ (after fix) |
| C5 | Title and subtitle do not collide | look at the PNG | FAILED first render (subtitle overlapped the title baseline) → title pad 16→38, re-rendered clean | ✅ (after fix) |
| D1 | Hovering a dot names the populations, country, n, and % | synthesize a `motion_notify_event` at a dot | multi-population site returns "MEASURED / 8 populations · Israel / 23% / 1190 chromosomes" plus all 8 members | ✅ |
| D2 | Hovering non-sampled land labels the value as interpolated | synthesized hover at 15°E 22°N | "INTERPOLATED — not measured / ≈ 36%" | ✅ |
| D3 | Hovering no-data land says so; hovering sea shows nothing | synthesized hovers at 133°E 24°S and 75°E 15°S | "NO DATA / nearest sample >1,500 km away"; sea → annotation hidden | ✅ |
| E1 | Source and modern-population caveat stated on the figure | read the rendered caption | "GLAD, UCL, 2017 — 434 modern populations at 343 sites" | ✅ |
| E2 | Interpolation method and cutoff stated in plain words | read the rendered caption | "inverse-distance weighting (1/d², great-circle, tapered to 0 at 2,000 km), land only" | ✅ |
| F1 | Verified by LOOKING at the rendered map, not by "it ran" | read the PNG back as an image, twice | two render passes reviewed; both fixes above came from looking | ✅ |
| F2 | Script exits cleanly with no display available | run in a headless shell | falls back to Agg, writes the PNG, exit 0 | ✅ |

## Known limitation, disclosed on the figure
Interpolation assumes lactase persistence varies smoothly with geography. That is roughly true
across a continuous farming region and quite false across a sharp cultural or ecological boundary.
The dots are the data; the smooth field is a sketch.

## Not verified
The interactive window itself could not be opened from this environment — WSLg's X server refused
`DISPLAY=:0` from a non-interactive shell (`TclError: couldn't connect to display ":0"`). The hover
callbacks were verified by synthesizing `motion_notify_event`s against a real figure instead, and
the script now degrades to a PNG rather than crashing when no display exists. Whether a window
actually appears on the user's own WSL terminal is untested.
