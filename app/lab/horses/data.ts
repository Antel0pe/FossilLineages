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

export type TreeNode = {
  id: string;
  label: string;
  panelId: string;
  status?: "extinct" | "living";
  statusNote?: string;
  children?: TreeNode[];
};

export const SOURCES: Record<number, HorseCitation> = {
  1: {
    n: 1,
    text: "Zachos et al. (2001). \"Trends, Rhythms, and Aberrations in Global Climate 65 Ma to Present.\" Science 292(5517):686-693.",
    url: "https://doi.org/10.1126/science.1059412",
  },
  2: {
    n: 2,
    text: "Zanazzi et al. (2007). \"Large temperature drop across the Eocene-Oligocene transition in central North America.\" Nature 445:639-642.",
    url: "https://doi.org/10.1038/nature05551",
  },
  3: {
    n: 3,
    text: "MacFadden (1986). \"Fossil horses from 'Eohippus' (Hyracotherium) to Equus: scaling, Cope's Law, and the evolution of body size.\" Paleobiology 12(4):355-369.",
  },
  4: {
    n: 4,
    text: "MacFadden (1988). \"Fossil horses from 'Eohippus' (Hyracotherium) to Equus, 2: rates of dental evolution revisited.\" Biological Journal of the Linnean Society 35(1):37-48.",
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
    text: "MacFadden (1998). \"Equidae.\" In Evolution of Tertiary Mammals of North America, Vol. 1. Cambridge University Press.",
  },
  9: {
    n: 9,
    text: "Kaiser (2009). \"Anchitherium aurelianense: a brachydont 'dirty browser' from Sandelzhausen (Miocene, Germany).\" Paläontologische Zeitschrift 83:131-140.",
    url: "https://doi.org/10.1007/s12542-009-0002-z",
  },
  10: {
    n: 10,
    text: "Retallack (1997). \"Neogene expansion of the North American prairie.\" PALAIOS 12(4):380-390.",
  },
  11: {
    n: 11,
    text: "Retallack (2007). \"Cenozoic paleoclimate on land in North America.\" Journal of Geology 115(3):271-294.",
  },
  12: {
    n: 12,
    text: "MacFadden & Hulbert (1988). \"Explosive speciation at the base of the adaptive radiation of Miocene grazing horses.\" Nature 336:466-468.",
    url: "https://www.nature.com/articles/336466a0",
  },
  13: {
    n: 13,
    text: "Mihlbachler et al. (2011). \"Dietary Change and Evolution of Horses in North America.\" Science 331(6021):1178-1181.",
    url: "https://doi.org/10.1126/science.1196166",
  },
  14: {
    n: 14,
    text: "Jardine et al. (2012). \"Grit not grass: early origin of hypsodonty in Great Plains ungulates and Glires.\" Palaeogeography, Palaeoclimatology, Palaeoecology 365:1-10.",
    url: "https://doi.org/10.1016/j.palaeo.2012.09.001",
  },
  15: {
    n: 15,
    text: "Cerling et al. (1997). \"Global vegetation change through the Miocene/Pliocene boundary.\" Nature 389:153-158.",
    url: "https://doi.org/10.1038/38229",
  },
  16: {
    n: 16,
    text: "Fox & Koch (2003). \"Tertiary history of C4 biomass in the Great Plains, USA.\" Geology 31(9):809-812.",
    url: "https://doi.org/10.1130/G19580.1",
  },
  17: {
    n: 17,
    text: "Janis & Bernor (2019). \"The Evolution of Equid Monodactyly: A Review Including a New Hypothesis.\" Frontiers in Ecology and Evolution 7:119.",
    url: "https://doi.org/10.3389/fevo.2019.00119",
  },
  18: {
    n: 18,
    text: "Bernor et al. (2021). \"Old World hipparion evolution, biogeography, climatology and ecology.\" Earth-Science Reviews 221:103784.",
    url: "https://doi.org/10.1016/j.earscirev.2021.103784",
  },
  19: {
    n: 19,
    text: "Parker, McHorse & Pierce (2018). \"Niche modeling reveals lack of broad-scale habitat partitioning in extinct horses of North America.\" Palaeogeography, Palaeoclimatology, Palaeoecology 511:103-118.",
    url: "https://www.sciencedirect.com/science/article/abs/pii/S0031018218301111",
  },
  20: {
    n: 20,
    text: "Jónsson et al. (2014). \"Speciation with gene flow in equids despite extensive chromosomal plasticity.\" PNAS 111(52):18655-18660.",
    url: "https://doi.org/10.1073/pnas.1412627111",
  },
  21: {
    n: 21,
    text: "Vilstrup et al. (2013). \"Mitochondrial Phylogenomics of Modern and Ancient Equids.\" PLOS ONE 8(2):e55950.",
    url: "https://doi.org/10.1371/journal.pone.0055950",
  },
  22: {
    n: 22,
    text: "Haile et al. (2009). \"Ancient DNA reveals late survival of mammoth and horse in interior Alaska.\" PNAS 106(52):22352-22357.",
    url: "https://doi.org/10.1073/pnas.0912510106",
  },
  23: {
    n: 23,
    text: "Guthrie (2003). \"Rapid body size decline in Alaskan Pleistocene horses before extinction.\" Nature 426:169-171.",
    url: "https://doi.org/10.1038/nature02098",
  },
  24: {
    n: 24,
    text: "Buck & Bard (2007). \"A calendar chronology for Pleistocene mammoth and horse extinction in North America.\" Quaternary Science Reviews 26(17-18):2031-2035.",
    url: "https://doi.org/10.1016/j.quascirev.2007.06.013",
  },
  25: {
    n: 25,
    text: "Running Horse Collin et al. (2025). \"Sustainability insights from Late Pleistocene climate change and horse migration patterns.\" Science 388(6748):748-755.",
    url: "https://doi.org/10.1126/science.adr2355",
  },
  26: {
    n: 26,
    text: "Librado et al. (2021). \"The origins and spread of domestic horses from the Western Eurasian steppes.\" Nature 598:634-640.",
    url: "https://doi.org/10.1038/s41586-021-04018-9",
  },
  27: {
    n: 27,
    text: "Prothero & Shubin (1989). \"The evolution of Oligocene horses.\" In The Evolution of Perissodactyls. Oxford University Press, pp. 142-175.",
  },
  28: {
    n: 28,
    text: "MacFadden (1992). Fossil Horses: Systematics, Paleobiology, and Evolution of the Family Equidae. Cambridge University Press.",
  },
  29: {
    n: 29,
    text: "Janis, Damuth & Theodor (2000). \"Miocene ungulates and terrestrial primary productivity: Where have all the browsers gone?\" PNAS 97(14):7899-7904.",
    url: "https://doi.org/10.1073/pnas.97.14.7899",
  },
  30: {
    n: 30,
    text: "Janis, Damuth & Theodor (2002). \"The origins and evolution of the North American grassland biome.\" Palaeogeography, Palaeoclimatology, Palaeoecology 177(1-2):183-198.",
    url: "https://doi.org/10.1016/S0031-0182(01)00359-5",
  },
  31: {
    n: 31,
    text: "Heintzman et al. (2017). \"A new genus of horse from Pleistocene North America.\" eLife 6:e29944.",
    url: "https://doi.org/10.7554/eLife.29944",
  },
  32: {
    n: 32,
    text: "Der Sarkissian et al. (2015). \"Mitochondrial genomes reveal the extinct Hippidion as an outgroup to all living equids.\" Biology Letters 11(3):20141058.",
    url: "https://doi.org/10.1098/rsbl.2014.1058",
  },
  33: {
    n: 33,
    text: "Orlando et al. (2003). \"Morphological convergence in Hippidion and Equus (Amerhippus) South American equids elucidated by ancient DNA analysis.\" Journal of Molecular Evolution 57(6):642-652.",
    url: "https://doi.org/10.1007/s00239-003-0005-4",
  },
  34: {
    n: 34,
    text: "O'Sullivan (2003). \"A new species of Archaeohippus (Mammalia, Equidae) from the Arikareean of central Florida.\" Journal of Vertebrate Paleontology 23(4):877-885.",
    url: "https://doi.org/10.1671/2369-12",
  },
  35: {
    n: 35,
    text: "Florida Museum of Natural History. \"Archaeohippus.\" Fossil Horses in Cyberspace gallery.",
    url: "https://www.floridamuseum.ufl.edu/fossil-horses/gallery/archaeohippus/",
  },
};

