"use client";

import Image from "next/image";
import Link from "next/link";
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

export type AdditionalContext = { fact: string; sourceIds: string[] };

export type SiblingBullet = { id: string; bullet: string; additionalContext?: AdditionalContext };

export type Divergence = {
  fromId: string;
  siblingIds: string[];
  label: string;
  ancestorBaseline: string;
  siblingBullets: SiblingBullet[];
  confidenceNote: string;
};

export type EvolutionPoint = {
  fromId: string;
  toId: string;
  label: string;
  ancestorBaseline: string;
  whatChangedBullet: string;
  confidenceNote: string;
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
  divergences?: Divergence[];
  evolutionPoints?: EvolutionPoint[];
};

type ExplorerProps = {
  data: LineageDataset;
  sources: Source[];
};

const CARD_WIDTH = 178;
const CARD_HEIGHT = 250;
const CARD_PAD_TOP = 10;
const CARD_PAD_BOTTOM = 11;
const ROW_GAP = 5;
const NAME_ROW_HEIGHT = 20;
const AGE_ROW_HEIGHT = 13;
// Fixed (never "auto") so the name/age rows can never be squeezed below the text's real
// height by the grid — an auto row whose content has overflow:hidden contributes a
// min-content of 0, so the grid can shrink it far below the text, which then renders at
// full size anyway and visually bleeds into the figure area above it.
const FOOTER_HEIGHT = CARD_PAD_TOP + CARD_PAD_BOTTOM + ROW_GAP * 2 + NAME_ROW_HEIGHT + AGE_ROW_HEIGHT;
const MIN_FIG = 56;
const MAX_FIG = 172;
const MAX_HEIGHT_M = 1.75;
// A floor of 0.4 made sense back when the tree never scrolled vertically and had to cram
// every lane into the viewport. Now that .treeViewport scrolls vertically, an oversized lane
// span (more branch points => more lanes) can lean on scroll instead of shrinking cards to
// near-illegibility — so the floor only needs to guard against a handful of extra lanes, not
// absorb unlimited vertical growth.
const MIN_SCALE = 0.72;

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

// --- Chronological nav pill layout -----------------------------------------------------
// Pills are positioned by the taxon's real graph `col` (same mapping the era labels use).
// Branch-point and evolution-point pills are packed into ONE shared left-to-right sequence
// (not packed per-row and then nudged) so that a pill's horizontal position is strictly
// governed by chronological order across BOTH rows at once — an older event, whichever row
// it's in, can never end up to the right of a younger one. Packing each row independently and
// then pushing overlaps sideways (an earlier approach here) could shove an older pill in one
// row to the right of a younger pill in the other row purely to dodge a collision, which broke
// the ordering guarantee; a single shared pack can't do that, since every pill's position is
// decided relative to the ONE pill immediately before it in true chronological order, period.
// Widths are estimated from label length (no DOM measurement pass) with a generous gap, since
// exact typographic width isn't needed — only "never overlaps, never reorders," which the gap
// and the shared-sequence pack together guarantee.
const PILL_ROW_HEIGHT = 32;
const PILL_ROW_GAP = 10;
const PILL_GAP = 14;

function estimatePillWidth(ageText: string, label: string) {
  return Math.round(24 + ageText.length * 5.6 + 7 + label.length * 6.6);
}

type PillItem = { key: string; natural: number; width: number };

// Sorts by natural (time-based) position and pushes any pill right just enough to clear the
// one before it, so pills never overlap and never reorder relative to their natural sequence.
function packTimeline(items: PillItem[]): Map<string, number> {
  const sorted = [...items].sort((a, b) => a.natural - b.natural);
  const lefts = new Map<string, number>();
  let rightEdge = -Infinity;
  for (const item of sorted) {
    const left = Math.max(item.natural, rightEdge + PILL_GAP);
    lefts.set(item.key, left);
    rightEdge = left + item.width;
  }
  return lefts;
}

function figureHeight(heightMeters: number, scale: number, figureAreaHeight: number) {
  const ratio = Math.min(heightMeters, MAX_HEIGHT_M) / MAX_HEIGHT_M;
  const minFig = Math.max(20, MIN_FIG * scale);
  const maxFig = Math.max(minFig + 8, MAX_FIG * scale);
  const raw = minFig + ratio * (maxFig - minFig);
  // Hard cap to the actual figure-area box (minus the figBox's own bottom margin) so the
  // image can never overflow its row regardless of how the scale math above resolves.
  return Math.round(Math.min(raw, figureAreaHeight - 8));
}

