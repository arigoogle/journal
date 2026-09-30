import { useEffect, useState } from 'react'
import type { JournalEntry } from '../../types'
import { formatLongDate } from '../../utils/date'
import { deleteEntry, saveEntry } from './api'

interface JournalEntryPanelProps {
  dateKey: string
  entry: JournalEntry | null
  loading: boolean
  error: string | null
  onSaved: (entry: JournalEntry) => void
  onDeleted: () => void
}

export function JournalEntryPanel({
  dateKey,
  entry,
  loading,
  error,
  onSaved,
  onDeleted,
}: JournalEntryPanelProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    setEditing(!entry)
    setDraft(entry?.content ?? '')
    setSaveError(null)
    setConfirmingDelete(false)
  }, [dateKey, entry])

  useEffect(() => {
    const isDirty = editing && draft !== (entry?.content ?? '')
    if (!isDirty) return

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [editing, draft, entry])

  if (loading) {
    return <p className="text-sm text-stone-400">Loading journal…</p>
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>
  }

  async function handleSave() {
    if (saving || !draft.trim()) return
    setSaving(true)
    setSaveError(null)
    try {
      const saved = await saveEntry(dateKey, draft.trim())
      onSaved(saved)
      setEditing(false)
    } catch {
      setSaveError('Could not save your entry. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!entry || deleting) return
    setDeleting(true)
    try {
      await deleteEntry(entry.id)
      onDeleted()
    } catch {
      setSaveError('Could not delete this entry. Please try again.')
      setDeleting(false)
    }
  }

  return (
    <div>
      <h3 className="mb-3 font-serif text-lg text-stone-900">{formatLongDate(dateKey)}</h3>

      {editing ? (
        <div>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="How was today?"
            rows={8}
            autoFocus
            className="w-full resize-none rounded-md border border-stone-300 p-3 text-sm leading-relaxed text-stone-800 focus:border-stone-500 focus:outline-none"
          />

          {saveError && <p className="mt-2 text-sm text-red-600">{saveError}</p>}

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={saving || !draft.trim()}
              className="rounded-md bg-stone-900 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-stone-700 disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
            {entry && (
              <button
                onClick={() => {
                  setDraft(entry.content)
                  setEditing(false)
                  setSaveError(null)
                }}
                disabled={saving}
                className="rounded-md px-4 py-1.5 text-sm text-stone-500 hover:bg-stone-100"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      ) : entry ? (
        <div>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-stone-800">
            {entry.content}
          </p>

          {saveError && <p className="mt-2 text-sm text-red-600">{saveError}</p>}

          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={() => setEditing(true)}
              className="rounded-md px-4 py-1.5 text-sm text-stone-600 hover:bg-stone-100"
            >
              Edit
            </button>

            {confirmingDelete ? (
              <span className="flex items-center gap-2 text-sm">
                <span className="text-stone-500">Delete this entry?</span>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                >
                  {deleting ? 'Deleting…' : 'Confirm'}
                </button>
                <button
                  onClick={() => setConfirmingDelete(false)}
                  disabled={deleting}
                  className="text-stone-500 hover:text-stone-700"
                >
                  Cancel
                </button>
              </span>
            ) : (
              <button
                onClick={() => setConfirmingDelete(true)}
                className="rounded-md px-4 py-1.5 text-sm text-stone-400 hover:bg-red-50 hover:text-red-600"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