export const PANELS: HorsePanel[] = [
  {
    id: "hyracotherium-mesohippus",
    kind: "evolution",
    kindLabel: "Straight line, no branch",
    title: "Hyracotherium → Mesohippus",
    dateRange: "~55–34 Ma",
    baseline:
      "The first horse, Hyracotherium (\"Eohippus\"), was small — dog-sized — with four toes up front and soft teeth built for eating leaves and fruit in dense forest.",
    changes: [
      {
        subject: "Fewer toes, tougher teeth",
        text: "Mesohippus had longer legs, one fewer toe, and teeth that could grind coarser plants. As forests thinned into patchier woodland, being able to run across open gaps — and eat tougher food when the good stuff ran out — started to pay off.",
      },
    ],
    whyOfWhy:
      "The planet was going through the sharpest cooling event of the last 66 million years right at this point, confirmed by two separate climate records (deep-ocean sediment and fossil tooth enamel from the same region these horses lived in).",
    confidence:
      "High — an unusually well-preserved fossil sequence, and two independent climate records agree.",
    citationNs: [1, 2, 3, 4, 5],
  },
  {
    id: "mesohippus-miohippus",
    kind: "evolution",
    kindLabel: "Straight line, no branch",
    title: "Mesohippus → Miohippus",
    dateRange: "~36–32 Ma",
    baseline:
      "Mesohippus was small — about 50-75 lbs — and had stayed that size for millions of years.",
    changes: [
      {
        subject: "A new, bigger population splits off",
        text: "Miohippus wasn't a slow transformation — a separate, larger population (about 120 lbs) split off and lived right alongside Mesohippus for roughly 4 million years; their fossils turn up together in the same rock layers. In the same increasingly patchy, open terrain, being bigger likely meant fewer predators could take you down, and you could go further between food patches.",
      },
    ],
    whyOfWhy:
      "This isn't a case of missing fossils papering over a gap — the same pattern (long stability, then a population splitting off) shows up across several other horse species in these same rock layers at the same time, which is what tells scientists this was a real branching event.",
    confidence:
      "High that this was a genuine branch — solid enough that it undersells the story to call it \"few transitional fossils.\" Lower on exactly why body size jumped — a reasonable read, not a pinned-down mechanism.",
    citationNs: [27, 28, 8],
  },
  {
    id: "miohippus-branch",
    kind: "branch",
    kindLabel: "Branch point",
    title: "Miohippus branches",
    dateRange: "~32–24 Ma",
    baseline:
      "Grass started spreading across North America's interior for the first time. Miohippus, still a forest browser, effectively faced a choice: stick with the shrinking forest, or eat the new grassy ground cover.",
    changes: [
      {
        subject: "Anchitheriinae — stayed browsers",
        text: "This line barely changed at all. It just spread out, wandering as far as Europe and Asia, browsing on leaves wherever it went — there was still forest to eat almost everywhere it settled.",
      },
      {
        subject: "Equinae stem — started grazing",
        text: "This line grew taller teeth suited to a grittier, grassier diet — letting it eat food the still-forest-adapted browsers couldn't touch.",
      },
    ],
    whyOfWhy:
      "Fossil soil samples from the Great Plains directly confirm grass cover was spreading exactly when the grazing line's teeth changed. Dig sites in Germany independently show the browsing line was still living among other forest browsers long after it left North America — it simply never needed to change.",
    confidence:
      "Solid on the browse-vs-graze split. Less certain on the finer details of exactly how the early family tree branches.",
    citationNs: [6, 8, 9, 10, 11],
  },
  {
    id: "anchitheriinae-extinction",
    kind: "deadend",
    kindLabel: "Dead end",
    title: "Anchitheriinae go extinct",
    dateRange: "~24 Ma → extinct by ~9 Ma",
    baseline:
      "This isn't a story about losing to its grazing sibling. Anchitheriinae (Anchitherium and its larger cousins Hypohippus, Megahippus, Sinohippus) spread across two continents and stayed successful browsers for over 20 million years.",
    changes: [
      {
        subject: "Bigger versions of the same browser",
        text: "Their basic body plan never changed further — just bigger versions of the same tree-and-shrub browser, generation after generation, while their grazing cousins kept adapting to open ground.",
      },
      {
        subject: "Then, extinction",
        text: "By the end of the Miocene, every last one — on both continents — was gone.",
      },
    ],
    whyOfWhy:
      "A large, independent survey of dozens of fossil sites found browsing-species numbers didn't crash suddenly — they fell steadily for about 9 million years, bottoming out right when these horses disappear. The likely cause isn't \"grass took over\" (that's a different chapter) — it's that falling CO2 through the Miocene made leafy plants less productive worldwide, shrinking the food supply itself. The same study also found no evidence that grazing horses simply replaced browsers one-for-one, undercutting the simple \"grazers won\" story.",
    confidence:
      "Timing is solid. The cause is only partly settled — the best evidence points to a slow food squeeze rather than head-to-head competition, but it covers browsing mammals broadly, not these horses specifically.",
    citationNs: [9, 29, 30],
  },
  {
    id: "archaeohippus-dwarfing",
    kind: "deadend",
    kindLabel: "Dead end · went small, not big",
    title: "Archaeohippus shrinks",
    dateRange: "~21–13 Ma",
    baseline:
      "Miohippus's descendants were splitting into a browsing line and a grazing line — and almost every branch after this point trends toward bigger bodies over time.",
    changes: [
      {
        subject: "Going smaller, not bigger",
        text: "Archaeohippus did the opposite of its siblings: it shrank to roughly the size of a collie dog, and kept low, simple teeth like a browser instead of growing tall grazing teeth. Against its bigger-bodied cousins spreading onto open ground, going smaller let it specialize on soft leaves in dense forest understory — food a bigger animal's size and appetite made a poor fit for.",
      },
    ],
    whyOfWhy:
      "The best fossil sites for this animal are in Florida and along the Gulf Coast — a part of the continent that likely stayed wetter and more forested for longer than the drying Great Plains interior. That's a plausible explanation for why this pocket of forest habitat survived here specifically, though the most detailed source on it was only accessible as a summary, not the full study.",
    confidence:
      "High that the shrinking itself is real and sustained — the clearest exception to \"getting bigger\" anywhere in horse evolution. Lower on the specific why — a reasonable read, but the weakest-sourced explanation on this page.",
    citationNs: [3, 34, 35],
  },
  {
    id: "merychippus-branch",
    kind: "branch",
    kindLabel: "Branch point",
    title: "Merychippus branches",
    dateRange: "~17–15 Ma",
    baseline:
      "Merychippus was the first horse with truly tall, grass-ready teeth, though still three-toed. It wasn't one clean species — it exploded into many at once, which then split into two very different lifestyles.",
    changes: [
      {
        subject: "Hipparionini — stayed flexible",
        text: "Kept three toes and a flexible diet, grazing or browsing depending on what was around. That flexibility let it spread further than any horse before — out of North America, across Asia, into Africa.",
      },
      {
        subject: "Equini — committed to grazing",
        text: "Pushed toward one big toe and full-time grass-grazing — a strategy built for permanently open, dry ground rather than mixed terrain.",
      },
    ],
    whyOfWhy:
      "Oddly, the tough grass we picture (C4 grass) didn't actually spread worldwide until millions of years later — well after these teeth had already gotten tall. Other evidence points at ordinary grit and dust in the soil, not grass itself, as a bigger reason teeth got taller this early.",
    confidence:
      "The two-lifestyle split is solid. Exactly why teeth got taller this early — grass, grit, or both — is still debated.",
    citationNs: [7, 12, 13, 14, 15, 18],
  },
  {
    id: "pliohippus-equus",
    kind: "evolution",
    kindLabel: "Straight line, no branch",
    title: "Pliohippus → Equus",
    dateRange: "~13–4 Ma",
    baseline:
      "Pliohippus already grazed and stood mostly on one big toe, but small leftover bones from its side toes still remained.",
    changes: [
      {
        subject: "One solid hoof, spring-loaded",
        text: "By the time Equus appears, the side toes were gone for good, replaced by a single solid hoof built almost like a spring — storing energy each step for efficient, long-distance travel across dry, open ground.",
      },
    ],
    whyOfWhy:
      "Independent soil chemistry from the Great Plains shows the region turned genuinely dry and open in exactly this window — right when a foot built for open ground would start to pay off.",
    confidence:
      "The anatomy and timing are solid. The specific \"spring foot\" explanation for why one toe works better is a newer idea, not settled consensus.",
    citationNs: [3, 10, 11, 15, 16, 17],
  },
  {
    id: "early-equus-branches",
    kind: "branch",
    kindLabel: "Branch point",
    title: "Early Equus splits three ways",
    dateRange: "~7–2.5 Ma",
    baseline:
      "By about 4-6 million years ago, the one-toed grazing Equus lineage was established in North America. What bones alone didn't show is that this population actually split into three lineages, not one.",
    changes: [
      {
        subject: "Haringtonhippus — the stilt-legged horse",
        text: "One branch — genetically distinct enough to get its own new genus in 2017 — had slender, stilt-like legs and narrower hooves, unlike stocky Equus. For over a century its fossils were simply filed as odd, skinny Equus species; DNA showed it was different enough to have been a wholly separate horse, living alongside true Equus across Ice Age North America the whole time without ever interbreeding into it. The slender-leg build shows up independently in living Asian wild asses facing similar terrain — cheap travel across wide, sparse, dry ground. It survived the whole Ice Age and died out only at the very end, around 14,000-13,000 years ago.",
      },
      {
        subject: "Hippidion — the South American horse",
        text: "A related branch reached South America once the land bridge at Panama closed (~2.7-3 million years ago) and developed the opposite build: short, heavy legs, suited to stability on steep Andean terrain rather than fast travel on flat ground. For decades it was classified as descending from an older horse (Pliohippus) because of similar teeth — DNA overturned this: it actually branched off later, from within the Equus side of the family, making it Haringtonhippus's more distant cousin, not a Pliohippus descendant at all.",
      },
    ],
    whyOfWhy:
      "Skeletons fooled scientists about both animals in the same direction — a documented, repeating pattern where similar teeth or leg shapes evolve independently more than once in unrelated horse lines facing similar physical demands. DNA has now corrected the family tree in several separate places using this same realization.",
    confidence:
      "High on the corrected family tree — multiple independent DNA studies agree. Lower on the specific \"why these legs, this terrain\" explanations — reasonable reads, not tested mechanisms.",
    citationNs: [31, 32, 33],
  },
  {
    id: "hipparionine-extinction",
    kind: "deadend",
    kindLabel: "Dead end",
    title: "Hipparionini go extinct",
    dateRange: "~17 Ma → extinct by ~1 Ma",
    baseline:
      "This isn't a story about losing to the horse we know today. Hipparionines thrived for 16 million years, spread across three continents, and at their peak had more species than the entire one-toed horse lineage ever did at once.",
    changes: [
      {
        subject: "A genuinely different, successful strategy",
        text: "Three toes, a flexible diet, huge range — not a failed attempt to become a modern horse, just a different bet that worked for a very long time.",
      },
      {
        subject: "Then a crash",
        text: "Starting around 7 million years ago their numbers fell sharply. By about a million years ago, every last one was extinct.",
      },
    ],
    whyOfWhy:
      "Two things happened at once — one-toed grazing horses spread into the same regions, and the climate turned drier and cooler, shrinking the mixed habitat hipparionines needed. Which mattered more is genuinely disputed: a 2018 study specifically tested whether \"three toes = forest-dweller, one toe = grassland specialist\" holds up, and found the trait doesn't reliably predict habitat at all — undercutting the simple competition story.",
    confidence:
      "The extinction and its timing are solid. The cause — climate vs. competition — is a real, unresolved debate, not a settled ranking.",
    citationNs: [18, 19],
  },
  {
    id: "equus-modern-split",
    kind: "branch",
    kindLabel: "Branch point · still living",
    title: "Crown Equus branches into the horses we know",
    dateRange: "~3 Ma → today",
    baseline:
      "The main Equus branch — the one that leads to every horse, zebra, and donkey alive today — was established in North America around 4 million years ago, the continent the entire horse lineage evolved on.",
    changes: [
      {
        subject: "Zebras and wild asses",
        text: "Equus crossed into Asia over the Bering land bridge (more than once, in both directions) starting around 3 million years ago. The populations that reached Africa became zebras; populations across Asia and Africa became wild asses and onagers.",
      },
      {
        subject: "True horses — then gone from America, then back",
        text: "The lineage that stayed in Eurasia's grasslands became the wild horse, later domesticated on the western steppes around 2200 BCE. Meanwhile every horse left in the Americas — the lineage's original homeland — went extinct around 11,000 years ago, alongside mammoths. Horses were completely gone from the Americas for 10,000 years, until Spanish ships brought them back in 1493.",
      },
    ],
    whyOfWhy:
      "Why American Equus specifically died out is a genuine, live debate — the same shape as the mammoth-extinction argument. The strongest horse-specific evidence (measured body-size decline right before extinction, plus a 2025 study combining ancient DNA, isotopes, and Indigenous knowledge) leans toward climate-driven habitat loss as the region warmed and grasslands changed. But radiocarbon dating also shows humans were already in the area by the time horses disappeared, leaving a human role open and disputed, not ruled out.",
    confidence:
      "The Old World dispersal and the American extinction are both solidly dated by multiple independent methods. The cause of the American extinction — climate, humans, or both — is unresolved, same as it is for mammoths.",
    citationNs: [20, 21, 22, 23, 24, 25, 26],
  },
];