function Figure({ taxon, scale, figureAreaHeight, eager = false }: { taxon: Taxon; scale: number; figureAreaHeight: number; eager?: boolean }) {
  const [loaded, setLoaded] = useState(false);
  const height = figureHeight(taxon.heightMeters, scale, figureAreaHeight);
  return (
    <div className={styles.figureArea} style={{ height: figureAreaHeight }}>
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
  cardHeight,
  scale,
  onOpen,
}: {
  taxon: Taxon;
  x: number;
  y: number;
  cardHeight: number;
  scale: number;
  onOpen: (id: string) => void;
}) {
  const figureAreaHeight = Math.max(30, cardHeight - FOOTER_HEIGHT);
  return (
    <button
      type="button"
      className={`${styles.figCard} ${branchAccent[taxon.branch]}`}
      style={{
        left: x,
        top: y,
        width: CARD_WIDTH,
        height: cardHeight,
        gridTemplateRows: `${figureAreaHeight}px ${NAME_ROW_HEIGHT}px ${AGE_ROW_HEIGHT}px`,
      }}
      onClick={() => onOpen(taxon.id)}
      aria-label={`Open details for ${taxon.scientificName}`}
    >
      <Figure taxon={taxon} scale={scale} figureAreaHeight={figureAreaHeight} eager={taxon.col < 6} />
      <span className={styles.cardName}>{taxon.scientificName}</span>
      <span className={styles.cardAge}>{formatRange(taxon.olderMa, taxon.youngerMa)}</span>
    </button>
  );
}

