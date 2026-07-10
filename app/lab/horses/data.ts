export type HorseChangeBlock = {
  subject: string;
  text: string;
};

export type HorseCitation = {
  n: number;
  text: string;
  url?: string;
};

export type HorsePanel = {
  id: string;
  kind: "evolution" | "branch" | "deadend";
  title: string;
  dateRange: string;
  kindLabel: string;
  baseline: string;
  changes: HorseChangeBlock[];
  whyOfWhy: string;
  confidence: string;
  citationNs: number[];
};

export const SOURCES: Record<number, HorseCitation> = {
  1: {
    n: 1,
    text: "Zachos, J.C., Pagani, M., Sloan, L., Thomas, E., Billups, K. (2001). \"Trends, Rhythms, and Aberrations in Global Climate 65 Ma to Present.\" Science 292(5517):686-693.",
    url: "https://doi.org/10.1126/science.1059412",
  },
  2: {
    n: 2,
    text: "Zanazzi, A., Kohn, M.J., MacFadden, B.J., Terry, D.O. (2007). \"Large temperature drop across the Eocene-Oligocene transition in central North America.\" Nature 445:639-642.",
    url: "https://doi.org/10.1038/nature05551",
  },
  3: {
    n: 3,
    text: "MacFadden, B.J. (1986). \"Fossil horses from 'Eohippus' (Hyracotherium) to Equus: scaling, Cope's Law, and the evolution of body size.\" Paleobiology 12(4):355-369.",
  },
  4: {
    n: 4,
    text: "MacFadden, B.J. (1988). \"Fossil horses from 'Eohippus' (Hyracotherium) to Equus, 2: rates of dental evolution revisited.\" Biological Journal of the Linnean Society 35(1):37-48.",
    url: "https://doi.org/10.1111/j.1095-8312.1988.tb00457.x",
  },
  5: {
    n: 5,
    text: "Florida Museum of Natural History. \"Mesohippus.\" Fossil Horses in Cyberspace gallery.",
    url: "https://www.floridamuseum.ufl.edu/fossil-horses/gallery/mesohippus/",
  },
  6: {
    n: 6,
    text: "Florida Museum of Natural History. \"Parahippus.\" Fossil Horses in Cyberspace gallery.",
    url: "https://www.floridamuseum.ufl.edu/fossil-horses/gallery/parahippus/",
  },
  7: {
    n: 7,
    text: "Florida Museum of Natural History. \"Merychippus.\" Fossil Horses in Cyberspace gallery.",
    url: "https://www.floridamuseum.ufl.edu/fossil-horses/gallery/merychippus/",
  },
  8: {
    n: 8,
    text: "MacFadden, B.J. (1998). \"Equidae.\" In Janis, C.M., Scott, K.M., Jacobs, L.L. (eds.), Evolution of Tertiary Mammals of North America, Vol. 1. Cambridge University Press, pp. 537-559.",
  },
  9: {
    n: 9,
    text: "Kaiser, T.M. (2009). \"Anchitherium aurelianense (Equidae, Mammalia): a brachydont 'dirty browser' in the community of herbivorous large mammals from Sandelzhausen (Miocene, Germany).\" Paläontologische Zeitschrift 83:131-140.",
    url: "https://doi.org/10.1007/s12542-009-0002-z",
  },
  10: {
    n: 10,
    text: "Retallack, G.J. (1997). \"Neogene expansion of the North American prairie.\" PALAIOS 12(4):380-390.",
  },
  11: {
    n: 11,
    text: "Retallack, G.J. (2007). \"Cenozoic paleoclimate on land in North America.\" Journal of Geology 115(3):271-294.",
  },
  12: {
    n: 12,
    text: "MacFadden, B.J., Hulbert, R.C. (1988). \"Explosive speciation at the base of the adaptive radiation of Miocene grazing horses.\" Nature 336:466-468.",
    url: "https://www.nature.com/articles/336466a0",
  },
  13: {
    n: 13,
    text: "Mihlbachler, M.C., Rivals, F., Solounias, N., Semprebon, G.M. (2011). \"Dietary Change and Evolution of Horses in North America.\" Science 331(6021):1178-1181.",
    url: "https://doi.org/10.1126/science.1196166",
  },
  14: {
    n: 14,
    text: "Jardine, P.E., Janis, C.M., Sahney, S., Benton, M.J. (2012). \"Grit not grass: Concordant patterns of early origin of hypsodonty in Great Plains ungulates and Glires.\" Palaeogeography, Palaeoclimatology, Palaeoecology 365:1-10.",
    url: "https://doi.org/10.1016/j.palaeo.2012.09.001",
  },
  15: {
    n: 15,
    text: "Cerling, T.E., Harris, J.M., MacFadden, B.J., Leakey, M.G., Quade, J., Eisenmann, V., Ehleringer, J.R. (1997). \"Global vegetation change through the Miocene/Pliocene boundary.\" Nature 389:153-158.",
    url: "https://doi.org/10.1038/38229",
  },
  16: {
    n: 16,
    text: "Fox, D.L., Koch, P.L. (2003). \"Tertiary history of C4 biomass in the Great Plains, USA.\" Geology 31(9):809-812.",
    url: "https://doi.org/10.1130/G19580.1",
  },
  17: {
    n: 17,
    text: "Janis, C.M., Bernor, R.L. (2019). \"The Evolution of Equid Monodactyly: A Review Including a New Hypothesis.\" Frontiers in Ecology and Evolution 7:119.",
    url: "https://doi.org/10.3389/fevo.2019.00119",
  },
  18: {
    n: 18,
    text: "Bernor, R.L., Kaya, F., Kaakinen, A., Saarinen, J., Fortelius, M. (2021). \"Old World hipparion evolution, biogeography, climatology and ecology.\" Earth-Science Reviews 221:103784.",
    url: "https://doi.org/10.1016/j.earscirev.2021.103784",
  },
  19: {
    n: 19,
    text: "Parker, A.K., McHorse, B.K., Pierce, S.E. (2018). \"Niche modeling reveals lack of broad-scale habitat partitioning in extinct horses of North America.\" Palaeogeography, Palaeoclimatology, Palaeoecology 511:103-118.",
    url: "https://www.sciencedirect.com/science/article/abs/pii/S0031018218301111",
  },
};

