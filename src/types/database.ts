// Hand-written to match supabase/migrations/20260930060129_initial_schema.sql.
// Regenerate from a live database once available:
//   supabase gen types typescript --local > src/types/database.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type PursuitStatusEnum = 'ACTIVE' | 'ACHIEVED' | 'FAILED' | 'SKIPPED' | 'PASSED'

export interface Database {
  public: {
    Tables: {
      journal_entries: {
        Row: {
          id: string
          date: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          date: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          date?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      pursuits: {
        Row: {
          id: string
          title: string
          description: string | null
          status: PursuitStatusEnum
          started_at: string
          ended_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          status?: PursuitStatusEnum
          started_at?: string
          ended_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          status?: PursuitStatusEnum
          started_at?: string
          ended_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      pursuit_status_history: {
        Row: {
          id: string
          pursuit_id: string
          status: PursuitStatusEnum
          note: string | null
          created_at: string
        }
        Insert: {
          id?: string
          pursuit_id: string
          status: PursuitStatusEnum
          note?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          pursuit_id?: string
          status?: PursuitStatusEnum
          note?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'pursuit_status_history_pursuit_id_fkey'
            columns: ['pursuit_id']
            isOneToOne: false
            referencedRelation: 'pursuits'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      pursuit_status: PursuitStatusEnum
    }
    CompositeTypes: Record<string, never>
  }
}
