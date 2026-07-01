'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import styles from './geology-map.module.css'

export type Unit = {
  unit_id: number
  unit_name: string
  strat_name_long: string
  t_age: number
  b_age: number
  t_int_name: string
  b_int_name: string
  max_thick: number
  min_thick: number
  outcrop: string
  color: string
  lith: { name: string; type: string }[]
  environ: { name: string; class: string }[]
}

type Feature = {
  type: 'Feature'
  geometry: { type: 'Point'; coordinates: [number, number] }
  properties: {
    col_id: number
    name: string
    group: string
    project: string
    project_id: number
    source: string
  }
}

type ExpertEntry = {
  source: string
  citation: string
  url: string
  program: string
  leg: number
  site: number
  location: { lat: number; lng: number }
  ocean: string
  water_depth_m: number
  expert_text: string
  note: string
}

type CommonsImage = {
  url: string
  thumbUrl: string
  title: string
  description?: string
  commonsUrl: string
}

type CopyState = 'idle' | 'copied-img' | 'copied-prompt' | 'error'

type WikiPage = {
  title: string
  imageinfo?: Array<{ url: string; thumburl: string; extmetadata?: Record<string, { value: string }> }>
}

const OCEAN_PROJECTS = new Set(['eODP (ocean drill sites)', 'Deep Sea/DSDP'])

// Titles that are satellite/ISS shots, NAIP aerial tiles, or non-photo rasters
const SKIP_PATTERNS = /\bISS\d|STS\d|View of Earth|View of New|aerial|\.tif|NAIP|\bM_\d{7}\b/i

async function fetchCommonsImages(lat: number, lng: number): Promise<CommonsImage[]> {
  // Step 1: geosearch near the site
  const geoUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=geosearch&gsnamespace=6&gslimit=15&gscoord=${lat}|${lng}&gsradius=10000&format=json&origin=*`
  const geoRes = await fetch(geoUrl)
  const geoData = await geoRes.json()
  const hits: { title: string }[] = geoData?.query?.geosearch ?? []
  const filtered = hits.filter(h => !SKIP_PATTERNS.test(h.title)).slice(0, 6)
  if (filtered.length === 0) return []

  // Step 2: get thumbnail URLs + descriptions
  const titles = filtered.map(h => h.title).join('|')
  const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(titles)}&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=800&format=json&origin=*`
  const infoRes = await fetch(infoUrl)
  const infoData = await infoRes.json()
  const pages = Object.values(infoData?.query?.pages ?? {}) as WikiPage[]

  return pages
    .filter((p: WikiPage) => p.imageinfo?.[0]?.thumburl)
    .map((p: WikiPage) => {
      const info = p.imageinfo[0]
      const meta = info.extmetadata ?? {}
      const rawDesc = meta.ImageDescription?.value ?? meta.ObjectName?.value ?? ''
      const desc = rawDesc.replace(/<[^>]+>/g, '').substring(0, 200).trim()
      const name = (p.title as string).replace(/^File:/, '').replace(/\.[^.]+$/, '')
      return {
        url: info.url,
        thumbUrl: info.thumburl,
        title: name,
        description: desc || name,
        commonsUrl: `https://commons.wikimedia.org/wiki/${encodeURIComponent(p.title)}`,
      }
    })
}

const PROJECT_COLORS: Record<string, string> = {
  'North America': '#e8a030',
  'eODP (ocean drill sites)': '#4a90d9',
  'Deep Sea/DSDP': '#3a7bbd',
  'New Zealand': '#2ea043',
  'Caribbean': '#9b59b6',
  'South America': '#e74c3c',
  'Africa': '#f39c12',
}

function formatAge(ma: number): string {
  if (ma < 0.001) return '<1 ka'
  if (ma < 1) return `${Math.round(ma * 1000)} ka`
  return `${ma.toFixed(1)} Ma`
}

