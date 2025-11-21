import { logout } from '../utilities/auth'

export default function Navbar() {
  return (
    <header className="h-16 bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
          <span className="text-blue-600 font-bold text-xl">N</span>
        </div>
        <h1 className="text-xl font-bold text-white">NESPAK Portal</h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-blue-100 text-sm hidden md:block">Welcome back!</span>
        <button
          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all duration-200 border border-white/20 hover:shadow-lg"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </header>
  )
}
