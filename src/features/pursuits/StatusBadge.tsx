import type { PursuitStatus } from '../../types'

const STYLES: Record<PursuitStatus, string> = {
  ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-900',
  ACHIEVED: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-900',
  FAILED: 'bg-stone-100 text-stone-500 border-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:border-stone-700',
  SKIPPED: 'bg-stone-100 text-stone-500 border-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:border-stone-700',
  PASSED: 'bg-stone-100 text-stone-500 border-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:border-stone-700',
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
