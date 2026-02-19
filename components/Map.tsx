'use client'

import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { Spot } from '@/lib/spots'

export interface MapHandle {
  openSpot: (id: string, lng: number, lat: number) => void
}

interface MapProps {
  spots: Spot[]
}

const Map = forwardRef<MapHandle, MapProps>(({ spots }, ref) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const markers = useRef<{ [id: string]: maplibregl.Marker }>({})

  useImperativeHandle(ref, () => ({
    openSpot: (id: string, lng: number, lat: number) => {
      Object.values(markers.current).forEach(m => m.getPopup()?.remove())
      map.current?.flyTo({ center: [lng, lat], zoom: 15 })
      map.current?.once('moveend', () => {
        markers.current[id]?.togglePopup()
      })
    }
  }))

  // Init map
  useEffect(() => {
    if (map.current) return
    map.current = new maplibregl.Map({
      container: mapContainer.current!,
      style: 'https://tiles.openfreemap.org/styles/positron',
      center: [13.405, 52.52],
      zoom: 12
    })
  }, [])

  // Sync markers with filtered spots
  useEffect(() => {
    if (!map.current) return

    const syncMarkers = () => {
      const currentIds = new Set(spots.map(s => String(s.id)))
      const existingIds = new Set(Object.keys(markers.current))

      // Remove markers not in filtered list
      existingIds.forEach(id => {
        if (!currentIds.has(id)) {
          markers.current[id]?.getPopup()?.remove()
          markers.current[id]?.remove()
          delete markers.current[id]
        }
      })

      // Add markers new to filtered list
      spots.forEach(spot => {
        const sid = String(spot.id)
        if (markers.current[sid]) return
        if (spot.lat == null || spot.lng == null) return

        const color = spot.drink_type === 'craft_beer' ? '#e07b39' : '#8b2246'

        const popup = new maplibregl.Popup({
          closeButton: true,
          className: 'beer-popup',
          offset: 25
        }).setHTML(`
          <div style="font-family: inherit;">
            <div style="font-weight: 700; font-size: 15px; margin-bottom: 4px; padding-right: 20px;">${spot.name}</div>
            <div style="color: #666; font-size: 12px;">${spot.address}</div>
          </div>
        `)

        const marker = new maplibregl.Marker({ color })
          .setLngLat([spot.lng, spot.lat])
          .setPopup(popup)
          .addTo(map.current!)

        markers.current[sid] = marker
      })
    }

    if (map.current.isStyleLoaded()) {
      syncMarkers()
    } else {
      map.current.on('load', syncMarkers)
    }
  }, [spots])

  return <div ref={mapContainer} className="w-full h-[600px]" />
})

Map.displayName = 'Map'
export default Map