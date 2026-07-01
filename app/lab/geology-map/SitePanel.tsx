'use client'

import { useState, useCallback, useEffect } from 'react'
import styles from './geology-map.module.css'

export type OutcropImage = {
  title: string
  imageUrl: string
  pageUrl: string
}

export type OutcropLocation = {
  id: number
  lat: number
  lng: number
  hasExactCoords: boolean
  country: string
  images: OutcropImage[]
}

type CopyState = 'idle' | 'copied-img' | 'error'

const EXACT_COLOR = '#4ad982'
const APPROX_COLOR = '#e8a030'

type SitePanelProps = {
  location: OutcropLocation | null
  locationCount: number
  photoCount: number
  onClose: () => void
}

export default function SitePanel({ location, locationCount, photoCount, onClose }: SitePanelProps) {
  const [idx, setIdx] = useState(0)
  const [copyState, setCopyState] = useState<CopyState>('idle')

  useEffect(() => {
    setIdx(0)
    setCopyState('idle')
  }, [location])

  const image = location?.images[idx] ?? null

  const copyImage = useCallback(async () => {
    if (!image) return
    try {
      const resp = await fetch(image.imageUrl)
      const blob = await resp.blob()
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })])
      setCopyState('copied-img')
    } catch {
      try {
        await navigator.clipboard.writeText(image.imageUrl)
        setCopyState('copied-img')
      } catch {
        setCopyState('error')
      }
    }
    setTimeout(() => setCopyState('idle'), 2000)
  }, [image])

  if (!location) {
    return (
      <aside className={styles.sidebar}>
        <div className={styles.sidebarScroll}>
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>Outcrop Photos</p>
            <p className={styles.emptyBody}>
              {locationCount.toLocaleString()} locations — {photoCount.toLocaleString()} geological outcrop
              photographs from Wikimedia Commons, worldwide. Click any pin to explore.
            </p>
            <div className={styles.legend}>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: EXACT_COLOR }} />
                <span>Exact GPS from photo</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: APPROX_COLOR }} />
                <span>Estimated (country centroid)</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    )
  }

  const pinColor = location.hasExactCoords ? EXACT_COLOR : APPROX_COLOR

  return (
    <aside className={styles.sidebar}>
      <div className={styles.panelHeader}>
        <div className={styles.panelHeaderText}>
          <p className={styles.panelKicker} style={{ color: pinColor }}>
            {location.hasExactCoords ? 'Exact location' : 'Estimated · country centroid'}
          </p>
          <h2 className={styles.panelTitle}>{location.country}</h2>
        </div>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">×</button>
      </div>

      <div className={styles.sidebarScroll}>
        <div className={styles.section}>
          <p className={styles.sectionLabel}>Location</p>
          <div className={styles.metaGrid}>
            <div className={styles.metaPill}>
              <p className={styles.metaPillLabel}>Latitude</p>
              <p className={styles.metaPillValue}>{location.lat.toFixed(4)}°</p>
            </div>
            <div className={styles.metaPill}>
              <p className={styles.metaPillLabel}>Longitude</p>
              <p className={styles.metaPillValue}>{location.lng.toFixed(4)}°</p>
            </div>
            <div className={styles.metaPill}>
              <p className={styles.metaPillLabel}>Country</p>
              <p className={styles.metaPillValue}>{location.country}</p>
            </div>
            <div className={styles.metaPill}>
              <p className={styles.metaPillLabel}>Photos here</p>
              <p className={styles.metaPillValue}>{location.images.length}</p>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <p className={styles.sectionLabel}>Outcrop Photo</p>
          {image && (
            <>
              <div className={styles.imageWrap}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.imageUrl} alt={image.title} loading="lazy" />
              </div>
              <div className={styles.imageFooter}>
                <p className={styles.imageCaption}>
                  <a href={image.pageUrl} target="_blank" rel="noreferrer" className={styles.expertLink}>
                    Wikimedia Commons
                  </a>
                  {' — '}{image.title}
                </p>
                {location.images.length > 1 && (
                  <div className={styles.imageNav}>
                    <button
                      className={styles.imageNavBtn}
                      onClick={() => setIdx(i => Math.max(0, i - 1))}
                      disabled={idx === 0}
                    >
                      ‹
                    </button>
                    <span className={styles.imageNavCount}>{idx + 1} / {location.images.length}</span>
                    <button
                      className={styles.imageNavBtn}
                      onClick={() => setIdx(i => Math.min(location.images.length - 1, i + 1))}
                      disabled={idx === location.images.length - 1}
                    >
                      ›
                    </button>
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
                <a
                  className={styles.copyBtn}
                  style={{ textDecoration: 'none', textAlign: 'center' }}
                  href={image.pageUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View on Commons ↗
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  )
}
