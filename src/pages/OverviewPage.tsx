import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Calendar } from '../features/journal/Calendar'
import { fetchCurrentStreak, fetchJournalDatesForMonth } from '../features/overview/api'
import { fetchActivePursuits } from '../features/pursuits/api'
import type { Pursuit } from '../types'
import { addMonths, daysInMonth } from '../utils/date'

export function OverviewPage() {
  const navigate = useNavigate()

  const [monthDate, setMonthDate] = useState(() => new Date())
  const [monthDates, setMonthDates] = useState<Set<string> | null>(null)
  const [activePursuits, setActivePursuits] = useState<Pursuit[] | null>(null)
  const [streak, setStreak] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setError(null)
    setMonthDates(null)
    fetchJournalDatesForMonth(monthDate)
      .then(setMonthDates)
      .catch(() => setError('Could not load your journal stats.'))
  }, [monthDate])

  useEffect(() => {
    fetchActivePursuits()
      .then(setActivePursuits)
      .catch(() => setError('Could not load your pursuits.'))

    fetchCurrentStreak()
      .then(setStreak)
      .catch(() => {
        // Streak is a bonus stat; failing to load it shouldn't block the page.
      })
  }, [])

  const total = daysInMonth(monthDate)
  const journaledDays = monthDates?.size ?? null
  const pct = journaledDays === null ? 0 : Math.round((journaledDays / total) * 100)

  return (
    <div className="max-w-md space-y-10">
      <div>
        <Calendar
          monthDate={monthDate}
          selectedDateKey=""
          datesWithEntries={monthDates ?? new Set()}
          onSelectDate={(dateKey) => navigate('/', { state: { dateKey } })}
          onPrevMonth={() => setMonthDate((d) => addMonths(d, -1))}
          onNextMonth={() => setMonthDate((d) => addMonths(d, 1))}
        />

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <p className="mt-6 mb-1 text-sm text-stone-500">Journal</p>

        {journaledDays === null ? (
          <p className="text-sm text-stone-400">Loading…</p>
        ) : (
          <>
            <p className="mb-2 text-sm text-stone-800">
              {journaledDays} / {total} days
            </p>
            <div className="h-1 w-full overflow-hidden rounded-full bg-stone-100">
              <div
                className="h-full rounded-full bg-stone-900 transition-[width]"
                style={{ width: `${pct}%` }}
              />
            </div>
          </>
        )}

        {streak !== null && streak > 0 && (
          <p className="mt-3 text-sm text-stone-400">{streak}-day journaling streak</p>
        )}
      </div>

      <div>
        <p className="mb-1 text-sm text-stone-500">Current Pursuits</p>

        {activePursuits === null ? (
          <p className="text-sm text-stone-400">Loading…</p>
        ) : activePursuits.length === 0 ? (
          <p className="text-sm text-stone-400">No active pursuits.</p>
        ) : (
          <ul className="space-y-1.5">
            {activePursuits.map((p) => (
              <li key={p.id}>
                <Link
                  to={`/pursuits/${p.id}`}
                  className="text-sm text-stone-800 hover:text-stone-500"
                >
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
