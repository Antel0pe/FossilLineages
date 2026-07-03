export type Source = {
  id: string;
  citation: string;
  url: string;
};

export const SOURCES: Record<string, Source> = {
  dryad: {
    id: "dryad",
    citation:
      "Grant, P.R. & Grant, B.R. (2013). Data from: 40 Years of Evolution: Darwin's Finches on Daphne Major Island. Dryad Digital Repository.",
    url: "https://datadryad.org/dataset/doi:10.5061/dryad.g6g3h",
  },
  boagGrant1981: {
    id: "boagGrant1981",
    citation:
      "Boag, P.T. & Grant, P.R. (1981). Intense natural selection in a population of Darwin's finches (Geospizinae) in the Galápagos. Science 214(4516), 82–85.",
    url: "https://doi.org/10.1126/science.214.4516.82",
  },
  priceEtAl1984: {
    id: "priceEtAl1984",
    citation:
      "Price, T.D., Grant, P.R., Boag, P.T. & Gibbs, H.L. (1984). Recurrent patterns of natural selection in a population of Darwin's finches. Nature 309, 787–789.",
    url: "https://doi.org/10.1038/309787a0",
  },
  gibbsGrant1987: {
    id: "gibbsGrant1987",
    citation: "Gibbs, H.L. & Grant, P.R. (1987). Oscillating selection on Darwin's finches. Nature 327, 511–513.",
    url: "https://doi.org/10.1038/327511a0",
  },
  grantGrant2002: {
    id: "grantGrant2002",
    citation:
      "Grant, P.R. & Grant, B.R. (2002). Unpredictable evolution in a 30-year study of Darwin's finches. Science 296(5568), 707–711.",
    url: "https://doi.org/10.1126/science.1070315",
  },
  grantGrant2006: {
    id: "grantGrant2006",
    citation:
      "Grant, P.R. & Grant, B.R. (2006). Evolution of character displacement in Darwin's finches. Science 313(5784), 224–226.",
    url: "https://doi.org/10.1126/science.1128374",
  },
};

export type YearPoint = { year: number; value: number };

// Annual mean beak length & beak depth (mm), G. fortis, Daphne Major.
// Exact per-year means, from Grant & Grant (2013) Dryad archive "Fig. 01-06 (also 7.3).csv"
// (identical to "Fig. 11-04.csv"), underlying Figure 1.6 / 7.3 / 11.4 of
// Grant & Grant, 40 Years of Evolution (Princeton, 2014). Not read off a chart image —
// these are the literal data-table values behind the published figures.
export const BEAK_LENGTH: YearPoint[] = [
  { year: 1973, value: 10.76 }, { year: 1974, value: 10.72 }, { year: 1975, value: 10.57 },
  { year: 1976, value: 10.64 }, { year: 1977, value: 10.73 }, { year: 1978, value: 11.04 },
  { year: 1979, value: 11.07 }, { year: 1980, value: 11.11 }, { year: 1981, value: 11.04 },
  { year: 1982, value: 11.06 }, { year: 1983, value: 11.03 }, { year: 1984, value: 10.93 },
  { year: 1985, value: 10.91 }, { year: 1986, value: 10.91 }, { year: 1987, value: 10.93 },
  { year: 1988, value: 10.93 }, { year: 1989, value: 10.91 }, { year: 1990, value: 10.89 },
  { year: 1991, value: 10.83 }, { year: 1992, value: 10.82 }, { year: 1993, value: 10.82 },
  { year: 1994, value: 10.84 }, { year: 1995, value: 10.74 }, { year: 1996, value: 10.81 },
  { year: 1997, value: 10.77 }, { year: 1998, value: 10.84 }, { year: 1999, value: 10.89 },
  { year: 2000, value: 10.92 }, { year: 2001, value: 10.75 }, { year: 2002, value: 10.78 },
  { year: 2003, value: 10.85 }, { year: 2004, value: 10.94 }, { year: 2005, value: 10.34 },
  { year: 2006, value: 10.31 }, { year: 2007, value: 10.32 }, { year: 2008, value: 10.28 },
  { year: 2009, value: 10.28 }, { year: 2010, value: 10.42 }, { year: 2011, value: 10.46 },
  { year: 2012, value: 10.51 },
];

