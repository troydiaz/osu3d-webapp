export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      inv_categories: {
        Row: {
          created_at: string
          created_by_user_id: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          created_by_user_id: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          created_by_user_id?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "inv_categories_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          }
        ]
      }
      inv_changes: {
        Row: {
          amount: number
          created_at: string
          created_by_user_id: string
          id: string
          inv_item_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          created_by_user_id: string
          id?: string
          inv_item_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          created_by_user_id?: string
          id?: string
          inv_item_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inv_changes_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "inv_changes_inv_item_id_fkey"
            columns: ["inv_item_id"]
            referencedRelation: "inv_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inv_changes_inv_item_id_fkey"
            columns: ["inv_item_id"]
            referencedRelation: "inv_items_view"
            referencedColumns: ["id"]
          }
        ]
      }
      inv_items: {
        Row: {
          created_at: string
          created_by_user_id: string
          id: string
          inv_category_id: string
          minimum: number
          name: string
        }
        Insert: {
          created_at?: string
          created_by_user_id: string
          id?: string
          inv_category_id: string
          minimum: number
          name: string
        }
        Update: {
          created_at?: string
          created_by_user_id?: string
          id?: string
          inv_category_id?: string
          minimum?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "inv_items_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "inv_items_inv_category_id_fkey"
            columns: ["inv_category_id"]
            referencedRelation: "inv_categories"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: []
      }
      machine_events: {
        Row: {
          created_at: string
          created_by_user_id: string
          description: string | null
          event_type: Database["public"]["Enums"]["event_type"]
          id: string
          machine_id: string
          print_id: string | null
          resolved: boolean
          resolved_at: string | null
          resolved_by_user_id: string | null
        }
        Insert: {
          created_at?: string
          created_by_user_id: string
          description?: string | null
          event_type: Database["public"]["Enums"]["event_type"]
          id?: string
          machine_id: string
          print_id?: string | null
          resolved?: boolean
          resolved_at?: string | null
          resolved_by_user_id?: string | null
        }
        Update: {
          created_at?: string
          created_by_user_id?: string
          description?: string | null
          event_type?: Database["public"]["Enums"]["event_type"]
          id?: string
          machine_id?: string
          print_id?: string | null
          resolved?: boolean
          resolved_at?: string | null
          resolved_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "machine_events_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "machine_events_machine_id_fkey"
            columns: ["machine_id"]
            referencedRelation: "machines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "machine_events_machine_id_fkey"
            columns: ["machine_id"]
            referencedRelation: "machines_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "machine_events_print_id_fkey"
            columns: ["print_id"]
            referencedRelation: "prints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "machine_events_print_id_fkey"
            columns: ["print_id"]
            referencedRelation: "prints_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "machine_events_resolved_by_user_id_fkey"
            columns: ["resolved_by_user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "machines_machine_defs_id_fkey"
            columns: ["machine_defs_id"]
            referencedRelation: "machine_defs"
            referencedColumns: ["id"]
          }
        ]
      }
      prints: {
        Row: {
          created_at: string
          created_by_user_id: string
          done_at: string
          filament: number
          id: string
          machine_id: string
        }
        Insert: {
          created_at?: string
          created_by_user_id: string
          done_at: string
          filament?: number
          id?: string
          machine_id: string
        }
        Update: {
          created_at?: string
          created_by_user_id?: string
          done_at?: string
          filament?: number
          id?: string
          machine_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prints_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "prints_machine_id_fkey"
            columns: ["machine_id"]
            referencedRelation: "machines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prints_machine_id_fkey"
            columns: ["machine_id"]
            referencedRelation: "machines_view"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          created_at: string
          discord: string | null
          email: string | null
          full_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          discord?: string | null
          email?: string | null
          full_name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          discord?: string | null
          email?: string | null
          full_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "user_levels_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      inv_changes_view: {
        Row: {
          amount: number | null
          created_at: string | null
          created_by_user_id: string | null
          id: string | null
          inv_item_id: string | null
          running_total: number | null
        }
        Relationships: [
          {
            foreignKeyName: "inv_changes_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "inv_changes_inv_item_id_fkey"
            columns: ["inv_item_id"]
            referencedRelation: "inv_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inv_changes_inv_item_id_fkey"
            columns: ["inv_item_id"]
            referencedRelation: "inv_items_view"
            referencedColumns: ["id"]
          }
        ]
      }
      inv_items_view: {
        Row: {
          created_at: string | null
          created_by_user_id: string | null
          current_stock: number | null
          id: string | null
          inv_category_id: string | null
          minimum: number | null
          name: string | null
        }
        Insert: {
          created_at?: string | null
          created_by_user_id?: string | null
          current_stock?: never
          id?: string | null
          inv_category_id?: string | null
          minimum?: number | null
          name?: string | null
        }
        Update: {
          created_at?: string | null
          created_by_user_id?: string | null
          current_stock?: never
          id?: string | null
          inv_category_id?: string | null
          minimum?: number | null
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inv_items_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "inv_items_inv_category_id_fkey"
            columns: ["inv_category_id"]
            referencedRelation: "inv_categories"
            referencedColumns: ["id"]
          }
        ]
      }
      machines_view: {
        Row: {
          created_at: string | null
          id: string | null
          machine_defs_id: string | null
          nickname: string | null
          status: Database["public"]["Enums"]["machine_status"] | null
          tier: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string | null
          machine_defs_id?: string | null
          nickname?: string | null
          status?: never
          tier?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string | null
          machine_defs_id?: string | null
          nickname?: string | null
          status?: never
          tier?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "machines_machine_defs_id_fkey"
            columns: ["machine_defs_id"]
            referencedRelation: "machine_defs"
            referencedColumns: ["id"]
          }
        ]
      }
      prints_view: {
        Row: {
          created_at: string | null
          created_by_user_id: string | null
          done_at: string | null
          filament: number | null
          id: string | null
          machine_id: string | null
          status: Database["public"]["Enums"]["print_status"] | null
        }
        Insert: {
          created_at?: string | null
          created_by_user_id?: string | null
          done_at?: string | null
          filament?: number | null
          id?: string | null
          machine_id?: string | null
          status?: never
        }
        Update: {
          created_at?: string | null
          created_by_user_id?: string | null
          done_at?: string | null
          filament?: number | null
          id?: string | null
          machine_id?: string | null
          status?: never
        }
        Relationships: [
          {
            foreignKeyName: "prints_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "prints_machine_id_fkey"
            columns: ["machine_id"]
            referencedRelation: "machines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prints_machine_id_fkey"
            columns: ["machine_id"]
            referencedRelation: "machines_view"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Functions: {
      get_machine_status: {
        Args: {
          machine_id: string
        }
        Returns: Database["public"]["Enums"]["machine_status"]
      }
      get_perms: {
        Args: {
          user_id: string
        }
        Returns: Json
      }
      get_print_status: {
        Args: {
          print_id: string
        }
        Returns: Database["public"]["Enums"]["print_status"]
      }
      has_perm:
        | {
            Args: {
              user_id: string
              bit_index: number
            }
            Returns: boolean
          }
        | {
            Args: {
              user_id: string
              perm_name: string
            }
            Returns: boolean
          }
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      set_perm: {
        Args: {
          user_id: string
          bit_index: number
          value: boolean
        }
        Returns: boolean
      }
    }
    Enums: {
      event_type: "STOP" | "FAULT"
      machine_status: "IDLE" | "WORKING" | "FAULT"
      print_status: "WORKING" | "SUCCESS" | "CANCELED" | "FAULT"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "buckets_owner_fkey"
            columns: ["owner"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: unknown
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