function buildPrompt(site: Feature, units: Unit[] | null): string {
  const [lng, lat] = site.geometry.coordinates
  const lines: string[] = [
    `Please analyze this geological image from the following site:`,
    ``,
    `Site: ${site.properties.name}`,
    `Location: ${lat.toFixed(3)}°${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lng).toFixed(3)}°${lng >= 0 ? 'E' : 'W'}`,
    `Project: ${site.properties.project}`,
  ]
  if (units && units.length > 0) {
    const oldest = Math.max(...units.map(u => u.b_age))
    const youngest = Math.min(...units.map(u => u.t_age))
    lines.push(`Age range: ${formatAge(youngest)} – ${formatAge(oldest)}`)
    lines.push(``)
    lines.push(`Stratigraphic units (youngest to oldest):`)
    units.slice(0, 8).forEach(u => {
      const lithNames = u.lith?.map(l => l.name).join(', ') ?? 'unknown'
      lines.push(`  • ${u.strat_name_long || u.unit_name} (${formatAge(u.t_age)}–${formatAge(u.b_age)}) — ${lithNames}`)
    })
  }
  lines.push(``)
  lines.push(`Please describe:`)
  lines.push(`1. What each visible layer in this image represents (rock type, color, texture)`)
  lines.push(`2. What geological processes or conditions created each layer`)
  lines.push(`3. What was happening on Earth when the deepest visible layer formed`)
  lines.push(`4. Any major geological events or transitions visible here`)
  return lines.join('\n')
}

function CommonsGeoSection({ lat, lng, project }: { lat: number; lng: number; project: string }) {
  const [images, setImages] = useState<CommonsImage[]>([])
  const [idx, setIdx] = useState(0)
  const [loading, setLoading] = useState(false)
  const [copyState, setCopyState] = useState<CopyState>('idle')
  const abortRef = useRef<AbortController | null>(null)
  const isOcean = OCEAN_PROJECTS.has(project)

  useEffect(() => {
    abortRef.current?.abort()
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setImages([])
    setIdx(0)
    setCopyState('idle')
    if (isOcean) return

    const ac = new AbortController()
    abortRef.current = ac
    setLoading(true)
    fetchCommonsImages(lat, lng)
      .then(imgs => { if (!ac.signal.aborted) { setImages(imgs); setLoading(false) } })
      .catch(() => { if (!ac.signal.aborted) setLoading(false) })
    return () => ac.abort()
  }, [lat, lng, isOcean])

  const image = images[idx] ?? null

  const copyImage = useCallback(async () => {
    if (!image) return
    try {
      const resp = await fetch(image.url)
      const blob = await resp.blob()
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })])
      setCopyState('copied-img')
    } catch {
      try {
        await navigator.clipboard.writeText(image.url)
        setCopyState('copied-img')
      } catch {
        setCopyState('error')
      }
    }
    setTimeout(() => setCopyState('idle'), 2000)
  }, [image])

  if (isOcean) return null

  return (
    <>
      {loading && <div className={styles.imageLoading}>Searching nearby photos…</div>}
      {image && (
        <>
          <div className={styles.imageWrap}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.thumbUrl} alt={image.title} loading="lazy" />
          </div>
          <div className={styles.imageFooter}>
            <p className={styles.imageCaption}>
              <a href={image.commonsUrl} target="_blank" rel="noreferrer" className={styles.expertLink}>
                Wikimedia Commons
              </a>
              {image.description ? ` — ${image.description}` : ''}
            </p>
            {images.length > 1 && (
              <div className={styles.imageNav}>
                <button className={styles.imageNavBtn} onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0}>‹</button>
                <span className={styles.imageNavCount}>{idx + 1} / {images.length}</span>
                <button className={styles.imageNavBtn} onClick={() => setIdx(i => Math.min(images.length - 1, i + 1))} disabled={idx === images.length - 1}>›</button>
              </div>
            )}
          </div>
          <div className={styles.copyRow}>
            <button
              className={`${styles.copyBtn} ${copyState === 'copied-img' ? styles.copyBtnDone : ''}`}
              onClick={copyImage}
            >
              {copyState === 'copied-img' ? '✓ Copied' : 'Copy image'}
            </button>
          </div>
        </>
      )}
      {!loading && images.length === 0 && (
        <p className={styles.imageNone}>No geotagged photos within 10 km on Wikimedia Commons.</p>
      )}
    </>
  )
}

