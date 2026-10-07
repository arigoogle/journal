import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatLongDate, formatMonthYear, getMonthGrid, isSameDay, toDateKey } from '../../utils/date'

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

interface PhotoCalendarProps {
  monthDate: Date
  photosByDate: Map<string, string>
  onPrevMonth: () => void
  onNextMonth: () => void
}

export function PhotoCalendar({
  monthDate,
  photosByDate,
  onPrevMonth,
  onNextMonth,
}: PhotoCalendarProps) {
  const navigate = useNavigate()
  const weeks = getMonthGrid(monthDate)
  const today = new Date()

  const [previewDateKey, setPreviewDateKey] = useState<string | null>(null)

  useEffect(() => {
    if (!previewDateKey) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setPreviewDateKey(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [previewDateKey])

  function goToJournal(dateKey: string) {
    navigate('/', { state: { dateKey } })
  }

  const previewPhotoUrl = previewDateKey ? photosByDate.get(previewDateKey) : undefined

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onPrevMonth}
          aria-label="Previous month"
          className="rounded-md px-2 py-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
        >
          &lt;
        </button>
        <h2 className="font-serif text-2xl text-stone-900">{formatMonthYear(monthDate)}</h2>
        <button
          onClick={onNextMonth}
          aria-label="Next month"
          className="rounded-md px-2 py-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
        >
          &gt;
        </button>
      </div>

      {/* Bleeds past the page gutter on mobile so cells get as much room as
          possible; settles back inside the normal content width from sm up. */}
      <div className="-mx-4 sm:mx-0">
        <div className="grid grid-cols-7 gap-1 px-4 sm:gap-2 sm:px-0">
          {WEEKDAY_LABELS.map((label) => (
            <div
              key={label}
              className="pb-1 text-center text-[10px] font-medium tracking-wide text-stone-400 uppercase"
            >
              {label}
            </div>
          ))}

          {weeks.flat().map((date) => {
            const dateKey = toDateKey(date)
            const inMonth = date.getMonth() === monthDate.getMonth()
            const isToday = isSameDay(date, today)
            const photoUrl = photosByDate.get(dateKey)

            return (
              <button
                key={dateKey}
                type="button"
                onClick={() => (photoUrl ? setPreviewDateKey(dateKey) : goToJournal(dateKey))}
                className={`group relative block aspect-[4/5] w-full overflow-hidden rounded-sm sm:rounded-md ${
                  photoUrl ? '' : 'bg-stone-50 hover:bg-stone-100'
                } ${!inMonth ? 'opacity-40' : ''} ${isToday ? 'ring-1 ring-stone-900' : ''}`}
              >
                {photoUrl ? (
                  <>
                    <img
                      src={photoUrl}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                    <span className="absolute top-1 left-1.5 text-xs font-medium text-white [text-shadow:0_1px_3px_rgb(0_0_0_/_0.6)]">
                      {date.getDate()}
                    </span>
                  </>
                ) : (
                  <span
                    className={`flex h-full w-full items-center justify-center text-sm ${
                      inMonth ? 'text-stone-300' : 'text-stone-200'
                    }`}
                  >
                    {date.getDate()}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {previewDateKey && previewPhotoUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Photo preview"
          onClick={() => setPreviewDateKey(null)}
        >
          <div className="relative w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewDateKey(null)}
              aria-label="Close"
              className="absolute -top-9 right-0 text-sm text-white/70 hover:text-white"
            >
              ✕
            </button>

            <img
              src={previewPhotoUrl}
              alt=""
              className="max-h-[70vh] w-full rounded-md object-contain"
            />

            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-sm text-white/80">{formatLongDate(previewDateKey)}</p>
              <button
                onClick={() => goToJournal(previewDateKey)}
                className="shrink-0 rounded-full bg-white px-3.5 py-1.5 text-sm font-medium text-stone-900 hover:bg-stone-100"
              >
                Open in Journal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
