"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Animal, AnimalHealthRecord } from '@/lib/db/schema';
import { GrazingRotation } from '@/lib/db/schema';

interface AnimalContextType {
  animals: Animal[];
  loading: boolean;
  error: string | null;
  addAnimal: (animal: Omit<Animal, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateAnimal: (id: number, updates: Partial<Animal>) => Promise<void>;
  deleteAnimal: (id: number) => Promise<void>;
  refreshData: () => Promise<void>;
  getAnimalsByType: (animalType: string) => Animal[];
  getAnimalHealthRecords: (animalId: number) => Promise<AnimalHealthRecord[]>;
  getAnimalGrazingHistory: (animalId: number) => Promise<GrazingRotation[]>;
}

const AnimalContext = createContext<AnimalContextType | undefined>(undefined);

export function AnimalProvider({ children }: { children: ReactNode }) {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/animals');
      if (!res.ok) {
        throw new Error('Failed to fetch animals');
      }
      const data = await res.json();
      setAnimals(data);
    } catch (err) {
      console.error('Error fetching animals:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch animals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addAnimal = async (animal: Omit<Animal, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const res = await fetch('/api/animals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(animal),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create animal');
      }

      await fetchData();
    } catch (err) {
      console.error('Error adding animal:', err);
      setError(err instanceof Error ? err.message : 'Failed to add animal');
      throw err;
    }
  };

  const updateAnimal = async (id: number, updates: Partial<Animal>) => {
    try {
      const res = await fetch(`/api/animals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to update animal');
      }

      await fetchData();
    } catch (err) {
      console.error('Error updating animal:', err);
      setError(err instanceof Error ? err.message : 'Failed to update animal');
      throw err;
    }
  };

  const deleteAnimal = async (id: number) => {
    try {
      const res = await fetch(`/api/animals/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to delete animal');
      }

      await fetchData();
    } catch (err) {
      console.error('Error deleting animal:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete animal');
      throw err;
    }
  };

  const getAnimalsByType = (animalType: string): Animal[] => {
    return animals.filter(animal => animal.animal_type === animalType);
  };

  const getAnimalHealthRecords = async (animalId: number): Promise<AnimalHealthRecord[]> => {
    try {
      const res = await fetch(`/api/animals/${animalId}/health-records`);
      if (!res.ok) {
        throw new Error('Failed to fetch health records');
      }
      return await res.json();
    } catch (err) {
      console.error('Error fetching health records:', err);
      return [];
    }
  };

  const getAnimalGrazingHistory = async (animalId: number): Promise<GrazingRotation[]> => {
    try {
      const res = await fetch(`/api/animals/${animalId}/grazing-history`);
      if (!res.ok) {
        throw new Error('Failed to fetch grazing history');
      }
      return await res.json();
    } catch (err) {
      console.error('Error fetching grazing history:', err);
      return [];
    }
  };

  return (
    <AnimalContext.Provider
      value={{
        animals,
        loading,
        error,
        addAnimal,
        updateAnimal,
        deleteAnimal,
        refreshData: fetchData,
        getAnimalsByType,
        getAnimalHealthRecords,
        getAnimalGrazingHistory,
      }}
    >
      {children}
    </AnimalContext.Provider>
  );
}

export function useAnimals() {
  const context = useContext(AnimalContext);
  if (context === undefined) {
    throw new Error('useAnimals must be used within an AnimalProvider');
  }
  return context;
}

