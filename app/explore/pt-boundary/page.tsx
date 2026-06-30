"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./explorer.module.css";

type Layer = {
  id: string;
  shortLabel: string;
  name: string;
  rockType: string;
  age: string;
  body: string[];
  top: number;
  height: number;
};

const LAYERS: Layer[] = [
  {
    id: "grass",
    shortLabel: "Grass cap",
    name: "Modern topsoil and grass",
    rockType: "Living soil and vegetation",
    age: "Present day",
    top: 0,
    height: 22,
    body: [
      "This is now. The grass, shrubs, and soil at the top of the cliff are growing today — they have no age in geological terms, they're just this year's growth.",
      "Everything below this line is older. Walk down the cliff face and you're walking back through roughly 252 million years, one band at a time, until you reach the dark seam at the bottom.",
    ],
  },
  {
    id: "sandstone-cap",
    shortLabel: "Sandstone cap",
    name: "Upper sandstone / conglomerate cliff",
    rockType: "Hard, resistant sandstone, most likely Triassic and typical of the Narrabeen Group sandstones common along this stretch of the NSW coast",
    age: "Likely early-to-middle Triassic, tens of millions of years after the extinction boundary",
    top: 16,
    height: 26,
    body: [
      "This is the bulk of the standing cliff. It's harder and more resistant to erosion than the soft layers underneath, which is exactly why it still forms a vertical face instead of having worn away to a gentle slope like the ground below it.",
      "It's most likely a later Triassic fluvial or coastal sandstone unit, consistent with the Narrabeen Group sandstones that cap much of this part of the Sydney Basin coastline. Exact unit identification from a photo alone isn't certain — but its job in this story is simple: it caps and protects everything more fragile and more important happening beneath it.",
    ],
  },
  {
    id: "sandy-transition",
    shortLabel: "Sandy transition",
    name: 'The "coal gap" interval',
    rockType: "Buff/sandy transitional sediment — reworked, erosion-derived material rather than stable peat",
    age: "Earliest Triassic, just after the extinction",
    top: 42,
    height: 14,
    body: [
      "After the end-Permian extinction wiped out the peat-forming swamp plants, something strange happened worldwide: for roughly 10 million years, no coal was deposited anywhere on Earth. Geologists call this the \"coal gap.\" Full Permian-level peat thickness didn't return until the Late Triassic, around 230 million years ago.",
      "This buff, sandy band is consistent with that gap. With the forests and ground cover gone, the landscape had nothing left to hold soil in place. Rivers reworked and dumped loose sand and sediment into the basin instead of forming stable, plant-anchored swamps. The sandiness here isn't desert — it's a vegetation-stripped, eroding landscape quite literally raining sediment downhill because nothing was left to stop it.",
    ],
  },
  {
    id: "grey-band",
    shortLabel: "Grey dead-zone band",
    name: "The Frazer Beach Member — the extinction horizon itself",
    rockType: "Dark grey-black siltstone, shale, and mudstone",
    age: "Latest Permian, ~252 million years ago — the boundary itself",
    top: 56,
    height: 9,
    body: [
      "This thin, dark grey-black band sitting directly on the coal is geologically specific to this exact site: it's part of the Frazer Beach Member of the Moon Island Beach Formation, a unit formally named in a 2021 study (Mays et al., Frontiers in Earth Science) precisely because of what it preserves.",
      "Inside it, palynologists find a \"dead zone\": abundant degraded wood fragments, charcoal, and a spike in fungal spores, with only low-diversity spores, pollen, and freshwater algae showing up higher in the unit. That is the literal sedimentary fingerprint of a forest collapsing — dead wood, charcoal probably from wildfires sweeping through dried-out, dying vegetation, and fungi feeding on rotting timber, while almost no living, diverse plant matter was being laid down anymore.",
      "Radiometric dating of ash beds in this unit places it right at the very end of the Permian — this band is, as close as a single photographed layer can be, the extinction event itself.",
    ],
  },
  {
    id: "coal",
    shortLabel: "Coal seam",
    name: "Uppermost Permian coal measures",
    rockType: "Coal — compressed, waterlogged plant matter",
    age: "Latest Permian, just before the extinction, ~252+ million years ago",
    top: 65,
    height: 35,
    body: [
      "This thick black seam is the last coal this swamp basin would produce for about 10 million years. It formed from peat: plant matter from Glossopteris-dominated swamp forests that didn't fully decompose because it accumulated waterlogged, then got buried and compressed.",
      "It represents a thriving, intact late-Permian forest ecosystem — exactly the kind of ecosystem that collapses in the grey band sitting right above it. The coal is the \"before\" picture.",
    ],
  },
];

