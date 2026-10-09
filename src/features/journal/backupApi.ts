import type { JournalEntry } from '../../types'
import { extractFirstImageSrc } from './editor/content'

const BACKUP_API_URL = import.meta.env.VITE_BACKUP_API_URL
const BACKUP_API_TOKEN = import.meta.env.VITE_BACKUP_API_TOKEN

/**
 * Best-effort mirror of a saved entry to the DreamHost backup API. Fires on
 * explicit Save only (not every autosave tick) and never throws or blocks
 * the primary Supabase save — if the backup host is slow, unreachable, or
 * unconfigured (no env vars set), this quietly no-ops.
 */
export function backupEntry(entry: JournalEntry): void {
  if (!BACKUP_API_URL || !BACKUP_API_TOKEN) return

  fetch(`${BACKUP_API_URL}/api/entries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${BACKUP_API_TOKEN}`,
    },
    body: JSON.stringify({
      date: entry.date,
      content: entry.content,
      location_lat: entry.location_lat,
      location_lng: entry.location_lng,
      image_url: extractFirstImageSrc(entry.content),
    }),
  }).catch(() => {
    // Backup is best-effort; failures here must never surface to the user.
  })
}

/** Mirrors a delete. The backup API soft-deletes, so this never destroys data. */
export function backupDeleteEntry(dateKey: string): void {
  if (!BACKUP_API_URL || !BACKUP_API_TOKEN) return

  fetch(`${BACKUP_API_URL}/api/entries/${dateKey}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${BACKUP_API_TOKEN}` },
  }).catch(() => {})
}