export const BEAK_DEPTH: YearPoint[] = [
  { year: 1973, value: 9.48 }, { year: 1974, value: 9.42 }, { year: 1975, value: 9.19 },
  { year: 1976, value: 9.23 }, { year: 1977, value: 9.35 }, { year: 1978, value: 9.74 },
  { year: 1979, value: 9.78 }, { year: 1980, value: 9.81 }, { year: 1981, value: 9.75 },
  { year: 1982, value: 9.80 }, { year: 1983, value: 9.71 }, { year: 1984, value: 9.66 },
  { year: 1985, value: 9.62 }, { year: 1986, value: 9.48 }, { year: 1987, value: 9.31 },
  { year: 1988, value: 9.31 }, { year: 1989, value: 9.28 }, { year: 1990, value: 9.26 },
  { year: 1991, value: 9.21 }, { year: 1992, value: 9.19 }, { year: 1993, value: 9.18 },
  { year: 1994, value: 9.20 }, { year: 1995, value: 9.10 }, { year: 1996, value: 9.15 },
  { year: 1997, value: 9.12 }, { year: 1998, value: 9.11 }, { year: 1999, value: 9.14 },
  { year: 2000, value: 9.18 }, { year: 2001, value: 9.02 }, { year: 2002, value: 9.07 },
  { year: 2003, value: 9.12 }, { year: 2004, value: 9.19 }, { year: 2005, value: 8.68 },
  { year: 2006, value: 8.63 }, { year: 2007, value: 8.62 }, { year: 2008, value: 8.57 },
  { year: 2009, value: 8.51 }, { year: 2010, value: 8.52 }, { year: 2011, value: 8.57 },
  { year: 2012, value: 8.65 },
];

// Body size as PC1 of {mass, wing length, tarsus length} — a standardized composite index,
// NOT grams. No public annual mean-body-mass-in-grams series exists for this population
// (checked: absent from the Dryad "40 Years of Evolution" archive and from Grant & Grant
// 2002/2006, which themselves only report body size in these standardized PC1 units).
// Exact per-year values, from Grant & Grant (2013) Dryad archive "Fig. 11-03.csv", the data
// underlying Figure 2 of Grant & Grant (2006) Science 313:224.
export const BODY_SIZE_PC1: YearPoint[] = [
  { year: 1973, value: -0.041 }, { year: 1974, value: -0.065 }, { year: 1975, value: -0.609 },
  { year: 1976, value: -0.623 }, { year: 1977, value: -0.378 }, { year: 1978, value: 0.101 },
  { year: 1979, value: 0.18 }, { year: 1980, value: 0.203 }, { year: 1981, value: 0.006 },
  { year: 1982, value: 0.025 }, { year: 1983, value: -0.134 }, { year: 1984, value: -0.148 },
  { year: 1985, value: -0.239 }, { year: 1986, value: -0.41 }, { year: 1987, value: -0.644 },
  { year: 1988, value: -0.644 }, { year: 1989, value: -0.657 }, { year: 1990, value: -0.68 },
  { year: 1991, value: -0.785 }, { year: 1992, value: -0.806 }, { year: 1993, value: -0.749 },
  { year: 1994, value: -0.705 }, { year: 1995, value: -0.751 }, { year: 1996, value: -0.657 },
  { year: 1997, value: -0.766 }, { year: 1998, value: -0.714 }, { year: 1999, value: -0.678 },
  { year: 2000, value: -0.625 }, { year: 2001, value: -0.796 }, { year: 2002, value: -0.637 },
  { year: 2003, value: -0.606 }, { year: 2004, value: -0.327 }, { year: 2005, value: -1.164 },
  { year: 2006, value: -1.202 }, { year: 2007, value: -1.281 }, { year: 2008, value: -1.281 },
  { year: 2009, value: -1.26 }, { year: 2010, value: -1.228 }, { year: 2011, value: -1.228 },
  { year: 2012, value: -1.201 },
];

export type MetricKey = "beakLength" | "beakDepth" | "bodySize";

export const METRICS: {
  key: MetricKey;
  label: string;
  unit: string;
  points: YearPoint[];
  axisNote?: string;
}[] = [
  { key: "beakLength", label: "Beak length", unit: "mm", points: BEAK_LENGTH },
  { key: "beakDepth", label: "Beak depth", unit: "mm", points: BEAK_DEPTH },
  {
    key: "bodySize",
    label: "Body size",
    unit: "PC1 index",
    points: BODY_SIZE_PC1,
    axisNote:
      "Standardized composite of mass, wing length & tarsus length — no public annual mass-in-grams series exists for this population, so this is the real metric the Grants themselves tracked body size with.",
  },
];

export type CauseCategory = "baseline" | "drought" | "elNino" | "competitor";

export const CATEGORY_COLORS: Record<CauseCategory, string> = {
  baseline: "#9a9d8f",
  drought: "#c0562b",
  elNino: "#2f6f9e",
  competitor: "#7a3b8c",
};

export type CausalSection = {
  id: string;
  startYear: number;
  endYear: number;
  category: CauseCategory;
  title: string;
  blurb: string[];
  sourceIds: string[];
};

