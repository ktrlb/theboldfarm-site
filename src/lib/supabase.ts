import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a mock client if Supabase credentials aren't available
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      goats: {
        Row: {
          id: number
          name: string
          type: string
          birth_date: string | null
          birth_type: 'exact' | 'year'
          price: number
          registered: boolean
          horn_status: string
          dam: string | null
          sire: string | null
          bio: string
          status: string
          photos: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          type: string
          birth_date?: string | null
          birth_type: 'exact' | 'year'
          price: number
          registered: boolean
          horn_status: string
          dam?: string | null
          sire?: string | null
          bio: string
          status?: string
          photos?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          type?: string
          birth_date?: string | null
          birth_type?: 'exact' | 'year'
          price?: number
          registered?: boolean
          horn_status?: string
          dam?: string | null
          sire?: string | null
          bio?: string
          status?: string
          photos?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: number
          name: string
          category: string
          price: number
          description: string
          in_stock: boolean
          featured: boolean
          photos: string[]
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          category: string
          price: number
          description: string
          in_stock?: boolean
          featured?: boolean
          photos?: string[]
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          category?: string
          price?: number
          description?: string
          in_stock?: boolean
          featured?: boolean
          photos?: string[]
          created_at?: string
        }
      }
    }
  }
}
