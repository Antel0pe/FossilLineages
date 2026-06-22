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

export type Fossil = {
  id: string;
  taxonId: string;
  specimen: string;
  site: string;
  country: string;
  lat: number;
  lon: number;
  coordinatePrecisionKm: number;
  olderMa: number;
  youngerMa: number;
  material: string;
  importance: string;
  mediaUrl?: string;
  sourceIds: string[];
};

export type VisualAsset = {
  id: string;
  taxonId: string;
  category: string;
  title: string;
  localPath?: string;
  externalUrl?: string;
  sourcePage: string;
  creator: string;
  license: string;
  licenseUrl?: string;
  reuse?: string;
  scientificCaveat: string;
};

export type Taxon = {
  id: string;
  scientificName: string;
  kind: string;
  lineageRole: string;
  olderMa: number;
  youngerMa: number;
  regions: string[];
  summary: string;
  observedTraits: string[];
  changeSummary: string;
  whyHypotheses: string[];
  relationshipCertainty: string;
  representativeFossilIds: string[];
  visualAssetIds: string[];
  sourceIds: string[];
};

export type HumanLineageDataset = {
  updatedAt: string;
  taxa: Taxon[];
  fossils: Fossil[];
  visualAssets: VisualAsset[];
};

type ExplorerProps = {
  data: HumanLineageDataset;
  sources: Source[];
};

type Tab = "overview" | "fossils" | "map";

type TreePosition = {
  id: string;
  x: number;
  y: number;
};

type TreeEdge = {
  fromId: string;
  toId: string;
  kind: "supported" | "candidate" | "context" | "gene-flow";
};

const CARD_WIDTH = 188;
const CARD_HEIGHT = 196;
const TREE_WIDTH = 2828;
const TREE_HEIGHT = 840;

const treePositions: TreePosition[] = [
  { id: "rukwapithecus-fleaglei", x: 36, y: 286 },
  { id: "ekembo-nyanzae", x: 266, y: 286 },
  { id: "nakalipithecus-nakayamai", x: 496, y: 286 },
  { id: "sahelanthropus-tchadensis", x: 726, y: 104 },
  { id: "orrorin-tugenensis", x: 726, y: 494 },
  { id: "ardipithecus-kadabba", x: 956, y: 286 },
  { id: "ardipithecus-ramidus", x: 1186, y: 286 },
  { id: "australopithecus-anamensis", x: 1416, y: 286 },
  { id: "australopithecus-afarensis", x: 1646, y: 286 },
  { id: "homo-habilis", x: 1876, y: 116 },
  { id: "paranthropus-boisei", x: 1876, y: 494 },
  { id: "homo-erectus", x: 2106, y: 116 },
  { id: "middle-pleistocene-homo", x: 2336, y: 116 },
  { id: "homo-sapiens", x: 2566, y: 18 },
  { id: "homo-neanderthalensis", x: 2566, y: 286 },
  { id: "denisovans", x: 2566, y: 554 },
];

const treeEdges: TreeEdge[] = [
  { fromId: "rukwapithecus-fleaglei", toId: "ekembo-nyanzae", kind: "context" },
  { fromId: "ekembo-nyanzae", toId: "nakalipithecus-nakayamai", kind: "context" },
  { fromId: "nakalipithecus-nakayamai", toId: "sahelanthropus-tchadensis", kind: "context" },
  { fromId: "nakalipithecus-nakayamai", toId: "orrorin-tugenensis", kind: "context" },
  { fromId: "sahelanthropus-tchadensis", toId: "ardipithecus-kadabba", kind: "candidate" },
  { fromId: "orrorin-tugenensis", toId: "ardipithecus-kadabba", kind: "candidate" },
  { fromId: "ardipithecus-kadabba", toId: "ardipithecus-ramidus", kind: "candidate" },
  { fromId: "ardipithecus-ramidus", toId: "australopithecus-anamensis", kind: "candidate" },
  { fromId: "australopithecus-anamensis", toId: "australopithecus-afarensis", kind: "supported" },
  { fromId: "australopithecus-afarensis", toId: "homo-habilis", kind: "candidate" },
  { fromId: "australopithecus-afarensis", toId: "paranthropus-boisei", kind: "candidate" },
  { fromId: "homo-habilis", toId: "homo-erectus", kind: "supported" },
  { fromId: "homo-erectus", toId: "middle-pleistocene-homo", kind: "supported" },
  { fromId: "middle-pleistocene-homo", toId: "homo-sapiens", kind: "supported" },
  { fromId: "middle-pleistocene-homo", toId: "homo-neanderthalensis", kind: "supported" },
  { fromId: "middle-pleistocene-homo", toId: "denisovans", kind: "supported" },
  { fromId: "homo-neanderthalensis", toId: "homo-sapiens", kind: "gene-flow" },
  { fromId: "denisovans", toId: "homo-sapiens", kind: "gene-flow" },
];

