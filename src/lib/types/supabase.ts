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
      fault_log: {
        Row: {
          created_at: string
          created_by_id: string
          description: string
          id: string
          machine_id: string
          resolved: boolean
          resolved_at: string | null
          resolved_by_id: string | null
        }
        Insert: {
          created_at?: string
          created_by_id: string
          description?: string
          id?: string
          machine_id: string
          resolved?: boolean
          resolved_at?: string | null
          resolved_by_id?: string | null
        }
        Update: {
          created_at?: string
          created_by_id?: string
          description?: string
          id?: string
          machine_id?: string
          resolved?: boolean
          resolved_at?: string | null
          resolved_by_id?: string | null
        }
      }
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
          cancelled: boolean
          cancelled_at: string | null
          cancelled_by_id: string | null
          created_at: string
          created_by_id: string
          done_at: string
          filament: number
          id: string
          machine_id: string
        }
        Insert: {
          cancelled?: boolean
          cancelled_at?: string | null
          cancelled_by_id?: string | null
          created_at?: string
          created_by_id: string
          done_at: string
          filament?: number
          id?: string
          machine_id: string
        }
        Update: {
          cancelled?: boolean
          cancelled_at?: string | null
          cancelled_by_id?: string | null
          created_at?: string
          created_by_id?: string
          done_at?: string
          filament?: number
          id?: string
          machine_id?: string
        }
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
          website?: string | null
        }
      }
      user_levels: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          level: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          level?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          level?: number
          updated_at?: string | null
          user_id?: string
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
