import { logout } from '../utilities/auth'

export default function Navbar() {
  return (
    <header className="h-16 bg-linear-to-r from-blue-600 to-blue-700 shadow-lg flex items-center justify-between px-6">
      <div className="flex items-center gap-1">
       <img src="/icon.png" className='h-10' alt="" />
        <h1 className="text-xl font-bold text-white">Check Request Portal</h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-blue-100 text-sm hidden md:block">Welcome back! {}</span>
        <button
          className="px-4 py-[6px] rounded-lg cursor-pointer bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all duration-200 border border-white/20 hover:shadow-lg"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </header>
  )
}