const navigationEdges = treeEdges.filter((edge) => edge.kind !== "gene-flow");

const branchLabels = [
  { x: 550, label: "African great ape context", date: "~10–7 Ma" },
  { x: 1190, label: "Habitual bipedality", date: "~5–4 Ma" },
  { x: 1880, label: "Early Homo diversifies", date: "~2.4 Ma" },
  { x: 2380, label: "Later Homo branches", date: "<800 ka" },
];

function formatAge(value: number) {
  if (value === 0) return "present";
  if (value < 1) return `${Math.round(value * 1000).toLocaleString()} ka`;
  return `${Number.isInteger(value) ? value : value.toFixed(value < 10 ? 2 : 1)} Ma`;
}

function formatRange(olderMa: number, youngerMa: number) {
  if (youngerMa === 0) return `${formatAge(olderMa)} to present`;
  if (Math.abs(olderMa - youngerMa) < 0.005) return `about ${formatAge(olderMa)}`;
  return `${formatAge(olderMa)}–${formatAge(youngerMa)}`;
}

function humanize(value: string) {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function shortenName(name: string) {
  return name.replace(" (often grouped as Homo heidelbergensis)", "");
}

function isAvailableAsset(asset: VisualAsset) {
  return Boolean(asset.localPath || asset.externalUrl);
}

function isWholeBodyAsset(asset: VisualAsset) {
  return /full-body|skeleton/i.test(asset.title);
}

function pickOverviewAsset(assets: VisualAsset[]) {
  return assets.find((asset) => isAvailableAsset(asset) && isWholeBodyAsset(asset))
    ?? assets.find((asset) => isAvailableAsset(asset) && asset.category.includes("color_life"))
    ?? assets.find(isAvailableAsset);
}

function pickFossilAsset(assets: VisualAsset[]) {
  return assets.find((asset) => isAvailableAsset(asset) && asset.category.includes("fossil") && isWholeBodyAsset(asset))
    ?? assets.find((asset) => isAvailableAsset(asset) && asset.category.includes("fossil"));
}

function edgePath(from: TreePosition, to: TreePosition) {
  const startX = from.x + CARD_WIDTH;
  const startY = from.y + CARD_HEIGHT / 2;
  const endX = to.x;
  const endY = to.y + CARD_HEIGHT / 2;
  const bend = Math.max(34, (endX - startX) * 0.5);
  return `M ${startX} ${startY} C ${startX + bend} ${startY}, ${endX - bend} ${endY}, ${endX} ${endY}`;
}

function PlaceholderVisual({ label }: { label: string }) {
  return (
    <div className={styles.placeholderVisual} aria-label={`No reconstruction selected for ${label}`}>
      <svg viewBox="0 0 80 80" aria-hidden="true">
        <path d="M25 23c0-11 7-18 16-18s16 7 16 18c0 8-3 13-7 17l-1 10H33l-1-10c-4-4-7-9-7-17Z" />
        <path d="M31 30h7m5 0h7M37 41h8M20 70c2-13 9-20 20-20s18 7 20 20" />
      </svg>
      <span>Fossil evidence only</span>
    </div>
  );
}

function SpecimenImage({
  asset,
  label,
  compact = false,
}: {
  asset?: VisualAsset;
  label: string;
  compact?: boolean;
}) {
  const source = asset?.localPath ?? asset?.externalUrl;
  const [loadedSource, setLoadedSource] = useState<string | null>(null);
  if (!asset || !source) return <PlaceholderVisual label={label} />;
  const isLoaded = loadedSource === source;

  return (
    <div className={styles.imageFrame}>
      {!isLoaded && <span className={styles.imageLoader} aria-hidden="true">Loading image…</span>}
      <Image
        key={source}
        src={source}
        alt={`${asset.title}. ${asset.scientificCaveat}`}
        fill
        loading={compact ? "eager" : "lazy"}
        decoding="async"
        sizes={compact ? "188px" : "(max-width: 700px) 90vw, 520px"}
        onLoad={() => setLoadedSource(source)}
        className={`${styles.specimenImage} ${isLoaded ? styles.imageLoaded : styles.imageLoading}`}
      />
    </div>
  );
}

function TaxonCard({
  taxon,
  asset,
  position,
  onOpen,
}: {
  taxon: Taxon;
  asset?: VisualAsset;
  position: TreePosition;
  onOpen: (id: string) => void;
}) {
  return (
    <button
      type="button"
      className={styles.taxonCard}
      style={{ left: position.x, top: position.y }}
      onClick={() => onOpen(taxon.id)}
      aria-label={`Open details for ${taxon.scientificName}`}
    >
      <span className={styles.cardRole}>{humanize(taxon.lineageRole).replace("Population Grade", "grade")}</span>
      <span className={styles.cardImage}>
        <SpecimenImage asset={asset} label={taxon.scientificName} compact />
      </span>
      <span className={styles.cardName}>{shortenName(taxon.scientificName)}</span>
      <span className={styles.cardAge}>{formatRange(taxon.olderMa, taxon.youngerMa)}</span>
      <span className={styles.cardAction}>Explore <span aria-hidden="true">↗</span></span>
    </button>
  );
}

function WorldMap({ fossils }: { fossils: Fossil[] }) {
  return (
    <div className={styles.mapWrap}>
      <div
        className={styles.mapCanvas}
        role="img"
        aria-label={`Map showing ${fossils.length} representative fossil ${fossils.length === 1 ? "site" : "sites"}`}
      >
        <Image src="/images/world-map.png" alt="Political world basemap" fill sizes="850px" className={styles.mapImage} />
        {fossils.map((fossil, index) => (
          <span
            key={fossil.id}
            className={styles.mapMarker}
            style={{
              left: `${((fossil.lon + 180) / 360) * 100}%`,
              top: `${((90 - fossil.lat) / 180) * 100}%`,
            }}
            title={`${fossil.site}, ${fossil.country}`}
          >
            {index + 1}
          </span>
        ))}
      </div>
      <p className={styles.mapNote}>Modern coordinates · public-domain Natural Earth basemap · locations are rounded</p>
      <ol className={styles.siteList}>
        {fossils.map((fossil) => (
          <li key={fossil.id}>
            <span className={styles.siteDot} aria-hidden="true" />
            <span>
              <strong>{fossil.site}</strong>
              <small>{fossil.country} · ±{fossil.coordinatePrecisionKm} km</small>
            </span>
            <span>{formatRange(fossil.olderMa, fossil.youngerMa)}</span>
          </li>
        ))}
      </ol>
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

function LineageNavigation({
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
  if (!taxa.length) return <div className={styles.navEmpty} />;

  return (
    <nav className={`${styles.lineageNav} ${direction === "left" ? styles.navLeft : styles.navRight}`} aria-label={label}>
      <span className={styles.navLabel}>{label}</span>
      {taxa.map((taxon) => (
        <button type="button" key={taxon.id} onClick={() => onNavigate(taxon.id)}>
          {direction === "left" && <ArrowIcon direction="left" />}
          <span>{shortenName(taxon.scientificName)}</span>
          {direction === "right" && <ArrowIcon direction="right" />}
        </button>
      ))}
    </nav>
  );
}

function DetailModal({
  taxon,
  fossils,
  assets,
  references,
  ancestors,
  descendants,
  activeTab,
  onTabChange,
  onClose,
  onNavigate,
}: {
  taxon: Taxon;
  fossils: Fossil[];
  assets: VisualAsset[];
  references: Source[];
  ancestors: Taxon[];
  descendants: Taxon[];
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onClose: () => void;
  onNavigate: (id: string) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const fossilAsset = pickFossilAsset(assets);
  const overviewAsset = pickOverviewAsset(assets);

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

        <LineageNavigation label="Earlier" taxa={ancestors} direction="left" onNavigate={onNavigate} />
        <LineageNavigation label="Later branches" taxa={descendants} direction="right" onNavigate={onNavigate} />

        <div className={styles.modalInner}>
          <header className={styles.modalHeader}>
            <span className={styles.modalEyebrow}>{humanize(taxon.lineageRole)}</span>
            <h2 id="taxon-title">{taxon.scientificName}</h2>
            <p>{taxon.summary}</p>
          </header>

          <div className={styles.tabs} role="tablist" aria-label="Species detail views">
            {([
              ["overview", "Overview"],
              ["fossils", `Fossils ${fossils.length ? `(${fossils.length})` : ""}`],
              ["map", "Map"],
            ] as [Tab, string][]).map(([id, label]) => (
              <button
                type="button"
                role="tab"
                key={id}
                id={`tab-${id}`}
                aria-selected={activeTab === id}
                aria-controls={`panel-${id}`}
                className={activeTab === id ? styles.activeTab : undefined}
                onClick={() => onTabChange(id)}
              >
                {label}
              </button>
            ))}
          </div>

          {activeTab === "overview" && (
            <div className={styles.overviewLayout} role="tabpanel" id="panel-overview" aria-labelledby="tab-overview">
              <figure className={styles.overviewVisual}>
                <SpecimenImage key={`${taxon.id}-overview`} asset={overviewAsset} label={taxon.scientificName} />
                <figcaption>
                  <strong>{overviewAsset?.title ?? "No vetted image selected"}</strong>
                  <span>{overviewAsset?.scientificCaveat ?? "The fossil record does not support a confident life reconstruction."}</span>
                  {overviewAsset && <a href={overviewAsset.sourcePage} target="_blank" rel="noreferrer">Image source · {overviewAsset.license}</a>}
                </figcaption>
              </figure>

              <div className={styles.overviewFacts}>
                <article className={styles.keyFact}>
                  <span>Time range</span>
                  <strong>{formatRange(taxon.olderMa, taxon.youngerMa)}</strong>
                  <small>{taxon.regions.join(" · ")}</small>
                </article>
                <article>
                  <span>Observed change</span>
                  <h3>What changed</h3>
                  <p>{taxon.changeSummary}</p>
                </article>
                <article>
                  <span>Evolutionary pressures</span>
                  <h3>Why it may have changed</h3>
                  <ul>{taxon.whyHypotheses.map((item) => <li key={item}>{item}</li>)}</ul>
                </article>
                <article>
                  <span>Evidence</span>
                  <h3>Observed traits</h3>
                  <ul>{taxon.observedTraits.map((item) => <li key={item}>{item}</li>)}</ul>
                </article>
                <article className={styles.confidenceCard}>
                  <span>Confidence</span>
                  <h3>{taxon.relationshipCertainty}</h3>
                </article>
              </div>
            </div>
          )}

          {activeTab === "fossils" && (
            <div className={styles.fossilLayout} role="tabpanel" id="panel-fossils" aria-labelledby="tab-fossils">
              <figure className={styles.fossilVisual}>
                <SpecimenImage key={`${taxon.id}-fossil`} asset={fossilAsset} label={`${taxon.scientificName} fossil`} />
                <figcaption>
                  <strong>{fossilAsset?.title ?? "No fossil image selected"}</strong>
                  <span>{fossilAsset?.scientificCaveat ?? "No sufficiently documented specimen image is available."}</span>
                  {fossilAsset && <a href={fossilAsset.sourcePage} target="_blank" rel="noreferrer">Image source · {fossilAsset.license}</a>}
                </figcaption>
              </figure>
              <div className={styles.fossilRecords}>
                {fossils.length ? fossils.map((fossil) => (
                  <article key={fossil.id}>
                    <div>
                      <span>{formatRange(fossil.olderMa, fossil.youngerMa)}</span>
                      <h3>{fossil.specimen}</h3>
                      <p>{fossil.material}</p>
                    </div>
                    <p>{fossil.importance}</p>
                    {fossil.mediaUrl && <a href={fossil.mediaUrl} target="_blank" rel="noreferrer">Museum record ↗</a>}
                  </article>
                )) : <div className={styles.emptyPanel}>No representative fossil record is included yet.</div>}
              </div>
            </div>
          )}

          {activeTab === "map" && (
            <div className={styles.tabPanel} role="tabpanel" id="panel-map" aria-labelledby="tab-map">
              {fossils.length ? <WorldMap fossils={fossils} /> : <div className={styles.emptyPanel}>No mapped representative fossil is included yet.</div>}
            </div>
          )}

          <footer className={styles.referenceStrip}>
            <span>Evidence trail</span>
            <div>
              {references.slice(0, 4).map((source) => (
                <a key={source.id} href={source.url} target="_blank" rel="noreferrer">
                  {source.organization ?? source.authors ?? "Research"}{source.year ? ` · ${source.year}` : ""}
                </a>
              ))}
              {references.length > 4 && <span>+{references.length - 4} more</span>}
            </div>
          </footer>
        </div>
      </section>
    </div>
  );
}

export default function EvolutionExplorer({ data, sources }: ExplorerProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const treeViewportRef = useRef<HTMLDivElement>(null);

  const taxaById = useMemo(() => new Map(data.taxa.map((taxon) => [taxon.id, taxon])), [data.taxa]);
  const assetsById = useMemo(() => new Map(data.visualAssets.map((asset) => [asset.id, asset])), [data.visualAssets]);
  const fossilsById = useMemo(() => new Map(data.fossils.map((fossil) => [fossil.id, fossil])), [data.fossils]);
  const sourcesById = useMemo(() => new Map(sources.map((source) => [source.id, source])), [sources]);
  const positionsById = useMemo(() => new Map(treePositions.map((position) => [position.id, position])), []);

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

  const openTaxon = (id: string) => {
    setSelectedId(id);
    setActiveTab("overview");
  };

  const scrollTree = (direction: -1 | 1) => {
    treeViewportRef.current?.scrollBy({ left: direction * 560, behavior: "smooth" });
  };

  return (
    <main className={styles.pageShell}>
      <header className={styles.siteHeader}>
        <a className={styles.brand} href="#top" aria-label="Fossil Lineages home">
          <span className={styles.brandMark} aria-hidden="true">FL</span>
          <span><strong>Fossil Lineages</strong><small>Human origins atlas</small></span>
        </a>
        <div className={styles.headerMeta}>
          <span><i className={styles.legendSolid} /> Supported / broad relation</span>
          <span><i className={styles.legendDotted} /> Candidate / context</span>
          <span><i className={styles.legendTeal} /> Gene flow</span>
        </div>
      </header>

      <section className={styles.explorerSection} id="top" aria-labelledby="tree-heading">
        <div className={styles.explorerHeader}>
          <div>
            <p className={styles.sectionNumber}>01 / EXPLORE THE LINEAGE</p>
            <h2 id="tree-heading">Deep past <span>→</span> present</h2>
          </div>
          <div className={styles.scrollControls}>
            <span>Scroll through time</span>
            <button type="button" onClick={() => scrollTree(-1)} aria-label="Scroll tree left"><ArrowIcon direction="left" /></button>
            <button type="button" onClick={() => scrollTree(1)} aria-label="Scroll tree right"><ArrowIcon direction="right" /></button>
          </div>
        </div>

        <div className={styles.treeViewport} ref={treeViewportRef} tabIndex={0} aria-label="Horizontally scrollable evolutionary tree">
          <div className={styles.treeCanvas} style={{ width: TREE_WIDTH, height: TREE_HEIGHT }}>
            <div className={styles.timelineLine} aria-hidden="true">
              {[25, 20, 15, 10, 5, 0].map((age, index) => (
                <span key={age} style={{ left: `${index * 20}%` }}><i />{age === 0 ? "Present" : `${age} Ma`}</span>
              ))}
            </div>

            {branchLabels.map((item) => (
              <div className={styles.branchLabel} key={item.label} style={{ left: item.x }}>
                <span>{item.date}</span>{item.label}
              </div>
            ))}

            <svg className={styles.connectorLayer} width={TREE_WIDTH} height={TREE_HEIGHT} aria-hidden="true">
              <defs>
                <marker id="arrow-supported" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 8 4 0 8Z" /></marker>
                <marker id="arrow-candidate" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 8 4 0 8Z" /></marker>
              </defs>
              {treeEdges.map((edge) => {
                const from = positionsById.get(edge.fromId);
                const to = positionsById.get(edge.toId);
                if (!from || !to) return null;
                return (
                  <path
                    key={`${edge.fromId}-${edge.toId}-${edge.kind}`}
                    d={edgePath(from, to)}
                    className={styles[`edge_${edge.kind.replace("-", "_")}`]}
                    markerEnd={edge.kind === "gene-flow" ? undefined : `url(#arrow-${edge.kind === "supported" ? "supported" : "candidate"})`}
                  />
                );
              })}
            </svg>

            {treePositions.map((position) => {
              const taxon = taxaById.get(position.id);
              if (!taxon) return null;
              const localAssets = taxon.visualAssetIds.map((id) => assetsById.get(id)).filter((asset): asset is VisualAsset => Boolean(asset));
              const asset = pickOverviewAsset(localAssets);
              return <TaxonCard key={taxon.id} taxon={taxon} asset={asset} position={position} onOpen={openTaxon} />;
            })}
          </div>
        </div>

        <div className={styles.treeFootnote}>
          <strong>How to read this tree</strong>
          <p>Solid lines show supported broad relationships. Dotted lines are candidates or contextual fossils—not proven direct ancestors. Teal curves show later interbreeding.</p>
          <span>Click any specimen card to inspect the evidence.</span>
        </div>
      </section>

      {selected && (
        <DetailModal
          key={selected.id}
          taxon={selected}
          fossils={selected.representativeFossilIds.map((id) => fossilsById.get(id)).filter((fossil): fossil is Fossil => Boolean(fossil))}
          assets={selected.visualAssetIds.map((id) => assetsById.get(id)).filter((asset): asset is VisualAsset => Boolean(asset))}
          references={selected.sourceIds.map((id) => sourcesById.get(id)).filter((source): source is Source => Boolean(source))}
          ancestors={navigationEdges.filter((edge) => edge.toId === selected.id).map((edge) => taxaById.get(edge.fromId)).filter((taxon): taxon is Taxon => Boolean(taxon))}
          descendants={navigationEdges.filter((edge) => edge.fromId === selected.id).map((edge) => taxaById.get(edge.toId)).filter((taxon): taxon is Taxon => Boolean(taxon))}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onClose={() => setSelectedId(null)}
          onNavigate={openTaxon}
        />
      )}
    </main>
  );
}
