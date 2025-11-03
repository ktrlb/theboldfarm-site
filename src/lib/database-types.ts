// Database types for TypeScript
// These match the schema in src/lib/db/schema.ts
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
          is_for_sale: boolean
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
          is_for_sale: boolean
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
          is_for_sale?: boolean
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
          created_at?: string
        }
      }
      pastures: {
        Row: {
          id: number
          name: string
          description: string | null
          area_size: number | null
          area_unit: string
          shape_data: Record<string, unknown> | null
          quality_rating: number | null
          forage_type: string | null
          water_source: boolean
          shade_available: boolean
          fencing_type: string | null
          fencing_condition: string | null
          notes: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['pastures']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['pastures']['Row']>
      }
      grazing_rotations: {
        Row: {
          id: number
          pasture_id: number
          start_date: string
          end_date: string | null
          is_current: boolean
          animal_type: string
          animal_count: number | null
          animal_ids: number[] | null
          grazing_pressure: string | null
          pasture_quality_start: number | null
          pasture_quality_end: number | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['grazing_rotations']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['grazing_rotations']['Row']>
      }
      pasture_observations: {
        Row: {
          id: number
          pasture_id: number
          observation_date: string
          quality_rating: number | null
          forage_height: number | null
          moisture_level: string | null
          weed_pressure: string | null
          bare_spots_percentage: number | null
          needs_reseeding: boolean
          needs_mowing: boolean
          needs_fertilizing: boolean
          photos: string[]
          notes: string | null
          observed_by: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['pasture_observations']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['pasture_observations']['Row']>
      }
      pasture_rest_periods: {
        Row: {
          id: number
          pasture_id: number
          start_date: string
          planned_end_date: string | null
          actual_end_date: string | null
          reason: string | null
          recovery_actions: string[]
          is_active: boolean
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['pasture_rest_periods']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['pasture_rest_periods']['Row']>
      }
      property_map: {
        Row: {
          id: number
          name: string
          total_area: number | null
          area_unit: string
          boundary_data: Record<string, unknown> | null
          map_image_url: string | null
          map_svg: string | null
          map_scale: number | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['property_map']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['property_map']['Row']>
      }
    }
  }
}

