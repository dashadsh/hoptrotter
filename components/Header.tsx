export default function Header() {
  return (
    <header className="bg-amber-800 text-white px-8 py-4 flex items-center justify-between">
      <div>
        <span className="text-xl font-bold">HopTrotter</span>
        {/* <span className="text-gray-400 text-sm ml-3">Find your perfect pint</span> */}
      </div>
      <nav className="text-sm text-amber-200">
        <span>Find your perfect pint</span>
      </nav>
    </header>
  )
}