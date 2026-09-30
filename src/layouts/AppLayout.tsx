import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase/client'

const NAV_ITEMS = [
  { to: '/', label: 'Journal', end: true },
  { to: '/pursuits', label: 'Pursuits', end: false },
  { to: '/overview', label: 'Overview', end: false },
]

export function AppLayout() {
  // The Journal page hosts the rich-text editor and benefits from more
  // horizontal room, but the outer shell (and the nav bar inside it) stays
  // a constant width across routes so the header never shifts when
  // navigating — only non-Journal pages get an inner width constraint.
  const isJournalRoute = useLocation().pathname === '/'

  return (
    <div className="mx-auto flex min-h-dvh max-w-6xl flex-col px-4">
      <header className="flex items-center justify-between border-b border-stone-200 py-5">
        <nav className="flex gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
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
        {isJournalRoute ? (
          <Outlet />
        ) : (
          <div className="mx-auto w-full max-w-2xl">
            <Outlet />
          </div>
        )}
      </main>
    </div>
  )
}
