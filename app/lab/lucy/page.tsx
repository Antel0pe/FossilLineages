"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./lucy.module.css";

type Region = {
  id: string;
  shortLabel: string;
  name: string;
  whatItIs: string;
  age: string;
  body: string[];
  top: number;
  height: number;
};

const REGIONS: Region[] = [
  {
    id: "skull",
    shortLabel: "Skull fragments",
    name: "Cranial fragments",
    whatItIs: "Partial pieces of the braincase and face — not a complete skull",
    age: "~3.2 million years ago",
    top: 2.5,
    height: 11.5,
    body: [
      "Only a handful of cranial fragments survive from this individual — enough to show a small, ape-sized braincase, but not enough to reconstruct a full skull from this specimen alone.",
      "That small brain size is the whole reason this skeleton turned out to matter so much: see the section below on why a small-brained, upright-walking hominin overturned a longstanding assumption about the order of human evolution.",
    ],
  },
  {
    id: "jaw",
    shortLabel: "Jaw",
    name: "Mandible (lower jaw) and teeth",
    whatItIs: "The lower jawbone, preserved with teeth in place",
    age: "~3.2 million years ago",
    top: 15.4,
    height: 8.5,
    body: [
      "The jaw and teeth are a major source of evidence for diet. Australopithecus afarensis is generally understood to have had a mixed diet, processed with fairly robust teeth and jaws compared to later Homo — though notably less heavily built than the specialized, even more robust jaws of later \"robust\" australopiths like Paranthropus.",
      "Tooth wear and jaw shape from specimens like this one are part of how researchers infer what early hominins were actually eating, long before there's any other direct evidence of diet.",
    ],
  },
  {
    id: "ribs",
    shortLabel: "Ribs / vertebrae",
    name: "Ribs and vertebrae",
    whatItIs: "Fragments of the rib cage and spinal column",
    age: "~3.2 million years ago",
    top: 25.5,
    height: 11.5,
    body: [
      "The preserved rib and vertebra fragments don't tell one dramatic story on their own — their value is cumulative. Along with the rest of the skeleton, they helped reconstruct her general body plan and proportions: how the torso, shoulders, and spine were built relative to the hips and legs below.",
      "Combined with the limb bones, this is part of how researchers concluded Lucy stood a little over a meter tall and likely weighed around 25-30 kg — small by modern human standards, but proportioned in a way that's recognizably on the path toward us.",
    ],
  },
  {
    id: "pelvis",
    shortLabel: "Pelvis",
    name: "Pelvis (ilium and sacrum)",
    whatItIs: "The hip bone, including the broad upper wing (ilium) and the sacrum it attaches to",
    age: "~3.2 million years ago",
    top: 37,
    height: 17,
    body: [
      "This is one of the strongest single pieces of skeletal evidence for habitual bipedalism in this species. Lucy's pelvis — particularly the ilium, the broad upper wing of the hip bone — is short and basin-shaped, much more similar to a modern human pelvis than to the tall, narrow pelvis of a chimpanzee.",
      "A basin-shaped pelvis supports the abdominal organs from below and anchors muscles, including the gluteal muscles, in a position that lets them stabilize the body over a single leg with each stride. That's exactly the muscular setup upright, striding walking requires — and exactly what a chimpanzee's pelvis isn't built for.",
    ],
  },
  {
    id: "femur",
    shortLabel: "Femur",
    name: "Femur (thighbone)",
    whatItIs: "The right femur, preserved largely intact",
    age: "~3.2 million years ago",
    top: 54,
    height: 19,
    body: [
      "Lucy's femur angles inward from the hip toward the knee — a feature called a valgus angle — bringing the knees close together under the body's center of mass.",
      "This is the same basic geometry seen in modern humans, who walk with their knees nearly under the body's midline. It's distinct from apes like chimpanzees, whose femurs run nearly straight down from a wider-set hip, consistent with a different, non-striding gait. Together with the pelvis, this is real, specific anatomical evidence — not just an assumption — that this species walked upright on two legs as a matter of course.",
    ],
  },
  {
    id: "lower-leg",
    shortLabel: "Lower leg",
    name: "Tibia (shinbone)",
    whatItIs: "The lower leg bone, between the knee and ankle",
    age: "~3.2 million years ago",
    top: 73.5,
    height: 7.7,
    body: [
      "The tibia continues the same story as the femur above it: its proportions and the angle at which it would have met the knee are consistent with a leg built to bear weight in a straight line beneath the body during upright walking, rather than the more bowed, climbing-adapted leg of a chimpanzee.",
    ],
  },
  {
    id: "hand-foot",
    shortLabel: "Hand / foot bones",
    name: "Hand and foot bones",
    whatItIs: "Scattered finger bones (mid-body, left and right) and foot bones (bottom of the skeleton)",
    age: "~3.2 million years ago",
    top: 87.3,
    height: 9.7,
    body: [
      "Some of Lucy's preserved hand and foot bones show curvature consistent with strong grasping ability. Many researchers interpret this as retained climbing, or arboreal, capability alongside her bipedal adaptations.",
      "How much tree-climbing Australopithecus afarensis actually still did in daily life is genuinely debated among paleoanthropologists — it's not a settled question either way. What's not in dispute is that she had both: a pelvis and femur built for upright walking, and hands and feet that may have still been useful in the trees. That combination is often called a \"mosaic\" of traits, evolution working on different parts of the body at different rates rather than all at once.",
    ],
  },
];

