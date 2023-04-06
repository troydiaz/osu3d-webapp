export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      machine_defs: {
        Row: {
          created_at: string | null
          id: string
          make: string | null
          model: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          make?: string | null
          model?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          make?: string | null
          model?: string | null
        }
      }
      machines: {
        Row: {
          created_at: string | null
          id: string
          machine_defs_id: string
          nickname: string
          tier: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          machine_defs_id: string
          nickname?: string
          tier?: number
        }
        Update: {
          created_at?: string | null
          id?: string
          machine_defs_id?: string
          nickname?: string
          tier?: number
        }
      }
      print_log: {
        Row: {
          created_at: string
          done_at: string
          id: string
          machine_id: string
          owner_id: string
        }
        Insert: {
          created_at?: string
          done_at: string
          id?: string
          machine_id: string
          owner_id: string
        }
        Update: {
          created_at?: string
          done_at?: string
          id?: string
          machine_id?: string
          owner_id?: string
        }
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
