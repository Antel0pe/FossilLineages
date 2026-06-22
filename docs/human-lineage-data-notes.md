# Human lineage dataset notes

This first research pass covers living humans back through the estimated last common ancestral population of all living apes. It also includes one deeper fossil calibration so the early-ape endpoint is not floating without context.

The usable data is in [`data/human-lineage.json`](../data/human-lineage.json); its citation registry is in [`data/human-lineage-sources.json`](../data/human-lineage-sources.json).

## What is in the dataset

- Taxa and population grades on or near the human line.
- Neanderthals, Denisovans and *Paranthropus boisei* as informative branches.
- Molecular divergence intervals for chimpanzees/bonobos, gorillas, orangutans and gibbons.
- Representative fossils with display coordinates, age estimates, material and significance.
- Candidate relationships with confidence, caveats and sources.
- Observed changes kept separate from hypotheses about selection or environment.
- Open-license images with attribution, plus an externally linked Smithsonian reconstruction whose reuse rights are not cleared.
- Reproducible Paleobiology Database query URLs for later occurrence expansion.

This is a curated starter set, not an exhaustive fossil catalog. The site should describe it as such.

## The central scientific decision

A straight sequence such as “*Ardipithecus* became *Australopithecus*, which became *Homo habilis*, which became *Homo erectus*” is visually tempting and scientifically too strong. Fossil taxa usually sample neighboring branches or broad, structured populations. The dataset therefore uses relationship types such as `possible_ancestor_descendant`, `broad_ancestral_grade`, `sister_populations` and `introgression`. Each edge carries a confidence and a note.

The deepest named fossils are context proxies:

- *Rukwapithecus* helps calibrate the ape–Old World monkey split around 25.2 Ma.
- *Ekembo* shows an early Miocene ape body plan near the estimated origin of crown apes.
- *Nakalipithecus* samples African great-ape diversity near the likely gorilla divergence.
- None is asserted to be the literal direct ancestor of humans.

## Best websites and what each is good for

| Resource | Best use | Main caution |
| --- | --- | --- |
| [Smithsonian Human Origins Program](https://humanorigins.si.edu/evidence/human-fossils/species) | Editorial backbone: readable species accounts, major traits, fossil specimen pages, reconstructions and paper lists | Some pages simplify disputed taxonomy; site imagery is generally not automatically reusable |
| [Paleobiology Database API](https://paleobiodb.org/data1.2/) | Reproducible occurrence downloads with coordinates, ages and reference IDs | Hominin records need manual review for outdated names, duplicates, broad age bins and surprising assignments |
| [MorphoSource](https://www.morphosource.org/) | Museum-linked CT data, surface models and 2D media | Download and reuse permissions differ per item |
| [AfricanFossils.org](https://africanfossils.org/) | High-value East African fossil models and associated fauna | Coverage is regional and rights must be checked per asset |
| [eFossils](https://efossils.org/) | Comparative primate/hominin anatomy and teaching models | Better for anatomical comparison than a complete occurrence dataset |
| [Wikimedia Commons](https://commons.wikimedia.org/) | Color images with machine-readable creator and license metadata | An open license says nothing about scientific accuracy; inspect model provenance |
| [Crossref](https://www.crossref.org/) and DOI landing pages | Stable primary-paper identifiers and bibliographic metadata | Abstracts and full text are not always open |
| [Morphobank](https://morphobank.org/) | Published morphological matrices and image sets when a study deposits them | Project-by-project coverage and permissions |
| [Neotoma Paleoecology Database](https://www.neotomadb.org/) | Environmental proxy records that can help test habitat narratives | Requires matching temporal resolution and location to the fossil context |
| [PANGAEA](https://www.pangaea.de/) | Published paleoclimate, isotope and sediment datasets | Discovery is paper-specific; not a single turnkey human-evolution layer |
| [GPlates](https://www.gplates.org/) and [EarthByte](https://www.earthbyte.org/) | Reconstruct fossil coordinates and plates for deep-time maps | The current latitude/longitude in this dataset is not a paleocoordinate; use a named plate model and show model uncertainty |

## Image policy

The local images are photographs of reconstructions or a fossil composite, not direct observations of a living extinct animal. The UI should always display:

1. “Life reconstruction” or “fossil reconstruction,” never just “photo.”
2. Creator and license.
3. A short uncertainty label for hair, skin, fat, pigmentation and missing anatomy.
4. The fossil specimen on which a model is based, when known.

Do not invent a species-specific colored body for *Ardipithecus kadabba*, *Orrorin*, *Nakalipithecus* or *Rukwapithecus*. Their fossil samples do not constrain one. A silhouette with known bones highlighted would be more honest and more interesting.

## Map policy

The included coordinates are representative display locations, usually rounded and accompanied by `coordinatePrecisionKm`. They are not excavation coordinates. Exact fossil localities can be sensitive, unpublished or only approximately described.

For a first map:

- Plot the curated records as points with an uncertainty halo.
- Link each point to its source and fossil card.
- Cluster records from the same site.
- Label the map “modern geography.”

For paleomaps later:

- Store the present-day coordinate unchanged.
- Add reconstructed coordinates as a separate object containing age, plate model, model version and rotation source.
- Reconstruct points at the fossil’s midpoint age only for display, while allowing the full age range to be inspected.
- At 25–3 Ma plate motion is material; below roughly 1 Ma it is usually visually small at global scale but the same reproducible pipeline is still preferable.

## “Why did it change?” policy

Every explanatory card should have three layers:

- **Observed:** what anatomy, trace fossil, tool, isotope or genome actually shows.
- **Hypothesis:** the proposed ecological or social advantage.
- **Test strength:** what else could produce the pattern and how confident researchers are.

For example, *Ardipithecus ramidus* lived in woodland, so “humans stood up when forests disappeared into savanna” is not a defensible single story. The fossil supports mosaic locomotion; patchy resources, branch feeding, carrying and heat management remain competing or complementary explanations.

## Known limitations and next research passes

- Verify the map coordinates against the original site publications or a maintained archaeological gazetteer before treating them as more than display points.
- Expand fossils from the PBDB query URLs, retaining PBDB occurrence, collection and reference IDs and applying a manual inclusion flag.
- Add associated-fauna records for a few strong case studies rather than dumping every animal at a site.
- Add dietary isotope and microwear sources for *Paranthropus boisei*.
- Add a dedicated Middle Pleistocene taxonomy review; this is the least stable segment of the familiar human lineage graphic.
- Select or commission scientifically reviewed, openly licensed full-body art. Open museum-model photos are a useful bridge, not the visual endpoint.
- Add image pixel dimensions, hashes and original download URLs to a generated asset manifest if the build begins transforming these files.

