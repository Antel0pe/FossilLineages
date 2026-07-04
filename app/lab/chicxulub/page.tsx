"use client";

import { useState } from "react";
import Link from "next/link";
import { EVIDENCE, PHASE_LABELS, SOURCES, type Phase } from "./data";
import styles from "./chicxulub.module.css";

export default function ChicxulubLab() {
  const [activeId, setActiveId] = useState<string>(EVIDENCE[0].id);
  const [phase, setPhase] = useState<Phase>("before");
  const active = EVIDENCE.find((e) => e.id === activeId) ?? EVIDENCE[0];

  function selectSource(id: string) {
    setActiveId(id);
    setPhase("before");
  }

  return (
    <main className={styles.page}>
      <Link href="/lab" className={styles.back}>
        ← back to the lab
      </Link>

      <section className={styles.intro}>
        <p className={styles.kicker}>Chicxulub crater, Yucatán · ~66 million years ago</p>
        <h1 className={styles.title}>
          Six kinds of evidence for one asteroid — and why each thing it caused happened
        </h1>
        <p className={styles.subtitle}>
          The Chicxulub impact didn&rsquo;t leave one clue behind — it left six completely
          different kinds, in six completely different materials: a layer of dirt, the
          chemistry of ancient air, the shells of ocean plankton, fossilized pollen, dinosaur
          bones, and fish caught mid-breath. Each one below explains a different piece of
          <em> why</em> things happened the way they did, not just that they happened.
        </p>
        <p className={styles.subtitle}>
          Pick a source, then step through <strong>before → during → after</strong> to see how
          it changed.
        </p>
        <div className={styles.caveatBox}>
          <p className={styles.caveatTitle}>A note on certainty</p>
          <p className={styles.caveatBody}>
            The asteroid impact itself, the global iridium layer, and the planktonic
            foraminifera collapse are about as settled as historical science gets. A couple of
            sources below — especially the single-site Tanis deposit, and some finer details of
            the fern spike and dinosaur survival pattern — are flagged inline as still debated,
            so you can tell the bedrock findings from the more contested edges.
          </p>
        </div>
      </section>

      <div className={styles.layout}>
        <ul className={styles.sourceList} aria-label="Evidence sources">
          {EVIDENCE.map((source) => (
            <li key={source.id}>
              <button
                type="button"
                className={`${styles.sourceButton} ${
                  activeId === source.id ? styles.sourceButtonActive : ""
                }`}
                style={{ borderColor: source.color }}
                onClick={() => selectSource(source.id)}
                aria-pressed={activeId === source.id}
              >
                <span
                  className={styles.sourceSwatch}
                  style={{ background: source.color }}
                  aria-hidden="true"
                />
                <span className={styles.sourceButtonText}>
                  <span className={styles.sourceButtonKicker}>{source.kicker}</span>
                  <span className={styles.sourceButtonLabel}>{source.shortLabel}</span>
                </span>
                {source.confidence === "debated" && (
                  <span className={styles.debatedTag}>debated</span>
                )}
              </button>
            </li>
          ))}
        </ul>

        <div className={styles.panelColumn}>
          <div className={styles.panel} style={{ borderColor: active.color }}>
            <p className={styles.panelKicker} style={{ color: active.color }}>
              {active.kicker}
            </p>
            <h2 className={styles.panelTitle}>{active.name}</h2>

            <div className={styles.phaseToggle} role="tablist" aria-label="Timeline phase">
              {(Object.keys(PHASE_LABELS) as Phase[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  role="tab"
                  aria-selected={phase === p}
                  className={`${styles.phaseButton} ${phase === p ? styles.phaseButtonActive : ""}`}
                  style={phase === p ? { background: active.color, borderColor: active.color } : undefined}
                  onClick={() => setPhase(p)}
                >
                  {PHASE_LABELS[p]}
                </button>
              ))}
            </div>

            {active.phases[phase].map((paragraph, i) => (
              <p className={styles.panelBody} key={i}>
                {paragraph}
              </p>
            ))}

            <div className={styles.whyBlock}>
              <p className={styles.whyKicker}>Why this happened</p>
              {active.why.map((paragraph, i) => (
                <p className={styles.panelBody} key={i}>
                  {paragraph}
                </p>
              ))}
            </div>

            {active.caveat && (
              <div className={styles.debatedBlock}>
                <p className={styles.debatedKicker}>Where this is debated</p>
                <p className={styles.debatedBody}>{active.caveat}</p>
              </div>
            )}

            <ul className={styles.citeList}>
              {active.sourceIds.map((sourceId) => {
                const source = SOURCES[sourceId];
                return (
                  <li key={sourceId}>
                    <a
                      className={styles.citeLink}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {source.citation}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      <section className={styles.provenanceSection}>
        <h2 className={styles.provenanceTitle}>Where all of this comes from</h2>
        <p className={styles.provenanceBody}>
          Every fact above traces to a peer-reviewed paper, a major research institution, or a
          reputable science outlet reporting directly on one — linked next to the panel that
          uses it, and again here in full.
        </p>
        <ul className={styles.sourceCiteList}>
          {Object.values(SOURCES).map((source) => (
            <li key={source.id}>
              <a href={source.url} target="_blank" rel="noopener noreferrer">
                {source.citation}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
