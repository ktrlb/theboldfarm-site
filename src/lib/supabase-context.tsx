"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase, Database } from "./supabase";
import { GoatRow, ProductRow, initialGoats, initialProducts } from "./data";

type GoatInsert = Database['public']['Tables']['goats']['Insert'];
type GoatUpdate = Database['public']['Tables']['goats']['Update'];

type ProductInsert = Database['public']['Tables']['products']['Insert'];
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

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const [goats, setGoats] = useState<GoatRow[]>([]);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all data from Supabase
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if Supabase is available
      if (!supabase) {
        console.log('Supabase not configured, using fallback data');
        // Fallback to initial data if Supabase is not configured
        setGoats(initialGoats.map((goat, index) => ({
          id: index + 1,
          name: goat.name,
          type: goat.type,
          birth_date: goat.birth_date,
          birth_type: goat.birth_type,
          price: goat.price,
          registered: goat.registered,
          horn_status: goat.horn_status,
          dam: goat.dam,
          sire: goat.sire,
          bio: goat.bio,
          status: goat.status,
          photos: goat.photos,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })));
        setProducts(initialProducts.map((product, index) => ({
          id: index + 1,
          name: product.name,
          category: product.category,
          price: product.price,
          description: product.description,
          in_stock: product.in_stock,
          featured: product.featured,
          photos: product.photos,
          created_at: new Date().toISOString()
        })));
        return;
      }

      console.log('Attempting to fetch data from Supabase...');
      console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);

      // Fetch goats
      const { data: goatsData, error: goatsError } = await supabase
        .from('goats')
        .select('*')
        .order('created_at', { ascending: false });

      if (goatsError) {
        console.error('Error fetching goats:', goatsError);
        throw goatsError;
      }

      console.log('Goats fetched successfully:', goatsData);

      // Fetch products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (productsError) {
        console.error('Error fetching products:', productsError);
        throw productsError;
      }

      console.log('Products fetched successfully:', productsData);

      setGoats(goatsData || []);
      setProducts(productsData || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
      setError(errorMessage);
      
      // Fallback to initial data if Supabase fails
      setGoats(initialGoats.map((goat, index) => ({
        id: index + 1,
        name: goat.name,
        type: goat.type,
        birth_date: goat.birth_date,
        birth_type: goat.birth_type,
        price: goat.price,
        registered: goat.registered,
        horn_status: goat.horn_status,
        dam: goat.dam,
        sire: goat.sire,
        bio: goat.bio,
        status: goat.status,
        photos: goat.photos,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })));
      setProducts(initialProducts.map((product, index) => ({
        id: index + 1,
        name: product.name,
        category: product.category,
        price: product.price,
        description: product.description,
        in_stock: product.in_stock,
        featured: product.featured,
        photos: product.photos,
        created_at: new Date().toISOString()
      })));
    } finally {
      setLoading(false);
    }
  };

  // Add a new goat
  const addGoat = async (goat: Omit<GoatRow, 'id' | 'created_at' | 'updated_at'>) => {
    try {
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

      const { data, error } = await supabase
        .from('goats')
        .insert([{ ...goat, updated_at: new Date().toISOString() }])
        .select()
        .single();

      if (error) throw error;

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
      const { data, error } = await supabase
        .from('goats')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

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
    <SupabaseContext.Provider value={{
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
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
}
