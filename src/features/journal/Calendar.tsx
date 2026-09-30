import { formatMonthYear, getMonthGrid, isSameDay, toDateKey } from '../../utils/date'

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

interface CalendarProps {
  monthDate: Date
  selectedDateKey: string
  datesWithEntries: Set<string>
  onSelectDate: (dateKey: string) => void
  onPrevMonth: () => void
  onNextMonth: () => void
}

export function Calendar({
  monthDate,
  selectedDateKey,
  datesWithEntries,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
}: CalendarProps) {
  const weeks = getMonthGrid(monthDate)
  const today = new Date()

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={onPrevMonth}
          aria-label="Previous month"
          className="rounded-md px-2 py-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
        >
          &lt;
        </button>
        <h2 className="font-serif text-lg text-stone-900">{formatMonthYear(monthDate)}</h2>
        <button
          onClick={onNextMonth}
          aria-label="Next month"
          className="rounded-md px-2 py-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
        >
          &gt;
        </button>
      </div>

      <div className="grid grid-cols-7 gap-y-1 text-center">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="pb-2 text-xs font-medium tracking-wide text-stone-400 uppercase"
          >
            {label}
          </div>
        ))}

        {weeks.flat().map((date) => {
          const dateKey = toDateKey(date)
          const inMonth = date.getMonth() === monthDate.getMonth()
          const isToday = isSameDay(date, today)
          const isSelected = dateKey === selectedDateKey
          const hasEntry = datesWithEntries.has(dateKey)

          return (
            <button
              key={dateKey}
              onClick={() => onSelectDate(dateKey)}
              className={`relative mx-auto flex size-9 flex-col items-center justify-center rounded-full text-sm transition-colors sm:size-10 ${
                !inMonth ? 'text-stone-300' : 'text-stone-700'
              } ${isSelected ? 'bg-stone-900 text-white' : isToday ? 'ring-1 ring-stone-900' : 'hover:bg-stone-100'}`}
            >
              {date.getDate()}
              {hasEntry && (
                <span
                  className={`absolute bottom-1.5 h-1 w-1 rounded-full ${
                    isSelected ? 'bg-white' : 'bg-stone-500'
                  }`}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
