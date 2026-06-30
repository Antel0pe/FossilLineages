"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./antikythera.module.css";

type Step = {
  id: string;
  year: string;
  shortLabel: string;
  title: string;
  body: string[];
};

const STEPS: Step[] = [
  {
    id: "1901",
    year: "1901",
    shortLabel: "1901: pulled from the sea",
    title: "A corroded lump comes up from a shipwreck",
    body: [
      "Sponge divers find the wreck of an ancient cargo ship off the Greek island of Antikythera, dated to roughly 70-60 BCE. Among the statues and amphorae, archaeologists recover a green, corroded chunk of bronze and wood, badly cracked apart.",
      "At this point it looks like junk: a heavily corroded lump, indistinguishable at a glance from any other piece of shipwreck debris. Nobody yet knows it's a machine.",
    ],
  },
  {
    id: "gears",
    year: "mid-1900s",
    shortLabel: "mid-1900s: someone notices gears",
    title: "Wait — those are gear teeth",
    body: [
      "Decades after the recovery, researchers looking closely at the largest fragments start to notice something odd: tiny, precisely cut bronze teeth, the unmistakable signature of gears, embedded in the corrosion.",
      "This is the first real clue that the lump isn't debris at all but the remains of a deliberately engineered device. Counting visible gears suggests a mechanism of real mechanical sophistication, but most of its structure is still hidden inside the corroded fragments, completely unreadable to the naked eye.",
    ],
  },
  {
    id: "2006",
    year: "2006",
    shortLabel: "2006: X-rays reveal a calendar",
    title: "Seeing through 2,000 years of corrosion",
    body: [
      "A major study published in 2006 applies X-ray imaging and surface scanning to the fragments, letting researchers see structure buried inside the bronze that corrosion had hidden for two millennia.",
      "The imaging reveals gear trains modeling the cycles of the sun and moon, lunar-phase display, and a mechanism tied to the ancient Saros cycle for predicting eclipses. It also exposes minute inscribed Greek text on internal surfaces no eye had read since antiquity — including references to the timing of Panhellenic games, like the Olympics.",
      "The device turns out to contain at least 30 hand-cut bronze gears: a level of mechanical complexity nothing else from the ancient world is known to match.",
    ],
  },
  {
    id: "2018",
    year: "2018",
    shortLabel: "2018: improved CT reveals more",
    title: "A sharper look at the largest fragment",
    body: [
      "An improved X-ray computed tomography (CT) reconstruction, published in PLOS One in 2018, re-examines the largest fragment with higher resolution than the 2006 imaging allowed.",
      "Like a new layer of rock exposed in a cliff, the better scan reveals more buried detail: finer gear-tooth counts and inscription fragments that refine and extend what the 2006 study had found. Each imaging advance is read the same way a geologist reads a rock face — evidence recovered piece by piece, just hidden inside corroded metal instead of inside stone.",
    ],
  },
  {
    id: "today",
    year: "today",
    shortLabel: "today: still studied",
    title: "The fragments are still being read",
    body: [
      "More than a century after it was pulled from the sea, the mechanism is still an active research subject. New imaging techniques continue to be applied to the surviving 82 fragments, and details of the gearing and inscriptions are still being refined and debated.",
      "Each pass — naked eye, then X-ray, then CT, then better CT — has added a layer of understanding that the previous pass couldn't see. There is no reason to think this is the last one.",
    ],
  },
];

