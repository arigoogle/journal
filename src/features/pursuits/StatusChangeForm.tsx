import { useState, type FormEvent } from 'react'
import { Modal } from '../../components/Modal'
import type { Pursuit, PursuitStatus } from '../../types'
import { changePursuitStatus } from './api'

const CHANGEABLE_STATUSES: PursuitStatus[] = ['ACHIEVED', 'FAILED', 'SKIPPED', 'PASSED', 'ACTIVE']

interface StatusChangeFormProps {
  pursuit: Pursuit
  onClose: () => void
  onChanged: (pursuit: Pursuit) => void
}

export function StatusChangeForm({ pursuit, onClose, onChanged }: StatusChangeFormProps) {
  const options = CHANGEABLE_STATUSES.filter((s) => s !== pursuit.status)
  const [status, setStatus] = useState<PursuitStatus>(options[0])
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (submitting) return

    setSubmitting(true)
    setError(null)
    try {
      const updated = await changePursuitStatus(pursuit.id, status, note.trim())
      onChanged(updated)
    } catch {
      setError('Could not update the status. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <Modal title="Change Status" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="status-select" className="mb-1 block text-sm text-stone-600">
            Status
          </label>
          <select
            id="status-select"
            value={status}
            onChange={(e) => setStatus(e.target.value as PursuitStatus)}
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:outline-none"
          >
            {options.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0) + s.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="status-note" className="mb-1 block text-sm text-stone-600">
            Note
          </label>
          <input
            id="status-note"
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional"
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:outline-none"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex items-center gap-2 pt-1">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-stone-900 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-stone-700 disabled:opacity-50"
          >
            {submitting ? 'Saving…' : 'Confirm'}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-md px-4 py-1.5 text-sm text-stone-500 hover:bg-stone-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  )
}
