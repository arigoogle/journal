import { daysInMonth } from '../../utils/date'

interface MonthlyMomentumProps {
  monthDate: Date
  entryCount: number
}

export function MonthlyMomentum({ monthDate, entryCount }: MonthlyMomentumProps) {
  const today = new Date()
  const isCurrentMonth =
    monthDate.getFullYear() === today.getFullYear() && monthDate.getMonth() === today.getMonth()
  const isPastMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1) <= today

  const total = daysInMonth(monthDate)
  const daysElapsed = isCurrentMonth ? today.getDate() : isPastMonth ? total : 0
  const pace = daysElapsed > 0 ? Math.round((entryCount / daysElapsed) * 100) : null
  const daysRemaining = isCurrentMonth ? total - daysElapsed : null

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-4">
      <p className="text-xs font-medium tracking-wide text-stone-400 uppercase">
        Monthly Momentum
      </p>

      <div className="mt-2 flex items-baseline justify-between">
        <p>
          <span className="font-serif text-2xl text-stone-900">{entryCount}</span>{' '}
          <span className="text-sm text-stone-500">
            {entryCount === 1 ? 'entry written' : 'entries written'}
          </span>
        </p>
        {pace !== null && <span className="text-xs font-medium text-stone-500">{pace}% pace</span>}
      </div>

      {daysRemaining !== null && (
        <p className="mt-1 text-xs text-stone-400">
          {daysRemaining === 0
            ? 'Last day of the month'
            : `${daysRemaining} day${daysRemaining === 1 ? '' : 's'} remaining`}
        </p>
      )}
    </div>
  )
}