export const PANELS: HorsePanel[] = [
  {
    id: "hyracotherium-mesohippus",
    kind: "evolution",
    kindLabel: "Evolution point · no known branch",
    title: "Hyracotherium → Mesohippus",
    dateRange: "~55–34 Ma",
    baseline:
      "Hyracotherium (“Eohippus”), early Eocene North America: a small, roughly dog-sized, short-legged forest browser with four functional toes on the front feet and three on the hind feet, all cushioned by fleshy pads rather than a hoof. Its cheek teeth were low-crowned with simple, rounded cusps, built to break down soft leaves and fruit inside a continuous, closed-canopy forest. This body plan barely changed for the first 20+ million years of horse evolution — body mass stayed in a narrow, small range (roughly 25–50 kg) across the whole Eocene into the early Oligocene.",
    changes: [
      {
        subject: "Toes and legs",
        text: "Mesohippus lost the fourth front toe, becoming three-toed on both front and hind feet, with the middle digit doing most of the weight-bearing, and had proportionally longer legs and stood taller than Hyracotherium. Against Hyracotherium's splayed, four-toed, pad-cushioned forefoot — suited to soft, uneven forest litter — Mesohippus's narrower, longer-legged foot let it move faster over firmer, more open ground, something Hyracotherium's foot wasn't built for. As closed Eocene forest gave way to patchier woodland with more open ground between stands, an animal that could cross that open ground quickly — to reach the next patch of cover, or to outrun a predator — had a real locomotor advantage a pure forest-floor browser's foot didn't confer.",
      },
      {
        subject: "Teeth",
        text: "Mesohippus's premolars became molariform — squared off with grinding surfaces, like its molars — rather than the simple triangular pulping premolars of Hyracotherium. Crown height stayed low in both animals; this was a change in tooth shape and grinding capacity, not yet a shift to high-crowned grazing teeth. Against Hyracotherium's pulping-only dentition, Mesohippus's molariform premolars let it grind a tougher, more fibrous mix of browse — not a switch to grass, but a diet less restricted to the softest available plant parts. As forest interior contracted, the easiest, softest browse Hyracotherium specialized on became less reliably available; a dentition that could also process tougher leaves and stems widened what a Mesohippus-grade animal could still eat when the softest food was scarce.",
      },
    ],
    whyOfWhy:
      "Both changes trace to the same deeper event, documented by two independent evidence streams. The global benthic-foraminiferal oxygen-isotope record shows the Eocene-Oligocene transition (~34 Ma) as the single largest cooling step of the entire Cenozoic, marking the first major build-up of a permanent Antarctic ice sheet. Independently, a terrestrial-specific proxy — oxygen isotopes in fossil tooth enamel and other proxies from central North America, the exact region these horses lived in — shows a large (~8°C) drop in mean annual temperature and increased seasonality across the same interval, confirming the cooling wasn't just a marine/global signal but a real, regional shift in the habitat horses actually occupied. Cooler, drier, more seasonal conditions are the documented mechanism by which closed Eocene forest fragmented into more open Oligocene woodland — the precondition both the toe and tooth changes above respond to.",
    confidence:
      "High. This is one of the best-sampled transitions in the whole vertebrate fossil record (dense, continuous North American basin sequences spanning the boundary), and the climatic driver is confirmed by two independent proxy types (marine benthic isotopes and terrestrial enamel isotopes) rather than resting on inference from anatomy alone. One caution: popular accounts sometimes describe Mesohippus as already “eating grass” — the evidence instead supports a tougher-browse diet within a still low-crowned, non-grazing dentition; true grass-adapted high-crowned teeth don't appear until Merychippus, ~20 million years later.",
    citationNs: [1, 2, 3, 4, 5],
  },
  {
    id: "miohippus-branch",
    kind: "branch",
    kindLabel: "Branch point · 2 strategies",
    title: "Miohippus → Anchitheriinae vs. Equinae stem",
    dateRange: "~32–24 Ma",
    baseline:
      "Miohippus, descendant of the Mesohippus lineage, was still a three-toed woodland browser with low-crowned cheek teeth. It lived across a North American interior where continued post-Eocene-Oligocene cooling and drying had opened Mesohippus's patchy woodland further: in places closed forest persisted, but in the Great Plains interior specifically, paleosol evidence shows the first true open, grass-containing ground cover — desert-like “bunch” grassland by the late Oligocene (~33 Ma), then more continuous “sod” grassland by the earliest Miocene (~19 Ma) — appearing for the first time. By the early Miocene, Miohippus-grade horses stood at a real fork: stay a browser in the woodland/forest-margin habitat that still existed, or begin exploiting the newly-available grassy ground cover.",
    changes: [
      {
        subject: "Anchitheriinae (e.g. Anchitherium)",
        text: "Essentially nothing changed about the tooth or foot plan — Anchitherium kept Miohippus's three-toed foot and low-crowned teeth relatively unchanged. What it did do that Miohippus itself had not: hugely expand its geographic range, dispersing out of North America across the Bering land bridge into Asia and Europe by around 18–19 Ma. Direct fossil-community evidence from a well-studied German site (Sandelzhausen) independently describes Anchitherium there as a “dirty browser” — still eating leaves and shrubby browse, embedded in a community of other browsing large mammals, not a grassland grazer. Against its Parahippus-lineage sibling, which was raising tooth crown height in North America over this same interval, Anchitherium's teeth stayed flatly unchanged. Wherever Anchitherium went — across the Great Plains margins it started from, and into the Eurasian woodlands it dispersed into — a browsing niche on trees and shrubs remained available throughout the early-to-middle Miocene; it didn't need to solve the grit/grass problem because it wasn't living inside the specific North American interior habitat where that problem was intensifying.",
      },
      {
        subject: "Equinae stem (e.g. Parahippus)",
        text: "Parahippus, the lineage continuing toward Equinae, evolved mesodont teeth — a real, measurable increase in crown height above the Miohippus/Anchitherium baseline, though still short of full hypsodonty. Against Anchitherium's unchanged low-crowned teeth, this let Parahippus keep grinding a diet containing more of the newly-available, grit- and phytolith-laden grassy ground cover without wearing its teeth down as fast as an unmodified tooth would. In the North American Great Plains interior specifically — not everywhere Miohippus-grade horses lived — grasses were becoming a significant, regionally new component of ground cover; a lineage that could tolerate the added abrasiveness of that ground cover, even partially, could exploit a food source largely closed to a pure browser stuck with an Anchitherium-style tooth.",
      },
    ],
    whyOfWhy:
      "The claim that grassy ground cover became newly available in the North American interior specifically, at just this time, doesn't rest on tooth evidence alone — it is independently confirmed by paleosol (fossil soil) geochemistry from the Great Plains itself, which stages the vegetation change directly from the rocks: late Oligocene desert bunch grassland, then early Miocene (~19 Ma) sod grassland, arriving in the same place and window Parahippus appears. That the alternative, browsing-only path stayed viable is likewise independently confirmed not by teeth but by fossil-community reconstruction at actual Eurasian sites Anchitherium reached — the Sandelzhausen assemblage shows it living alongside other browsers in a still-wooded community, a direct paleoecological snapshot rather than an inference from its unchanged dentition.",
    confidence:
      "Moderate-to-high on the core browse-vs-graze contrast itself, well supported by independent paleosol and paleocommunity evidence on both sides. Lower on the precise phylogenetic detail: the exact branching pattern among early Miocene equids, and how cleanly Miohippus itself sits at a single branch point versus being one node in a messier, still incompletely resolved early equid tree, is acknowledged in the primary equid systematics literature as less settled than the later (Merychippus-onward) part of the tree.",
    citationNs: [6, 8, 9, 10, 11],
  },
  {
    id: "merychippus-branch",
    kind: "branch",
    kindLabel: "Branch point · 2 strategies",
    title: "Merychippus → Hipparionini vs. Equini",
    dateRange: "~17–15 Ma",
    baseline:
      "Merychippus, descended from the Parahippus (mesodont) lineage, was the first horse with fully hypsodont (high-crowned) cheek teeth, capped with a durable cementum layer. It still kept three toes on each foot, but the side toes were reduced and weight increasingly rode on the enlarged central toe, on a foot built for faster, sustained travel over open ground. Merychippus is a genuinely explosive radiation point: at least 19 new species arose by branching in North America in a roughly 15–18 Ma window, and horse species diversity then plateaued at around 16 contemporaneous grazing-adapted species that persisted until roughly 6 Ma. Phylogenetic analyses treat Merychippus as a paraphyletic stem — not a single clean species handing off to one descendant, but a diversifying population from which two major later tribes emerge: the three-toed Hipparionini and the one-toed Equini.",
    changes: [
      {
        subject: "Hipparionini (e.g. Hipparion)",
        text: "Hipparionines kept the three-toed foot plan and, while further raising crown height over the Merychippus baseline, did so on a track that stayed compatible with a mixed, more flexible diet — later Old World hipparionines (e.g. Hippotherium) are isotopically documented as opportunistic mixed feeders, ranging from browsing to grazing rather than committing fully to open-grassland grazing. Against its Equini sibling, which progressively lost the side toes entirely, Hipparionini retained the extra toes and a more generalist diet across a huge range of habitats. That flexibility let hipparionines colonize an unusually wide range of environments — they disperse out of North America across Beringia into Eurasia and Africa starting around 11 Ma, radiating into over 60 species across roughly 10 genera on those continents — something a foot and diet committed to one specific open-grassland lifestyle would have made harder to pull off across such varied Old World terrain.",
      },
      {
        subject: "Equini stem (e.g. Pliohippus)",
        text: "The Equini stem pushed hypsodonty further than Hipparionini and began true reduction toward a single functional toe, with the side toes progressively shrinking toward non-weight-bearing splints — the beginning of full monodactyly, not yet complete in Pliohippus itself. Against Hipparionini's retained three-toed, mixed-diet strategy, Equini committed to a narrower, more specialized open-grassland grazing lifestyle. A foot built around one enlarged, stiffened toe is a better long-distance travel design on hard, open, arid ground than a three-toed foot — the committed grazing/committed monodactyly package only pays off if the animal is actually living somewhere consistently open and hard-surfaced, which the Equini lineage increasingly was.",
      },
    ],
    whyOfWhy:
      "This is the equid analog to the hominin boisei/robustus isotope story, and it complicates rather than confirms the clean “grass made teeth taller” story. Fossil tooth enamel carbon isotopes and dental mesowear across 6,500+ fossil horses (222 populations, 70+ species, the full 55.5-million-year North American record) show mesowear trends track global cooling and vegetation change overall — but also that most individual horse populations had highly variable amounts of dietary abrasion, meaning crown height and actual measured wear only correlate loosely. A genuinely separate evidence stream complicates the story further: paleosol and phytolith records show that the classic global marker of grass committing to C4 photosynthesis — the isotopically-documented worldwide C4 biomass expansion — didn't happen until 8–6 Ma, a full 7–10 million years after Merychippus's initial hypsodonty at ~15–17 Ma. The grasses Merychippus and early Hipparionini/Equini were actually grinding on were C3 grasses, not C4 ones. A further complication: a comparative study of hypsodonty origins across multiple unrelated Great Plains lineages found that the timing of tooth-crown increases is better explained by ingested grit — soil and, in some intervals, volcanic ash — than by grass phytoliths specifically, since hypsodonty in some lineages preceded the spread of grasslands themselves. None of this erases the grass/grit/open-habitat pressure as the driver — it just means the honest picture is plural: cooling-linked vegetation opening, non-constant wear pressure, and abrasive grit all contributed, and the C4 signal specifically belongs to a later chapter, not this one.",
    confidence:
      "High that a real branch with two different foot/diet strategies happened at this point, and high that isotopes/mesowear are a genuinely independent, hard-evidence check on the dental story rather than a restatement of it. Moderate on the precise causal weighting between grass phytoliths, ingested grit, and general habitat opening as the driver of hypsodonty specifically in this 15–17 Ma window — the “grit not grass” finding is a real, published complication to the textbook grass-diet story, not a settled replacement for it.",
    citationNs: [7, 12, 13, 14, 15, 18],
  },
  {
    id: "pliohippus-equus",
    kind: "evolution",
    kindLabel: "Evolution point · no known branch",
    title: "Pliohippus → Dinohippus → Equus",
    dateRange: "~13–4 Ma",
    baseline:
      "Pliohippus, the Equini-stem descendant from the Merychippus radiation, had already committed to hypsodont grazing teeth and to a foot with a single enlarged central toe doing almost all the weight-bearing — but its side toes, while much reduced, had not yet disappeared into fully non-functional splints; early Pliohippus specimens still show small remnant bone nubbins from the second and fifth digits. Body mass among Equini-stem horses had already diversified substantially during the earlier Miocene radiation, from the small ~25–50 kg range that had held steady for most of horse evolution up to about 25 Ma, to a much wider 75–400 kg range achieved by roughly 10 Ma.",
    changes: [
      {
        subject: "Dinohippus and Equus",
        text: "Over three successive early Pliocene strata, the side toes were lost as functional structures entirely — Dinohippus is recognized as the first true single-toed horse, with the second and fourth digits reduced to non-weight-bearing splint bones fused along the cannon bone. Equus inherited and retained this fully solid one-toed foot (living Equus still carry the genes for side toes, occasionally expressed as rare atavistic extra toes, but the default plan is a single hoof). Cheek teeth also became more completely and durably hypsodont, and body size increased further into the range modern Equus occupies. Against the Pliohippus baseline's still-partly-articulated side toes, a fully solid, single-toed foot is a structurally different design, not just a more extreme version of the same one: recent biomechanical work argues the key change was not digit loss per se but an enhanced elastic “spring foot” at the fetlock, which stores and returns more energy per stride than a three-toed or incipiently-monodactyl foot can. The specific advantage of that spring-foot design is locomotor efficiency over long, open, and increasingly arid terrain — greater elastic energy return favors an efficient, sustained trotting gait for covering long distances between patchy resources, as opposed to the shorter-range running-walk gait better suited to the more broken, wooded terrain that tridactyl hipparionines continued to occupy over the same interval.",
      },
    ],
    whyOfWhy:
      "The claim that terrain was becoming more consistently open and arid over exactly this ~10–4 Ma window — the precondition the spring-foot/trotting-efficiency argument depends on — is backed by evidence completely independent of horse limb biomechanics: Great Plains paleosol carbonate isotopes show C4-grass biomass staying low and steady (roughly 12–34%) through most of the Miocene, then rising sharply between 6.4 and 4.0 Ma and reaching near-modern levels by about 2.5 Ma — a regional, soil-geochemistry-based confirmation, matching the same global C4 expansion signal documented in fossil tooth enamel worldwide. Separately, Great Plains paleosols also show truly open, arid grassland — as opposed to the earlier, more mixed sod grassland of the middle Miocene — doesn't clearly appear until the latest Miocene, around 6 Ma. Both independent lines (soil geochemistry and enamel isotopes) converge on the same late Miocene-into-Pliocene window as when the landscape actually became the kind of open, dry, long-distance terrain a fully solid, spring-loaded one-toed foot pays off in.",
    confidence:
      "High on the sequence and structural facts (fossil strata directly document the stepwise loss of functional side toes; body size and crown-height trends are independently measured). Moderate on the specific causal mechanism: the “elastic energy storage/trotting efficiency” explanation for monodactyly is a genuinely current hypothesis in the primary literature, not long-settled consensus — its own authors present it as revising older, simpler “single toe = faster running” explanations. The paleoclimate/vegetation timing match, by contrast, rests on multiple independent proxy types and is on firmer ground.",
    citationNs: [3, 10, 11, 15, 16, 17],
  },
  {
    id: "hipparionine-extinction",
    kind: "deadend",
    kindLabel: "Dead end · extinct, no living descendants",
    title: "The hipparionine horses' extinction",
    dateRange: "~17 Ma → extinct by ~1 Ma",
    baseline:
      "This panel is not a foil for Equus. Hipparionines ran for roughly 16 million years, radiated across three continents into more species and genera than the entire Equini/Equus lineage ever produced at one time, and their eventual extinction has its own, only partly resolved, causal story — it is not simply “the group that lost to the horse we still have.” Hipparionini split from the Merychippus radiation as a three-toed lineage with hypsodont but diet-flexible teeth. Starting around 11 Ma, one branch (early Cormohipparion) dispersed out of North America across Beringia into Eurasia — the “Hipparion Datum,” a major faunal turnover event recognized across Old World mammal communities — and from there radiated further into Africa.",
    changes: [
      {
        subject: "What changed, over their run",
        text: "In the Old World, hipparionines diversified explosively — more than 60 species across roughly 10 recognized genera by the late Miocene, occupying habitats from wooded to open, with body size and paleodiet varying genus by genus; some later Old World hipparionines (e.g. Hippotherium) are isotopically documented as flexible, opportunistic mixed feeders rather than committed grazers, and Old World hipparionines in general increased body size and crown height further through the Pliocene, though less dramatically than their New World counterparts. Against the single-toed, narrower-diet Equini/Equus lineage occupying North America and, later, the Old World over the same span, hipparionines kept a three-toed foot and a broader dietary envelope across their entire run — a genuinely different long-term strategy, not a failed attempt at the Equus strategy.",
      },
      {
        subject: "The terminal fact",
        text: "Diversity peaked around 7.6–6.8 Ma, then declined sharply — by the end of the Miocene (~6.8–5.3 Ma) numerous Old World hipparionine lineages went extinct, and by the earliest Pleistocene (~2.6 Ma) only three genera (Proboscidipparion, Plesiohipparion, Cremohipparion) persisted anywhere in Eurasia; the last hipparionines anywhere disappear by roughly the early-to-mid Pleistocene, while in North America the group had already been supplanted earlier by monodactyl equines during the late Miocene-Pliocene turnover. Two concrete pressures are both documented, and specialists weigh them differently rather than agreeing on one dominant cause: direct competitive pressure from “stenonine” Equus — a monodactyl, more committed grazer — dispersing into Eurasia and Africa around 2.6 Ma into the same regions and habitats the last hipparionines still occupied; and independent climate/habitat pressure, as temperatures cooled and climates became drier and more seasonal across Eurasia over the same interval, squeezing the wooded and mixed habitats hipparionines' more generalist foot and diet were suited to. Neither pressure is fabricated — both are attested in the same body of literature — but which one did the work of driving each regional extinction event, and in what proportion, is not settled.",
      },
    ],
    whyOfWhy:
      "A genuinely separate evidence stream complicates the tidy “single-toed grazers out-competed three-toed generalists in open grassland” version of this story: a 2018 niche-modeling study of North American fossil horses — using occurrence and trait data independent of both the Old World fossil record and any dietary-isotope argument — found low niche overlap between horse genera grouped by exactly the traits (body size, crown height, toe number) this narrative assumes map cleanly onto habitat, and concluded grassland habitat occupancy cannot reliably be inferred from those derived traits alone. That doesn't disprove competition or climate as extinction drivers, but it is a direct, hard-evidence challenge to treating “three toes = wooded generalist, one toe = open-grassland specialist, therefore the specialist displaced the generalist” as a settled mechanism rather than a plausible but under-tested inference.",
    confidence:
      "The fact and rough timing of extinction (diversity peak ~7.6–6.8 Ma, stepwise decline through the Mio-Pliocene boundary, last lineages gone by the early-mid Pleistocene) is well established. The cause is genuinely live specialist territory, not settled science: the same literature documenting Equus's arrival in Eurasia at 2.6 Ma and cooling/drying climate over this interval does not cleanly partition how much each contributed, and independent niche-modeling work specifically challenges the intuitive trait-to-habitat mapping the competition-driven version of the story leans on. Treat “climate vs. competition” here as genuinely open, not a settled ranking.",
    citationNs: [18, 19],
  },
];
