import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchEntries } from '../features/journal/api'
import { excerptAround } from '../features/journal/editor/content'
import type { JournalEntry } from '../types'
import { formatLongDate } from '../utils/date'

// Avoid firing a query on every keystroke.
const DEBOUNCE_MS = 300

export function SearchPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const trimmed = query.trim()
    if (trimmed === '') {
      setResults([])
      setError(null)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    const timer = setTimeout(() => {
      searchEntries(trimmed)
        .then((entries) => {
          if (!cancelled) setResults(entries)
        })
        .catch(() => {
          if (!cancelled) setError('Could not search journal entries.')
        })
        .finally(() => {
          if (!cancelled) setLoading(false)
        })
    }, DEBOUNCE_MS)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [query])

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search your journal…"
        autoFocus
        className="w-full rounded-full border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-stone-600"
      />

      <div className="mt-6 space-y-1">
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

        {!error && !loading && query.trim() !== '' && results.length === 0 && (
          <p className="text-sm text-stone-400 dark:text-stone-500">
            No entries match "{query.trim()}".
          </p>
        )}

        {results.map((entry) => (
          <button
            key={entry.id}
            type="button"
            onClick={() => navigate('/', { state: { dateKey: entry.date } })}
            className="block w-full rounded-lg px-3 py-3 text-left hover:bg-stone-50 dark:hover:bg-stone-900"
          >
            <p className="text-sm font-medium text-stone-900 dark:text-stone-100">
              {formatLongDate(entry.date)}
            </p>
            <p className="mt-0.5 text-sm text-stone-500 dark:text-stone-400">
              {excerptAround(entry.content, query.trim())}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}
