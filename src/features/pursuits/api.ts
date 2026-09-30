import { supabase } from '../../lib/supabase/client'
import type { Pursuit, PursuitStatus, PursuitStatusHistory } from '../../types'
import { todayKey } from '../../utils/date'

export class PursuitsApiError extends Error {}

function wrap(message: string): never {
  throw new PursuitsApiError(message)
}

export async function fetchActivePursuits(): Promise<Pursuit[]> {
  const { data, error } = await supabase
    .from('pursuits')
    .select('*')
    .eq('status', 'ACTIVE')
    .order('started_at', { ascending: false })

  if (error) wrap('Could not load current pursuits.')
  return data ?? []
}

export async function fetchHistoryPursuits(statusFilter?: PursuitStatus): Promise<Pursuit[]> {
  let query = supabase.from('pursuits').select('*').neq('status', 'ACTIVE')

  if (statusFilter) {
    query = supabase.from('pursuits').select('*').eq('status', statusFilter)
  }

  const { data, error } = await query.order('updated_at', { ascending: false })

  if (error) wrap('Could not load pursuit history.')
  return data ?? []
}

export async function fetchPursuit(id: string): Promise<Pursuit | null> {
  const { data, error } = await supabase.from('pursuits').select('*').eq('id', id).maybeSingle()
  if (error) wrap('Could not load this pursuit.')
  return data
}

export async function fetchPursuitStatusHistory(
  pursuitId: string,
): Promise<PursuitStatusHistory[]> {
  const { data, error } = await supabase
    .from('pursuit_status_history')
    .select('*')
    .eq('pursuit_id', pursuitId)
    .order('created_at', { ascending: true })

  if (error) wrap('Could not load status history.')
  return data ?? []
}

export async function createPursuit(input: {
  title: string
  description: string
  startedAt: string
  deadlineAt: string | null
}): Promise<Pursuit> {
  const { data: pursuit, error } = await supabase
    .from('pursuits')
    .insert({
      title: input.title,
      description: input.description || null,
      started_at: input.startedAt,
      deadline_at: input.deadlineAt,
      status: 'ACTIVE',
    })
    .select('*')
    .single()

  if (error || !pursuit) wrap('Could not create this pursuit.')

  const { error: historyError } = await supabase
    .from('pursuit_status_history')
    .insert({ pursuit_id: pursuit.id, status: 'ACTIVE', note: null })

  if (historyError) wrap('Pursuit was created, but its history could not be recorded.')

  return pursuit
}

export async function updatePursuitDetails(
  id: string,
  input: { title: string; description: string; deadlineAt: string | null },
): Promise<Pursuit> {
  const { data, error } = await supabase
    .from('pursuits')
    .update({
      title: input.title,
      description: input.description || null,
      deadline_at: input.deadlineAt,
    })
    .eq('id', id)
    .select('*')
    .single()

  if (error || !data) wrap('Could not update this pursuit.')
  return data
}

export async function changePursuitStatus(
  id: string,
  status: PursuitStatus,
  note: string,
): Promise<Pursuit> {
  const { error: historyError } = await supabase
    .from('pursuit_status_history')
    .insert({ pursuit_id: id, status, note: note || null })

  if (historyError) wrap('Could not record this status change.')

  const { data, error } = await supabase
    .from('pursuits')
    .update({ status, ended_at: status === 'ACTIVE' ? null : todayKey() })
    .eq('id', id)
    .select('*')
    .single()

  if (error || !data) wrap('Status history was recorded, but the pursuit could not be updated.')
  return data
}
