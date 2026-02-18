import Map from '@/components/Map'

export default function Home() {
  return (
    <main>
      <div className="p-8 pb-4">
        <h1 className="text-3xl font-bold">Beer Map</h1>
        <p className="text-gray-500 mt-2">Discover the best craft beer spots near you</p>
      </div>
      <Map />
    </main>
  )
}