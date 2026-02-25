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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      articles: {
        Row: {
          author: string | null
          category: string
          content_en: string | null
          content_zh: string | null
          created_at: string
          excerpt_en: string | null
          excerpt_zh: string | null
          featured_image: string | null
          id: string
          published: boolean | null
          published_at: string | null
          read_time: number | null
          slug: string
          tags: string[] | null
          title_en: string
          title_zh: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          category: string
          content_en?: string | null
          content_zh?: string | null
          created_at?: string
          excerpt_en?: string | null
          excerpt_zh?: string | null
          featured_image?: string | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          read_time?: number | null
          slug: string
          tags?: string[] | null
          title_en: string
          title_zh: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          category?: string
          content_en?: string | null
          content_zh?: string | null
          created_at?: string
          excerpt_en?: string | null
          excerpt_zh?: string | null
          featured_image?: string | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          read_time?: number | null
          slug?: string
          tags?: string[] | null
          title_en?: string
          title_zh?: string
          updated_at?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          bed_count: number | null
          city: string | null
          created_at: string
          description_en: string | null
          description_zh: string | null
          devices: Json[] | null
          hospital_type: string | null
          id: string
          image_url: string | null
          name_en: string
          name_zh: string
          province: string
          published: boolean | null
          slug: string
          updated_at: string
          year: number | null
        }
        Insert: {
          bed_count?: number | null
          city?: string | null
          created_at?: string
          description_en?: string | null
          description_zh?: string | null
          devices?: Json[] | null
          hospital_type?: string | null
          id?: string
          image_url?: string | null
          name_en: string
          name_zh: string
          province: string
          published?: boolean | null
          slug: string
          updated_at?: string
          year?: number | null
        }
        Update: {
          bed_count?: number | null
          city?: string | null
          created_at?: string
          description_en?: string | null
          description_zh?: string | null
          devices?: Json[] | null
          hospital_type?: string | null
          id?: string
          image_url?: string | null
          name_en?: string
          name_zh?: string
          province?: string
          published?: boolean | null
          slug?: string
          updated_at?: string
          year?: number | null
        }
        Relationships: []
      }
      devices: {
        Row: {
          applications_en: string[] | null
          applications_zh: string[] | null
          certifications: string[] | null
          created_at: string
          description_en: string | null
          description_zh: string | null
          features_en: string[] | null
          features_zh: string[] | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          manufacturer_id: string | null
          name_en: string
          name_zh: string
          price_range: string | null
          published: boolean | null
          release_year: number | null
          slug: string
          specifications: Json | null
          type: string
          updated_at: string
        }
        Insert: {
          applications_en?: string[] | null
          applications_zh?: string[] | null
          certifications?: string[] | null
          created_at?: string
          description_en?: string | null
          description_zh?: string | null
          features_en?: string[] | null
          features_zh?: string[] | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          manufacturer_id?: string | null
          name_en: string
          name_zh: string
          price_range?: string | null
          published?: boolean | null
          release_year?: number | null
          slug: string
          specifications?: Json | null
          type: string
          updated_at?: string
        }
        Update: {
          applications_en?: string[] | null
          applications_zh?: string[] | null
          certifications?: string[] | null
          created_at?: string
          description_en?: string | null
          description_zh?: string | null
          features_en?: string[] | null
          features_zh?: string[] | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          manufacturer_id?: string | null
          name_en?: string
          name_zh?: string
          price_range?: string | null
          published?: boolean | null
          release_year?: number | null
          slug?: string
          specifications?: Json | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_devices_manufacturer"
            columns: ["manufacturer_id"]
            isOneToOne: false
            referencedRelation: "manufacturers"
            referencedColumns: ["id"]
          },
        ]
      }
      manufacturers: {
        Row: {
          category: string[] | null
          country: string
          created_at: string
          description_en: string | null
          description_zh: string | null
          founded_year: number | null
          headquarters: string | null
          id: string
          is_featured: boolean | null
          logo_url: string | null
          market_share: number | null
          name_en: string
          name_zh: string
          published: boolean | null
          slug: string
          updated_at: string
          website: string | null
        }
        Insert: {
          category?: string[] | null
          country: string
          created_at?: string
          description_en?: string | null
          description_zh?: string | null
          founded_year?: number | null
          headquarters?: string | null
          id?: string
          is_featured?: boolean | null
          logo_url?: string | null
          market_share?: number | null
          name_en: string
          name_zh: string
          published?: boolean | null
          slug: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          category?: string[] | null
          country?: string
          created_at?: string
          description_en?: string | null
          description_zh?: string | null
          founded_year?: number | null
          headquarters?: string | null
          id?: string
          is_featured?: boolean | null
          logo_url?: string | null
          market_share?: number | null
          name_en?: string
          name_zh?: string
          published?: boolean | null
          slug?: string
          updated_at?: string
          website?: string | null
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
    Enums: {},
  },
} as const
