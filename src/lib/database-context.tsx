"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase, Database } from "./supabase";
import { GoatRow, ProductRow } from "./data";

type GoatUpdate = Database['public']['Tables']['goats']['Update'];
type ProductUpdate = Database['public']['Tables']['products']['Update'];

interface SupabaseContextType {
  goats: GoatRow[];
  products: ProductRow[];
  loading: boolean;
  error: string | null;
  addGoat: (goat: Omit<GoatRow, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateGoat: (id: number, updates: Partial<GoatUpdate>) => Promise<void>;
  deleteGoat: (id: number) => Promise<void>;
  addProduct: (product: Omit<ProductRow, 'id' | 'created_at'>) => Promise<void>;
  updateProduct: (id: number, updates: Partial<ProductUpdate>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  refreshData: () => Promise<void>;
}

const DatabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [goats, setGoats] = useState<GoatRow[]>([]);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all data from Neon (via API routes)
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Skip during build/SSR
      if (typeof window === 'undefined') {
        setLoading(false);
        return;
      }

      console.log('Fetching data from Neon database...');

      // Fetch from API routes that use Drizzle + Neon
      const [goatsRes, productsRes] = await Promise.all([
        fetch('/api/goats'),
        fetch('/api/products')
      ]);

      if (!goatsRes.ok) {
        throw new Error(`Failed to fetch goats: ${goatsRes.statusText}`);
      }

      if (!productsRes.ok) {
        throw new Error(`Failed to fetch products: ${productsRes.statusText}`);
      }

      const goatsData = await goatsRes.json();
      const productsData = await productsRes.json();

      console.log('Data fetched successfully from Neon:', {
        goats: goatsData.length,
        products: productsData.length
      });

      setGoats(goatsData || []);
      setProducts(productsData || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      let errorMessage = 'Failed to fetch data';
      
      if (err && typeof err === 'object' && 'code' in err) {
        const dbError = err as { code?: string; message?: string };
        if (dbError.code === '57014') {
          errorMessage = 'Database query timeout. Please check your database performance or contact support.';
        } else if (dbError.message) {
          errorMessage = dbError.message;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setGoats([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Add a new goat
  const addGoat = async (goat: Omit<GoatRow, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Clear any previous errors
      setError(null);
      
      if (!supabase) {
        // Fallback: add to local state
        const newGoat = { 
          ...goat, 
          id: Date.now(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setGoats(prev => [newGoat, ...prev]);
        return;
      }

      // Prepare the goat data for insertion
      const goatData = {
        ...goat,
        updated_at: new Date().toISOString()
      };

      console.log('Inserting goat data:', goatData);
      console.log('Data types:', {
        name: typeof goatData.name,
        type: typeof goatData.type,
        birth_date: typeof goatData.birth_date,
        birth_type: typeof goatData.birth_type,
        price: typeof goatData.price,
        is_for_sale: typeof goatData.is_for_sale,
        registered: typeof goatData.registered,
        horn_status: typeof goatData.horn_status,
        dam: typeof goatData.dam,
        sire: typeof goatData.sire,
        bio: typeof goatData.bio,
        status: typeof goatData.status,
        photos: Array.isArray(goatData.photos) ? 'array' : typeof goatData.photos
      });

      const { data, error } = await supabase
        .from('goats')
        .insert([goatData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Goat added successfully:', data);
      setGoats(prev => [data, ...prev]);
    } catch (err) {
      console.error('Error adding goat:', err);
      setError(err instanceof Error ? err.message : 'Failed to add goat');
    }
  };

  // Update an existing goat
  const updateGoat = async (id: number, updates: Partial<GoatUpdate>) => {
    try {
      if (!supabase) {
        console.log('Supabase not configured, cannot update goat');
        return;
      }

      // Prepare the update data
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      console.log('Updating goat with data:', updateData);

      const { data, error } = await supabase
        .from('goats')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }

      console.log('Goat updated successfully:', data);
      setGoats(prev => prev.map(goat => goat.id === id ? data : goat));
    } catch (err) {
      console.error('Error updating goat:', err);
      setError(err instanceof Error ? err.message : 'Failed to update goat');
    }
  };

  // Delete a goat
  const deleteGoat = async (id: number) => {
    try {
      if (!supabase) {
        console.log('Supabase not configured, cannot delete goat');
        return;
      }
      const { error } = await supabase
        .from('goats')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setGoats(prev => prev.filter(goat => goat.id !== id));
    } catch (err) {
      console.error('Error deleting goat:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete goat');
    }
  };

  // Add a new product
  const addProduct = async (product: Omit<ProductRow, 'id' | 'created_at'>) => {
    try {
      if (!supabase) {
        console.log('Supabase not configured, cannot add product');
        return;
      }
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();

      if (error) throw error;

      setProducts(prev => [data, ...prev]);
    } catch (err) {
      console.error('Error adding product:', err);
      setError(err instanceof Error ? err.message : 'Failed to add product');
    }
  };

  // Update an existing product
  const updateProduct = async (id: number, updates: Partial<ProductUpdate>) => {
    try {
      if (!supabase) {
        console.log('Supabase not configured, cannot update product');
        return;
      }
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setProducts(prev => prev.map(product => product.id === id ? data : product));
    } catch (err) {
      console.error('Error updating product:', err);
      setError(err instanceof Error ? err.message : 'Failed to update product');
    }
  };

  // Delete a product
  const deleteProduct = async (id: number) => {
    try {
      if (!supabase) {
        console.log('Supabase not configured, cannot delete product');
        return;
      }
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProducts(prev => prev.filter(product => product.id !== id));
    } catch (err) {
      console.error('Error deleting product:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    }
  };

  // Refresh all data
  const refreshData = async () => {
    await fetchData();
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DatabaseContext.Provider value={{
      goats,
      products,
      loading,
      error,
      addGoat,
      updateGoat,
      deleteGoat,
      addProduct,
      updateProduct,
      deleteProduct,
      refreshData,
    }}>
      {children}
    </DatabaseContext.Provider>
  );
}

// Export with both names for compatibility
export const SupabaseProvider = DatabaseProvider;

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
}

// Export with old name for compatibility
export const useSupabase = useDatabase;
