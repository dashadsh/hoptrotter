'use client'

import { useRef, useEffect, useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { MapHandle } from '@/components/Map'
import Header from '@/components/Header'
import SpotList from '@/components/SpotList'
import { supabase } from '@/lib/supabase'
import { Spot } from '@/lib/spots'

const Map = dynamic(() => import('@/components/Map'), { ssr: false })

type DrinkFilter = 'all' | 'craft_beer' | 'natural_wine'
type TypeFilter = 'all' | 'bar' | 'shop'

export default function BerlinPage() {
  const mapRef = useRef<MapHandle>(null)
  const [spots, setSpots] = useState<Spot[]>([])
  const [drinkFilter, setDrinkFilter] = useState<DrinkFilter>('all')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [districtFilter, setDistrictFilter] = useState<string>('all')

  useEffect(() => {
    supabase.from('spots').select('*').then(({ data }) => {
      if (data) setSpots(data as Spot[])
    })
  }, [])

  const filteredSpots = useMemo(() => {
    let result = [...spots]
    if (drinkFilter !== 'all') result = result.filter(s => s.drink_type === drinkFilter)
    if (typeFilter !== 'all') result = result.filter(s => s.types?.includes(typeFilter))
    if (districtFilter !== 'all') result = result.filter(s => s.neighborhood === districtFilter)
    return result
  }, [spots, drinkFilter, typeFilter, districtFilter])

  return (
    <main>
      <Header />
      <div className="px-8 py-6">
        <h1 className="text-4xl font-bold">Berlin</h1>
        <p className="text-gray-500 mt-1">Your local guide · {filteredSpots.length} spots</p>
      </div>
      <Map ref={mapRef} spots={filteredSpots} />
      <SpotList
        spots={filteredSpots}
        allSpots={spots}
        drinkFilter={drinkFilter}
        typeFilter={typeFilter}
        districtFilter={districtFilter}
        onDrinkFilterChange={setDrinkFilter}
        onTypeFilterChange={setTypeFilter}
        onDistrictFilterChange={setDistrictFilter}
        onSpotClick={(id, lng, lat) => mapRef.current?.openSpot(id, lng, lat)}
      />
    </main>
  )
}