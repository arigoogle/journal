import { useEffect, useState } from 'react'
import {
  fetchActivePursuitCount,
  fetchCurrentStreak,
  fetchJournalDatesForMonth,
} from '../features/overview/api'
import { addMonths, daysInMonth, formatMonthYear } from '../utils/date'

export function OverviewPage() {
  const [monthDate, setMonthDate] = useState(() => new Date())
  const [journaledDays, setJournaledDays] = useState<number | null>(null)
  const [activeCount, setActiveCount] = useState<number | null>(null)
  const [streak, setStreak] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setError(null)
    setJournaledDays(null)
    fetchJournalDatesForMonth(monthDate)
      .then((dates) => setJournaledDays(dates.size))
      .catch(() => setError('Could not load your journal stats.'))
  }, [monthDate])

  useEffect(() => {
    fetchActivePursuitCount()
      .then(setActiveCount)
      .catch(() => setError('Could not load your pursuits.'))

    fetchCurrentStreak()
      .then(setStreak)
      .catch(() => {
        // Streak is a bonus stat; failing to load it shouldn't block the page.
      })
  }, [])

  const total = daysInMonth(monthDate)
  const pct = journaledDays === null ? 0 : Math.round((journaledDays / total) * 100)

  return (
    <div className="max-w-md space-y-10">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <button
            onClick={() => setMonthDate((d) => addMonths(d, -1))}
            aria-label="Previous month"
            className="rounded-md px-2 py-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
          >
            &lt;
          </button>
          <h1 className="font-serif text-lg text-stone-900">{formatMonthYear(monthDate)}</h1>
          <button
            onClick={() => setMonthDate((d) => addMonths(d, 1))}
            aria-label="Next month"
            className="rounded-md px-2 py-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
          >
            &gt;
          </button>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <p className="mb-1 text-sm text-stone-500">Journal</p>

        {journaledDays === null ? (
          <p className="text-sm text-stone-400">Loading…</p>
        ) : (
          <>
            <p className="mb-2 text-sm text-stone-800">
              {journaledDays} / {total} days
            </p>
            <div className="h-2 w-full overflow-hidden rounded-full bg-stone-100">
              <div
                className="h-full rounded-full bg-stone-900 transition-[width]"
                style={{ width: `${pct}%` }}
              />
            </div>
          </>
        )}

        {streak !== null && streak > 0 && (
          <p className="mt-3 text-sm text-stone-400">
            {streak}-day journaling streak
          </p>
        )}
      </div>

      <div>
        <p className="mb-1 text-sm text-stone-500">Current Pursuits</p>
        {activeCount === null ? (
          <p className="text-sm text-stone-400">Loading…</p>
        ) : (
          <p className="text-sm text-stone-800">{activeCount} active</p>
        )}
      </div>
    </div>
  )
}
