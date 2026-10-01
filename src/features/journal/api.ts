import { supabase } from '../../lib/supabase/client'
import type { JournalEntry } from '../../types'
import { toDateKey } from '../../utils/date'
import type { Coordinates } from './geolocation'

export class JournalApiError extends Error {}

function wrap(message: string): never {
  throw new JournalApiError(message)
}

/** Returns entries whose date falls within the month containing `monthDate`. */
export async function fetchEntriesForMonth(monthDate: Date): Promise<JournalEntry[]> {
  const start = toDateKey(new Date(monthDate.getFullYear(), monthDate.getMonth(), 1))
  const end = toDateKey(new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0))

  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .gte('date', start)
    .lte('date', end)

  if (error) wrap('Could not load journal entries for this month.')
  return data ?? []
}

export async function fetchEntryByDate(dateKey: string): Promise<JournalEntry | null> {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('date', dateKey)
    .maybeSingle()

  if (error) wrap('Could not load this journal entry.')
  return data
}

/**
 * `location` is only written on first create (see JournalEntryPanel) — it is
 * omitted from the payload on later saves so an existing entry's captured
 * location is never overwritten.
 */
export async function saveEntry(
  dateKey: string,
  content: string,
  location?: Coordinates | null,
): Promise<JournalEntry> {
  const { data, error } = await supabase
    .from('journal_entries')
    .upsert(
      {
        date: dateKey,
        content,
        ...(location ? { location_lat: location.lat, location_lng: location.lng } : {}),
      },
      { onConflict: 'date' },
    )
    .select('*')
    .single()

  if (error || !data) wrap('Could not save this journal entry.')
  return data
}

export async function deleteEntry(id: string): Promise<void> {
  const { error } = await supabase.from('journal_entries').delete().eq('id', id)
  if (error) wrap('Could not delete this journal entry.')
}
