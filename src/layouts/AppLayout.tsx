import { useEffect, useRef } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { ThemeToggle } from '../components/ThemeToggle'
import {
  ArchiveIcon,
  JournalIcon,
  OverviewIcon,
  PursuitsIcon,
  SearchIcon,
} from '../components/NavIcons'
import { supabase } from '../lib/supabase/client'

const NAV_ITEMS = [
  { to: '/', label: 'Journal', end: true, icon: JournalIcon },
  { to: '/pursuits', label: 'Pursuits', end: false, icon: PursuitsIcon },
  { to: '/overview', label: 'Overview', end: false, icon: OverviewIcon },
  { to: '/archive', label: 'Archive', end: false, icon: ArchiveIcon },
  { to: '/search', label: 'Search', end: false, icon: SearchIcon },
]

// The Journal page hosts the rich-text editor and the Archive page hosts a
// photo grid — both benefit from more horizontal room than the other pages.
// The outer shell (and the nav bar inside it) stays a constant width across
// routes so the header never shifts when navigating — only these two get an
// inner width constraint lifted.
const WIDE_ROUTES = new Set(['/', '/archive'])

export function AppLayout() {
  const location = useLocation()
  const isWideRoute = WIDE_ROUTES.has(location.pathname)
  const navRef = useRef<HTMLElement>(null)

  // On a narrow screen the nav row scrolls — if the current route's pill
  // isn't the first one, make sure it's actually visible instead of
  // defaulting to the scrolled-to-start position.
  useEffect(() => {
    const active = navRef.current?.querySelector('[aria-current="page"]')
    active?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [location.pathname])

  return (
    <div className="mx-auto flex min-h-dvh max-w-6xl flex-col px-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      <header className="flex items-center justify-between gap-2 border-b border-stone-200 py-5 dark:border-stone-800">
        {/* overflow-x-auto + hidden scrollbar: on narrow phones the five
            pills don't all fit — let the row scroll instead of wrapping or
            squeezing "Sign out" off-screen. */}
        <nav
          ref={navRef}
          className="scroll-fade-x flex min-w-0 flex-1 gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              aria-label={item.label}
              title={item.label}
              className={({ isActive }) =>
                `flex shrink-0 items-center justify-center rounded-full px-3 py-2 text-sm font-medium transition-colors sm:px-3.5 sm:py-1.5 ${
                  isActive
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                    : 'text-stone-500 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-900 dark:hover:text-stone-100'
                }`
              }
            >
              <item.icon className="size-5 sm:hidden" />
              <span className="hidden sm:inline">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-xs text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="flex-1 py-6">
        {isWideRoute ? (
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
