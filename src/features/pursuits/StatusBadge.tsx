import type { PursuitStatus } from '../../types'

const STYLES: Record<PursuitStatus, string> = {
  ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  ACHIEVED: 'bg-blue-50 text-blue-700 border-blue-100',
  FAILED: 'bg-stone-100 text-stone-500 border-stone-200',
  SKIPPED: 'bg-stone-100 text-stone-500 border-stone-200',
  PASSED: 'bg-stone-100 text-stone-500 border-stone-200',
}

export function StatusBadge({ status }: { status: PursuitStatus }) {
  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide ${STYLES[status]}`}
    >
      {status}
    </span>
  )
}
