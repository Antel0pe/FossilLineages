"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

type Location = {
  id: string;
  name: string;
  region: string;
  people: string;
  age: string;
  tradition: string[];
  verification: string[];
  note?: string;
};

const LOCATIONS: Location[] = [
  {
    id: "tasmania",
    name: "Tasmania",
    region: "SE Australia",
    people: "Palawa people",
    age: "~12,000–14,000 years old",
    tradition: [
      "The Palawa — the Aboriginal Tasmanians — describe their ancestors walking to Tasmania from the north, across dry land that connected it to the mainland. The sea rose and turned their home into an island. They were cut off from the relatives they had left behind.",
      "In a separate account, a Palawa elder described the position of a star called Moinee — a bright southern star — drawing the surrounding reference stars in the sand to triangulate where it had stood in the sky near the south pole. The elder wasn't describing where it is now. Canopus, the star researchers matched to Moinee, is no longer near the south pole.",
    ],
    verification: [
      "Tasmania was connected to mainland Australia by a land bridge (now called the Bassian Plain, under Bass Strait) until approximately 10,000 years ago. At lower sea levels during the last ice age, the bridge was above water and walkable. The Palawa's ancestors walked across it. Then the sea rose and sealed them off, beginning about 10,000 years of isolation before European contact.",
      "The astronomical claim is independently verified by physics. Earth's rotational axis wobbles slowly over a cycle of roughly 26,000 years — axial precession. This shifts which stars appear near the celestial poles over time. Running the calculation backward, Canopus was last positioned near the south celestial pole approximately 14,000 years ago. The elder's description matches the sky as it would have appeared roughly 14,000 years before the recording was made — 500 generations earlier.",
    ],
    note: "The Canopus position is, as far as researchers have found, the only oral tradition anywhere on Earth known to describe a star's position as it appeared more than 10,000 years ago.",
  },
  {
    id: "spencer-gulf",
    name: "Spencer Gulf",
    region: "South Australia",
    people: "Narrangga people",
    age: "~9,500–12,400 years old",
    tradition: [
      "The Narrangga people describe freshwater lagoons and rivers on land that is now the floor of Spencer Gulf — a large sea inlet on the South Australian coast, roughly 300 kilometres long and 130 kilometres wide at its mouth.",
      "In their telling, this was walkable country with fresh water. The sea came in.",
    ],
    verification: [
      "Spencer Gulf is geologically shallow, averaging around 22 metres depth. At sea levels 10,000–12,000 years ago — roughly 30 to 50 metres lower than today — the floor of the gulf would have been exposed dry land. River systems would have crossed it, draining toward the open sea at the outer edge. The freshwater lagoons the Narrangga describe are geographically plausible given what the landscape would have looked like at lower sea levels.",
      "Of the 21 Aboriginal oral traditions that researchers checked against bathymetric data in a 2015–2016 study, the Spencer Gulf accounts were among those with the oldest plausible dates — pushing toward the outer limit of the sea-level rise event itself.",
    ],
  },
  {
    id: "kangaroo-island",
    name: "Kangaroo Island",
    region: "South Australia",
    people: "Ngarrindjeri people",
    age: "~9,800–10,650 years old",
    tradition: [
      "The Ngarrindjeri tell of Ngurunderi, a spirit ancestor, pursuing two wives who fled from him across a land connection to an island. The sea rose, swallowing the connection between them. The wives were turned into offshore rocks — the Pages Islands, a group of small rocky outcroppings still visible off the tip of the Fleurieu Peninsula today.",
      "What was once land you could walk became water, and the islands became islands.",
    ],
    verification: [
      "Kangaroo Island is separated from the Fleurieu Peninsula by Backstairs Passage, a strait roughly 13 kilometres wide at its narrowest point. The sea floor is shallow — mostly under 50 metres. At sea levels around 10,000 years ago, this passage would have been dry, and Kangaroo Island would have been a peninsula extending from the mainland.",
      "The Pages Islands, referenced in the story as the transformed wives, are real small rocky outcroppings at the eastern end of Backstairs Passage. They would have been hills above the land connection before the sea rose. The story maps accurately onto the geography — not as metaphor but as description.",
    ],
  },
  {
    id: "tiwi-islands",
    name: "Tiwi Islands",
    region: "Northern Territory",
    people: "Tiwi people",
    age: "~8,200–9,650 years old",
    tradition: [
      "The Tiwi people tell of an old woman who crawled between two pieces of land that were later separated by the sea. In the telling, the woman is part of the landscape itself — she moves between areas that the sea then closed off from each other.",
      "Melville Island and Bathurst Island, the two main Tiwi Islands north of Darwin, were once part of the mainland.",
    ],
    verification: [
      "The straits separating the Tiwi Islands from the Australian mainland (Clarence Strait and Dundas Strait) are generally shallow — 20 to 40 metres depth in most areas. At sea levels around 8,000–9,000 years ago, these straits would have been above water. The islands would have been hills and plateaus on the mainland, connected by walkable country.",
      "The separation event — sea rising to close off the land connection — is a real geological event that happened within the window the oral tradition describes. The story is a record of that specific moment in local geography.",
    ],
  },
  {
    id: "port-phillip",
    name: "Port Phillip Bay",
    region: "Victoria",
    people: "Bunurong, Wathaurong, Woiwurrung peoples",
    age: "~7,800–9,350 years old",
    tradition: [
      "Multiple groups — the Bunurong, Wathaurong, and Woiwurrung peoples — describe the area now covered by Port Phillip Bay as dry land before the sea came in. It was open country, flat enough for animals to graze across it. Several traditions specifically describe it as kangaroo ground.",
      "Melbourne now sits on the bay's northern shore. In the telling, before the sea arrived, you could have walked south from where the city now stands across open grassland all the way to where the bay's mouth now is.",
    ],
    verification: [
      "Port Phillip Bay is geologically shallow — most of it is less than 15 metres deep, with large areas shallower than 8 metres. At sea levels 9,000 years ago, roughly 25–30 metres lower than today, the entire bay floor would have been exposed. It would have looked like open, flat, low-lying country — a broad plain.",
      "Flat country capable of supporting grazing animals is precisely what bathymetric and geological data suggest the bay floor was. The traditions describe the landscape accurately. The sea came in around 9,000 years ago through a narrow entrance channel, gradually filling the flat ground.",
    ],
  },
];