export default function LucyExplorer() {
  const [activeId, setActiveId] = useState<string>("pelvis");
  const active = REGIONS.find((r) => r.id === activeId) ?? REGIONS[0];

  return (
    <main className={styles.page}>
      <Link href="/lab" className={styles.back}>
        ← back to the lab
      </Link>

      <section className={styles.intro}>
        <p className={styles.kicker}>Hadar, Afar Triangle, Ethiopia · discovered 1974</p>
        <h1 className={styles.title}>
          A skeleton that proved we walked upright millions of years before we got a big brain.
        </h1>
        <p className={styles.subtitle}>
          This is AL 288-1 — nicknamed &ldquo;Lucy&rdquo; — a partial skeleton, roughly 40%
          complete, of <em>Australopithecus afarensis</em>, discovered by paleoanthropologist
          Donald Johanson and dated to roughly 3.2 million years ago. The nickname comes from
          the Beatles song &ldquo;Lucy in the Sky with Diamonds,&rdquo; reportedly played at the
          dig camp the night of the discovery.
        </p>
        <p className={styles.subtitle}>
          Click or tap a bone region on the photo, or pick one below it, to see what it is and
          what it tells us.
        </p>
      </section>

      <div className={styles.layout}>
        <div className={styles.imageColumn}>
          <div className={styles.imageFrame}>
            <Image
              src="/images/lab/lucy-skeleton.jpg"
              alt="Photograph of the reconstructed AL 288-1 'Lucy' skeleton cast, with bones laid out in their natural body positions: skull fragments and jaw at top, ribs and vertebrae in the torso, pelvis and femur at center, lower leg below, and hand and foot bones scattered at the sides and bottom"
              width={1000}
              height={2413}
              className={styles.photo}
              priority
              sizes="(max-width: 760px) 100vw, 460px"
            />
            {REGIONS.map((region) => (
              <button
                key={region.id}
                type="button"
                className={`${styles.hotspot} ${
                  activeId === region.id ? styles.hotspotActive : ""
                }`}
                style={{ top: `${region.top}%`, height: `${region.height}%` }}
                onClick={() => setActiveId(region.id)}
                aria-pressed={activeId === region.id}
                aria-label={region.name}
              >
                <span className={styles.hotspotLabel}>{region.shortLabel}</span>
              </button>
            ))}
          </div>
          <p className={styles.credit}>
            Photo: reconstruction of the AL 288-1 (&ldquo;Lucy&rdquo;) skeleton cast, displayed
            at the Musée national d&rsquo;histoire naturelle, Paris. Credit: &ldquo;User
            120&rdquo;, via{" "}
            <a
              href="https://commons.wikimedia.org/wiki/File:Reconstruction_of_the_fossil_skeleton_of_%22Lucy%22_the_Australopithecus_afarensis.jpg"
              target="_blank"
              rel="noopener noreferrer"
            >
              Wikimedia Commons
            </a>
            , multi-licensed{" "}
            <a
              href="https://creativecommons.org/licenses/by-sa/3.0/"
              target="_blank"
              rel="noopener noreferrer"
            >
              CC BY-SA 3.0
            </a>{" "}
            /{" "}
            <a
              href="https://creativecommons.org/licenses/by/2.5/"
              target="_blank"
              rel="noopener noreferrer"
            >
              CC BY 2.5
            </a>{" "}
            / GFDL.
          </p>
        </div>

        <div className={styles.panelColumn}>
          <div className={styles.panel}>
            <p className={styles.panelKicker}>{active.shortLabel}</p>
            <h2 className={styles.panelTitle}>{active.name}</h2>
            <p className={styles.panelMeta}>
              <strong>What it is:</strong> {active.whatItIs}
              <br />
              <strong>Age:</strong> {active.age}
            </p>
            {active.body.map((paragraph, i) => (
              <p className={styles.panelBody} key={i}>
                {paragraph}
              </p>
            ))}
          </div>

          <ul className={styles.regionList}>
            {REGIONS.map((region) => (
              <li key={region.id}>
                <button
                  type="button"
                  className={`${styles.regionListItem} ${
                    activeId === region.id ? styles.regionListItemActive : ""
                  }`}
                  onClick={() => setActiveId(region.id)}
                  aria-pressed={activeId === region.id}
                >
                  {region.shortLabel}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <section className={styles.causalSection}>
        <h2 className={styles.causalTitle}>Why this particular skeleton mattered</h2>
        <p className={styles.causalBody}>
          Before discoveries like Lucy, many researchers assumed that a large brain came first
          in human evolution, with upright walking following later as one of several
          &ldquo;human&rdquo; traits emerging together. The reasoning was straightforward
          enough: brains seem like the most distinctively human thing about us, so why wouldn&rsquo;t
          they have led the way?
        </p>
        <p className={styles.causalBody}>
          Lucy was complete enough — particularly in the pelvis and femur — to demonstrate
          clearly that habitual bipedalism was already well established roughly 3.2 million
          years ago, in a species that still had a small, ape-sized brain. That was a genuine,
          important shift in how scientists understood the order of human evolutionary changes:
          walking upright evolved well before big brains did, not alongside or after them.
        </p>
        <p className={styles.causalBody}>
          This page is about the physical evidence for that order of events. For a narrative,
          animal&rsquo;s-eye-view telling of an earlier, more hypothetical moment when bipedalism
          may have first taken hold — around 6 million years ago, well before Lucy&rsquo;s
          time — see{" "}
          <Link href="/story/bipedalism">the bipedalism scene</Link>. That story imagines the
          moment; this skeleton is the real fossil evidence that the bet it describes paid off.
        </p>
      </section>
    </main>
  );
}
