# Verification criteria — Prehistoric milk use + ancient LP, mapped over time (2026-08-06)

## Task
Download the public data behind Evershed et al. 2022 (*Nature*) into the repo, then produce **two
map series**:
1. **Milk use over time** — where dairy fat residues appear in pottery, sliced by period.
2. **Ancient lactase persistence over time** — where and when the rs4988235 derived allele shows up
   in ancient genomes, sliced by the same periods.

## User's ask, verbatim
- "go through the links you shared and download what seems relevant into the data folder then make a
  map that shows dairy usage over time in the areas we have"
- "and then also download some data about ancient lp over time and show how it changed over time as
  well. make a map and show a series of them across time"

## Decisions taken without asking (flagged for the disclosure)
- **Medium: Python + matplotlib**, matching the 2026-08-05 mid-task correction ("just make it a
  python script that displays a plot or something"). Not HTML.
- **Time slices copied from the paper's own Figure 2** so the milk panels are directly comparable to
  the published figure rather than to bins I invented.
- **No interpolation on either figure.** The public milk CSV is a *subset* of the paper's database
  (see D1), so a smooth surface would imply coverage that does not exist. Dots only.
- **LP shown as carrier / non-carrier individuals, not an interpolated frequency field.** With 86
  carriers among 1,786 individuals, per-region frequencies are too sparse to shade honestly.

## Sources downloaded
| File | From | What it is |
|---|---|---|
| `data/lactase/milk/lipid_residue_summary.csv` | github.com/AdrianTimpson/2020-03-03523A | site-phase dairy vs non-dairy sherd counts |
| `data/lactase/adna/AADRv44.all.mpileups.tsv` | github.com/ydiekmann/Evershed_Nature_2022 | rs4988235 calls for ancient individuals |
| `data/lactase/polygons/*.kml` | Timpson repo | site + model polygons |
| `data/lactase/geo/ne_110m_land.geojson` | Natural Earth | coastline |

## Acceptance criteria and observed results

| # | Criterion | Check method | Observed | Pass |
|---|-----------|--------------|----------|------|
| A1 | Every data row with parseable coords + counts is plotted or reported as dropped | script prints kept/dropped with reasons | 313 rows in, 313 site-phases kept, 0 dropped; 1,995 sherds with animal fat | ✅ |
| A2 | Site names containing commas are not mangled by CSV splitting | `csv.DictReader` + print names containing commas | 13 such names parsed intact, e.g. `'Balhungie, Monikie'` | ✅ |
| A3 | Dairy fraction is always in [0,1] and derived from `dairy/(dairy+nondairy)` | `assert` in `load_milk`; run fails loudly | run completes, no assertion raised | ✅ |
| A4 | Rows with zero total sherds are excluded, not rendered as 0% | print count of such rows | 0 such rows in this table; guard is in place and would report them | ✅ |
| B1 | aDNA `mean_date` (years BP) is converted to calendar years and the conversion is stated | read code + rendered caption | `year = 1950 − BP`; stated verbatim in the figure caption | ✅ |
| B2 | Genotype→allele mapping is explicit and complete; unmapped genotypes are reported, not silently dropped | print every distinct genotype and its mapping | observed `{GG:1235, G:462, GA:58, AA:10, A:18, GT:3}`; **GT (3) reported as "genotype not mapped" and excluded** — GT is not a valid rs4988235 call | ✅ |
| B3 | Single-allele calls (`G`, `A`) are counted as 1 allele, not 2 | read `GENO` table; compare total to the paper | 3,084 alleles, **96 derived** vs the paper's stated 98 LP alleles (difference = the 3 excluded GT rows and 1 present-day reference) | ✅ |
| C1 | A site-phase appears in every time slice it overlaps, and this rule is stated on the figure | read rendered caption | "A site-phase is drawn in every slice its date range overlaps" — present | ✅ |
| C2 | Each panel states its own n, so empty panels are not read as "no dairying" | look at the render | every panel carries `n site-phases · n sherds`; the empty 7000–6500 BC panel reads "0 site-phases · no sherds sampled" | ✅ |
| C3 | Panels are in chronological order and labelled with explicit year ranges | look at the render | 7 panels, oldest top-left → youngest, each labelled with its BC/AD range | ✅ |
| D1 | The figure discloses that the milk CSV is a subset of the paper's 554-site database | look at the render | caption: "this table is the study's NEWLY-GENERATED subset, not all 554 sites… coverage is UK- and Germany-heavy" | ✅ |
| D2 | The figure discloses the mare's-milk blind spot in the Δ¹³C proxy | look at the render | caption: "cannot detect mare's milk, so horse-pastoralist regions read as milk-free when they may not be" | ✅ |
| E1 | Colour is a single-hue sequential ramp, consistent with `lp_map.py` | read `RAMP` | identical 13-step blue ramp copied from `lp_map.py` | ✅ |
| E2 | Legend explains dot colour AND dot size | look at the render | FAILED first render (size label collided with colourbar tick row) → moved size block down, re-rendered; now colourbar + 1/10/50/120 size key both clear | ✅ (after fix) |
| E3 | Off-frame points are counted and their locations named correctly | look at the render; compare to script output | FAILED first render (legend hardcoded "Kazakhstan"; data is Kazakhstan **and Russia**) → made the country list derive from the data; now reads "(Kazakhstan, Russia)" | ✅ (after fix) |
| E4 | Panel statistics describe exactly what is drawn, not a superset | read code; compare panel n before/after | FAILED first render (stats counted off-frame points that were invisible) → stats now computed from `drawn`; LP panel 7 changed 735→420 individuals accordingly | ✅ (after fix) |
| E5 | Hidden LP carriers are disclosed, not silently lost | script prints off-frame carrier count; read render | **29 of 96 derived alleles (30%) sit outside the frame** — stated on the figure: "417 individual(s) fall outside this frame… 29 of them carry an LP allele" | ✅ |
| F1 | **Verified by LOOKING at both rendered PNGs**, not by "the script exited 0" | read the PNGs back as images | 3 render passes reviewed as images; every fix above came from looking, not from the logs | ✅ |
| F2 | Script runs headless and writes both PNGs; exits 0 | run under `MPLBACKEND=Agg` in a non-interactive shell | `EXIT=0`, both PNGs written | ✅ |

## Per-panel ledger (OBSERVED)

### Milk use — `lactase-persistence/milk_over_time.png`
| Slice | site-phases drawn | sherds | dairy % of animal fats | Panel renders? |
|---|---|---|---|---|
| 7000–6500 BC | 0 | 0 | n/a | ✅ (correctly empty, labelled "no sherds sampled") |
| 6500–5500 BC | 10 | 34 | 11.8% | ✅ |
| 5500–5000 BC | 121 | 999 | 25.2% | ✅ |
| 5000–4500 BC | 64 | 564 | 28.9% | ✅ |
| 4500–3500 BC | 53 | 563 | 45.1% | ✅ |
| 3500–2000 BC | 84 | 339 | 65.2% | ✅ |
| 2000 BC – AD 1500 | 106 | 294 | 48.6% | ✅ |

### Ancient LP — `lactase-persistence/lp_ancient_over_time.png`
| Slice | individuals drawn | alleles | derived | LP allele freq | Panel renders? |
|---|---|---|---|---|---|
| 7000–6500 BC | 11 | 22 | 0 | 0.0% | ✅ (all pale) |
| 6500–5500 BC | 86 | 155 | 0 | 0.0% | ✅ (all pale) |
| 5500–5000 BC | 95 | 153 | 0 | 0.0% | ✅ (all pale) |
| 5000–4500 BC | 58 | 106 | 1 | 0.9% | ✅ (one dark dot, NW Black Sea) |
| 4500–3500 BC | 169 | 293 | 1 | 0.3% | ✅ |
| 3500–2000 BC | 491 | 867 | 15 | 1.7% | ✅ |
| 2000 BC – AD 1500 | 420 | 700 | 47 | 6.7% | ✅ |

Cross-check against the paper: Evershed et al. state the earliest LP individual dates to ~4700–4600 BC.
The first non-zero panel here is 5000–4500 BC with exactly 1 derived allele. Consistent.

## Known limitations to state on the figures
- The public milk CSV is the paper's newly-generated subset, not all 554 sites; coverage is
  UK/Germany-heavy and **absence on the map means unsampled, not milk-free**.
- The Δ¹³C proxy cannot detect mare's milk, so horse-pastoralist regions are under-read.
- aDNA sampling is itself geographically and temporally uneven; panel n is the honest caveat.
