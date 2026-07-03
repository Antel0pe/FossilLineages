"use client";

import { useState } from "react";
import Link from "next/link";
import FinchChart from "./FinchChart";
import { CATEGORY_COLORS, METRICS, SECTIONS, SOURCES } from "./data";
import styles from "./grants-finches.module.css";

const CATEGORY_LABELS: Record<string, string> = {
  baseline: "No single acute cause",
  drought: "Drought",
  elNino: "El Niño flood",
  competitor: "New competitor",
};

export default function GrantsFinchesLab() {
  const [activeSectionId, setActiveSectionId] = useState<string>(SECTIONS[0].id);
  const activeSection = SECTIONS.find((s) => s.id === activeSectionId) ?? SECTIONS[0];

  return (
    <main className={styles.page}>
      <Link href="/lab" className={styles.back}>
        ← back to the lab
      </Link>

      <section className={styles.intro}>
        <p className={styles.kicker}>Daphne Major, Galápagos · Geospiza fortis · 1973–2012</p>
        <h1 className={styles.title}>
          Forty years of a beak changing size — and the real events that pushed it each time
        </h1>
        <p className={styles.subtitle}>
          Peter and Rosemary Grant measured every finch on this tiny island for four decades.
          The numbers below are real per-year measurements from their published data, not
          smoothed or invented — and every jump or reversal in the lines traces back to an
          actual event: a drought, a flood, a new competitor arriving.
        </p>
        <p className={styles.subtitle}>
          Click a colored band on any graph — or a button under the panel — to see what
          happened during that stretch and why it moved the population the way it did. The
          same color means the same kind of cause, on every graph.
        </p>
        <ul className={styles.legend}>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <li key={key} className={styles.legendItem}>
              <span
                className={styles.legendSwatch}
                style={{ background: CATEGORY_COLORS[key as keyof typeof CATEGORY_COLORS] }}
              />
              {label}
            </li>
          ))}
        </ul>
      </section>

      <div className={styles.layout}>
        <div className={styles.chartsColumn}>
          {METRICS.map((metric) => (
            <div key={metric.key}>
              <FinchChart
                label={metric.label}
                unit={metric.unit}
                points={metric.points}
                sections={SECTIONS}
                activeSectionId={activeSectionId}
                onSelectSection={setActiveSectionId}
              />
              {metric.axisNote && <p className={styles.axisNote}>{metric.axisNote}</p>}
            </div>
          ))}
        </div>

        <div className={styles.panelColumn}>
          <div className={styles.panel}>
            <p className={styles.panelKicker}>
              {activeSection.startYear}–{activeSection.endYear} ·{" "}
              {CATEGORY_LABELS[activeSection.category]}
            </p>
            <h2 className={styles.panelTitle}>{activeSection.title}</h2>
            {activeSection.blurb.map((paragraph, i) => (
              <p className={styles.panelBody} key={i}>
                {paragraph}
              </p>
            ))}
            <ul className={styles.sourceList}>
              {activeSection.sourceIds.map((sourceId) => {
                const source = SOURCES[sourceId];
                return (
                  <li key={sourceId}>
                    <a
                      className={styles.sourceLink}
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

          <ul className={styles.sectionList}>
            {SECTIONS.map((section) => (
              <li key={section.id}>
                <button
                  type="button"
                  className={`${styles.sectionListItem} ${
                    activeSectionId === section.id ? styles.sectionListItemActive : ""
                  }`}
                  onClick={() => setActiveSectionId(section.id)}
                  aria-pressed={activeSectionId === section.id}
                >
                  {section.startYear}–{section.endYear}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <section className={styles.provenanceSection}>
        <h2 className={styles.provenanceTitle}>Where these numbers actually come from</h2>
        <p className={styles.provenanceBody}>
          Beak length and beak depth above are exact annual means, pulled directly from the
          data tables the Grants deposited alongside their book{" "}
          <em>40 Years of Evolution: Darwin&rsquo;s Finches on Daphne Major Island</em> (Princeton,
          2014) — the same numbers behind the book&rsquo;s own published figures, not values read
          off a chart image.
        </p>
        <p className={styles.provenanceBody}>
          Body size is shown as a standardized index (PC1 of mass, wing length, and tarsus
          length combined), because no public year-by-year average weight-in-grams series
          exists for this population — the Grants themselves report body size in these same
          standardized units in their papers, so this chart uses the real metric they tracked
          rather than inventing a gram figure that isn&rsquo;t publicly available.
        </p>
        <p className={styles.provenanceBody}>
          The causal sections are drawn from the peer-reviewed papers cited in each panel, not
          from generic narrative — each section&rsquo;s year range was chosen to match where the
          real data actually moves in the direction the paper describes.
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