export default function OldestStoriesPage() {
  const [activeId, setActiveId] = useState<string>(LOCATIONS[0].id);
  const active = LOCATIONS.find((l) => l.id === activeId) ?? LOCATIONS[0];

  return (
    <main className={styles.page}>
      <Link href="/lab" className={styles.back}>
        ← back to the lab
      </Link>

      <section className={styles.intro}>
        <p className={styles.kicker}>
          SE Australia, South Australia, Northern Territory &middot; 7,000&ndash;14,000 years ago
        </p>
        <h1 className={styles.title}>
          These stories are real geological records
        </h1>
        <p className={styles.subtitle}>
          Aboriginal Australian oral traditions describe coastlines, land bridges, and
          freshwater rivers in places that are now open sea. For a long time, this was
          treated as myth. Then researchers checked the stories against bathymetric maps of
          the seabed.
        </p>
        <p className={styles.subtitle}>
          The seabed matches. The stories are accurate records of actual geological events —
          the post-ice-age sea level rise that flooded coastal Australia between roughly
          7,000 and 14,000 years ago. No one wrote these down. They were spoken, sung, and
          danced across hundreds of generations. Click a location to read the story and the
          evidence.
        </p>
      </section>

      <section className={styles.explorable} aria-label="Stories by location">
        <div className={styles.locationList} role="list">
          {LOCATIONS.map((loc) => (
            <button
              key={loc.id}
              type="button"
              role="listitem"
              className={`${styles.locationBtn} ${
                activeId === loc.id ? styles.locationBtnActive : ""
              }`}
              onClick={() => setActiveId(loc.id)}
              aria-pressed={activeId === loc.id}
            >
              <span className={styles.locationName}>{loc.name}</span>
              <span className={styles.locationMeta}>
                {loc.people} &middot; {loc.age}
              </span>
            </button>
          ))}
        </div>

        <div className={styles.panel}>
          <p className={styles.panelKicker}>
            {active.name}, {active.region} &mdash; {active.people}
          </p>
          <p className={styles.panelAge}>{active.age}</p>

          <div className={styles.panelBlock}>
            <h3 className={styles.panelBlockHeading}>What the tradition says</h3>
            {active.tradition.map((p, i) => (
              <p className={styles.panelBody} key={i}>
                {p}
              </p>
            ))}
          </div>

          <div className={styles.panelBlock}>
            <h3 className={styles.panelBlockHeading}>What the geology shows</h3>
            {active.verification.map((p, i) => (
              <p className={styles.panelBody} key={i}>
                {p}
              </p>
            ))}
          </div>

          {active.note && (
            <p className={styles.panelNote}>{active.note}</p>
          )}
        </div>
      </section>

      <section className={styles.mechanismSection}>
        <h2 className={styles.mechanismTitle}>
          How a story survives for 14,000 years
        </h2>
        <p className={styles.mechanismBody}>
          The orthodox position in folklore and history is that oral traditions degrade past
          recognition within about 1,000 years. These survived for ten to fourteen times
          that. The question isn&rsquo;t just what the stories say — it&rsquo;s how they
          stayed accurate across 500 or more generations of transmission.
        </p>
        <p className={styles.mechanismBody}>
          The answer is that Aboriginal Australian knowledge systems are not simple
          storytelling. They are engineered for exactly this problem. The same knowledge is
          encoded simultaneously in multiple channels: song, dance, visual art, ceremony,
          kinship law, and geographic landmark. If any single channel degrades, the others
          reconstruct it. The land itself is a mnemonic — you walk the country and the
          country confirms or contradicts what you were told. Ceremonies involving many
          knowledge holders at once function as error correction: individual memory drifts,
          but collective performance catches deviations. Modification is not just
          discouraged but treated as a serious transgression. And specific stories are the
          inherited responsibility of specific family lineages, creating ongoing
          accountability across generations.
        </p>
        <p className={styles.mechanismBody}>
          The Palawa star account adds a different dimension. Coastlines can be described
          and checked against a map. But the position of a star in the sky 14,000 years ago
          is verifiable only by calculating backward through axial precession — Earth&rsquo;s
          slow wobble, which shifts which stars appear near the poles over tens of thousands
          of years. The elder who drew Moinee&rsquo;s position in the sand wasn&rsquo;t
          transmitting a story about the coast. They were transmitting a precise astronomical
          observation, which happened to be checkable by physics rather than bathymetry.
        </p>
        <p className={styles.mechanismBody}>
          Researchers who confirmed these accounts note that Aboriginal Australia is not
          unique in having ancient oral knowledge — but it may be unique in having
          conditions that enabled such knowledge to survive intact at such a scale: relative
          cultural isolation, a knowledge system explicitly built against drift, and a
          landscape that functioned as the external verification layer for what was being
          remembered.
        </p>
        <p className={styles.mechanismBody}>
          The open question: how much of the world&rsquo;s oral tradition, still active in
          living communities, also preserves accurate records of real geological, astronomical,
          or biological events — and simply hasn&rsquo;t been checked against the evidence yet?
        </p>
      </section>
    </main>
  );
}
