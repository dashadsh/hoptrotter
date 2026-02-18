import { spots } from '@/lib/spots'

export default function SpotList() {
  return (
    <div className="px-8 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {spots.map(spot => (
        <div key={spot.id} className="border border-gray-200 rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow">
          <div className="font-bold text-lg">{spot.name}</div>
          <div className="text-gray-500 text-sm mt-1">{spot.address}</div>
          <div className="text-amber-700 text-xs font-medium mt-2 uppercase tracking-wide">{spot.neighborhood}</div>
        </div>
      ))}
    </div>
  )
}