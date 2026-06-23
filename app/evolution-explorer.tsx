"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./explorer.module.css";

export type Source = {
  id: string;
  title: string;
  url: string;
  organization?: string;
  authors?: string;
  year?: number;
};

export type Pressure = { change: string; pressure: string };

export type FossilSite = {
  site: string;
  country: string;
  lat: number;
  lon: number;
  specimen: string;
  note: string;
  olderMa: number;
  youngerMa: number;
};

export type TaxonImage = {
  src: string;
  local: boolean;
  kind: string;
  creator: string;
  license: string;
  sourcePage: string;
  caveat: string;
};

export type Taxon = {
  id: string;
  scientificName: string;
  commonName?: string;
  role: string;
  branch: "spine" | "sibling" | "living-anchor" | "ancestral-ape";
  posture: "biped" | "quadruped" | "knuckle-walker";
  heightMeters: number;
  olderMa: number;
  youngerMa: number;
  col: number;
  lane: number;
  regions: string[];
  summary: string;
  physicalChange: string;
  observedTraits: string[];
  behavioralChange: string;
  pressures: Pressure[];
  certainty: string;
  image: TaxonImage;
  fossilSites: FossilSite[];
  sourceIds: string[];
};

export type Edge = {
  fromId: string;
  toId: string;
  kind: "supported" | "candidate" | "context" | "split" | "gene-flow";
};

export type Layout = {
  colSpacing: number;
  laneSpacing: number;
  padX: number;
  baseLane: number;
};

export type LineageDataset = {
  taxa: Taxon[];
  edges: Edge[];
  layout: Layout;
  intro?: { focus: string; honesty: string };
};

type ExplorerProps = {
  data: LineageDataset;
  sources: Source[];
};

const CARD_WIDTH = 178;
const CARD_HEIGHT = 250;
const PAD_TOP = 96;
const MIN_FIG = 56;
const MAX_FIG = 172;
const MAX_HEIGHT_M = 1.75;

const eraLabels = [
  { col: 0.2, label: "Miocene apes", date: "~20 Ma" },
  { col: 3.2, label: "First upright steps", date: "~7–4 Ma" },
  { col: 6.6, label: "Australopiths walk Africa", date: "~4–2 Ma" },
  { col: 9.8, label: "The genus Homo spreads", date: "~2 Ma →" },
  { col: 12.6, label: "The last branches", date: "<0.8 Ma" },
];

const branchAccent: Record<Taxon["branch"], string> = {
  spine: styles.accentSpine,
  sibling: styles.accentSibling,
  "living-anchor": styles.accentAnchor,
  "ancestral-ape": styles.accentApe,
};

function formatAge(value: number) {
  if (value === 0) return "present";
  if (value < 1) return `${Math.round(value * 1000).toLocaleString()} ka`;
  return `${Number.isInteger(value) ? value : value.toFixed(value < 10 ? 1 : 0)} Ma`;
}

function formatRange(olderMa: number, youngerMa: number) {
  if (youngerMa === 0) return `${formatAge(olderMa)} → present`;
  if (Math.abs(olderMa - youngerMa) < 0.005) return `about ${formatAge(olderMa)}`;
  return `${formatAge(olderMa)} – ${formatAge(youngerMa)}`;
}

function figureHeight(heightMeters: number) {
  const ratio = Math.min(heightMeters, MAX_HEIGHT_M) / MAX_HEIGHT_M;
  return Math.round(MIN_FIG + ratio * (MAX_FIG - MIN_FIG));
}

function Figure({ taxon, eager = false }: { taxon: Taxon; eager?: boolean }) {
  const [loaded, setLoaded] = useState(false);
  const height = figureHeight(taxon.heightMeters);
  return (
    <div className={styles.figureArea}>
      <span className={styles.groundLine} aria-hidden="true" />
      <div className={styles.figBox} style={{ height }}>
        {!loaded && <span className={styles.figLoader} aria-hidden="true" />}
        <Image
          src={taxon.image.src}
          alt={`${taxon.scientificName}: ${taxon.image.kind}. ${taxon.image.caveat}`}
          fill
          loading={eager ? "eager" : "lazy"}
          sizes="200px"
          className={`${styles.figImg} ${loaded ? styles.figLoaded : ""}`}
          onLoad={() => setLoaded(true)}
        />
      </div>
    </div>
  );
}

