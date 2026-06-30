"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./denisovans.module.css";

type Hotspot = {
  id: string;
  shortLabel: string;
  name: string;
  meta: string;
  body: string[];
  top: number;
  height: number;
  left?: number;
  width?: number;
};

const MANDIBLE_SPOTS: Hotspot[] = [
  {
    id: "bone",
    shortLabel: "The jawbone",
    name: "Right half of a partial mandible",
    meta: "Found 1980, Baishiya Karst Cave, Gansu, China",
    top: 8,
    height: 60,
    left: 4,
    width: 46,
    body: [
      "This is the right half of a partial lower jawbone, covered in a hard carbonate crust from sitting in the cave for tens of thousands of years. It was found in 1980 by a Buddhist monk at Baishiya Karst Cave, on the northeastern edge of the Tibetan Plateau, and only later recognized for what it was.",
      "It's dated to roughly 160,000 years ago — making it, at the time of its identification, one of only a handful of confirmed Denisovan specimens anywhere on Earth.",
    ],
  },
  {
    id: "molars",
    shortLabel: "The molars",
    name: "Two attached molars",
    meta: "Still rooted in the jawbone, unusually large and robust",
    top: 40,
    height: 28,
    left: 46,
    width: 40,
    body: [
      "Two molars remain attached to the jaw, large and robustly built — a detail consistent with other Denisovan teeth found elsewhere, which tend to be notably bigger and more heavily built than typical Neanderthal or modern human molars.",
      "Tooth size and shape were part of the comparative picture, but on their own they couldn't settle the question of exactly which hominin this jaw belonged to. That answer came from a different line of evidence entirely — see the next hotspot.",
    ],
  },
  {
    id: "identification",
    shortLabel: "How we know",
    name: "Identified by protein, not DNA",
    meta: "Ancient palaeoproteomics, not ancient DNA",
    top: 4,
    height: 92,
    left: 50,
    width: 46,
    body: [
      "Here's the twist: the bone itself didn't yield usable ancient DNA. Tens of thousands of years on a high, cold plateau preserved the mandible well enough to find, but not well enough to read its genome directly.",
      "Instead, researchers identified it as Denisovan through ancient protein analysis — palaeoproteomics — extracting and sequencing proteins preserved in the dentine of the molars. Protein sequences are less information-rich than DNA, but they survive longer and degrade more slowly, and the patterns recovered here matched the Denisovan lineage closely enough to make the call.",
      "It's a reminder that \"no DNA\" doesn't always mean \"no molecular evidence.\" Sometimes the bone tells its story in a different molecule. And in this exact cave, even the dirt had more to say than the bone did — see the cave photo below.",
    ],
  },
];

const CAVE_SPOTS: Hotspot[] = [
  {
    id: "location",
    shortLabel: "Location & elevation",
    name: "Baishiya Karst Cave",
    meta: "~3,280 m elevation, Xiahe County, Gansu, China",
    top: 4,
    height: 38,
    left: 10,
    width: 80,
    body: [
      "This is the cave entrance itself: Baishiya Karst Cave, on the northeastern edge of the Tibetan Plateau, at roughly 3,280 meters elevation — high enough that simply living here year-round is a real physiological challenge in low-oxygen, cold conditions.",
      "It's a real, nameable, walkable site, not a reconstructed or inferred location — the mandible above and the sediment described next both came from inside this same cave mouth.",
    ],
  },
  {
    id: "sediment-dna",
    shortLabel: "DNA in the dirt",
    name: "Denisovan DNA — from sediment, not bone",
    meta: "Recovered from cave-floor sediment samples",
    top: 42,
    height: 30,
    left: 10,
    width: 80,
    body: [
      "Even though the Xiahe mandible itself didn't yield usable DNA, actual Denisovan DNA was recovered from this cave — not from any bone, but from sediment on the cave floor. Ancient DNA can linger in dirt long after it's gone from the bones that originally shed it.",
      "So the detective story has two molecular layers: a fossil identified by its proteins, and a population confirmed, separately, by genetic material pulled straight out of the ground it stood on. Even when a fossil won't give up its genetic story, the dirt around it sometimes still can.",
    ],
  },
  {
    id: "faunal",
    shortLabel: "What they hunted",
    name: "Butchered animal bones, not a Denisovan skeleton",
    meta: "Yak, snow leopard, wolf, Tibetan fox, golden eagle, pheasant",
    top: 74,
    height: 24,
    left: 10,
    width: 80,
    body: [
      "No Denisovan skeleton has been found at this site — but butchered animal bones recovered from the cave floor tell us how they lived here anyway. Cut marks and breakage patterns on bones from yak, snow leopard, wolf, Tibetan fox, golden eagle, and pheasant point to a real, varied high-altitude hunting lifestyle.",
      "It's a lifestyle reconstructed entirely from what they ate, not from their own bodies — a different kind of indirect evidence again, this time zooarchaeological rather than genetic or proteomic.",
    ],
  },
];

type AdmixturePartner = {
  id: string;
  label: string;
  title: string;
  timing: string;
  body: string[];
};