function StratColumn({ units }: { units: Unit[] }) {
  return (
    <div className={styles.stratigraphyCol}>
      {units.map((u, i) => {
        const lithNames = u.lith?.slice(0, 2).map(l => l.name).join(', ') ?? ''
        const env = u.environ?.[0]?.name ?? ''
        return (
          <div
            key={u.unit_id ?? i}
            className={styles.stratUnit}
            style={{ background: `${u.color}18` }}
            title={`${u.strat_name_long || u.unit_name}\n${formatAge(u.t_age)} – ${formatAge(u.b_age)}\n${lithNames}${env ? `\n${env}` : ''}`}
          >
            <div className={styles.stratSwatch} style={{ background: u.color || '#888' }} />
            <div className={styles.stratInfo}>
              <div className={styles.stratName}>{u.strat_name_long || u.unit_name}</div>
              <div className={styles.stratAge}>{formatAge(u.t_age)} – {formatAge(u.b_age)}</div>
            </div>
            {lithNames && <div className={styles.stratLith}>{lithNames}</div>}
          </div>
        )
      })}
    </div>
  )
}

type SitePanelProps = {
  site: Feature | null
  unitsData: Record<string, { col_id: number; units: Unit[] }>
  expertText: Record<string, ExpertEntry>
  onClose: () => void
}

