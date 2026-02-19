'use client'

import { useRef, useEffect, useState } from 'react'
import Map, { MapHandle } from '@/components/Map'
import Header from '@/components/Header'
import SpotList from '@/components/SpotList'
import { supabase } from '@/lib/supabase'
import { Spot } from '@/lib/spots'

export default function BerlinPage() {
  const mapRef = useRef<MapHandle>(null)
  const [spots, setSpots] = useState<Spot[]>([])

  useEffect(() => {
    supabase.from('spots').select('*').then(({ data }) => {
      if (data) setSpots(data as Spot[])
    })
  }, [])

  return (
    <main>
      <Header />
      <div className="px-8 py-6">
        <h1 className="text-4xl font-bold">Berlin</h1>
        <p className="text-gray-500 mt-1">Your local guide · {spots.length} spots</p>
      </div>
      <Map ref={mapRef} spots={spots} />
      <SpotList spots={spots} onSpotClick={(id, lng, lat) => mapRef.current?.openSpot(id, lng, lat)} />
    </main>
  )
}