import Map from '@/components/Map'
import Header from '@/components/Header'
import SpotList from '@/components/SpotList'

export default function BerlinPage() {
  return (
    <main>
      <Header />
      <div className="px-8 py-6">
        <h1 className="text-4xl font-bold">Berlin</h1>
        <p className="text-gray-500 mt-1">Craft beer guide · 3 spots</p>
      </div>
      <Map />
      <SpotList />
    </main>
  )
}