export default function SitePanel({ site, unitsData, expertText, onClose }: SitePanelProps) {
  const [units, setUnits] = useState<Unit[] | null>(null)
  const [unitsFetching, setUnitsFetching] = useState(false)
  const [expert, setExpert] = useState<ExpertEntry | null>(null)
  const [promptCopied, setPromptCopied] = useState(false)

  useEffect(() => {
    if (!site) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUnits(null)
      setExpert(null)
      return
    }

    const colId = site.properties.col_id.toString()

    // Check preloaded sample
    if (unitsData[colId]) {
      setUnits(unitsData[colId].units)
      setUnitsFetching(false)
    } else {
      setUnits(null)
      setUnitsFetching(true)
      fetch(
        `https://macrostrat.org/api/units?col_id=${colId}&format=json&response=long`
      )
        .then(r => r.json())
        .then(data => {
          const raw = data?.success?.data ?? data?.data ?? data
          if (Array.isArray(raw) && raw.length > 0) {
            setUnits(raw)
          } else {
            setUnits([])
          }
        })
        .catch(() => setUnits([]))
        .finally(() => setUnitsFetching(false))
    }

    // Match expert text by ODP site number from col_name
    const siteMatch = site.properties.name.match(/Site\s+(\d+)/i)
    if (siteMatch) {
      const siteNum = parseInt(siteMatch[1], 10)
      const key = Object.keys(expertText).find(k => expertText[k].site === siteNum)
      setExpert(key ? expertText[key] : null)
    } else {
      setExpert(null)
    }

    setPromptCopied(false)
  }, [site, unitsData, expertText])

  const copyPrompt = useCallback(async () => {
    if (!site) return
    const text = buildPrompt(site, units)
    try {
      await navigator.clipboard.writeText(text)
      setPromptCopied(true)
      setTimeout(() => setPromptCopied(false), 2000)
    } catch { /* ignore */ }
  }, [site, units])

  if (!site) {
    return (
      <aside className={styles.sidebar}>
        <div className={styles.sidebarScroll}>
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>Geology Map</p>
            <p className={styles.emptyBody}>
              3,244 geological sites — ocean drill cores, rock columns, and outcrops from seven global programs.
              Click any pin to explore.
            </p>
            <div className={styles.legend}>
              {Object.entries(PROJECT_COLORS).map(([name, color]) => (
                <div key={name} className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ background: color }} />
                  <span>{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    )
  }

  const [lng, lat] = site.geometry.coordinates
  const projectColor = PROJECT_COLORS[site.properties.project] ?? '#888'

  return (
    <aside className={styles.sidebar}>
      <div className={styles.panelHeader}>
        <div className={styles.panelHeaderText}>
          <p className={styles.panelKicker} style={{ color: projectColor }}>
            {site.properties.project}
          </p>
          <h2 className={styles.panelTitle}>{site.properties.name}</h2>
        </div>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">×</button>
      </div>

      <div className={styles.sidebarScroll}>
        {/* Coordinates & metadata */}
        <div className={styles.section}>
          <p className={styles.sectionLabel}>Location</p>
          <div className={styles.metaGrid}>
            <div className={styles.metaPill}>
              <p className={styles.metaPillLabel}>Latitude</p>
              <p className={styles.metaPillValue}>{lat.toFixed(4)}°</p>
            </div>
            <div className={styles.metaPill}>
              <p className={styles.metaPillLabel}>Longitude</p>
              <p className={styles.metaPillValue}>{lng.toFixed(4)}°</p>
            </div>
            <div className={styles.metaPill}>
              <p className={styles.metaPillLabel}>Column ID</p>
              <p className={styles.metaPillValue}>{site.properties.col_id}</p>
            </div>
            <div className={styles.metaPill}>
              <p className={styles.metaPillLabel}>Source</p>
              <p className={styles.metaPillValue} style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {site.properties.source}
              </p>
            </div>
          </div>
        </div>

        {/* Image section */}
        <div className={styles.section}>
          <p className={styles.sectionLabel}>Nearby Photos</p>
          <CommonsGeoSection lat={lat} lng={lng} project={site.properties.project} />
          <div className={styles.copyRow} style={{ marginTop: 10 }}>
            <button
              className={`${styles.copyBtn} ${promptCopied ? styles.copyBtnDone : ''}`}
              onClick={copyPrompt}
            >
              {promptCopied ? '✓ Prompt copied' : 'Copy LLM prompt'}
            </button>
          </div>
        </div>

        {/* Stratigraphic column */}
        <div className={styles.section}>
          <p className={styles.sectionLabel}>Stratigraphic Units</p>
          {unitsFetching && <p className={styles.fetchingUnits}>Fetching from Macrostrat…</p>}
          {!unitsFetching && units && units.length > 0 && <StratColumn units={units} />}
          {!unitsFetching && units && units.length === 0 && (
            <p className={styles.noUnits}>No unit data found for this column.</p>
          )}
          {!unitsFetching && units === null && !unitsData[site.properties.col_id.toString()] && (
            <p className={styles.noUnits}>Unit data not available.</p>
          )}
        </div>

        {/* Expert text */}
        {expert && (
          <div className={styles.section}>
            <p className={styles.sectionLabel}>ODP Scientific Description</p>
            <pre className={styles.expertText}>{expert.expert_text}</pre>
            <p className={styles.expertMeta}>
              {expert.citation}
              {expert.url && (
                <> · <a href={expert.url} target="_blank" rel="noreferrer" className={styles.expertLink}>PDF ↗</a></>
              )}
              {expert.water_depth_m && (
                <> · {expert.water_depth_m.toLocaleString()} m water depth</>
              )}
            </p>
          </div>
        )}

        {/* Ocean drill link */}
        {!expert && site.properties.source === 'eODP' && (
          <div className={styles.section}>
            <p className={styles.sectionLabel}>Ocean Drill Core</p>
            <p className={styles.imageNone}>
              Photos and detailed logs for ocean drill sites are available via the{' '}
              <a
                href="https://www.iodp.tamu.edu/labs/description/vcd.html"
                target="_blank"
                rel="noreferrer"
                className={styles.expertLink}
              >
                IODP LIMS report system ↗
              </a>
              .
            </p>
          </div>
        )}
      </div>
    </aside>
  )
}