export default function AntikytheraPage() {
  const [activeId, setActiveId] = useState<string>(STEPS[0].id);
  const activeIndex = STEPS.findIndex((s) => s.id === activeId);
  const active = STEPS[activeIndex] ?? STEPS[0];

  return (
    <main className={styles.page}>
      <Link href="/lab" className={styles.back}>
        ← back to the lab
      </Link>

      <section className={styles.intro}>
        <p className={styles.kicker}>Antikythera, Greece &middot; shipwreck dated ~70-60 BCE</p>
        <h1 className={styles.title}>
          This looks like a corroded lump of junk. It isn&rsquo;t.
        </h1>
        <p className={styles.subtitle}>
          In 1901, sponge divers recovered this fragment — and others like it — from an
          ancient shipwreck. Underneath the corrosion is the most mechanically complex
          object known to survive from the ancient world: a hand-built bronze mechanism
          with at least 30 precisely cut gears.
        </p>
        <p className={styles.subtitle}>
          Nobody figured that out by looking at it once. It took decades, and several
          generations of imaging technology, each one revealing a layer the last one
          couldn&rsquo;t see. Click through the timeline below to follow how that
          understanding was built up, piece by piece.
        </p>
      </section>

      <div className={styles.imageWrap}>
        <div className={styles.imageFrame}>
          <Image
            src="/images/lab/antikythera-fragment-a.webp"
            alt="Fragment A of the Antikythera mechanism, a corroded ancient bronze gear assembly, photographed at the National Archaeological Museum, Athens"
            width={3648}
            height={3648}
            className={styles.photo}
            priority
            sizes="(max-width: 760px) 100vw, 700px"
          />
        </div>
        <p className={styles.credit}>
          Photo: Fragment A of the Antikythera mechanism, National Archaeological Museum,
          Athens, by Logg Tandy, via{" "}
          <a
            href="https://commons.wikimedia.org/wiki/Category:Antikythera_mechanism"
            target="_blank"
            rel="noopener noreferrer"
          >
            Wikimedia Commons
          </a>
          , licensed{" "}
          <a
            href="https://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            rel="noopener noreferrer"
          >
            CC BY 4.0
          </a>
          .
        </p>
      </div>

      <section className={styles.timelineSection}>
        <h2 className={styles.timelineHeading}>How we figured out what this is</h2>
        <ol className={styles.timeline}>
          {STEPS.map((step, i) => (
            <li key={step.id} className={styles.timelineItem}>
              <button
                type="button"
                className={`${styles.timelineButton} ${
                  activeId === step.id ? styles.timelineButtonActive : ""
                }`}
                onClick={() => setActiveId(step.id)}
                aria-pressed={activeId === step.id}
              >
                <span className={styles.timelineYear}>{step.year}</span>
                <span className={styles.timelineDot} aria-hidden="true" />
              </button>
              {i < STEPS.length - 1 && (
                <span className={styles.timelineConnector} aria-hidden="true" />
              )}
            </li>
          ))}
        </ol>

        <div className={styles.panel}>
          <p className={styles.panelKicker}>{active.shortLabel}</p>
          <h3 className={styles.panelTitle}>{active.title}</h3>
          {active.body.map((paragraph, i) => (
            <p className={styles.panelBody} key={i}>
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section className={styles.openQuestionSection}>
        <h2 className={styles.openQuestionTitle}>An open question, not a solved one</h2>
        <p className={styles.openQuestionBody}>
          Nothing else of comparable mechanical complexity is known from the ancient
          world. And nothing comparably sophisticated reappears in the historical record
          for roughly 1,000 years or more, until medieval European astronomical clocks.
        </p>
        <p className={styles.openQuestionBody}>
          That gap is still genuinely debated among historians of science. Was this device
          a singular masterpiece — a one-off feat by an exceptional maker, never repeated?
          Or is it the one survivor of a broader tradition of precision Greek geared
          instruments that mostly didn&rsquo;t survive shipwrecks, fires, and twenty
          centuries of melting bronze down for reuse? Both are plausible. Neither is
          proven. The mechanism is the only direct evidence we have, and it can&rsquo;t
          settle the question on its own.
        </p>
        <p className={styles.openQuestionBody}>
          One thing we can say with more confidence, speculatively: whoever designed the
          gear ratios that model the moon&rsquo;s irregular motion across the sky had to
          work the mathematics out by hand, with no way to test a wrong gear count except
          building it and watching it drift out of sync with the actual sky. That is a
          slow, exacting way to discover you were wrong.
        </p>
      </section>
    </main>
  );
}
