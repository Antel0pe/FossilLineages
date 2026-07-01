'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import SitePanel, { type Unit } from './SitePanel'
import styles from './geology-map.module.css'

const PROJECT_COLORS: Record<string, string> = {
  'North America': '#e8a030',
  'eODP (ocean drill sites)': '#4a90d9',
  'Deep Sea/DSDP': '#3a7bbd',
  'New Zealand': '#2ea043',
  'Caribbean': '#9b59b6',
  'South America': '#e74c3c',
  'Africa': '#f39c12',
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

type UnitEntry = { col_id: number; units: Unit[] }
type ExpertEntry = {
  source: string; citation: string; url: string; program: string
  leg: number; site: number; location: { lat: number; lng: number }
  ocean: string; water_depth_m: number; expert_text: string; note: string
}

type MarkersProps = {
  features: Feature[]
  selectedId: number | null
  onSelect: (f: Feature) => void
}

function Markers({ features, selectedId, onSelect }: MarkersProps) {
  const map = useMap()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clusterRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<Map<number, any>>(new Map())

  useEffect(() => {
    if (features.length === 0 || !map) return

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

      features.forEach(f => {
        const [lng, lat] = f.geometry.coordinates
        const color = PROJECT_COLORS[f.properties.project] ?? '#888888'

        const marker = L.circleMarker([lat, lng], {
          radius: 4,
          color,
          fillColor: color,
          fillOpacity: 0.85,
          weight: 0.5,
        })

        marker.bindTooltip(f.properties.name, { direction: 'top', offset: [0, -4] })
        marker.on('click', () => onSelect(f))
        markersRef.current.set(f.properties.col_id, marker)
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
  }, [map, features, onSelect])

  // Highlight selected marker
  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      const f = features.find(f => f.properties.col_id === id)
      if (!f) return
      const color = PROJECT_COLORS[f.properties.project] ?? '#888888'
      if (id === selectedId) {
        marker.setStyle({ radius: 7, color: '#ffffff', fillColor: color, fillOpacity: 1, weight: 2 })
      } else {
        marker.setStyle({ radius: 4, color, fillColor: color, fillOpacity: 0.85, weight: 0.5 })
      }
    })
  }, [selectedId, features])

  return null
}

export default function GeologyMap() {
  const [features, setFeatures] = useState<Feature[]>([])
  const [unitsData, setUnitsData] = useState<Record<string, UnitEntry>>({})
  const [expertText, setExpertText] = useState<Record<string, ExpertEntry>>({})
  const [selected, setSelected] = useState<Feature | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/geology-data/sites.geojson').then(r => r.json()),
      fetch('/geology-data/units-sample.json').then(r => r.json()),
      fetch('/geology-data/expert-text-samples.json').then(r => r.json()),
    ]).then(([geojson, units, expert]) => {
      setFeatures(geojson.features)
      setUnitsData(units)
      setExpertText(expert)
      setLoading(false)
    }).catch(err => {
      console.error('Failed to load geology data', err)
      setLoading(false)
    })
  }, [])

  const handleSelect = useCallback((f: Feature) => setSelected(f), [])
  const handleClose = useCallback(() => setSelected(null), [])

  return (
    <div className={styles.container}>
      {loading && (
        <div className={styles.loading}>
          <div className={styles.loadingInner}>Loading 3,244 geological sites…</div>
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
          {features.length > 0 && (
            <Markers
              features={features}
              selectedId={selected?.properties.col_id ?? null}
              onSelect={handleSelect}
            />
          )}
        </MapContainer>
      </div>

      <SitePanel
        site={selected}
        unitsData={unitsData}
        expertText={expertText}
        onClose={handleClose}
      />
    </div>
  )
}
