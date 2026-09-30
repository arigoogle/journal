import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { EditPursuitForm } from '../features/pursuits/EditPursuitForm'
import { fetchPursuit, fetchPursuitStatusHistory } from '../features/pursuits/api'
import { StatusBadge } from '../features/pursuits/StatusBadge'
import { StatusChangeForm } from '../features/pursuits/StatusChangeForm'
import type { Pursuit, PursuitStatusHistory } from '../types'
import { formatLongDate } from '../utils/date'

export function PursuitDetailPage() {
  const { id } = useParams<{ id: string }>()

  const [pursuit, setPursuit] = useState<Pursuit | null | undefined>(undefined)
  const [history, setHistory] = useState<PursuitStatusHistory[]>([])
  const [error, setError] = useState<string | null>(null)
  const [showStatusForm, setShowStatusForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)

  useEffect(() => {
    if (!id) return
    setError(null)

    Promise.all([fetchPursuit(id), fetchPursuitStatusHistory(id)])
      .then(([p, h]) => {
        setPursuit(p)
        setHistory(h)
      })
      .catch(() => setError('Could not load this pursuit.'))
  }, [id])

  if (error) return <p className="text-sm text-red-600">{error}</p>
  if (pursuit === undefined) return <p className="text-sm text-stone-400">Loading…</p>
  if (pursuit === null) return <p className="text-sm text-stone-500">Pursuit not found.</p>

  return (
    <div className="max-w-lg">
      <Link to="/pursuits" className="mb-6 inline-block text-sm text-stone-400 hover:text-stone-700">
        &larr; Pursuits
      </Link>

      <h1 className="mb-4 font-serif text-2xl text-stone-900">{pursuit.title}</h1>

      <dl className="space-y-4 text-sm">
        <div>
          <dt className="text-stone-400">Started</dt>
          <dd className="text-stone-800">{formatLongDate(pursuit.started_at)}</dd>
        </div>

        {pursuit.description && (
          <div>
            <dt className="text-stone-400">Description</dt>
            <dd className="whitespace-pre-wrap text-stone-800">{pursuit.description}</dd>
          </div>
        )}

        <div>
          <dt className="mb-1 text-stone-400">Status</dt>
          <dd>
            <StatusBadge status={pursuit.status} />
          </dd>
        </div>
      </dl>

      <div className="mt-6 flex items-center gap-2">
        <button
          onClick={() => setShowStatusForm(true)}
          className="rounded-md bg-stone-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-stone-700"
        >
          Update Status
        </button>
        <button
          onClick={() => setShowEditForm(true)}
          className="rounded-md px-4 py-1.5 text-sm text-stone-600 hover:bg-stone-100"
        >
          Edit
        </button>
      </div>

      {history.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-3 text-sm font-medium text-stone-500">History</h2>
          <ul className="space-y-3 border-l border-stone-200 pl-4">
            {history.map((h, i) => (
              <li key={h.id} className="text-sm">
                <div className="text-stone-400">{formatLongDate(h.created_at.slice(0, 10))}</div>
                {i === 0 && <div className="text-stone-500">Created</div>}
                <div className="mt-0.5 flex items-center gap-2">
                  <StatusBadge status={h.status} />
                  {h.note && <span className="text-stone-600">{h.note}</span>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showStatusForm && (
        <StatusChangeForm
          pursuit={pursuit}
          onClose={() => setShowStatusForm(false)}
          onChanged={(updated) => {
            setPursuit(updated)
            setShowStatusForm(false)
            if (id) fetchPursuitStatusHistory(id).then(setHistory)
          }}
        />
      )}

      {showEditForm && (
        <EditPursuitForm
          pursuit={pursuit}
          onClose={() => setShowEditForm(false)}
          onSaved={(saved) => {
            setPursuit(saved)
            setShowEditForm(false)
          }}
        />
      )}
    </div>
  )
}
