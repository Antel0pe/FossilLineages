"use client";

import { useState } from "react";
import Link from "next/link";
import { PANELS, SOURCES, TREE, type HorsePanel, type TreeNode } from "./data";
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
        <h1 className={styles.title}>How horses actually branched</h1>
        <p className={styles.subtitle}>
          Real points in horse evolutionary history, laid out as an actual branching tree —
          who split from who, and what happened to each branch, including the dead ends. Only
          one line (Equus) is still around; the others aren&rsquo;t footnotes to it, each has
          its own story. Click any point on the tree.
        </p>
      </section>

      <div className={styles.layout}>
        <nav className={styles.treeWrap} aria-label="Horse lineage branching tree">
          <TreeList node={TREE} activeId={activeId} onSelect={setActiveId} />
        </nav>

        <SidePanel panel={active} />
      </div>
    </main>
  );
}

function TreeList({
  node,
  activeId,
  onSelect,
}: {
  node: TreeNode;
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <ul className={styles.treeList}>
      <TreeItem node={node} activeId={activeId} onSelect={onSelect} />
    </ul>
  );
}

function TreeItem({
  node,
  activeId,
  onSelect,
}: {
  node: TreeNode;
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const panel = PANELS.find((p) => p.id === node.panelId);
  const accent = panel ? KIND_ACCENT[panel.kind] : "";
  return (
    <li className={styles.treeItem}>
      <button
        type="button"
        className={`${styles.treeButton} ${accent} ${activeId === node.panelId ? styles.treeButtonActive : ""}`}
        onClick={() => onSelect(node.panelId)}
        aria-pressed={activeId === node.panelId}
      >
        <span className={styles.treeLabel}>{node.label}</span>
        {node.status === "extinct" && <span className={styles.tagExtinct}>extinct</span>}
        {node.status === "living" && <span className={styles.tagLiving}>living</span>}
        {node.statusNote && <span className={styles.treeNote}>{node.statusNote}</span>}
      </button>
      {node.children && node.children.length > 0 && (
        <ul className={styles.treeChildren}>
          {node.children.map((child) => (
            <TreeItem key={child.id} node={child} activeId={activeId} onSelect={onSelect} />
          ))}
        </ul>
      )}
    </li>
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
        <span className={styles.blockTag}>The deeper why</span>
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