const ADMIXTURE_PARTNERS: AdmixturePartner[] = [
  {
    id: "neanderthal",
    label: "Neanderthals",
    title: "Interbred with Neanderthals",
    timing: "Documented in ancient genomes",
    body: [
      "Denisovan and Neanderthal genomes show clear evidence of interbreeding where their ranges overlapped — most famously demonstrated by a single individual, nicknamed \"Denny,\" found to have one Neanderthal parent and one Denisovan parent.",
    ],
  },
  {
    id: "sapiens",
    label: "Modern humans",
    title: "Interbred with Homo sapiens",
    timing: "Left a genetic trace still carried today",
    body: [
      "Denisovans also interbred with modern humans as our ancestors moved through Asia and Oceania. That mixing is why some living populations — including Tibetans, Melanesians, and other groups across Asia and Oceania — carry measurable Denisovan ancestry today. The EPAS1 story below is the clearest single example of this legacy.",
    ],
  },
  {
    id: "superarchaic",
    label: "\"Superarchaic\" ghost population",
    title: "Interbred with a third, unnamed lineage",
    timing: "Inferred event, roughly 700,000 years ago",
    body: [
      "Genome analysis also points to interbreeding with a third population that has no known fossils at all — a \"superarchaic\" lineage that split off long before Neanderthals and Denisovans did. It's inferred indirectly, using a method called Legofit, which looks at patterns of shared genetic sites across ancient genomes to detect mixing events even when there's no body to point to.",
      "That makes the real picture messier than \"three separate species who occasionally met\": it's a tangled web of at least four lineages mixing across hundreds of thousands of years, with one of the participants known only as a statistical signal in other species' DNA.",
    ],
  },
];

