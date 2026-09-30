import { useEffect, useState } from 'react'
import { Calendar } from '../features/journal/Calendar'
import { fetchEntriesForMonth, fetchEntryByDate } from '../features/journal/api'
import { JournalEntryPanel } from '../features/journal/JournalEntryPanel'
import type { JournalEntry } from '../types'
import { addMonths, todayKey } from '../utils/date'

export function JournalPage() {
  const [monthDate, setMonthDate] = useState(() => new Date())
  const [selectedDateKey, setSelectedDateKey] = useState(() => todayKey())

  const [monthEntries, setMonthEntries] = useState<JournalEntry[]>([])
  const [monthError, setMonthError] = useState<string | null>(null)

  const [entry, setEntry] = useState<JournalEntry | null>(null)
  const [entryLoading, setEntryLoading] = useState(true)
  const [entryError, setEntryError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setMonthError(null)

    fetchEntriesForMonth(monthDate)
      .then((entries) => {
        if (!cancelled) setMonthEntries(entries)
      })
      .catch(() => {
        if (!cancelled) setMonthError('Could not load this month.')
      })

    return () => {
      cancelled = true
    }
  }, [monthDate])

  useEffect(() => {
    let cancelled = false
    setEntryLoading(true)
    setEntryError(null)

    fetchEntryByDate(selectedDateKey)
      .then((found) => {
        if (!cancelled) setEntry(found)
      })
      .catch(() => {
        if (!cancelled) setEntryError('Could not load this journal entry.')
      })
      .finally(() => {
        if (!cancelled) setEntryLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [selectedDateKey])

  const datesWithEntries = new Set(monthEntries.map((e) => e.date))

  function upsertMonthEntry(saved: JournalEntry) {
    setMonthEntries((prev) => {
      const withoutSaved = prev.filter((e) => e.date !== saved.date)
      return [...withoutSaved, saved]
    })
  }

  function removeMonthEntry(dateKey: string) {
    setMonthEntries((prev) => prev.filter((e) => e.date !== dateKey))
  }

  return (
    <div className="grid gap-8 sm:grid-cols-[auto_1fr]">
      <div>
        {monthError ? (
          <p className="text-sm text-red-600">{monthError}</p>
        ) : (
          <Calendar
            monthDate={monthDate}
            selectedDateKey={selectedDateKey}
            datesWithEntries={datesWithEntries}
            onSelectDate={setSelectedDateKey}
            onPrevMonth={() => setMonthDate((d) => addMonths(d, -1))}
            onNextMonth={() => setMonthDate((d) => addMonths(d, 1))}
          />
        )}
      </div>

      <div className="max-w-[720px] border-t border-stone-200 pt-6 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-8">
        <JournalEntryPanel
          dateKey={selectedDateKey}
          entry={entry}
          loading={entryLoading}
          error={entryError}
          onSaved={(saved) => {
            setEntry(saved)
            upsertMonthEntry(saved)
          }}
          onDeleted={() => {
            removeMonthEntry(selectedDateKey)
            setEntry(null)
          }}
        />
      </div>
    </div>
  )
}
