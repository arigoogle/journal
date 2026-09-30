import { useState, type FormEvent } from 'react'
import { Modal } from '../../components/Modal'
import type { Pursuit } from '../../types'
import { updatePursuitDetails } from './api'

interface EditPursuitFormProps {
  pursuit: Pursuit
  onClose: () => void
  onSaved: (pursuit: Pursuit) => void
}

export function EditPursuitForm({ pursuit, onClose, onSaved }: EditPursuitFormProps) {
  const [title, setTitle] = useState(pursuit.title)
  const [description, setDescription] = useState(pursuit.description ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (submitting || !title.trim()) return

    setSubmitting(true)
    setError(null)
    try {
      const saved = await updatePursuitDetails(pursuit.id, {
        title: title.trim(),
        description,
      })
      onSaved(saved)
    } catch {
      setError('Could not save your changes. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <Modal title="Edit Pursuit" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="edit-title" className="mb-1 block text-sm text-stone-600">
            Title
          </label>
          <input
            id="edit-title"
            type="text"
            required
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="edit-description" className="mb-1 block text-sm text-stone-600">
            Description
          </label>
          <textarea
            id="edit-description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full resize-none rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:outline-none"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex items-center gap-2 pt-1">
          <button
            type="submit"
            disabled={submitting || !title.trim()}
            className="rounded-md bg-stone-900 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? 'Saving…' : 'Save'}
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
