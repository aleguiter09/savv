export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "11.2.0 (c820efb)"
  }
  public: {
    Tables: {
      account: {
        Row: {
          balance: number
          created_at: string
          id: number
          is_default: boolean
          name: string
          user_id: string | null
        }
        Insert: {
          balance?: number
          created_at?: string
          id?: number
          is_default?: boolean
          name?: string
          user_id?: string | null
        }
        Update: {
          balance?: number
          created_at?: string
          id?: number
          is_default?: boolean
          name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      category: {
        Row: {
          color: Database["public"]["Enums"]["categoryColors"]
          created_at: string
          icon: string | null
          id: number
          parent_id: number | null
          title: string
          user_id: string | null
        }
        Insert: {
          color?: Database["public"]["Enums"]["categoryColors"]
          created_at?: string
          icon?: string | null
          id?: number
          parent_id?: number | null
          title: string
          user_id?: string | null
        }
        Update: {
          color?: Database["public"]["Enums"]["categoryColors"]
          created_at?: string
          icon?: string | null
          id?: number
          parent_id?: number | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "category_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "category"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "category_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "effective_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      movement: {
        Row: {
          amount: number
          applied: boolean
          balance_after: number | null
          category: number | null
          created_at: string
          description: string
          done_at: string
          from: number
          id: number
          type: Database["public"]["Enums"]["movementType"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          applied?: boolean
          balance_after?: number | null
          category?: number | null
          created_at?: string
          description: string
          done_at?: string
          from: number
          id?: number
          type: Database["public"]["Enums"]["movementType"]
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          amount?: number
          applied?: boolean
          balance_after?: number | null
          category?: number | null
          created_at?: string
          description?: string
          done_at?: string
          from?: number
          id?: number
          type?: Database["public"]["Enums"]["movementType"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "movement_category_fkey"
            columns: ["category"]
            isOneToOne: false
            referencedRelation: "category"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movement_category_fkey"
            columns: ["category"]
            isOneToOne: false
            referencedRelation: "effective_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movement_from_fkey"
            columns: ["from"]
            isOneToOne: false
            referencedRelation: "account"
            referencedColumns: ["id"]
          },
        ]
      }
      user_category: {
        Row: {
          category_id: number
          created_at: string
          custom_color: Database["public"]["Enums"]["categoryColors"] | null
          custom_icon: string | null
          custom_name: string | null
          id: number
          is_hidden: boolean | null
          user_id: string
        }
        Insert: {
          category_id: number
          created_at?: string
          custom_color?: Database["public"]["Enums"]["categoryColors"] | null
          custom_icon?: string | null
          custom_name?: string | null
          id?: number
          is_hidden?: boolean | null
          user_id?: string
        }
        Update: {
          category_id?: number
          created_at?: string
          custom_color?: Database["public"]["Enums"]["categoryColors"] | null
          custom_icon?: string | null
          custom_name?: string | null
          id?: number
          is_hidden?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_category_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "category"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_category_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "effective_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          id: number
          language: string
          user_id: string
        }
        Insert: {
          id?: number
          language?: string
          user_id: string
        }
        Update: {
          id?: number
          language?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      effective_categories: {
        Row: {
          color: Database["public"]["Enums"]["categoryColors"] | null
          icon: string | null
          id: number | null
          is_custom_name: boolean | null
          is_global: boolean | null
          is_hidden: boolean | null
          parent_id: number | null
          title: string | null
        }
        Relationships: [
          {
            foreignKeyName: "category_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "category"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "category_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "effective_categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      delete_movement_with_balance: {
        Args: { p_movement_id: number }
        Returns: undefined
      }
      finish: { Args: never; Returns: string[] }
      get_accounts_balance_at: {
        Args: { target_date: string }
        Returns: {
          balance: number
          from: number
        }[]
      }
      get_balance_timeline:
        | {
            Args: { bucket: string; from_date: string; to_date: string }
            Returns: {
              balance: number
              bucket_date: string
            }[]
          }
        | {
            Args: {
              account_filter?: number
              bucket: string
              from_date: string
              to_date: string
            }
            Returns: {
              balance: number
              bucket_date: string
            }[]
          }
      pass: { Args: { "": string }; Returns: string }
      recalculate_balance_after_for_account: {
        Args: { p_account_id: number; p_user_id: string }
        Returns: undefined
      }
      save_movement_with_balance: {
        Args: {
          p_amount: number
          p_category?: number
          p_description: string
          p_done_at: string
          p_from: number
          p_movement_id: number
          p_type: Database["public"]["Enums"]["movementType"]
          p_where?: number
        }
        Returns: number
      }
    }
    Enums: {
      categoryColors:
        | "amber"
        | "blue"
        | "cyan"
        | "fuchsia"
        | "gray"
        | "green"
        | "indigo"
        | "orange"
        | "pink"
        | "red"
        | "rose"
        | "sky"
        | "teal"
        | "violet"
        | "yellow"
      language: "es" | "en"
      movementType: "expense" | "transfer" | "income"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      categoryColors: [
        "amber",
        "blue",
        "cyan",
        "fuchsia",
        "gray",
        "green",
        "indigo",
        "orange",
        "pink",
        "red",
        "rose",
        "sky",
        "teal",
        "violet",
        "yellow",
      ],
      language: ["es", "en"],
      movementType: ["expense", "transfer", "income"],
    },
  },
} as const