function DivergencePanel({
  divergence,
  ancestor,
  siblings,
  sourcesById,
  onClose,
  onOpenSpecies,
}: {
  divergence: Divergence;
  ancestor: Taxon;
  siblings: { taxon: Taxon; bullet: string; additionalContext: AdditionalContext | undefined }[];
  sourcesById: Map<string, Source>;
  onClose: () => void;
  onOpenSpecies: (id: string) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [tab, setTab] = useState<"changed" | "context">("changed");
  // The parent keys this component by divergence, so a new branch point remounts it and
  // `tab` starts at "changed" on its own — this effect only has to move focus into the dialog.
  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  // Only siblings with a genuinely additive fact get a row here — this is expected to be
  // situational (some branch points have none), matching how `pressures` already varies
  // 1-2 entries per taxon without reading as broken. No padded "nothing found" placeholders.
  const contextSiblings = siblings.filter(
    (s): s is { taxon: Taxon; bullet: string; additionalContext: AdditionalContext } => Boolean(s.additionalContext)
  );

  return (
    <div className={styles.divergenceBackdrop} onMouseDown={onClose}>
      <section
        className={styles.divergencePanel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="divergence-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button ref={closeRef} type="button" className={styles.closeButton} onClick={onClose} aria-label="Close comparison">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
        </button>

        <header className={styles.divergenceHeader}>
          <span className={styles.modalEyebrow}>Branch point &middot; {siblings.length} strategies</span>
          <h3 id="divergence-title">{divergence.label}</h3>
        </header>

        {contextSiblings.length > 0 && (
          <div className={styles.panelTabs} role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={tab === "changed"}
              className={`${styles.panelTab} ${tab === "changed" ? styles.panelTabActive : ""}`}
              onClick={() => setTab("changed")}
            >
              What changed
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === "context"}
              className={`${styles.panelTab} ${tab === "context" ? styles.panelTabActive : ""}`}
              onClick={() => setTab("context")}
            >
              Additional context
            </button>
          </div>
        )}

        {tab === "changed" && (
          <>
            <article className={styles.ancestorBlock}>
              <span className={styles.blockTag}>
                Starting point &middot; <button type="button" className={styles.inlineTaxonLink} onClick={() => onOpenSpecies(ancestor.id)}>{ancestor.scientificName}</button>
              </span>
              <p>{divergence.ancestorBaseline}</p>
            </article>

            <ul className={styles.siblingBulletList}>
              {siblings.map(({ taxon, bullet }) => (
                <li key={taxon.id}>
                  <button type="button" className={styles.siblingBulletName} onClick={() => onOpenSpecies(taxon.id)}>
                    {taxon.scientificName}
                  </button>
                  <p>{bullet}</p>
                </li>
              ))}
            </ul>

            <article className={`${styles.block} ${styles.confidenceBlock}`}>
              <span className={styles.blockTag}>How sure are we?</span>
              <p>{divergence.confidenceNote}</p>
            </article>
          </>
        )}

        {tab === "context" && contextSiblings.length > 0 && (
          <ul className={styles.additionalContextList}>
            {contextSiblings.map(({ taxon, additionalContext }) => (
              <li key={taxon.id}>
                <button type="button" className={styles.siblingBulletName} onClick={() => onOpenSpecies(taxon.id)}>
                  {taxon.scientificName}
                </button>
                <p>{additionalContext.fact}</p>
                <div className={styles.additionalContextSources}>
                  {additionalContext.sourceIds.map((id) => {
                    const source = sourcesById.get(id);
                    if (!source) return null;
                    return (
                      <a key={id} href={source.url} target="_blank" rel="noreferrer">
                        {source.organization ?? source.authors ?? "Source"}{source.year ? ` · ${source.year}` : ""}
                      </a>
                    );
                  })}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function EvolutionPointPanel({
  point,
  ancestor,
  descendant,
  onClose,
  onOpenSpecies,
}: {
  point: EvolutionPoint;
  ancestor: Taxon;
  descendant: Taxon;
  onClose: () => void;
  onOpenSpecies: (id: string) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeRef.current?.focus();
  }, [point.fromId, point.toId]);

  return (
    <div className={styles.divergenceBackdrop} onMouseDown={onClose}>
      <section
        className={styles.divergencePanel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="evolution-point-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button ref={closeRef} type="button" className={styles.closeButton} onClick={onClose} aria-label="Close evolution point">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
        </button>

        <header className={styles.divergenceHeader}>
          <span className={styles.modalEyebrow}>Evolution point &middot; no known branch</span>
          <h3 id="evolution-point-title">{point.label}</h3>
        </header>

        <article className={styles.ancestorBlock}>
          <span className={styles.blockTag}>
            Starting point &middot; <button type="button" className={styles.inlineTaxonLink} onClick={() => onOpenSpecies(ancestor.id)}>{ancestor.scientificName}</button>
          </span>
          <p>{point.ancestorBaseline}</p>
        </article>

        <ul className={styles.siblingBulletList}>
          <li>
            <button type="button" className={styles.siblingBulletName} onClick={() => onOpenSpecies(descendant.id)}>
              {descendant.scientificName}
            </button>
            <p>{point.whatChangedBullet}</p>
          </li>
        </ul>

        <article className={`${styles.block} ${styles.confidenceBlock}`}>
          <span className={styles.blockTag}>How sure are we this was a straight, unbranched line?</span>
          <p>{point.confidenceNote}</p>
        </article>
      </section>
    </div>
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
  const [activeDivergenceKey, setActiveDivergenceKey] = useState<string | null>(null);
  const [activeEvolutionPointKey, setActiveEvolutionPointKey] = useState<string | null>(null);
  const treeViewportRef = useRef<HTMLDivElement>(null);
  const [viewportHeight, setViewportHeight] = useState(0);

  const { layout } = data;
  const taxaById = useMemo(() => new Map(data.taxa.map((t) => [t.id, t])), [data.taxa]);
  const sourcesById = useMemo(() => new Map(sources.map((s) => [s.id, s])), [sources]);

  useEffect(() => {
    const el = treeViewportRef.current;
    if (!el) return;
    const measure = () => setViewportHeight(el.clientHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Lane spacing is derived from the ROUNDED card height plus a fixed gap (not from two
  // independently-scaled values) so lanePx > cardHeight is guaranteed exactly, with no
  // floating-point race — siblings one lane apart sit flush but never overlap, at any size.
  const LANE_GAP = 2;
  const { cardHeight, span, minLane } = useMemo(() => {
    const laneValues = data.taxa.map((t) => layout.baseLane + t.lane);
    const lo = Math.min(...laneValues);
    const hi = Math.max(...laneValues);
    const laneSpan = hi - lo || 1;
    const naturalTotal = laneSpan * (CARD_HEIGHT + LANE_GAP) + CARD_HEIGHT + 24;
    const available = viewportHeight || naturalTotal;
    const ideal = (available - 24 - laneSpan * LANE_GAP) / (laneSpan + 1);
    const h = Math.round(Math.max(MIN_SCALE * CARD_HEIGHT, Math.min(CARD_HEIGHT, ideal)));
    return { cardHeight: h, span: laneSpan, minLane: lo };
  }, [data.taxa, layout, viewportHeight]);

  const scale = cardHeight / CARD_HEIGHT;
  const lanePx = cardHeight + LANE_GAP;
  const canvasHeight = Math.max(viewportHeight, span * lanePx + cardHeight + 24);

  const positions = useMemo(() => {
    const map = new Map<string, { x: number; y: number; cx: number; cy: number }>();
    for (const t of data.taxa) {
      const x = layout.padX + t.col * layout.colSpacing;
      const laneValue = layout.baseLane + t.lane;
      const y = 12 + (laneValue - minLane) * lanePx;
      map.set(t.id, { x, y, cx: x + CARD_WIDTH / 2, cy: y + cardHeight / 2 });
    }
    return map;
  }, [data.taxa, layout, lanePx, minLane, cardHeight]);

  const canvasWidth = useMemo(() => {
    let w = 0;
    for (const p of positions.values()) w = Math.max(w, p.x + CARD_WIDTH);
    return w + layout.padX;
  }, [positions, layout.padX]);

  const navEdges = useMemo(() => data.edges.filter((e) => e.kind !== "gene-flow"), [data.edges]);

  const divergenceByKey = useMemo(() => {
    const map = new Map<string, Divergence>();
    for (const div of data.divergences ?? []) {
      map.set(`${div.fromId}-${div.siblingIds.join("-")}`, div);
    }
    return map;
  }, [data.divergences]);

  // Ordered oldest-first by the latest-appearing sibling in each cluster (a proxy for "roughly
  // when this split had played out"), so the index reads left-to-right the same way the graph does.
  const chronoDivergences = useMemo(() => {
    const rows = (data.divergences ?? []).map((div) => {
      const key = `${div.fromId}-${div.siblingIds.join("-")}`;
      const splitAge = Math.max(...div.siblingIds.map((id) => taxaById.get(id)?.olderMa ?? 0));
      return { key, fromId: div.fromId, label: div.label, splitAge, siblingCount: div.siblingIds.length };
    });
    return rows.sort((a, b) => b.splitAge - a.splitAge);
  }, [data.divergences, taxaById]);

  const activeDivergence = activeDivergenceKey ? divergenceByKey.get(activeDivergenceKey) : undefined;
  const activeDivergenceView = useMemo(() => {
    if (!activeDivergence) return undefined;
    const ancestor = taxaById.get(activeDivergence.fromId);
    if (!ancestor) return undefined;
    const siblings = activeDivergence.siblingBullets
      .map((sb) => {
        const taxon = taxaById.get(sb.id);
        return taxon ? { taxon, bullet: sb.bullet, additionalContext: sb.additionalContext } : undefined;
      })
      .filter((s): s is { taxon: Taxon; bullet: string; additionalContext: AdditionalContext | undefined } => Boolean(s));
    return { divergence: activeDivergence, ancestor, siblings };
  }, [activeDivergence, taxaById]);

  const evolutionPointByKey = useMemo(() => {
    const map = new Map<string, EvolutionPoint>();
    for (const ep of data.evolutionPoints ?? []) {
      map.set(`${ep.fromId}-${ep.toId}`, ep);
    }
    return map;
  }, [data.evolutionPoints]);

  // Same chronological convention as chronoDivergences: sorted oldest-first by the point when
  // the descendant taxon appears, so it lines up left-to-right the same way as the graph/other row.
  const chronoEvolutionPoints = useMemo(() => {
    const rows = (data.evolutionPoints ?? []).map((ep) => {
      const key = `${ep.fromId}-${ep.toId}`;
      const pointAge = taxaById.get(ep.toId)?.olderMa ?? 0;
      return { key, fromId: ep.fromId, label: ep.label, pointAge };
    });
    return rows.sort((a, b) => b.pointAge - a.pointAge);
  }, [data.evolutionPoints, taxaById]);

  const activeEvolutionPoint = activeEvolutionPointKey ? evolutionPointByKey.get(activeEvolutionPointKey) : undefined;
  const activeEvolutionPointView = useMemo(() => {
    if (!activeEvolutionPoint) return undefined;
    const ancestor = taxaById.get(activeEvolutionPoint.fromId);
    const descendant = taxaById.get(activeEvolutionPoint.toId);
    if (!ancestor || !descendant) return undefined;
    return { point: activeEvolutionPoint, ancestor, descendant };
  }, [activeEvolutionPoint, taxaById]);

  // Positions both nav rows along the graph's own `col` timeline (same mapping eraLabels use).
  // Branch and evolution pills share ONE packed sequence (see packTimeline above) so their
  // left-to-right order always matches true chronological order across both rows combined.
  const navPillLayout = useMemo(() => {
    const colX = (id: string) => layout.padX + (taxaById.get(id)?.col ?? 0) * layout.colSpacing;

    const branchItems: PillItem[] = chronoDivergences.map((row) => ({
      key: `branch:${row.key}`,
      natural: colX(row.fromId),
      width: estimatePillWidth(formatAge(row.splitAge), row.label),
    }));
    const evoItems: PillItem[] = chronoEvolutionPoints.map((row) => ({
      key: `evo:${row.key}`,
      natural: colX(row.fromId),
      width: estimatePillWidth(formatAge(row.pointAge), row.label),
    }));

    const lefts = packTimeline([...branchItems, ...evoItems]);

    let trackWidth = 0;
    for (const item of [...branchItems, ...evoItems]) trackWidth = Math.max(trackWidth, (lefts.get(item.key) ?? 0) + item.width);

    return { lefts, trackWidth: trackWidth + layout.padX };
  }, [chronoDivergences, chronoEvolutionPoints, taxaById, layout]);

  const openSpecies = (id: string) => {
    setActiveDivergenceKey(null);
    setActiveEvolutionPointKey(null);
    setSelectedId(id);
  };
  const openDivergence = (key: string) => {
    setSelectedId(null);
    setActiveEvolutionPointKey(null);
    setActiveDivergenceKey(key);
  };
  const openEvolutionPoint = (key: string) => {
    setSelectedId(null);
    setActiveDivergenceKey(null);
    setActiveEvolutionPointKey(key);
  };

  const selected = selectedId ? taxaById.get(selectedId) : undefined;

  useEffect(() => {
    if (!selectedId && !activeDivergenceKey && !activeEvolutionPointKey) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedId(null);
        setActiveDivergenceKey(null);
        setActiveEvolutionPointKey(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedId, activeDivergenceKey, activeEvolutionPointKey]);

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
          <span><strong>Fossil Lineages</strong></span>
        </a>
        <div className={styles.scrollControls}>
          <Link href="/story" className={styles.storiesLink}>Stories</Link>
          <Link href="/lab" className={styles.storiesLink}>Lab</Link>
          <button type="button" onClick={() => scrollTree(-1)} aria-label="Scroll left"><ArrowIcon direction="left" /></button>
          <button type="button" onClick={() => scrollTree(1)} aria-label="Scroll right"><ArrowIcon direction="right" /></button>
        </div>
      </header>

      <nav className={styles.pointsNav} aria-label="Jump to a branch point or evolution point">
        <div className={styles.pointsNavLabels}>
          <span className={styles.branchNavLabel}>Branch points</span>
          <span className={styles.branchNavLabel}>Evolution points</span>
        </div>
        <div className={styles.pointsNavScroll}>
          <div
            className={styles.pointsNavTrack}
            style={{ width: navPillLayout.trackWidth, height: PILL_ROW_HEIGHT * 2 + PILL_ROW_GAP }}
          >
            {chronoDivergences.map((row) => (
              <button
                type="button"
                key={row.key}
                className={styles.branchNavItem}
                style={{ position: "absolute", left: navPillLayout.lefts.get(`branch:${row.key}`) ?? 0, top: 0 }}
                onClick={() => openDivergence(row.key)}
                aria-label={`Compare strategies: ${row.label}`}
              >
                <span className={styles.branchNavAge}>{formatAge(row.splitAge)}</span>
                {row.label}
              </button>
            ))}
            {chronoEvolutionPoints.map((row) => (
              <button
                type="button"
                key={row.key}
                className={`${styles.branchNavItem} ${styles.evoNavItem}`}
                style={{
                  position: "absolute",
                  left: navPillLayout.lefts.get(`evo:${row.key}`) ?? 0,
                  top: PILL_ROW_HEIGHT + PILL_ROW_GAP,
                }}
                onClick={() => openEvolutionPoint(row.key)}
                aria-label={`See what changed with no known branch: ${row.label}`}
              >
                <span className={styles.branchNavAge}>{formatAge(row.pointAge)}</span>
                {row.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <section className={styles.explorerSection} id="top" aria-label="Evolutionary tree">
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
              return <TaxonCard key={taxon.id} taxon={taxon} x={p.x} y={p.y} cardHeight={cardHeight} scale={scale} onOpen={openSpecies} />;
            })}
          </div>
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
          onNavigate={openSpecies}
        />
      )}

      {activeDivergenceView && (
        <DivergencePanel
          key={activeDivergenceKey}
          divergence={activeDivergenceView.divergence}
          ancestor={activeDivergenceView.ancestor}
          siblings={activeDivergenceView.siblings}
          sourcesById={sourcesById}
          onClose={() => setActiveDivergenceKey(null)}
          onOpenSpecies={openSpecies}
        />
      )}

      {activeEvolutionPointView && (
        <EvolutionPointPanel
          key={activeEvolutionPointKey}
          point={activeEvolutionPointView.point}
          ancestor={activeEvolutionPointView.ancestor}
          descendant={activeEvolutionPointView.descendant}
          onClose={() => setActiveEvolutionPointKey(null)}
          onOpenSpecies={openSpecies}
        />
      )}
    </main>
  );
}
