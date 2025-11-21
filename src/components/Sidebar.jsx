import { NavLink } from 'react-router-dom'

const links = [
  { to: '/users', label: 'Users', icon: '👥' },
  { to: '/clients', label: 'Clients', icon: '🏢' },
  { to: '/contractors', label: 'Contractors', icon: '🔨' },
  { to: '/consultants', label: 'Consultants', icon: '💼' },
  { to: '/projects', label: 'Projects', icon: '📁' },
  { to: '/main-form', label: 'Main Form', icon: '📋' },
]

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white h-[calc(100vh-4rem)] p-4 shadow-lg border-r border-gray-100">
      <nav className="flex flex-col gap-2">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transform scale-105' 
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
              }`
            }
          >
            <span className="text-xl">{l.icon}</span>
            <span>{l.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
