import { Link } from 'react-router-dom'
import { formatMonthYear, getMonthGrid, isSameDay, toDateKey } from '../../utils/date'

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
  const weeks = getMonthGrid(monthDate)
  const today = new Date()

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

      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
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
            <Link
              key={dateKey}
              to="/"
              state={{ dateKey }}
              className={`group relative block aspect-square overflow-hidden rounded-md ${
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
            </Link>
          )
        })}
      </div>
    </div>
  )
}
