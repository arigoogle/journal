import { useEffect, useState } from 'react'
import { fetchActivePursuits, fetchHistoryPursuits } from '../features/pursuits/api'
import { NewPursuitForm } from '../features/pursuits/NewPursuitForm'
import { PursuitCard } from '../features/pursuits/PursuitCard'
import type { Pursuit, PursuitStatus } from '../types'

type Tab = 'current' | 'history'
const HISTORY_FILTERS: (PursuitStatus | 'ALL')[] = ['ALL', 'ACHIEVED', 'FAILED', 'SKIPPED', 'PASSED']

export function PursuitsPage() {
  const [tab, setTab] = useState<Tab>('current')
  const [historyFilter, setHistoryFilter] = useState<PursuitStatus | 'ALL'>('ALL')

  const [active, setActive] = useState<Pursuit[] | null>(null)
  const [activeError, setActiveError] = useState<string | null>(null)
  const [history, setHistory] = useState<Pursuit[] | null>(null)
  const [historyError, setHistoryError] = useState<string | null>(null)
  const [showNewForm, setShowNewForm] = useState(false)

  useEffect(() => {
    setActiveError(null)
    fetchActivePursuits()
      .then(setActive)
      .catch(() => setActiveError('Could not load current pursuits.'))
  }, [])

  useEffect(() => {
    if (tab !== 'history') return
    setHistoryError(null)
    fetchHistoryPursuits(historyFilter === 'ALL' ? undefined : historyFilter)
      .then(setHistory)
      .catch(() => setHistoryError('Could not load pursuit history.'))
  }, [tab, historyFilter])

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex gap-1">
          <button
            onClick={() => setTab('current')}
            className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
              tab === 'current' ? 'bg-stone-900 text-white' : 'text-stone-500 hover:bg-stone-100'
            }`}
          >
            Current
          </button>
          <button
            onClick={() => setTab('history')}
            className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
              tab === 'history' ? 'bg-stone-900 text-white' : 'text-stone-500 hover:bg-stone-100'
            }`}
          >
            History
          </button>
        </div>

        <button
          onClick={() => setShowNewForm(true)}
          className="rounded-md bg-stone-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-700"
        >
          New Pursuit
        </button>
      </div>

      {tab === 'current' ? (
        activeError ? (
          <p className="text-sm text-red-600">{activeError}</p>
        ) : active === null ? (
          <p className="text-sm text-stone-400">Loading pursuits…</p>
        ) : active.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-stone-500">No active pursuits.</p>
            <p className="text-sm text-stone-400">What are you pursuing right now?</p>
          </div>
        ) : (
          <div>
            <p className="mb-3 text-sm text-stone-400">
              {active.length} active pursuit{active.length === 1 ? '' : 's'}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {active.map((p) => (
                <PursuitCard key={p.id} pursuit={p} />
              ))}
            </div>
          </div>
        )
      ) : (
        <div>
          <div className="mb-4 flex flex-wrap gap-1">
            {HISTORY_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setHistoryFilter(f)}
                className={`rounded-md px-2.5 py-1 text-xs transition-colors ${
                  historyFilter === f
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-500 hover:bg-stone-100'
                }`}
              >
                {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {historyError ? (
            <p className="text-sm text-red-600">{historyError}</p>
          ) : history === null ? (
            <p className="text-sm text-stone-400">Loading history…</p>
          ) : history.length === 0 ? (
            <p className="py-12 text-center text-sm text-stone-500">No pursuits here yet.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {history.map((p) => (
                <PursuitCard key={p.id} pursuit={p} />
              ))}
            </div>
          )}
        </div>
      )}

      {showNewForm && (
        <NewPursuitForm
          onClose={() => setShowNewForm(false)}
          onCreated={(pursuit) => {
            setActive((prev) => [pursuit, ...(prev ?? [])])
            setShowNewForm(false)
            setTab('current')
          }}
        />
      )}
    </div>
  )
}
