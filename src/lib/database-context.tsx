"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Database } from "./supabase";
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
      setError(null);

      const res = await fetch('/api/goats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goat),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create goat');
      }

      const data = await res.json();
      await fetchData(); // Refresh all data
    } catch (err) {
      console.error('Error adding goat:', err);
      setError(err instanceof Error ? err.message : 'Failed to add goat');
      throw err;
    }
  };

  // Update an existing goat
  const updateGoat = async (id: number, updates: Partial<GoatUpdate>) => {
    try {
      const res = await fetch(`/api/goats/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to update goat');
      }

      await fetchData(); // Refresh all data
    } catch (err) {
      console.error('Error updating goat:', err);
      setError(err instanceof Error ? err.message : 'Failed to update goat');
      throw err;
    }
  };

  // Delete a goat
  const deleteGoat = async (id: number) => {
    try {
      const res = await fetch(`/api/goats/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to delete goat');
      }

      await fetchData(); // Refresh all data
    } catch (err) {
      console.error('Error deleting goat:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete goat');
      throw err;
    }
  };

  // Add a new product
  const addProduct = async (product: Omit<ProductRow, 'id' | 'created_at'>) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create product');
      }

      await fetchData(); // Refresh all data
    } catch (err) {
      console.error('Error adding product:', err);
      setError(err instanceof Error ? err.message : 'Failed to add product');
      throw err;
    }
  };

  // Update an existing product
  const updateProduct = async (id: number, updates: Partial<ProductUpdate>) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to update product');
      }

      await fetchData(); // Refresh all data
    } catch (err) {
      console.error('Error updating product:', err);
      setError(err instanceof Error ? err.message : 'Failed to update product');
      throw err;
    }
  };

  // Delete a product
  const deleteProduct = async (id: number) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to delete product');
      }

      await fetchData(); // Refresh all data
    } catch (err) {
      console.error('Error deleting product:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete product');
      throw err;
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
