'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import SitePanel, { type OutcropLocation } from './SitePanel'
import styles from './geology-map.module.css'

const EXACT_COLOR = '#4ad982'
const APPROX_COLOR = '#e8a030'

type MarkersProps = {
  locations: OutcropLocation[]
  selectedId: number | null
  onSelect: (loc: OutcropLocation) => void
}

function Markers({ locations, selectedId, onSelect }: MarkersProps) {
  const map = useMap()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clusterRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<Map<number, any>>(new Map())

  useEffect(() => {
    if (locations.length === 0 || !map) return

    // Dynamically import to ensure we're in browser context
    import('leaflet.markercluster').then(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const L = (window as any).L

      const cluster = L.markerClusterGroup({
        chunkedLoading: true,
        maxClusterRadius: 40,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        spiderfyOnMaxZoom: true,
      })

      locations.forEach(loc => {
        const color = loc.hasExactCoords ? EXACT_COLOR : APPROX_COLOR

        const marker = L.circleMarker([loc.lat, loc.lng], {
          radius: 4,
          color,
          fillColor: color,
          fillOpacity: 0.85,
          weight: 0.5,
        })

        const label = `${loc.country} — ${loc.images.length} photo${loc.images.length !== 1 ? 's' : ''}`
        marker.bindTooltip(label, { direction: 'top', offset: [0, -4] })
        marker.on('click', () => onSelect(loc))
        markersRef.current.set(loc.id, marker)
        cluster.addLayer(marker)
      })

      map.addLayer(cluster)
      clusterRef.current = cluster
    })

    return () => {
      if (clusterRef.current && map) {
        map.removeLayer(clusterRef.current)
        clusterRef.current = null
        markersRef.current.clear()
      }
    }
  }, [map, locations, onSelect])

  // Highlight selected marker
  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      const loc = locations.find(l => l.id === id)
      if (!loc) return
      const color = loc.hasExactCoords ? EXACT_COLOR : APPROX_COLOR
      if (id === selectedId) {
        marker.setStyle({ radius: 7, color: '#ffffff', fillColor: color, fillOpacity: 1, weight: 2 })
      } else {
        marker.setStyle({ radius: 4, color, fillColor: color, fillOpacity: 0.85, weight: 0.5 })
      }
    })
  }, [selectedId, locations])

  return null
}

export default function GeologyMap() {
  const [locations, setLocations] = useState<OutcropLocation[]>([])
  const [photoCount, setPhotoCount] = useState(0)
  const [selected, setSelected] = useState<OutcropLocation | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/geology-data/wikimedia-outcrops.json')
      .then(r => r.json())
      .then(data => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const locs: OutcropLocation[] = data.locations.map((l: any, i: number) => ({ ...l, id: i }))
        setLocations(locs)
        setPhotoCount(data.totalFiles ?? locs.reduce((a, l) => a + l.images.length, 0))
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load outcrop data', err)
        setLoading(false)
      })
  }, [])

  const handleSelect = useCallback((loc: OutcropLocation) => setSelected(loc), [])
  const handleClose = useCallback(() => setSelected(null), [])

  return (
    <div className={styles.container}>
      {loading && (
        <div className={styles.loading}>
          <div className={styles.loadingInner}>Loading outcrop photos…</div>
        </div>
      )}

      <div className={styles.mapWrapper}>
        <MapContainer
          center={[20, 0]}
          zoom={2}
          minZoom={2}
          maxBounds={[[-90, -180], [90, 180]] as [[number, number], [number, number]]}
          maxBoundsViscosity={0.8}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            subdomains="abcd"
            maxZoom={19}
          />
          {locations.length > 0 && (
            <Markers
              locations={locations}
              selectedId={selected?.id ?? null}
              onSelect={handleSelect}
            />
          )}
        </MapContainer>
      </div>

      <SitePanel
        location={selected}
        locationCount={locations.length}
        photoCount={photoCount}
        onClose={handleClose}
      />
    </div>
  )
}
