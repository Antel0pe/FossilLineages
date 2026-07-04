export type Source = {
  id: string;
  citation: string;
  url: string;
};

export const SOURCES: Record<string, Source> = {
  alvarez1980: {
    id: "alvarez1980",
    citation:
      "Alvarez, L.W., Alvarez, W., Asaro, F. & Michel, H.V. (1980). Extraterrestrial Cause for the Cretaceous-Tertiary Extinction. Science 208(4448), 1095–1108.",
    url: "https://doi.org/10.1126/science.208.4448.1095",
  },
  sciAdv2021Iridium: {
    id: "sciAdv2021Iridium",
    citation:
      "Goderis, S. et al. (2021). Globally distributed iridium layer preserved within the Chicxulub impact structure. Science Advances 7(9).",
    url: "https://www.science.org/doi/10.1126/sciadv.abe3647",
  },
  chicxulubWiki: {
    id: "chicxulubWiki",
    citation: "Chicxulub crater — Wikipedia (overview + ejecta locality counts)",
    url: "https://en.wikipedia.org/wiki/Chicxulub_crater",
  },
  pnas2020Soot: {
    id: "pnas2020Soot",
    citation:
      "Junium, C.K. et al. (2020). Organic matter from the Chicxulub crater exacerbated the K–Pg impact winter. PNAS 117(41), 25313–25320.",
    url: "https://doi.org/10.1073/pnas.2004596117",
  },
  natGeo2023Dust: {
    id: "natGeo2023Dust",
    citation:
      "Senel, C.B. et al. (2023). Chicxulub impact winter sustained by fine silicate dust. Nature Geoscience 16, 1033–1040.",
    url: "https://www.nature.com/articles/s41561-023-01290-4",
  },
  lpiKring: {
    id: "lpiKring",
    citation: "Kring, D.A. Chicxulub Impact Event — Global Effects. Lunar and Planetary Institute.",
    url: "https://www.lpi.usra.edu/science/kring/Chicxulub/global-effects/",
  },
  keller1988: {
    id: "keller1988",
    citation:
      "Keller, G. (1988). Extinction, survivorship and evolution of planktic foraminifera across the Cretaceous/Tertiary boundary at El Kef, Tunisia. Marine Micropaleontology 13(3), 239–263.",
    url: "https://www.sciencedirect.com/science/article/abs/pii/0377839888900059",
  },
  yale2019Ocean: {
    id: "yale2019Ocean",
    citation: "Yale News (2019). Mystery solved: ocean acidity in the last mass extinction.",
    url: "https://news.yale.edu/2019/10/21/mystery-solved-ocean-acidity-last-mass-extinction",
  },
  pmc2021Ecosystem: {
    id: "pmc2021Ecosystem",
    citation:
      "Ecosystem function after the K/Pg extinction: decoupling of marine carbon pump and diversity. PMC8220277.",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8220277/",
  },
  nybgFernSpike: {
    id: "nybgFernSpike",
    citation:
      "New York Botanical Garden. Surviving a mass extinction: Lessons from the K-Pg fern spike.",
    url: "https://www.nybg.org/science-project/surviving-a-mass-extinction-lessons-from-the-k-pg-fern-spike/",
  },
  kpgWiki: {
    id: "kpgWiki",
    citation: "Cretaceous–Paleogene extinction event — Wikipedia (fern spike + vegetation pattern sections)",
    url: "https://en.wikipedia.org/wiki/Cretaceous%E2%80%93Paleogene_extinction_event",
  },
  longrich2012: {
    id: "longrich2012",
    citation:
      "Longrich, N.R., Bhullar, B.-A.S. & Gauthier, J.A. (2012). Mass extinction of lizards and snakes at the Cretaceous–Paleogene boundary. PNAS 109(52), 21396–21401.",
    url: "https://doi.org/10.1073/pnas.1211526110",
  },
  hellCreekWiki: {
    id: "hellCreekWiki",
    citation: "Paleobiota of the Hell Creek Formation — Wikipedia",
    url: "https://en.wikipedia.org/wiki/Paleobiota_of_the_Hell_Creek_Formation",
  },
  pnas2020Asteroid: {
    id: "pnas2020Asteroid",
    citation:
      "Hull, P.M. et al. (2020). On impact and volcanism across the Cretaceous-Paleogene boundary. PNAS/Science context paper.",
    url: "https://doi.org/10.1073/pnas.2006087117",
  },
  depalma2019Tanis: {
    id: "depalma2019Tanis",
    citation:
      "DePalma, R.A. et al. (2019). A seismically induced onshore surge deposit at the KPg boundary, North Dakota. PNAS 116(17), 8190–8199.",
    url: "https://doi.org/10.1073/pnas.1817407116",
  },
  smithsonianTanis: {
    id: "smithsonianTanis",
    citation:
      "Smithsonian Magazine (2019). Fossil Site May Capture the Dinosaur-Killing Impact, But It's Only the Beginning of the Story.",
    url: "https://www.smithsonianmag.com/science-nature/fossil-site-captures-dinosaur-killing-impact-its-only-beginning-story-180971868/",
  },
  sciReports2021Tanis: {
    id: "sciReports2021Tanis",
    citation:
      "Sci. Reports (2021). Seasonal calibration of the end-Cretaceous Chicxulub impact event.",
    url: "https://www.nature.com/articles/s41598-021-03232-9",
  },
};