export const TREE: TreeNode = {
  id: "hyracotherium",
  label: "Hyracotherium → Mesohippus",
  panelId: "hyracotherium-mesohippus",
  children: [
    {
      id: "mesohippus-miohippus",
      label: "Mesohippus → Miohippus",
      panelId: "mesohippus-miohippus",
      children: [
        {
          id: "miohippus",
          label: "Miohippus branches",
          panelId: "miohippus-branch",
          children: [
            {
              id: "anchitheriinae",
              label: "Anchitheriinae",
              panelId: "anchitheriinae-extinction",
              status: "extinct",
            },
            {
              id: "archaeohippus",
              label: "Archaeohippus",
              panelId: "archaeohippus-dwarfing",
              status: "extinct",
              statusNote: "shrank instead of growing",
            },
            {
              id: "merychippus",
              label: "Merychippus branches",
              panelId: "merychippus-branch",
              children: [
                {
                  id: "hipparionini",
                  label: "Hipparionini",
                  panelId: "hipparionine-extinction",
                  status: "extinct",
                  children: [],
                },
                {
                  id: "pliohippus",
                  label: "Pliohippus → Equus",
                  panelId: "pliohippus-equus",
                  children: [
                    {
                      id: "early-equus-split",
                      label: "Early Equus splits three ways",
                      panelId: "early-equus-branches",
                      children: [
                        {
                          id: "haringtonhippus",
                          label: "Haringtonhippus",
                          panelId: "early-equus-branches",
                          status: "extinct",
                          statusNote: "stilt-legged horse, survived to ~13,000 ya",
                        },
                        {
                          id: "hippidion",
                          label: "Hippidion",
                          panelId: "early-equus-branches",
                          status: "extinct",
                          statusNote: "South America",
                        },
                        {
                          id: "equus-split",
                          label: "Crown Equus branches",
                          panelId: "equus-modern-split",
                          children: [
                            {
                              id: "zebras",
                              label: "Zebras",
                              panelId: "equus-modern-split",
                              status: "living",
                            },
                            {
                              id: "asses",
                              label: "Donkeys & wild asses",
                              panelId: "equus-modern-split",
                              status: "living",
                            },
                            {
                              id: "horses",
                              label: "Horses",
                              panelId: "equus-modern-split",
                              status: "living",
                              statusNote: "extinct in the Americas ~11,000 yrs ago, reintroduced 1493",
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
