"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Animal } from "@/lib/db/schema";
import { ProductRow } from "./data";

interface DatabaseContextType {
  // Goats - for backwards compatibility, filtered from animals
  goats: Animal[];
  // Animals - the new unified animal system
  animals: Animal[];
  products: ProductRow[];
  loading: boolean;
  error: string | null;
  // Goat methods - for backwards compatibility
  addGoat: (goat: Omit<Animal, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateGoat: (id: number, updates: Partial<Animal>) => Promise<void>;
  deleteGoat: (id: number) => Promise<void>;
  // Product methods
  addProduct: (product: Omit<ProductRow, 'id' | 'created_at'>) => Promise<void>;
  updateProduct: (id: number, updates: Partial<ProductRow>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  refreshData: () => Promise<void>;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [animals, setAnimals] = useState<Animal[]>([]);
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
      // Use /api/animals for all animals, or /api/goats for backwards compatibility
      const [animalsRes, productsRes] = await Promise.all([
        fetch('/api/animals'),
        fetch('/api/products')
      ]);

      let animalsData: Animal[] = [];
      if (!animalsRes.ok) {
        // Fallback to /api/goats for backwards compatibility
        const goatsRes = await fetch('/api/goats');
        if (goatsRes.ok) {
          animalsData = await goatsRes.json();
        } else {
          throw new Error(`Failed to fetch animals: ${animalsRes.statusText}`);
        }
      } else {
        animalsData = await animalsRes.json();
      }
      setAnimals(animalsData || []);

      if (!productsRes.ok) {
        throw new Error(`Failed to fetch products: ${productsRes.statusText}`);
      }

      const productsData = await productsRes.json();

      console.log('Data fetched successfully from Neon:', {
        animals: animalsData.length,
        products: productsData.length
      });

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
      setAnimals([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Add a new goat (for backwards compatibility - uses animals API)
  const addGoat = async (goat: Omit<Animal, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setError(null);

      // Ensure animal_type is set to 'Goat' if not provided
      const animalData = { ...goat, animal_type: goat.animal_type || 'Goat' };

      // Try animals API first, fallback to goats API
      let res = await fetch('/api/animals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(animalData),
      });

      if (!res.ok) {
        // Fallback to goats API for backwards compatibility
        res = await fetch('/api/goats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(goat),
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || 'Failed to create goat');
        }
      }

      await fetchData(); // Refresh all data
    } catch (err) {
      console.error('Error adding goat:', err);
      setError(err instanceof Error ? err.message : 'Failed to add goat');
      throw err;
    }
  };

  // Update an existing goat (for backwards compatibility - uses animals API)
  const updateGoat = async (id: number, updates: Partial<Animal>) => {
    try {
      // Try animals API first, fallback to goats API
      let res = await fetch(`/api/animals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        // Fallback to goats API for backwards compatibility
        res = await fetch(`/api/goats/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || 'Failed to update goat');
        }
      }

      await fetchData(); // Refresh all data
    } catch (err) {
      console.error('Error updating goat:', err);
      setError(err instanceof Error ? err.message : 'Failed to update goat');
      throw err;
    }
  };

  // Delete a goat (for backwards compatibility - uses animals API)
  const deleteGoat = async (id: number) => {
    try {
      // Try animals API first, fallback to goats API
      let res = await fetch(`/api/animals/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        // Fallback to goats API for backwards compatibility
        res = await fetch(`/api/goats/${id}`, {
          method: 'DELETE',
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || 'Failed to delete goat');
        }
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
  const updateProduct = async (id: number, updates: Partial<ProductRow>) => {
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

  // Filter goats from animals for backwards compatibility
  const goats = animals.filter(animal => animal.animal_type === 'Goat');

  return (
    <DatabaseContext.Provider value={{
      goats, // Backwards compatibility
      animals, // New unified animal system
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

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
}

