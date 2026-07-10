"use client";

import { useState } from "react";
import Link from "next/link";
import { PANELS, SOURCES, type HorsePanel } from "./data";
import styles from "./horses.module.css";

const KIND_ACCENT: Record<HorsePanel["kind"], string> = {
  evolution: styles.accentEvolution,
  branch: styles.accentBranch,
  deadend: styles.accentDeadend,
};

export default function HorsesLab() {
  const [activeId, setActiveId] = useState<string>(PANELS[0].id);
  const active = PANELS.find((p) => p.id === activeId) ?? PANELS[0];

  return (
    <main className={styles.page}>
      <Link href="/lab" className={styles.back}>
        ← back to the lab
      </Link>

      <section className={styles.intro}>
        <p className={styles.kicker}>Equidae · ~55 million years ago → today</p>
        <h1 className={styles.title}>The horse lineage&rsquo;s branch and evolution points</h1>
        <p className={styles.subtitle}>
          Five real points in horse evolutionary history, placed in chronological order. Each
          one is a baseline, what changed and why, and the deeper evidence behind that why —
          the same causal method used for the human lineage, applied to a different animal.
          Only one branch (Equus) is still alive; the others aren&rsquo;t foils for it, each has
          its own causal story.
        </p>
      </section>

      <nav className={styles.timeline} aria-label="Chronological horse lineage points">
        <span className={styles.timelineLine} aria-hidden="true" />
        {PANELS.map((panel) => (
          <button
            key={panel.id}
            type="button"
            className={`${styles.marker} ${KIND_ACCENT[panel.kind]} ${
              activeId === panel.id ? styles.markerActive : ""
            }`}
            onClick={() => setActiveId(panel.id)}
            aria-pressed={activeId === panel.id}
          >
            <span className={styles.markerDot} aria-hidden="true" />
            <span className={styles.markerDate}>{panel.dateRange}</span>
            <span className={styles.markerTitle}>{panel.title}</span>
          </button>
        ))}
      </nav>

      <section className={styles.layout}>
        <SidePanel panel={active} />
      </section>
    </main>
  );
}

function SidePanel({ panel }: { panel: HorsePanel }) {
  return (
    <article className={`${styles.sidePanel} ${KIND_ACCENT[panel.kind]}`}>
      <header className={styles.panelHeader}>
        <span className={styles.panelEyebrow}>{panel.kindLabel}</span>
        <h2 className={styles.panelTitle}>{panel.title}</h2>
        <span className={styles.panelDate}>{panel.dateRange}</span>
      </header>

      <section className={styles.block}>
        <span className={styles.blockTag}>Starting point</span>
        <p>{panel.baseline}</p>
      </section>

      <ul className={styles.changeList}>
        {panel.changes.map((change) => (
          <li key={change.subject}>
            <span className={styles.changeSubject}>{change.subject}</span>
            <p>{change.text}</p>
          </li>
        ))}
      </ul>

      <section className={styles.block}>
        <span className={styles.blockTag}>Why-of-the-why — the deeper evidence</span>
        <p>{panel.whyOfWhy}</p>
      </section>

      <section className={`${styles.block} ${styles.confidenceBlock}`}>
        <span className={styles.blockTag}>How sure are we?</span>
        <p>{panel.confidence}</p>
      </section>

      <section className={styles.block}>
        <span className={styles.blockTag}>Sources</span>
        <ul className={styles.sourceList}>
          {panel.citationNs.map((n) => {
            const source = SOURCES[n];
            if (!source) return null;
            return (
              <li key={n}>
                {source.url ? (
                  <a href={source.url} target="_blank" rel="noreferrer">
                    {source.text}
                  </a>
                ) : (
                  <span>{source.text}</span>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </article>
  );
}