export type Phase = "before" | "during" | "after";

export type EvidenceSource = {
  id: string;
  shortLabel: string;
  name: string;
  kicker: string;
  color: string;
  confidence: "settled" | "debated";
  caveat?: string;
  phases: Record<Phase, string[]>;
  why: string[];
  sourceIds: string[];
};

export const PHASE_LABELS: Record<Phase, string> = {
  before: "Before",
  during: "During",
  after: "After",
};

export const EVIDENCE: EvidenceSource[] = [
  {
    id: "boundary-clay",
    shortLabel: "Boundary clay",
    name: "The iridium spike, shocked quartz & spherule layer",
    kicker: "The fingerprint",
    color: "#8a6d3b",
    confidence: "settled",
    phases: {
      before: [
        "In the tens of thousands of years before the boundary, marine sections worldwide show ordinary limestone or chalk sedimentation — the normal, slow accumulation of shells and mud on the sea floor, with no unusual chemistry.",
      ],
      during: [
        "A thin layer — often just millimeters to a few centimeters thick — sits directly at the boundary at sites across the globe. It's enriched in iridium 100 to 10,000 times above normal background levels, an element that's rare in Earth's crust but far more common in asteroids and comets.",
        "The same layer, at many of the same sites, also contains shocked quartz (mineral grains deformed by pressures only a high-energy impact produces) and small glass spherules — droplets of rock melted and flung into the atmosphere, then re-solidified as they fell back to Earth. A cataloguing effort found iridium anomalies at 113 localities worldwide, shocked quartz at 28, spherules at 54, and Ni-rich spinel at 18 — a global signature, not a local one.",
      ],
      after: [
        "Above the layer, ordinary sedimentation resumes — but everything about the fossils in it has changed: the diverse Cretaceous marine and terrestrial life below the layer is gone above it, replaced by a much narrower set of survivors.",
      ],
    },
    why: [
      "This is why we blame an asteroid at all. Iridium alone could (barely) be explained by intense volcanism, but the combination — iridium plus shocked quartz plus melt-glass spherules, at dozens of sites worldwide, all in the same paper-thin layer — is the specific forensic signature of a single, giant impact, not a slow geological process. It's the fingerprint that started the entire investigation in 1980.",
    ],
    sourceIds: ["alvarez1980", "sciAdv2021Iridium", "chicxulubWiki"],
  },
  {
    id: "impact-winter",
    shortLabel: "Impact winter",
    name: "Soot, sunlight & temperature records",
    kicker: "The kill mechanism",
    color: "#3b3b46",
    confidence: "settled",
    caveat:
      "The exact severity and duration (years vs. a couple of years) is still refined as new models and proxies come in — the existence of a sharp, dark, cold pulse is not in serious doubt, but its precise length is.",
    phases: {
      before: [
        "Immediately pre-impact, the Cretaceous climate was a warm, stable greenhouse baseline — no unusual atmospheric darkening or cooling signal.",
      ],
      during: [
        "The impact vaporized carbon-rich target rock and ignited fires, injecting an estimated 7.5×10¹⁴ to 2.5×10¹⁵ grams of soot into the atmosphere, which is thought to have circulated the entire globe within hours. That soot, together with fine silicate dust and sulfate aerosols, cut sunlight reaching the surface by 80–85% and cooled the planet by an estimated 10–16°C.",
        "Modelling of the resulting darkness suggests photosynthesis-driving sunlight was suppressed for on the order of one to two years — long enough to collapse plant growth on land and phytoplankton growth in the ocean, the base of both food webs.",
      ],
      after: [
        "As soot and dust gradually settled out of the atmosphere, sunlight and temperatures recovered — but by the time light came back, the food webs that depended on continuous photosynthesis had already collapsed (see the foraminifera and fern-spike evidence below for what that collapse and recovery actually looked like).",
      ],
    },
    why: [
      "This is why the dying was global, not just local to the impact site. A crater in Mexico doesn't explain why marine reptiles in Europe or dinosaurs in Montana died at the same moment — a multi-year global blackout and cold snap, cutting off the base of the food chain everywhere at once, does.",
    ],
    sourceIds: ["pnas2020Soot", "natGeo2023Dust", "lpiKring"],
  },
  {
    id: "foraminifera",
    shortLabel: "Foraminifera",
    name: "Planktonic foraminifera (ocean plankton)",
    kicker: "The ocean collapse",
    color: "#2f6f9e",
    confidence: "settled",
    phases: {
      before: [
        "Cretaceous marine sections (e.g. El Kef, Tunisia — one of the most complete, most studied boundary sections in the world) show diverse assemblages of planktonic foraminifera, dozens of distinct species living in the surface ocean.",
      ],
      during: [
        "At the boundary itself, the overwhelming majority of Cretaceous foraminifera species vanish essentially instantly in the rock record. What's left afterward is dominated by one or two tiny, opportunistic survivor species — the classic 'Strangelove Ocean' signature of a food web that has lost almost all of its productivity at the base.",
      ],
      after: [
        "Recovery was slow and uneven: some shallow shelf settings show productivity returning within roughly 400,000 years, but low diversity persisted much longer in the open ocean, and specialist species took far longer than opportunists to reappear. Carbon-isotope records (tracking the ocean's 'biological pump') trace this drawn-out recovery directly.",
      ],
    },
    why: [
      "This is why the oceans crashed, not just why individual species died. Foraminifera and other phytoplankton sit at the base of the marine food web — when the base collapses, everything relying on it (ammonites, marine reptiles, fish) loses its food supply too. It's the same kill mechanism as the impact winter, but this is the direct fossil record of the food chain actually breaking.",
    ],
    sourceIds: ["keller1988", "yale2019Ocean", "pmc2021Ecosystem"],
  },
  {
    id: "fern-spike",
    shortLabel: "Pollen & fern spike",
    name: "Pollen and fern-spore record",
    kicker: "The land recovery",
    color: "#4c7a3d",
    confidence: "debated",
    caveat:
      "Whether the fern spike represents a clean, single global recovery template (versus a more local, patchy pattern that varies by site) is genuinely debated among palaeobotanists — it's real, but not as tidy or universal as the classic textbook version suggests.",
    phases: {
      before: [
        "Sediments just below the boundary are dominated by diverse angiosperm (flowering plant) pollen — a rich, varied Cretaceous flora.",
      ],
      during: [
        "Right at and just after the boundary, pollen diversity collapses and the record becomes dominated almost entirely by fern spores — the 'fern spike'. Ferns are classic disturbance/pioneer species, fast to recolonize scorched, light-starved ground where slower-growing flowering plants can't yet compete.",
      ],
      after: [
        "Ordinary angiosperm pollen diversity gradually returns above the fern-dominated layer. How long the fern-dominated interval lasted varies by site — roughly 1,000 years at one Denver Basin site, but estimates elsewhere range up to 30,000–71,000 years — before more typical plant diversity resumes.",
      ],
    },
    why: [
      "This is why and how the land recovered, not just that it was devastated. Ferns spreading first, ahead of flowering plants, is a genuine ecological signature of disaster recovery — the same kind of pattern seen after a modern wildfire, at a much larger scale. It's the plant-side counterpart to the foraminifera story: a base-of-the-web collapse, followed by an observable, staged recolonization.",
    ],
    sourceIds: ["nybgFernSpike", "kpgWiki"],
  },
  {
    id: "hell-creek",
    shortLabel: "Dinosaur record",
    name: "Vertebrate fossils of the Hell Creek Formation",
    kicker: "Why some survived",
    color: "#a13d2b",
    confidence: "debated",
    caveat:
      "Small-bodied dinosaurs specifically are badly under-represented in the fossil record (their bones rarely survived long enough to fossilize), so the clean 'size predicted survival' pattern is best supported in lizards and snakes, not fully demonstrated within dinosaurs themselves — a real gap the field is upfront about.",
    phases: {
      before: [
        "The Hell Creek Formation preserves a rich, diverse Late Cretaceous ecosystem: large dinosaurs (Tyrannosaurus, Triceratops) alongside a wide range of smaller reptiles, mammals, and amphibians.",
      ],
      during: [
        "At the boundary, essentially all non-avian dinosaurs disappear from the record. Among lizards and snakes — where the fossil record is good enough to test size directly — large-bodied species suffered near-total extinction while small-bodied ones survived at a much higher rate.",
      ],
      after: [
        "Above the boundary, non-avian dinosaurs are simply absent. Surviving lineages — small mammals, birds (avian dinosaurs), and small reptiles — expand rapidly into the ecological space left behind, the beginning of the mammal and bird radiations that eventually produce the modern world.",
      ],
    },
    why: [
      "This is why some animals survived and others didn't. Small body size let animals shelter from the worst of the heat pulse and get by on scarce food — detritus, seeds, insects, carrion — through the dark, cold years described in the impact-winter evidence above. Large, specialized animals with high food demands had nowhere to hide and nothing to eat.",
    ],
    sourceIds: ["longrich2012", "hellCreekWiki", "pnas2020Asteroid"],
  },
  {
    id: "tanis",
    shortLabel: "Tanis",
    name: "The Tanis site, North Dakota",
    kicker: "The freeze-frame",
    color: "#6b4c8a",
    confidence: "debated",
    caveat:
      "Tanis is a single site, first described in 2019. The fish-and-surge-deposit findings are peer-reviewed and hold up well; more dramatic claims associated with the site in popular coverage (such as dinosaur remains found directly alongside the surge) are less fully documented in peer-reviewed literature, and at least one researcher has questioned whether spherules could have been reworked into younger rock. Treat the core finding as solid and the more sensational claims as unconfirmed.",
    phases: {
      before: [
        "Tanis sat within the same Hell Creek river-channel ecosystem described in the dinosaur-record evidence above — an ordinary freshwater channel, nothing unusual about the setting itself.",
      ],
      during: [
        "Seismic waves from the Chicxulub impact — modeled as equivalent to a magnitude 10–11 earthquake — are estimated to have reached this site in under an hour, triggering a local seiche: a sloshing surge of water up the river channel. The surge buried fish that were still alive when it hit — roughly half of the fish examined at the site have glass ejecta spherules lodged in their gill rakers, meaning debris was still falling from the sky as they breathed it in.",
      ],
      after: [
        "The surge deposit buried the site almost immediately and it was never significantly disturbed afterward — so unlike the other sources here, Tanis isn't really an 'after' story. Its value is entirely in how tightly it timestamps the during: a single geological instant, not a slow decline.",
      ],
    },
    why: [
      "This is why the extinction was a catastrophe, not a slow decline. Every other source here shows a die-off over some span of time; Tanis is the closest anything gets to a stopwatch on the impact itself — fish breathing in falling ejecta, on the same day the seismic waves from a crater 3,000 km away arrived. It's the evidence that ties the crater in Mexico to a specific afternoon in North Dakota.",
    ],
    sourceIds: ["depalma2019Tanis", "smithsonianTanis", "sciReports2021Tanis"],
  },
];