export default function PtBoundaryExplorer() {
  const [activeId, setActiveId] = useState<string>("grey-band");
  const active = LAYERS.find((l) => l.id === activeId) ?? LAYERS[0];

  return (
    <main className={styles.page}>
      <Link href="/" className={styles.back}>
        ← back to the graph
      </Link>

      <section className={styles.intro}>
        <p className={styles.kicker}>Frazer Beach, NSW, Australia</p>
        <h1 className={styles.title}>
          The grass on top of this cliff is growing right now. Walk down it and you walk
          back 252 million years.
        </h1>
        <p className={styles.subtitle}>
          Every band in this photo is sediment that was laid down in order, oldest at the
          bottom. Near the base sits one of the most consequential lines in Earth&rsquo;s
          history: the boundary between the Permian and Triassic periods, marking the
          &ldquo;Great Dying&rdquo; — the largest mass extinction known, roughly 90% of
          species lost. You can put your hand on it.
        </p>
        <p className={styles.subtitle}>
          Click or tap a band on the photo, or pick a layer below it, to see what it is, how
          we know, and why it formed.
        </p>
      </section>

      <div className={styles.layout}>
        <div className={styles.imageColumn}>
          <div className={styles.imageFrame}>
            <Image
              src="/images/explore/pt-boundary-frazer-beach.jpg"
              alt="Cliff face at Frazer Beach, NSW showing the Permian-Triassic boundary: a dark coal seam at the base, a thin grey band above it, a buff sandy layer, a sandstone cliff cap, and grass on top"
              width={3024}
              height={4032}
              className={styles.photo}
              priority
              sizes="(max-width: 760px) 100vw, 700px"
            />
            {LAYERS.map((layer) => (
              <button
                key={layer.id}
                type="button"
                className={`${styles.hotspot} ${activeId === layer.id ? styles.hotspotActive : ""}`}
                style={{ top: `${layer.top}%`, height: `${layer.height}%` }}
                onClick={() => setActiveId(layer.id)}
                aria-pressed={activeId === layer.id}
                aria-label={`${layer.name}`}
              >
                <span className={styles.hotspotLabel}>{layer.shortLabel}</span>
              </button>
            ))}
          </div>
          <p className={styles.credit}>
            Photo: &ldquo;Permian-Triassic boundary at Frazer Beach, NSW&rdquo; by
            Dippiljemmy, via{" "}
            <a
              href="https://commons.wikimedia.org/wiki/File:Permian-Triassic_boundary_at_Frazer_Beach,_NSW.jpg"
              target="_blank"
              rel="noopener noreferrer"
            >
              Wikimedia Commons
            </a>
            , licensed{" "}
            <a
              href="https://creativecommons.org/licenses/by-sa/4.0/"
              target="_blank"
              rel="noopener noreferrer"
            >
              CC BY-SA 4.0
            </a>
            .
          </p>
        </div>

        <div className={styles.panelColumn}>
          <div className={styles.panel}>
            <p className={styles.panelKicker}>{active.shortLabel}</p>
            <h2 className={styles.panelTitle}>{active.name}</h2>
            <p className={styles.panelMeta}>
              <strong>Rock type:</strong> {active.rockType}
              <br />
              <strong>Age:</strong> {active.age}
            </p>
            {active.body.map((paragraph, i) => (
              <p className={styles.panelBody} key={i}>
                {paragraph}
              </p>
            ))}
          </div>

          <ul className={styles.layerList}>
            {LAYERS.map((layer) => (
              <li key={layer.id}>
                <button
                  type="button"
                  className={`${styles.layerListItem} ${
                    activeId === layer.id ? styles.layerListItemActive : ""
                  }`}
                  onClick={() => setActiveId(layer.id)}
                  aria-pressed={activeId === layer.id}
                >
                  {layer.shortLabel}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <section className={styles.causalSection}>
        <h2 className={styles.causalTitle}>Why any of this happened</h2>
        <ul className={styles.causalChain} aria-label="Causal chain of the end-Permian extinction">
          <li>Siberian Traps volcanism</li>
          <li className={styles.causalArrow}>→</li>
          <li>Massive CO2 / methane release</li>
          <li className={styles.causalArrow}>→</li>
          <li>Global warming, ocean acidification &amp; anoxia</li>
          <li className={styles.causalArrow}>→</li>
          <li>Collapse of Glossopteris forests on land</li>
          <li className={styles.causalArrow}>→</li>
          <li>~90% of species lost</li>
        </ul>
        <p className={styles.causalBody}>
          The end-Permian mass extinction, nicknamed the &ldquo;Great Dying,&rdquo; happened
          around 252 million years ago and is generally attributed to enormous volcanic
          eruptions from the Siberian Traps, a large igneous province that pumped huge
          volumes of carbon dioxide and other gases into the atmosphere over a relatively
          short geological span.
        </p>
        <p className={styles.causalBody}>
          That triggered severe global warming, and in the oceans, acidification and
          widespread anoxia (oxygen-starved water) that devastated marine life. On land, the
          Glossopteris-dominated swamp forests that had been laying down peat for millions of
          years collapsed — and that collapse is exactly what&rsquo;s fossilized in the grey
          dead-zone band at this site: dead wood, wildfire charcoal, and a fungal spike where
          a living forest used to be.
        </p>
        <p className={styles.causalBody}>
          Roughly 90% of species on Earth were lost. The coal seam, the grey band, and the
          sandy gap above it are not just rock types — they&rsquo;re a before, during, and after of
          that event, sitting in order, in one cliff face, that you can walk past on a beach
          today.
        </p>
      </section>
    </main>
  );
}
