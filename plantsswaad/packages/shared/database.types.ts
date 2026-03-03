export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          image_url: string | null
          description: string | null
          is_active: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          image_url?: string | null
          description?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          image_url?: string | null
          description?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
        }
        Relationships: []
      }

      menu_items: {
        Row: {
          id: string
          category_id: string
          name: string
          description: string | null
          price: number
          image_url: string | null
          is_available: boolean
          is_featured: boolean
          tags: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          category_id: string
          name: string
          description?: string | null
          price: number
          image_url?: string | null
          is_available?: boolean
          is_featured?: boolean
          tags?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          name?: string
          description?: string | null
          price?: number
          image_url?: string | null
          is_available?: boolean
          is_featured?: boolean
          tags?: string[] | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }

      orders: {
        Row: {
          id: string
          user_id: string
          items: Json
          total_amount: number
          status: string
          delivery_address: Json
          payment_status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          items: Json
          total_amount: number
          status?: string
          delivery_address: Json
          payment_status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          items?: Json
          total_amount?: number
          status?: string
          delivery_address?: Json
          payment_status?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }

      profiles: {
        Row: {
          id: string
          full_name: string | null
          phone: string | null
          address: string | null
          avatar_url: string | null
          role: 'customer' | 'chef' | 'sales' | 'delivery' | 'admin'
        }
        Insert: {
          id: string
          full_name?: string | null
          phone?: string | null
          address?: string | null
          avatar_url?: string | null
          role?: 'customer' | 'chef' | 'sales' | 'delivery' | 'admin'
        }
        Update: {
          id?: string
          full_name?: string | null
          phone?: string | null
          address?: string | null
          avatar_url?: string | null
          role?: 'customer' | 'chef' | 'sales' | 'delivery' | 'admin'
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
  }
}