export default function DenisovansExplorer() {
  const [mandibleId, setMandibleId] = useState<string>("identification");
  const activeMandible =
    MANDIBLE_SPOTS.find((s) => s.id === mandibleId) ?? MANDIBLE_SPOTS[0];

  const [caveId, setCaveId] = useState<string>("sediment-dna");
  const activeCave = CAVE_SPOTS.find((s) => s.id === caveId) ?? CAVE_SPOTS[0];

  const [partnerId, setPartnerId] = useState<string | null>(null);
  const activePartner = ADMIXTURE_PARTNERS.find((p) => p.id === partnerId) ?? null;

  return (
    <main className={styles.page}>
      <Link href="/lab" className={styles.back}>
        ← back to the lab
      </Link>

      <section className={styles.intro}>
        <p className={styles.kicker}>Baishiya Karst Cave, Gansu, China · ~160,000 years ago</p>
        <h1 className={styles.title}>
          We know more about how this population mixed and spread than about what most of
          them looked like.
        </h1>
        <p className={styles.subtitle}>
          Denisovans are known almost entirely from a handful of fossil fragments and ancient
          genomes — only around four confirmed specimens worldwide, spread from Siberia to
          Tibet to Taiwan, mostly jaw and tooth fragments. Yet their migrations, interbreeding,
          and timing have been reconstructed in remarkable detail, almost entirely from DNA
          comparisons rather than skeletal anatomy.
        </p>
        <p className={styles.subtitle}>
          Click or tap a region on each photo, or the buttons below it, to see what it is and
          how we know.
        </p>
      </section>

      <section className={styles.explorerSection}>
        <h2 className={styles.sectionTitle}>The Xiahe mandible</h2>
        <div className={styles.layout}>
          <div className={styles.imageColumn}>
            <div className={styles.imageFrame}>
              <Image
                src="/images/lab/xiahe-mandible.jpg"
                alt="Photograph of the Xiahe mandible, the right half of a partial Denisovan jawbone covered in carbonate crust, with two molars still attached"
                width={4044}
                height={2196}
                className={styles.photo}
                priority
                sizes="(max-width: 760px) 100vw, 700px"
              />
              {MANDIBLE_SPOTS.map((spot) => (
                <button
                  key={spot.id}
                  type="button"
                  className={`${styles.hotspot} ${
                    mandibleId === spot.id ? styles.hotspotActive : ""
                  }`}
                  style={{
                    top: `${spot.top}%`,
                    height: `${spot.height}%`,
                    left: `${spot.left ?? 0}%`,
                    width: `${spot.width ?? 100}%`,
                  }}
                  onClick={() => setMandibleId(spot.id)}
                  aria-pressed={mandibleId === spot.id}
                  aria-label={spot.name}
                >
                  <span className={styles.hotspotLabel}>{spot.shortLabel}</span>
                </button>
              ))}
            </div>
            <p className={styles.credit}>
              Photo: the Xiahe mandible. Credit: Dongju Zhang, via Wikimedia Commons, licensed{" "}
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
              <p className={styles.panelKicker}>{activeMandible.shortLabel}</p>
              <h3 className={styles.panelTitle}>{activeMandible.name}</h3>
              <p className={styles.panelMeta}>{activeMandible.meta}</p>
              {activeMandible.body.map((paragraph, i) => (
                <p className={styles.panelBody} key={i}>
                  {paragraph}
                </p>
              ))}
            </div>

            <ul className={styles.spotList}>
              {MANDIBLE_SPOTS.map((spot) => (
                <li key={spot.id}>
                  <button
                    type="button"
                    className={`${styles.spotListItem} ${
                      mandibleId === spot.id ? styles.spotListItemActive : ""
                    }`}
                    onClick={() => setMandibleId(spot.id)}
                    aria-pressed={mandibleId === spot.id}
                  >
                    {spot.shortLabel}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.explorerSection}>
        <h2 className={styles.sectionTitle}>Baishiya Karst Cave</h2>
        <div className={styles.layout}>
          <div className={styles.imageColumn}>
            <div className={styles.imageFrame}>
              <Image
                src="/images/lab/baishiya-cave.jpg"
                alt="Photograph of the entrance to Baishiya Karst Cave on the Tibetan Plateau, where the Xiahe mandible was found"
                width={5355}
                height={3575}
                className={styles.photo}
                sizes="(max-width: 760px) 100vw, 700px"
              />
              {CAVE_SPOTS.map((spot) => (
                <button
                  key={spot.id}
                  type="button"
                  className={`${styles.hotspot} ${
                    caveId === spot.id ? styles.hotspotActive : ""
                  }`}
                  style={{
                    top: `${spot.top}%`,
                    height: `${spot.height}%`,
                    left: `${spot.left ?? 0}%`,
                    width: `${spot.width ?? 100}%`,
                  }}
                  onClick={() => setCaveId(spot.id)}
                  aria-pressed={caveId === spot.id}
                  aria-label={spot.name}
                >
                  <span className={styles.hotspotLabel}>{spot.shortLabel}</span>
                </button>
              ))}
            </div>
            <p className={styles.credit}>
              Photo: the entrance to Baishiya Karst Cave. Credit: Dongju Zhang, via Wikimedia
              Commons, licensed{" "}
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
              <p className={styles.panelKicker}>{activeCave.shortLabel}</p>
              <h3 className={styles.panelTitle}>{activeCave.name}</h3>
              <p className={styles.panelMeta}>{activeCave.meta}</p>
              {activeCave.body.map((paragraph, i) => (
                <p className={styles.panelBody} key={i}>
                  {paragraph}
                </p>
              ))}
            </div>

            <ul className={styles.spotList}>
              {CAVE_SPOTS.map((spot) => (
                <li key={spot.id}>
                  <button
                    type="button"
                    className={`${styles.spotListItem} ${
                      caveId === spot.id ? styles.spotListItemActive : ""
                    }`}
                    onClick={() => setCaveId(spot.id)}
                    aria-pressed={caveId === spot.id}
                  >
                    {spot.shortLabel}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.admixtureSection}>
        <h2 className={styles.sectionTitle}>A tangled family tree, not three tidy species</h2>
        <p className={styles.admixtureIntro}>
          Denisovans didn&rsquo;t just exist alongside Neanderthals and modern humans — they
          interbred with both, and with a third population known only from a genetic signal.
          Click each population to see the evidence for that mixing event.
        </p>
        <div className={styles.partnerGrid}>
          {ADMIXTURE_PARTNERS.map((partner) => (
            <button
              key={partner.id}
              type="button"
              className={`${styles.partnerCard} ${
                partnerId === partner.id ? styles.partnerCardActive : ""
              }`}
              onClick={() =>
                setPartnerId((current) => (current === partner.id ? null : partner.id))
              }
              aria-pressed={partnerId === partner.id}
            >
              <span className={styles.partnerLabel}>{partner.label}</span>
              <span className={styles.partnerHint}>
                {partnerId === partner.id ? "Tap to close" : "Tap to reveal"}
              </span>
            </button>
          ))}
        </div>
        {activePartner && (
          <div className={styles.partnerPanel}>
            <p className={styles.panelKicker}>{activePartner.timing}</p>
            <h3 className={styles.panelTitle}>{activePartner.title}</h3>
            {activePartner.body.map((paragraph, i) => (
              <p className={styles.panelBody} key={i}>
                {paragraph}
              </p>
            ))}
          </div>
        )}
      </section>

      <section className={styles.causalSection}>
        <h2 className={styles.causalTitle}>The gene that outlived the species</h2>
        <p className={styles.causalBody}>
          The clearest, most checkable legacy of all this mixing is a single gene: EPAS1. It
          helps the body cope with chronically low oxygen levels — exactly the kind of pressure
          that matters at high altitude, like the roughly 3,280-meter elevation of Baishiya
          Cave itself.
        </p>
        <p className={styles.causalBody}>
          EPAS1 passed from Denisovans into modern humans through interbreeding, and it is
          still carried by living Tibetan people today, where it&rsquo;s associated with
          better adaptation to high-altitude, low-oxygen conditions. It&rsquo;s a rare,
          concrete case of a specific adaptive trait outliving the species that originated it.
        </p>
        <p className={styles.causalBody}>
          Put simply: you can find living proof that this population existed by sequencing a
          living person&rsquo;s genome today — no excavation required. The mandible above and
          the cave it came from are the physical trace; the gene is the part of the story that
          never stopped being true.
        </p>
      </section>
    </main>
  );
}