function TaxonCard({
  taxon,
  x,
  y,
  onOpen,
}: {
  taxon: Taxon;
  x: number;
  y: number;
  onOpen: (id: string) => void;
}) {
  return (
    <button
      type="button"
      className={`${styles.figCard} ${branchAccent[taxon.branch]}`}
      style={{ left: x, top: y, width: CARD_WIDTH, height: CARD_HEIGHT }}
      onClick={() => onOpen(taxon.id)}
      aria-label={`Open details for ${taxon.scientificName}`}
    >
      <Figure taxon={taxon} eager={taxon.col < 6} />
      <span className={styles.cardName}>{taxon.scientificName}</span>
      <span className={styles.cardAge}>{formatRange(taxon.olderMa, taxon.youngerMa)}</span>
    </button>
  );
}

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={direction === "left" ? styles.flipIcon : undefined}>
      <path d="M5 12h14m-5-5 5 5-5 5" />
    </svg>
  );
}

function WorldMap({ sites }: { sites: FossilSite[] }) {
  return (
    <div className={styles.mapWrap}>
      <div
        className={styles.mapCanvas}
        role="img"
        aria-label={`Map of ${sites.length} key fossil ${sites.length === 1 ? "site" : "sites"}`}
      >
        <Image src="/images/world-map.png" alt="World basemap" fill priority sizes="760px" className={styles.mapImage} />
        {sites.map((site, index) => (
          <span
            key={`${site.site}-${index}`}
            className={styles.mapMarker}
            style={{
              left: `${((site.lon + 180) / 360) * 100}%`,
              top: `${((90 - site.lat) / 180) * 100}%`,
            }}
            title={`${site.site}, ${site.country}`}
          >
            {index + 1}
          </span>
        ))}
      </div>
      <ol className={styles.siteList}>
        {sites.map((site, index) => (
          <li key={`${site.site}-${index}`}>
            <span className={styles.siteDot} aria-hidden="true">{index + 1}</span>
            <span>
              <strong>{site.site}</strong>
              <small>{site.country} · {site.specimen}</small>
              <small>{site.note}</small>
            </span>
            <span className={styles.siteAge}>{formatRange(site.olderMa, site.youngerMa)}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function LineageNav({
  label,
  taxa,
  direction,
  onNavigate,
}: {
  label: string;
  taxa: Taxon[];
  direction: "left" | "right";
  onNavigate: (id: string) => void;
}) {
  if (!taxa.length) return null;
  return (
    <nav className={`${styles.lineageNav} ${direction === "left" ? styles.navLeft : styles.navRight}`} aria-label={label}>
      <span className={styles.navLabel}>{label}</span>
      {taxa.map((taxon) => (
        <button type="button" key={taxon.id} onClick={() => onNavigate(taxon.id)}>
          {direction === "left" && <ArrowIcon direction="left" />}
          <span>{taxon.scientificName}</span>
          {direction === "right" && <ArrowIcon direction="right" />}
        </button>
      ))}
    </nav>
  );
}

function DetailModal({
  taxon,
  references,
  ancestors,
  descendants,
  onClose,
  onNavigate,
}: {
  taxon: Taxon;
  references: Source[];
  ancestors: Taxon[];
  descendants: Taxon[];
  onClose: () => void;
  onNavigate: (id: string) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const isLiving = taxon.youngerMa === 0;

  useEffect(() => {
    closeRef.current?.focus();
  }, [taxon.id]);

  return (
    <div className={styles.modalBackdrop} onMouseDown={onClose}>
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="taxon-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button ref={closeRef} type="button" className={styles.closeButton} onClick={onClose} aria-label="Close details">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
        </button>

        <LineageNav label="Earlier" taxa={ancestors} direction="left" onNavigate={onNavigate} />
        <LineageNav label="Later branches" taxa={descendants} direction="right" onNavigate={onNavigate} />

        <div className={styles.modalScroll}>
          <header className={styles.modalHeader}>
            <span className={styles.modalEyebrow}>{taxon.role}</span>
            <h2 id="taxon-title">{taxon.scientificName}</h2>
            {taxon.commonName && <p className={styles.commonName}>{taxon.commonName}</p>}
            <p className={styles.summary}>{taxon.summary}</p>
            <p className={styles.metaRow}>
              <span>{formatRange(taxon.olderMa, taxon.youngerMa)}</span>
              <span>{taxon.regions.join(" · ")}</span>
            </p>
          </header>

          <div className={styles.modalBody}>
            <figure className={styles.modalVisual}>
              <div className={styles.modalImgWrap}>
                <Image
                  src={taxon.image.src}
                  alt={`${taxon.scientificName}: ${taxon.image.kind}`}
                  fill
                  priority
                  sizes="(max-width: 760px) 90vw, 380px"
                  className={styles.modalImg}
                />
              </div>
              <figcaption>
                <strong>{taxon.image.kind}</strong>
                <span>{taxon.image.caveat}</span>
                <a href={taxon.image.sourcePage} target="_blank" rel="noreferrer">
                  {taxon.image.creator} · {taxon.image.license}
                </a>
              </figcaption>
            </figure>

            <div className={styles.changeCol}>
              <article className={styles.block}>
                <span className={styles.blockTag}>What physically changed</span>
                <p>{taxon.physicalChange}</p>
                <ul className={styles.traitChips}>
                  {taxon.observedTraits.map((trait) => <li key={trait}>{trait}</li>)}
                </ul>
              </article>

              <article className={styles.block}>
                <span className={styles.blockTag}>How it lived — behaviour & ecology</span>
                <p>{taxon.behavioralChange}</p>
              </article>

              <article className={styles.block}>
                <span className={styles.blockTag}>Why it may have changed</span>
                <ul className={styles.pairList}>
                  {taxon.pressures.map((pair) => (
                    <li key={pair.change}>
                      <strong>{pair.change}</strong>
                      <span aria-hidden="true">←</span>
                      <em>{pair.pressure}</em>
                    </li>
                  ))}
                </ul>
              </article>

              <article className={`${styles.block} ${styles.confidenceBlock}`}>
                <span className={styles.blockTag}>How sure are we?</span>
                <p>{taxon.certainty}</p>
              </article>
            </div>
          </div>

          <section className={styles.mapSection}>
            <span className={styles.blockTag}>Where it lived & was found</span>
            {taxon.fossilSites.length ? (
              <WorldMap sites={taxon.fossilSites} />
            ) : (
              <p className={styles.livingNote}>
                {isLiving
                  ? "A living species — shown as a present-day cousin rather than from fossil sites."
                  : "No mapped fossil site is included for this form yet."}
              </p>
            )}
          </section>

          {references.length > 0 && (
            <footer className={styles.referenceStrip}>
              <span>Evidence trail</span>
              <div>
                {references.slice(0, 5).map((source) => (
                  <a key={source.id} href={source.url} target="_blank" rel="noreferrer">
                    {source.organization ?? source.authors ?? "Research"}{source.year ? ` · ${source.year}` : ""}
                  </a>
                ))}
                {references.length > 5 && <span>+{references.length - 5} more</span>}
              </div>
            </footer>
          )}
        </div>
      </section>
    </div>
  );
}

export default function EvolutionExplorer({ data, sources }: ExplorerProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const treeViewportRef = useRef<HTMLDivElement>(null);

  const { layout } = data;
  const taxaById = useMemo(() => new Map(data.taxa.map((t) => [t.id, t])), [data.taxa]);
  const sourcesById = useMemo(() => new Map(sources.map((s) => [s.id, s])), [sources]);

  const positions = useMemo(() => {
    const map = new Map<string, { x: number; y: number; cx: number; cy: number }>();
    for (const t of data.taxa) {
      const x = layout.padX + t.col * layout.colSpacing;
      const y = PAD_TOP + (layout.baseLane + t.lane) * layout.laneSpacing;
      map.set(t.id, { x, y, cx: x + CARD_WIDTH / 2, cy: y + CARD_HEIGHT / 2 });
    }
    return map;
  }, [data.taxa, layout]);

  const { canvasWidth, canvasHeight } = useMemo(() => {
    let w = 0;
    let h = 0;
    for (const p of positions.values()) {
      w = Math.max(w, p.x + CARD_WIDTH);
      h = Math.max(h, p.y + CARD_HEIGHT);
    }
    return { canvasWidth: w + layout.padX, canvasHeight: h + 60 };
  }, [positions, layout.padX]);

  const navEdges = useMemo(() => data.edges.filter((e) => e.kind !== "gene-flow"), [data.edges]);
  const selected = selectedId ? taxaById.get(selectedId) : undefined;

  useEffect(() => {
    if (!selectedId) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedId]);

  const scrollTree = (direction: -1 | 1) => {
    treeViewportRef.current?.scrollBy({ left: direction * 620, behavior: "smooth" });
  };

  function edgePath(fromId: string, toId: string) {
    const from = positions.get(fromId);
    const to = positions.get(toId);
    if (!from || !to) return null;
    const startX = from.x + CARD_WIDTH;
    const startY = from.cy;
    const endX = to.x;
    const endY = to.cy;
    const bend = Math.max(40, (endX - startX) * 0.45);
    return `M ${startX} ${startY} C ${startX + bend} ${startY}, ${endX - bend} ${endY}, ${endX} ${endY}`;
  }

  return (
    <main className={styles.pageShell}>
      <header className={styles.siteHeader}>
        <a className={styles.brand} href="#top" aria-label="Fossil Lineages home">
          <span className={styles.brandMark} aria-hidden="true">FL</span>
          <span><strong>Fossil Lineages</strong><small>How the human body changed</small></span>
        </a>
        <div className={styles.headerMeta}>
          <span><i className={styles.legendSolid} /> Supported step</span>
          <span><i className={styles.legendDotted} /> Candidate / context</span>
          <span><i className={styles.legendSplit} /> Split to living cousin</span>
          <span><i className={styles.legendTeal} /> Later interbreeding</span>
        </div>
      </header>

      <section className={styles.explorerSection} id="top" aria-labelledby="tree-heading">
        <div className={styles.explorerHeader}>
          <div>
            <p className={styles.sectionNumber}>01 / WALK THE LINEAGE</p>
            <h2 id="tree-heading">Watch the body <span>change</span></h2>
            <p className={styles.lede}>
              Figures are sized to real body height and stand on a shared ground line, so the change is visible as you
              scroll. Click any figure for what changed, how it lived, and why.
            </p>
          </div>
          <div className={styles.scrollControls}>
            <span>Deep past → present</span>
            <button type="button" onClick={() => scrollTree(-1)} aria-label="Scroll left"><ArrowIcon direction="left" /></button>
            <button type="button" onClick={() => scrollTree(1)} aria-label="Scroll right"><ArrowIcon direction="right" /></button>
          </div>
        </div>

        <div className={styles.treeViewport} ref={treeViewportRef} tabIndex={0} aria-label="Scrollable evolutionary tree">
          <div className={styles.treeCanvas} style={{ width: canvasWidth, height: canvasHeight }}>
            {eraLabels.map((era) => (
              <div className={styles.eraLabel} key={era.label} style={{ left: layout.padX + era.col * layout.colSpacing }}>
                <span>{era.date}</span>{era.label}
              </div>
            ))}

            <svg className={styles.connectorLayer} width={canvasWidth} height={canvasHeight} aria-hidden="true">
              {data.edges.map((edge) => {
                const d = edgePath(edge.fromId, edge.toId);
                if (!d) return null;
                return (
                  <path
                    key={`${edge.fromId}-${edge.toId}-${edge.kind}`}
                    d={d}
                    className={styles[`edge_${edge.kind.replace("-", "_")}`]}
                  />
                );
              })}
            </svg>

            {data.taxa.map((taxon) => {
              const p = positions.get(taxon.id)!;
              return <TaxonCard key={taxon.id} taxon={taxon} x={p.x} y={p.y} onOpen={setSelectedId} />;
            })}
          </div>
        </div>

        <div className={styles.treeFootnote}>
          <strong>How to read this</strong>
          <p>
            Solid lines are well-supported steps; dashed lines are candidates or context — not proven direct ancestors.
            Gorillas and chimps branch off as living <em>cousins</em>, and teal curves show later interbreeding. This is
            a branching bush, not a ladder.
          </p>
          <span>Best-evidence reconstructions — interpretations, not photographs.</span>
        </div>
      </section>

      {selected && (
        <DetailModal
          key={selected.id}
          taxon={selected}
          references={selected.sourceIds.map((id) => sourcesById.get(id)).filter((s): s is Source => Boolean(s))}
          ancestors={navEdges.filter((e) => e.toId === selected.id).map((e) => taxaById.get(e.fromId)).filter((t): t is Taxon => Boolean(t))}
          descendants={navEdges.filter((e) => e.fromId === selected.id).map((e) => taxaById.get(e.toId)).filter((t): t is Taxon => Boolean(t))}
          onClose={() => setSelectedId(null)}
          onNavigate={setSelectedId}
        />
      )}
    </main>
  );
}
