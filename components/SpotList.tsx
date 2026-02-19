'use client'

import { useState, useMemo } from 'react'

interface Spot {
  id: number
  name: string
  address: string
  neighborhood: string
  lng: number
  lat: number
  types: string[]
}

interface Props {
  spots: Spot[]
  onSpotClick: (id: number, lng: number, lat: number) => void
}

type SortOrder = 'asc' | 'desc'
type TypeFilter = 'all' | 'bar' | 'shop'

export default function SpotList({ spots, onSpotClick }: Props) {
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [districtFilter, setDistrictFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')

  // Get unique districts from spots
  const districts = useMemo(() => {
    const unique = Array.from(new Set(spots.map(s => s.neighborhood).filter(Boolean)))
    return unique.sort()
  }, [spots])

  // Apply filters + sort
  const filtered = useMemo(() => {
    let result = [...spots]

    if (districtFilter !== 'all') {
      result = result.filter(s => s.neighborhood === districtFilter)
    }

    if (typeFilter !== 'all') {
      result = result.filter(s => s.types?.includes(typeFilter))
    }

    result.sort((a, b) =>
      sortOrder === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    )

    return result
  }, [spots, districtFilter, typeFilter, sortOrder])

  const btnBase = 'px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer'
  const btnActive = 'bg-amber-800 text-white'
  const btnInactive = 'bg-white text-stone-600 border border-stone-300 hover:border-amber-800 hover:text-amber-800'

  return (
    <div className="px-8 pb-10">
      {/* Controls bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6 pt-2">

        {/* Sort */}
        <div className="flex items-center gap-1.5 mr-2">
          <button
            className={`${btnBase} ${sortOrder === 'asc' ? btnActive : btnInactive}`}
            onClick={() => setSortOrder('asc')}
          >
            A → Z
          </button>
          <button
            className={`${btnBase} ${sortOrder === 'desc' ? btnActive : btnInactive}`}
            onClick={() => setSortOrder('desc')}
          >
            Z → A
          </button>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-stone-200" />

        {/* Type filter */}
        <div className="flex items-center gap-1.5">
          {(['all', 'bar', 'shop'] as TypeFilter[]).map(t => (
            <button
              key={t}
              className={`${btnBase} ${typeFilter === t ? btnActive : btnInactive}`}
              onClick={() => setTypeFilter(t)}
            >
              {t === 'all' ? 'All' : t === 'bar' ? 'Bar' : 'Shop'}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-stone-200" />

        {/* District filter */}
        <select
          value={districtFilter}
          onChange={e => setDistrictFilter(e.target.value)}
          className="px-3 py-1.5 rounded-full text-sm font-medium border border-stone-300 bg-white text-stone-600 cursor-pointer hover:border-amber-800 hover:text-amber-800 transition-colors appearance-none pr-7 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M6%208L1%203h10z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[center_right_0.75rem]"
        >
          <option value="all">All districts</option>
          {districts.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        {/* Result count */}
        <span className="ml-auto text-sm text-stone-400">
          {filtered.length} {filtered.length === 1 ? 'spot' : 'spots'}
        </span>
      </div>

      {/* Cards grid */}
      {filtered.length === 0 ? (
        <p className="text-stone-400 text-sm py-8 text-center">No spots match your filters.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map(spot => (
            <div
              key={spot.id}
              onClick={() => onSpotClick(spot.id, spot.lng, spot.lat)}
              className="border border-stone-200 rounded-xl p-4 cursor-pointer hover:shadow-md hover:border-amber-300 transition-all"
            >
              <div className="font-bold text-base">{spot.name}</div>
              <div className="text-stone-400 text-sm mt-1">{spot.address}</div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-amber-800 text-xs font-medium uppercase tracking-wide">
                  {spot.neighborhood}
                </span>
                <div className="flex gap-1">
                  {spot.types?.map(t => (
                    <span key={t} className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}