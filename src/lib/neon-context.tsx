"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Goat, Product } from "./db/schema";

// Since Drizzle works server-side and we need client-side context,
// we'll use fetch to call API routes that use Drizzle

interface NeonContextType {
  goats: Goat[];
  products: Product[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

const NeonContext = createContext<NeonContextType | undefined>(undefined);

export function NeonProvider({ children }: { children: ReactNode }) {
  const [goats, setGoats] = useState<Goat[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching data from Neon via API...');

      // Fetch from API routes
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

      console.log('Data fetched successfully:', {
        goats: goatsData.length,
        products: productsData.length
      });

      setGoats(goatsData);
      setProducts(productsData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      setGoats([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <NeonContext.Provider value={{
      goats,
      products,
      loading,
      error,
      refreshData: fetchData
    }}>
      {children}
    </NeonContext.Provider>
  );
}

export function useNeon() {
  const context = useContext(NeonContext);
  if (context === undefined) {
    throw new Error('useNeon must be used within a NeonProvider');
  }
  return context;
}


