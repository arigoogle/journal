import type { PursuitStatus } from '../../types'

const STYLES: Record<PursuitStatus, string> = {
  ACTIVE: 'bg-emerald-50 text-emerald-700',
  ACHIEVED: 'bg-blue-50 text-blue-700',
  FAILED: 'bg-stone-100 text-stone-500',
  SKIPPED: 'bg-stone-100 text-stone-500',
  PASSED: 'bg-stone-100 text-stone-500',
}

export function StatusBadge({ status }: { status: PursuitStatus }) {
  return (
    <span
      className={`rounded px-2 py-0.5 text-[11px] font-medium tracking-wide ${STYLES[status]}`}
    >
      {status}
    </span>
  )
}
