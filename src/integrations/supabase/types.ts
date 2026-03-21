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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_logs: {
        Row: {
          action: string
          changed_by: string | null
          created_at: string
          id: string
          new_value: Json | null
          old_value: Json | null
        }
        Insert: {
          action: string
          changed_by?: string | null
          created_at?: string
          id?: string
          new_value?: Json | null
          old_value?: Json | null
        }
        Update: {
          action?: string
          changed_by?: string | null
          created_at?: string
          id?: string
          new_value?: Json | null
          old_value?: Json | null
        }
        Relationships: []
      }
      agent_config: {
        Row: {
          config: Json
          created_at: string
          id: string
        }
        Insert: {
          config?: Json
          created_at?: string
          id?: string
        }
        Update: {
          config?: Json
          created_at?: string
          id?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          availability_preference: string | null
          cargo: string | null
          company: string | null
          context: string
          created_at: string
          crm: string | null
          equipo_comercial: string | null
          fbclid: string | null
          flag: string | null
          full_url: string | null
          hubspot_contact_id: string | null
          hubspot_sync_error: string | null
          hubspot_sync_status: string | null
          id: string
          meeting_booked: boolean | null
          meeting_date: string | null
          meeting_time: string | null
          messages: Json
          problema_principal: string | null
          referrer: string | null
          rubro: string | null
          scheduled: boolean
          scheduled_at: string | null
          score: number | null
          score_breakdown: Json | null
          status: string | null
          summary: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          visitor_email: string | null
          visitor_name: string | null
        }
        Insert: {
          availability_preference?: string | null
          cargo?: string | null
          company?: string | null
          context?: string
          created_at?: string
          crm?: string | null
          equipo_comercial?: string | null
          fbclid?: string | null
          flag?: string | null
          full_url?: string | null
          hubspot_contact_id?: string | null
          hubspot_sync_error?: string | null
          hubspot_sync_status?: string | null
          id?: string
          meeting_booked?: boolean | null
          meeting_date?: string | null
          meeting_time?: string | null
          messages?: Json
          problema_principal?: string | null
          referrer?: string | null
          rubro?: string | null
          scheduled?: boolean
          scheduled_at?: string | null
          score?: number | null
          score_breakdown?: Json | null
          status?: string | null
          summary?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          visitor_email?: string | null
          visitor_name?: string | null
        }
        Update: {
          availability_preference?: string | null
          cargo?: string | null
          company?: string | null
          context?: string
          created_at?: string
          crm?: string | null
          equipo_comercial?: string | null
          fbclid?: string | null
          flag?: string | null
          full_url?: string | null
          hubspot_contact_id?: string | null
          hubspot_sync_error?: string | null
          hubspot_sync_status?: string | null
          id?: string
          meeting_booked?: boolean | null
          meeting_date?: string | null
          meeting_time?: string | null
          messages?: Json
          problema_principal?: string | null
          referrer?: string | null
          rubro?: string | null
          scheduled?: boolean
          scheduled_at?: string | null
          score?: number | null
          score_breakdown?: Json | null
          status?: string | null
          summary?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          visitor_email?: string | null
          visitor_name?: string | null
        }
        Relationships: []
      }
      conversions: {
        Row: {
          contact_email: string
          contact_id_hubspot: string | null
          conversation_id: string | null
          conversion_type: string
          converted_at: string
          created_at: string
          fbclid: string | null
          full_url: string | null
          id: string
          referrer: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          contact_email: string
          contact_id_hubspot?: string | null
          conversation_id?: string | null
          conversion_type?: string
          converted_at?: string
          created_at?: string
          fbclid?: string | null
          full_url?: string | null
          id?: string
          referrer?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          contact_email?: string
          contact_id_hubspot?: string | null
          conversation_id?: string | null
          conversion_type?: string
          converted_at?: string
          created_at?: string
          fbclid?: string | null
          full_url?: string | null
          id?: string
          referrer?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversions_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      cta_styles: {
        Row: {
          created_at: string
          id: string
          label: string
          sort_order: number
          style_key: string
          styles: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          sort_order?: number
          style_key: string
          styles?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          sort_order?: number
          style_key?: string
          styles?: Json
          updated_at?: string
        }
        Relationships: []
      }
      knowledge_base: {
        Row: {
          category: string
          content: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          category?: string
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          company_name: string
          created_at: string
          email: string
          first_name: string
          has_crm: string
          id: string
          industry: string
          is_qualified: boolean
          job_title: string
          last_name: string
          lead_score: number | null
          main_pain: string | null
          phone: string | null
          source_page: string | null
          team_size: string
        }
        Insert: {
          company_name: string
          created_at?: string
          email: string
          first_name: string
          has_crm: string
          id?: string
          industry: string
          is_qualified?: boolean
          job_title: string
          last_name: string
          lead_score?: number | null
          main_pain?: string | null
          phone?: string | null
          source_page?: string | null
          team_size: string
        }
        Update: {
          company_name?: string
          created_at?: string
          email?: string
          first_name?: string
          has_crm?: string
          id?: string
          industry?: string
          is_qualified?: boolean
          job_title?: string
          last_name?: string
          lead_score?: number | null
          main_pain?: string | null
          phone?: string | null
          source_page?: string | null
          team_size?: string
        }
        Relationships: []
      }
      media_library: {
        Row: {
          alt_text: string | null
          created_at: string
          file_name: string
          file_size: number | null
          file_type: string
          file_url: string
          id: string
          uploaded_by: string | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          file_name: string
          file_size?: number | null
          file_type?: string
          file_url: string
          id?: string
          uploaded_by?: string | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          file_name?: string
          file_size?: number | null
          file_type?: string
          file_url?: string
          id?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      page_sections: {
        Row: {
          background_image_url: string | null
          body: string | null
          created_at: string
          cta_text: string | null
          cta_url: string | null
          id: string
          image_url: string | null
          is_visible: boolean
          metadata: Json | null
          page_id: string
          section_key: string
          sort_order: number
          subtitle: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          background_image_url?: string | null
          body?: string | null
          created_at?: string
          cta_text?: string | null
          cta_url?: string | null
          id?: string
          image_url?: string | null
          is_visible?: boolean
          metadata?: Json | null
          page_id: string
          section_key: string
          sort_order?: number
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          background_image_url?: string | null
          body?: string | null
          created_at?: string
          cta_text?: string | null
          cta_url?: string | null
          id?: string
          image_url?: string | null
          is_visible?: boolean
          metadata?: Json | null
          page_id?: string
          section_key?: string
          sort_order?: number
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "page_sections_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "site_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      scoring_config: {
        Row: {
          created_at: string
          created_by: string | null
          criteria: Json
          id: string
          thresholds: Json
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          criteria?: Json
          id?: string
          thresholds?: Json
        }
        Update: {
          created_at?: string
          created_by?: string | null
          criteria?: Json
          id?: string
          thresholds?: Json
        }
        Relationships: []
      }
      site_pages: {
        Row: {
          created_at: string
          id: string
          is_published: boolean
          meta_description: string | null
          slug: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_published?: boolean
          meta_description?: string | null
          slug: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_published?: boolean
          meta_description?: string | null
          slug?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_styles: {
        Row: {
          category: string
          created_at: string
          id: string
          label: string
          style_key: string
          style_type: string
          updated_at: string
          value: string
        }
        Insert: {
          category?: string
          created_at?: string
          id?: string
          label: string
          style_key: string
          style_type?: string
          updated_at?: string
          value: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          label?: string
          style_key?: string
          style_type?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "editor" | "user"
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
      app_role: ["admin", "editor", "user"],
    },
  },
} as const
