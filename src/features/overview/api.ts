import { supabase } from '../../lib/supabase/client'
import { addDays, todayKey, toDateKey } from '../../utils/date'

export class OverviewApiError extends Error {}

function wrap(message: string): never {
  throw new OverviewApiError(message)
}

export async function fetchJournalDatesForMonth(monthDate: Date): Promise<Set<string>> {
  const start = toDateKey(new Date(monthDate.getFullYear(), monthDate.getMonth(), 1))
  const end = toDateKey(new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0))

  const { data, error } = await supabase
    .from('journal_entries')
    .select('date')
    .gte('date', start)
    .lte('date', end)

  if (error) wrap('Could not load journal activity for this month.')
  return new Set((data ?? []).map((row) => row.date))
}

export async function fetchActivePursuitCount(): Promise<number> {
  const { count, error } = await supabase
    .from('pursuits')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'ACTIVE')

  if (error) wrap('Could not load active pursuits.')
  return count ?? 0
}

/** Consecutive days with a journal entry, ending today or yesterday. */
export async function fetchCurrentStreak(): Promise<number> {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('date')
    .lte('date', todayKey())
    .order('date', { ascending: false })
    .limit(400)

  if (error) wrap('Could not compute journaling streak.')

  const dates = new Set((data ?? []).map((row) => row.date))

  let cursor = new Date()
  if (!dates.has(toDateKey(cursor))) {
    cursor = addDays(cursor, -1)
    if (!dates.has(toDateKey(cursor))) return 0
  }

  let streak = 0
  while (dates.has(toDateKey(cursor))) {
    streak++
    cursor = addDays(cursor, -1)
  }
  return streak
}
