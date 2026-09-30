import { NavLink, Outlet } from 'react-router-dom'
import { supabase } from '../lib/supabase/client'

const NAV_ITEMS = [
  { to: '/', label: 'Journal', end: true },
  { to: '/pursuits', label: 'Pursuits', end: false },
  { to: '/overview', label: 'Overview', end: false },
]

export function AppLayout() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col px-4">
      <header className="flex items-center justify-between border-b border-stone-200 py-5">
        <nav className="flex gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `rounded-md px-3 py-1.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-500 hover:bg-stone-100 hover:text-stone-900'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={() => supabase.auth.signOut()}
          className="text-xs text-stone-400 hover:text-stone-600"
        >
          Sign out
        </button>
      </header>

      <main className="flex-1 py-6">
        <Outlet />
      </main>
    </div>
  )
}
