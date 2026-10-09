import { useEffect, useMemo, useRef, useState } from 'react'
import type { JournalEntry } from '../../types'
import { formatLongDate } from '../../utils/date'
import { deleteEntry, saveEntry } from './api'
import { backupDeleteEntry, backupEntry } from './backupApi'
import { toEditorContent } from './editor/content'
import { JournalEditor } from './editor/JournalEditor'
import { getCurrentLocation, mapUrl } from './geolocation'
import { countWords, estimateReadingMinutes } from './wordCount'

interface JournalEntryPanelProps {
  dateKey: string
  entry: JournalEntry | null
  loading: boolean
  error: string | null
  onSaved: (entry: JournalEntry) => void
  onDeleted: () => void
}

const AUTOSAVE_DELAY_MS = 1500
const SAVED_INDICATOR_MS = 2000

export function JournalEntryPanel({
  dateKey,
  entry,
  loading,
  error,
  onSaved,
  onDeleted,
}: JournalEntryPanelProps) {
  const baselineHtml = useMemo(() => toEditorContent(entry?.content ?? ''), [entry])

  const [editing, setEditing] = useState(false)
  const [resetToken, setResetToken] = useState(0)
  const [draftHtml, setDraftHtml] = useState(baselineHtml)
  const [draftEmpty, setDraftEmpty] = useState(!baselineHtml)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [saveError, setSaveError] = useState<string | null>(null)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const lastSavedHtmlRef = useRef(baselineHtml)
  const savingRef = useRef(false)
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const savedIndicatorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setEditing(!entry)
    setDraftHtml(baselineHtml)
    setDraftEmpty(!baselineHtml)
    setSaveStatus('idle')
    setSaveError(null)
    setConfirmingDelete(false)
    lastSavedHtmlRef.current = baselineHtml
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current)
    if (savedIndicatorTimerRef.current) clearTimeout(savedIndicatorTimerRef.current)
    // Keyed on entry?.id (stable across content updates from our own
    // autosave) rather than the entry object itself — otherwise every
    // autosave-triggered re-fetch would reset editing back to view mode
    // mid-edit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateKey, entry?.id])

  useEffect(() => {
    const isDirty = editing && draftHtml !== lastSavedHtmlRef.current
    if (!isDirty) return

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [editing, draftHtml])

  async function performSave(html: string, { exitOnSuccess }: { exitOnSuccess: boolean }) {
    if (savingRef.current) return
    savingRef.current = true
    setSaveStatus('saving')
    setSaveError(null)
    try {
      // Only attempt to capture location on the save that first creates the
      // entry — never re-requested or overwritten on later edits.
      const location = entry ? undefined : await getCurrentLocation()
      const saved = await saveEntry(dateKey, html, location)
      lastSavedHtmlRef.current = html
      onSaved(saved)
      // Mirror to the DreamHost backup on explicit Save only — not every
      // autosave tick — so it doesn't get hit on every keystroke pause.
      if (exitOnSuccess) backupEntry(saved)
      setSaveStatus('saved')
      if (savedIndicatorTimerRef.current) clearTimeout(savedIndicatorTimerRef.current)
      savedIndicatorTimerRef.current = setTimeout(() => setSaveStatus('idle'), SAVED_INDICATOR_MS)
      if (exitOnSuccess) setEditing(false)
    } catch {
      setSaveStatus('error')
      setSaveError('Could not save your entry. Please try again.')
    } finally {
      savingRef.current = false
    }
  }

  // Autosave: only for entries that already exist, so a few stray
  // keystrokes on a blank day can't silently create a journal entry.
  useEffect(() => {
    if (!editing || !entry) return
    if (draftHtml === lastSavedHtmlRef.current) return

    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current)
    autosaveTimerRef.current = setTimeout(() => {
      performSave(draftHtml, { exitOnSuccess: false })
    }, AUTOSAVE_DELAY_MS)

    return () => {
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftHtml, editing, entry])

  useEffect(() => {
    return () => {
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current)
      if (savedIndicatorTimerRef.current) clearTimeout(savedIndicatorTimerRef.current)
    }
  }, [])

  if (loading) {
    return <p className="text-sm text-stone-400">Loading journal…</p>
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>
  }

  function handleSaveClick() {
    if (draftEmpty) return
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current)
    performSave(draftHtml, { exitOnSuccess: true })
  }

  function handleCancel() {
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current)
    setDraftHtml(baselineHtml)
    setDraftEmpty(!baselineHtml)
    setSaveStatus('idle')
    setSaveError(null)
    setEditing(false)
    setResetToken((t) => t + 1)
  }

  async function handleDelete() {
    if (!entry || deleting) return
    setDeleting(true)
    try {
      await deleteEntry(entry.id)
      backupDeleteEntry(dateKey)
      onDeleted()
    } catch {
      setSaveError('Could not delete this entry. Please try again.')
      setDeleting(false)
    }
  }

  const wordCount = countWords(draftHtml)
  const lat = entry?.location_lat
  const lng = entry?.location_lng

  return (
    <div>
      <h3 className="mb-1 font-serif text-lg text-stone-900">{formatLongDate(dateKey)}</h3>

      {(wordCount > 0 || (lat != null && lng != null)) && (
        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-400">
          {wordCount > 0 && (
            <span>
              {wordCount} {wordCount === 1 ? 'word' : 'words'} ·{' '}
              {estimateReadingMinutes(wordCount)} min read
            </span>
          )}
          {lat != null && lng != null && (
            <a
              href={mapUrl(lat, lng)}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-stone-600"
            >
              📍 {lat.toFixed(4)}, {lng.toFixed(4)}
            </a>
          )}
        </div>
      )}

      {editing ? (
        <div>
          <JournalEditor
            key={`edit-${dateKey}-${resetToken}`}
            content={baselineHtml}
            editable
            autoFocus
            placeholder="Write about your day…"
            onChange={(html, isEmpty) => {
              setDraftHtml(html)
              setDraftEmpty(isEmpty)
            }}
          />

          {saveError && <p className="mt-2 text-sm text-red-600">{saveError}</p>}

          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={handleSaveClick}
              disabled={saveStatus === 'saving' || draftEmpty}
              className="rounded-md bg-stone-900 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:opacity-50"
            >
              {saveStatus === 'saving' ? 'Saving…' : 'Save'}
            </button>
            {entry && (
              <button
                onClick={handleCancel}
                disabled={saveStatus === 'saving'}
                className="rounded-md px-4 py-1.5 text-sm text-stone-500 hover:bg-stone-100"
              >
                Cancel
              </button>
            )}
            {saveStatus === 'saved' && <span className="text-xs text-stone-400">Saved</span>}
          </div>
        </div>
      ) : entry ? (
        <div>
          <JournalEditor content={baselineHtml} editable={false} />

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
