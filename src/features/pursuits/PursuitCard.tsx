import { Link } from 'react-router-dom'
import type { Pursuit } from '../../types'
import { formatLongDate, formatMonthShort } from '../../utils/date'
import { StatusBadge } from './StatusBadge'

export function PursuitCard({ pursuit }: { pursuit: Pursuit }) {
  return (
    <Link
      to={`/pursuits/${pursuit.id}`}
      className="block rounded-lg border border-stone-200 p-4 transition-colors hover:border-stone-300 hover:bg-stone-50"
    >
      <h3 className="font-serif text-base text-stone-900">{pursuit.title}</h3>

      {pursuit.description && (
        <p className="mt-1 line-clamp-2 text-sm text-stone-500">{pursuit.description}</p>
      )}

      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-stone-400">
          {pursuit.status === 'ACTIVE'
            ? `Started ${formatLongDate(pursuit.started_at)}`
            : formatMonthShort(pursuit.ended_at ?? pursuit.started_at)}
        </span>
        <StatusBadge status={pursuit.status} />
      </div>
    </Link>
  )
}
