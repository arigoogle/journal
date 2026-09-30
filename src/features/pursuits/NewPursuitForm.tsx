import { useState, type FormEvent } from 'react'
import { Modal } from '../../components/Modal'
import type { Pursuit } from '../../types'
import { todayKey } from '../../utils/date'
import { createPursuit } from './api'

interface NewPursuitFormProps {
  onClose: () => void
  onCreated: (pursuit: Pursuit) => void
}

export function NewPursuitForm({ onClose, onCreated }: NewPursuitFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startedAt, setStartedAt] = useState(todayKey())
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (submitting || !title.trim()) return

    setSubmitting(true)
    setError(null)
    try {
      const pursuit = await createPursuit({ title: title.trim(), description, startedAt })
      onCreated(pursuit)
    } catch {
      setError('Could not create this pursuit. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <Modal title="New Pursuit" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="pursuit-title" className="mb-1 block text-sm text-stone-600">
            Title
          </label>
          <input
            id="pursuit-title"
            type="text"
            required
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Run a sub-20 5K"
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="pursuit-description" className="mb-1 block text-sm text-stone-600">
            Description
          </label>
          <textarea
            id="pursuit-description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional"
            className="w-full resize-none rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="pursuit-started-at" className="mb-1 block text-sm text-stone-600">
            Start date
          </label>
          <input
            id="pursuit-started-at"
            type="date"
            required
            value={startedAt}
            onChange={(e) => setStartedAt(e.target.value)}
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:outline-none"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex items-center gap-2 pt-1">
          <button
            type="submit"
            disabled={submitting || !title.trim()}
            className="rounded-md bg-stone-900 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-stone-700 disabled:opacity-50"
          >
            {submitting ? 'Creating…' : 'Create'}
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
