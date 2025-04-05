export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activities: {
        Row: {
          description: string | null
          id: number
          image_proof: string | null
          timestamp: string
          title: string | null
          user_id: string | null
          village_id: string | null
        }
        Insert: {
          description?: string | null
          id?: number
          image_proof?: string | null
          timestamp?: string
          title?: string | null
          user_id?: string | null
          village_id?: string | null
        }
        Update: {
          description?: string | null
          id?: number
          image_proof?: string | null
          timestamp?: string
          title?: string | null
          user_id?: string | null
          village_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activities_village_id_fkey"
            columns: ["village_id"]
            isOneToOne: false
            referencedRelation: "village"
            referencedColumns: ["id"]
          },
        ]
      }
      user_goals: {
        Row: {
          created_at: string
          goal_id: string | null
          id: string
          last_updated: string | null
          progress: number | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          goal_id?: string | null
          id?: string
          last_updated?: string | null
          progress?: number | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          goal_id?: string | null
          id?: string
          last_updated?: string | null
          progress?: number | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_goals_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "village_goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_goals_village_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "village"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          id: string
          updated_at: string | null
          wallet_address: string
        }
        Insert: {
          created_at?: string
          id?: string
          updated_at?: string | null
          wallet_address: string
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string | null
          wallet_address?: string
        }
        Relationships: []
      }
      village_goals: {
        Row: {
          created_at: string
          goal_description: string | null
          goal_end_date: string | null
          goal_start_date: string | null
          goal_target: number | null
          id: string
          is_active: boolean | null
          village_id: string | null
        }
        Insert: {
          created_at?: string
          goal_description?: string | null
          goal_end_date?: string | null
          goal_start_date?: string | null
          goal_target?: number | null
          id?: string
          is_active?: boolean | null
          village_id?: string | null
        }
        Update: {
          created_at?: string
          goal_description?: string | null
          goal_end_date?: string | null
          goal_start_date?: string | null
          goal_target?: number | null
          id?: string
          is_active?: boolean | null
          village_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_village_id"
            columns: ["village_id"]
            isOneToOne: false
            referencedRelation: "village"
            referencedColumns: ["id"]
          },
        ]
      }
      village_members: {
        Row: {
          id: string
          joined_at: string | null
          role: string
          stake_amount: number | null
          user_id: string
          village_id: string
        }
        Insert: {
          id?: string
          joined_at?: string | null
          role?: string
          stake_amount?: number | null
          user_id?: string
          village_id: string
        }
        Update: {
          id?: string
          joined_at?: string | null
          role?: string
          stake_amount?: number | null
          user_id?: string
          village_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_village_id"
            columns: ["village_id"]
            isOneToOne: false
            referencedRelation: "village"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "village_members_village_id_fkey"
            columns: ["village_id"]
            isOneToOne: false
            referencedRelation: "village"
            referencedColumns: ["id"]
          },
        ]
      }
      village: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          end_date: string
          goal: string
          id: string
          invite_link: string | null
          name: string
          reward_type: string | null
          stake: number
          start_date: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date: string
          goal: string
          id?: string
          invite_link?: string | null
          name: string
          reward_type?: string | null
          stake?: number
          start_date: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string
          goal?: string
          id?: string
          invite_link?: string | null
          name?: string
          reward_type?: string | null
          stake?: number
          start_date?: string
        }
        Relationships: []
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
