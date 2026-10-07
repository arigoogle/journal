import { useEffect, useState } from 'react'
import { fetchEntriesForMonth } from '../features/journal/api'
import { extractFirstImageSrc } from '../features/journal/editor/content'
import { PhotoCalendar } from '../features/journal/PhotoCalendar'
import { addMonths } from '../utils/date'

export function ArchivePage() {
  const [monthDate, setMonthDate] = useState(() => new Date())
  const [photosByDate, setPhotosByDate] = useState<Map<string, string>>(new Map())
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setError(null)

    fetchEntriesForMonth(monthDate)
      .then((entries) => {
        if (cancelled) return

        const next = new Map<string, string>()
        for (const entry of entries) {
          const src = extractFirstImageSrc(entry.content)
          if (src) next.set(entry.date, src)
        }
        setPhotosByDate(next)
      })
      .catch(() => {
        if (!cancelled) setError('Could not load this month.')
      })

    return () => {
      cancelled = true
    }
  }, [monthDate])

  return (
    <div className="mx-auto max-w-3xl">
      {error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : (
        <PhotoCalendar
          monthDate={monthDate}
          photosByDate={photosByDate}
          onPrevMonth={() => setMonthDate((d) => addMonths(d, -1))}
          onNextMonth={() => setMonthDate((d) => addMonths(d, 1))}
        />
      )}
    </div>
  )
}
