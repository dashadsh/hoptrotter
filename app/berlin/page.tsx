'use client'

import { useRef } from 'react'
import Map, { MapHandle } from '@/components/Map'
import Header from '@/components/Header'
import SpotList from '@/components/SpotList'

export default function BerlinPage() {
  const mapRef = useRef<MapHandle>(null)

  return (
    <main>
      <Header />
      <div className="px-8 py-6">
        <h1 className="text-4xl font-bold">Berlin</h1>
        <p className="text-gray-500 mt-1">Your local beer guide · 3 spots</p>
      </div>
      <Map ref={mapRef} />
      <SpotList onSpotClick={(lng, lat) => mapRef.current?.flyTo(lng, lat)} />
    </main>
  )
}