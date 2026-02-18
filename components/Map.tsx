'use client'

import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { spots } from '@/lib/spots'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

export interface MapHandle {
  openSpot: (id: number, lng: number, lat: number) => void
}

const Map = forwardRef<MapHandle>((_, ref) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markers = useRef<{ [id: number]: mapboxgl.Marker }>({})

  useImperativeHandle(ref, () => ({
    openSpot: (id: number, lng: number, lat: number) => {
      // close all popups first
      Object.values(markers.current).forEach(m => m.getPopup()?.remove())
      // fly then open
      map.current?.flyTo({ center: [lng, lat], zoom: 15 })
      map.current?.once('moveend', () => {
        markers.current[id]?.togglePopup()
      })
    }
  }))

  useEffect(() => {
    if (map.current) return
    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [13.405, 52.52],
      zoom: 12
    })

    map.current.on('load', () => {
      spots.forEach(spot => {
        const popup = new mapboxgl.Popup({
          closeButton: true,
          className: 'beer-popup',
          offset: 25
        }).setHTML(`
          <div style="font-family: inherit;">
            <div style="font-weight: 700; font-size: 15px; margin-bottom: 4px; padding-right: 20px;">${spot.name}</div>
            <div style="color: #666; font-size: 12px;">${spot.address}</div>
          </div>
        `)

        const marker = new mapboxgl.Marker({ color: '#f59e0b' })
          .setLngLat([spot.lng, spot.lat])
          .setPopup(popup)
          .addTo(map.current!)

        markers.current[spot.id] = marker
      })
    })
  }, [])

  return <div ref={mapContainer} className="w-full h-[600px]" />
})

Map.displayName = 'Map'
export default Map