// Section boundaries and blurbs are derived from the real per-year data above plus the
// causal narrative in the cited papers — every section covers years actually visible moving
// in the direction the blurb describes; see verification-criteria/2026-07-02-grants-finches-lab.md
// section A for the paper trail behind each row.
export const SECTIONS: CausalSection[] = [
  {
    id: "pre-1976",
    startYear: 1973,
    endYear: 1975,
    category: "baseline",
    title: "Where the record starts",
    blurb: [
      "The Grants began measuring every finch on Daphne Major in 1973. For these first few years the population's beak length, beak depth, and body size all sit in a fairly ordinary range, with no single dramatic driver — just the normal wobble of birth, death, and weather from one breeding season to the next.",
      "This baseline matters because everything that follows is a deviation from it: the 1977 drought pushes beak depth up from about 9.2mm toward 9.8mm, and the 2005 crash later pushes it back down past where it started — both changes are only visible because this quiet stretch was measured first.",
    ],
    sourceIds: ["dryad", "grantGrant2002"],
  },
  {
    id: "drought-1977",
    startYear: 1976,
    endYear: 1982,
    category: "drought",
    title: "The 1977 drought, and the selection it kept producing",
    blurb: [
      "Almost no rain fell in 1977 (about 24mm, against roughly 135mm in a normal year). Small, soft seeds — the finches' preferred food — ran out first, leaving mostly large, hard Tribulus cistoides seed pods that only birds with bigger, deeper beaks could crack open. The population crashed from roughly 1,400 birds in 1975 to a few hundred by the end of 1977, and survival was heavily skewed toward the larger-beaked birds.",
      "Because beak depth is strongly heritable, the offspring born to those survivors inherited the larger average beak size — a directly observed generational shift, not just individual birds surviving better. Mean beak depth rose from about 9.2mm before the drought to nearly 9.8mm by 1980, and two further mortality episodes in 1980 and 1982 kept selecting in the same direction, holding beak size near its peak for several more years.",
    ],
    sourceIds: ["boagGrant1981", "priceEtAl1984"],
  },
  {
    id: "el-nino-1983",
    startYear: 1983,
    endYear: 1987,
    category: "elNino",
    title: "1983 El Niño floods the island — and reverses the pressure",
    blurb: [
      "1983 brought an extraordinary El Niño: about 1,359mm of rain fell that year, roughly 25 times a typical year's total. The flood of growth that followed — including vine growth so heavy it smothered cactus bushes — shifted the seed supply toward abundant small, soft seeds and away from the large hard seeds that had favored big beaks a few years earlier.",
      "With small seeds suddenly abundant, smaller-beaked birds no longer paid a survival cost for their size, and selection swung the other way. Mean beak depth eased back down from its 9.8mm peak toward roughly 9.3mm by 1987 — a real reversal in the same population, driven by the opposite kind of weather extreme.",
    ],
    sourceIds: ["gibbsGrant1987", "grantGrant2006"],
  },
  {
    id: "quiet-1988-2002",
    startYear: 1988,
    endYear: 2002,
    category: "baseline",
    title: "A long quiet stretch",
    blurb: [
      "For about fifteen years, beak depth, beak length, and body size all settle into a narrow, ordinary range with no single acute event driving them. Ordinary wet and dry seasons still push the population up and down slightly year to year, but nothing forces a sustained directional shift the way 1977 or 1983 did.",
      "This is the same kind of baseline as 1973–75 — the Grants' own framing is that evolution in this population is 'unpredictable' precisely because long calm stretches like this one are interrupted, unpredictably, by rare extreme events.",
    ],
    sourceIds: ["grantGrant2002"],
  },
  {
    id: "competitor-2004",
    startYear: 2003,
    endYear: 2006,
    category: "competitor",
    title: "The same kind of drought — the opposite result",
    blurb: [
      "Almost no rain fell in 2003 (16mm) or 2004 (25mm) — a drought as severe as 1977's. But this time a larger competitor, the large ground finch Geospiza magnirostris, had established a breeding population on Daphne Major since the 1982-83 El Niño, and had grown to several hundred birds by 2003. Magnirostris is far more efficient at cracking the same large Tribulus seeds that saved big-beaked fortis in 1977, and it physically crowded fortis out of the best feeding sites.",
      "With the large-seed niche now dominated by the competitor, large-beaked fortis lost the advantage that had saved them in 1977 — and instead starved in disproportionate numbers. Selection swung hard toward SMALLER beaks: mean beak depth fell by roughly 0.7 standard deviations in a single generation, described in the source paper as the strongest evolutionary change observed in the study's 33 years. The 2005 survivor sample was tiny — only 29 birds — a sign of just how severe the crash was.",
    ],
    sourceIds: ["grantGrant2006"],
  },
  {
    id: "new-normal-2007",
    startYear: 2007,
    endYear: 2012,
    category: "baseline",
    title: "Settling into a smaller normal",
    blurb: [
      "After the 2004-05 crash, beak depth, beak length, and body size all stabilize again — but at a distinctly smaller level than before 2003. There's no new acute shock driving these years; it's the same kind of ordinary, no-single-cause stretch as 1973-75 or 1988-2002, just centered on a new, lower baseline that the competitor's arrival left behind.",
      "That's the throughline of the whole 40-year record: long ordinary stretches, punctuated by rare extreme events (a drought, a flood, a new competitor) that each leave the population's average beak and body size measurably different than before.",
    ],
    sourceIds: ["grantGrant2006", "dryad"],
  },
];
