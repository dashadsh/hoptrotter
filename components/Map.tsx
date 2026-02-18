'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { spots } from '@/lib/spots'


mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

export default function Map() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    if (map.current) return
    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
    //   style: 'mapbox://styles/mapbox/streets-v12',
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

        new mapboxgl.Marker({ color: '#f59e0b' })
          .setLngLat([spot.lng, spot.lat])
          .setPopup(popup)
          .addTo(map.current!)
      })
    })
  }, [])

	return (
	<div ref={mapContainer} className="w-full h-[600px]" />
	)
}