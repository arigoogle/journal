import type { Database } from './database'

export type JournalEntry = Database['public']['Tables']['journal_entries']['Row']
export type JournalEntryInsert = Database['public']['Tables']['journal_entries']['Insert']
export type JournalEntryUpdate = Database['public']['Tables']['journal_entries']['Update']

export type Pursuit = Database['public']['Tables']['pursuits']['Row']
export type PursuitInsert = Database['public']['Tables']['pursuits']['Insert']
export type PursuitUpdate = Database['public']['Tables']['pursuits']['Update']

export type PursuitStatusHistory = Database['public']['Tables']['pursuit_status_history']['Row']
export type PursuitStatusHistoryInsert =
  Database['public']['Tables']['pursuit_status_history']['Insert']

export type PursuitStatus = Database['public']['Enums']['pursuit_status']

export const PURSUIT_STATUSES: PursuitStatus[] = [
  'ACTIVE',
  'ACHIEVED',
  'FAILED',
  'SKIPPED',
  'PASSED',
]

export const ACTIVE_STATUS: PursuitStatus = 'ACTIVE'

export const INACTIVE_STATUSES: PursuitStatus[] = ['ACHIEVED', 'FAILED', 'SKIPPED', 'PASSED']
