"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { 
  Pasture, 
  GrazingRotation, 
  PastureObservation, 
  PastureRestPeriod,
  PropertyMap,
  PastureWithDetails 
} from "./pasture-types";

interface PastureContextType {
  pastures: PastureWithDetails[];
  rotations: GrazingRotation[];
  observations: PastureObservation[];
  restPeriods: PastureRestPeriod[];
  propertyMap: PropertyMap | null;
  loading: boolean;
  error: string | null;
  
  // Pasture CRUD
  addPasture: (pasture: Omit<Pasture, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updatePasture: (id: number, updates: Partial<Pasture>) => Promise<void>;
  deletePasture: (id: number) => Promise<void>;
  
  // Rotation CRUD
  addRotation: (rotation: Omit<GrazingRotation, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateRotation: (id: number, updates: Partial<GrazingRotation>) => Promise<void>;
  endRotation: (id: number, endDate: string, qualityEnd: number) => Promise<void>;
  
  // Observation CRUD
  addObservation: (observation: Omit<PastureObservation, 'id' | 'created_at'>) => Promise<void>;
  
  // Rest Period CRUD
  startRestPeriod: (restPeriod: Omit<PastureRestPeriod, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  endRestPeriod: (id: number, actualEndDate: string) => Promise<void>;
  
  // Property Map functions
  savePropertyBoundary: (coordinates: number[][]) => Promise<void>;
  savePropertyLocation: (center: [number, number], zoom: number) => Promise<void>;
  
  // Utility functions
  refreshData: () => Promise<void>;
  getPastureById: (id: number) => PastureWithDetails | undefined;
  getCurrentRotations: () => GrazingRotation[];
  getActiveRestPeriods: () => PastureRestPeriod[];
}

const PastureContext = createContext<PastureContextType | undefined>(undefined);

export function PastureProvider({ children }: { children: ReactNode }) {
  const [pastures, setPastures] = useState<PastureWithDetails[]>([]);
  const [rotations, setRotations] = useState<GrazingRotation[]>([]);
  const [observations, setObservations] = useState<PastureObservation[]>([]);
  const [restPeriods, setRestPeriods] = useState<PastureRestPeriod[]>([]);
  const [propertyMap, setPropertyMap] = useState<PropertyMap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Skip data fetching during SSR
  const isClient = typeof window !== 'undefined';

  // Fetch all data
  const fetchData = async () => {
    if (!isClient) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [pasturesRes, rotationsRes, observationsRes, restPeriodsRes, propertyMapRes] = await Promise.all([
        fetch('/api/pastures'),
        fetch('/api/rotations'),
        fetch('/api/observations'),
        fetch('/api/rest-periods'),
        fetch('/api/property-map'),
      ]);

      if (!pasturesRes.ok) throw new Error('Failed to fetch pastures');
      if (!rotationsRes.ok) throw new Error('Failed to fetch rotations');
      if (!observationsRes.ok) throw new Error('Failed to fetch observations');
      if (!restPeriodsRes.ok) throw new Error('Failed to fetch rest periods');

      const pasturesData: Pasture[] = await pasturesRes.json();
      const rotationsData: GrazingRotation[] = await rotationsRes.json();
      const observationsData: PastureObservation[] = await observationsRes.json();
      const restPeriodsData: PastureRestPeriod[] = await restPeriodsRes.json();
      let propertyMapData: PropertyMap | null = await propertyMapRes.json();

      // Auto-initialize farm location if not set
      if (!propertyMapData?.map_center) {
        const { FARM_LOCATION } = await import('@/lib/farm-location');
        try {
          const initRes = await fetch('/api/property-map', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: FARM_LOCATION.name,
              map_center: FARM_LOCATION.center,
              map_zoom: FARM_LOCATION.zoom,
            }),
          });
          if (initRes.ok) {
            propertyMapData = await initRes.json();
          }
        } catch (err) {
          console.error('Failed to auto-initialize farm location:', err);
        }
      }

      // Enrich pastures with related data
      const enrichedPastures: PastureWithDetails[] = pasturesData.map(pasture => {
        const currentRotation = rotationsData.find(
          r => r.pasture_id === pasture.id && r.is_current
        );
        
        const activeRestPeriod = restPeriodsData.find(
          rp => rp.pasture_id === pasture.id && rp.is_active
        );

        const lastObservation = observationsData
          .filter(obs => obs.pasture_id === pasture.id)
          .sort((a, b) => new Date(b.observation_date).getTime() - new Date(a.observation_date).getTime())[0];

        let daysResting = undefined;
        if (activeRestPeriod) {
          const startDate = new Date(activeRestPeriod.start_date);
          const today = new Date();
          daysResting = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        }

        return {
          ...pasture,
          current_rotation: currentRotation,
          rest_period: activeRestPeriod,
          days_resting: daysResting,
          last_observation: lastObservation
        };
      });

      setPastures(enrichedPastures);
      setRotations(rotationsData);
      setObservations(observationsData);
      setRestPeriods(restPeriodsData);
      setPropertyMap(propertyMapData);
    } catch (err) {
      console.error('Error fetching pasture data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch pasture data');
    } finally {
      setLoading(false);
    }
  };

  // Add pasture
  const addPasture = async (pasture: Omit<Pasture, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const res = await fetch('/api/pastures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pasture),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create pasture');
      }

      await fetchData(); // Refresh all data
    } catch (err) {
      console.error('Error adding pasture:', err);
      throw err;
    }
  };

  // Update pasture
  const updatePasture = async (id: number, updates: Partial<Pasture>) => {
    try {
      const res = await fetch(`/api/pastures/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to update pasture');
      }

      await fetchData();
    } catch (err) {
      console.error('Error updating pasture:', err);
      throw err;
    }
  };

  // Delete pasture
  const deletePasture = async (id: number) => {
    try {
      const res = await fetch(`/api/pastures/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to delete pasture');
      }

      await fetchData();
    } catch (err) {
      console.error('Error deleting pasture:', err);
      throw err;
    }
  };

  // Add rotation
  const addRotation = async (rotation: Omit<GrazingRotation, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // If this is a current rotation, mark others as not current
      if (rotation.is_current) {
        // Get all current rotations for this pasture and update them
        const currentRotations = rotations.filter(
          r => r.pasture_id === rotation.pasture_id && r.is_current
        );
        await Promise.all(
          currentRotations.map(r => 
            fetch(`/api/rotations/${r.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ is_current: false }),
            })
          )
        );
      }

      const res = await fetch('/api/rotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rotation),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create rotation');
      }

      await fetchData();
    } catch (err) {
      console.error('Error adding rotation:', err);
      throw err;
    }
  };

  // Update rotation
  const updateRotation = async (id: number, updates: Partial<GrazingRotation>) => {
    try {
      const res = await fetch(`/api/rotations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to update rotation');
      }

      await fetchData();
    } catch (err) {
      console.error('Error updating rotation:', err);
      throw err;
    }
  };

  // End rotation
  const endRotation = async (id: number, endDate: string, qualityEnd: number) => {
    try {
      const res = await fetch(`/api/rotations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          end_date: endDate,
          pasture_quality_end: qualityEnd,
          is_current: false,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to end rotation');
      }

      await fetchData();
    } catch (err) {
      console.error('Error ending rotation:', err);
      throw err;
    }
  };

  // Add observation
  const addObservation = async (observation: Omit<PastureObservation, 'id' | 'created_at'>) => {
    try {
      const res = await fetch('/api/observations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(observation),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create observation');
      }

      await fetchData();
    } catch (err) {
      console.error('Error adding observation:', err);
      throw err;
    }
  };

  // Start rest period
  const startRestPeriod = async (restPeriod: Omit<PastureRestPeriod, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const res = await fetch('/api/rest-periods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(restPeriod),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to start rest period');
      }

      await fetchData();
    } catch (err) {
      console.error('Error starting rest period:', err);
      throw err;
    }
  };

  // End rest period
  const endRestPeriod = async (id: number, actualEndDate: string) => {
    try {
      const res = await fetch(`/api/rest-periods/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actual_end_date: actualEndDate,
          is_active: false,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to end rest period');
      }

      await fetchData();
    } catch (err) {
      console.error('Error ending rest period:', err);
      throw err;
    }
  };

  // Utility functions
  const getPastureById = (id: number) => {
    return pastures.find(p => p.id === id);
  };

  const getCurrentRotations = () => {
    return rotations.filter(r => r.is_current);
  };

  const getActiveRestPeriods = () => {
    return restPeriods.filter(rp => rp.is_active);
  };

  // Save property boundary
  const savePropertyBoundary = async (coordinates: number[][]) => {
    try {
      const res = await fetch('/api/property-map', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          boundary_data: {
            type: 'polygon',
            coordinates: coordinates,
          },
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to save property boundary');
      }

      await fetchData(); // Refresh data
    } catch (err) {
      console.error('Error saving property boundary:', err);
      throw err;
    }
  };

  // Save property map center location
  const savePropertyLocation = async (center: [number, number], zoom: number) => {
    try {
      const res = await fetch('/api/property-map', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          map_center: center,
          map_zoom: zoom,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to save property location');
      }

      await fetchData(); // Refresh data
    } catch (err) {
      console.error('Error saving property location:', err);
      throw err;
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (isClient) {
      fetchData();
    }
  }, []);

  return (
    <PastureContext.Provider value={{
      pastures,
      rotations,
      observations,
      restPeriods,
      propertyMap,
      loading,
      error,
      addPasture,
      updatePasture,
      deletePasture,
      addRotation,
      updateRotation,
      endRotation,
      addObservation,
      startRestPeriod,
      endRestPeriod,
      savePropertyBoundary,
      savePropertyLocation,
      refreshData: fetchData,
      getPastureById,
      getCurrentRotations,
      getActiveRestPeriods
    }}>
      {children}
    </PastureContext.Provider>
  );
}

export function usePasture() {
  const context = useContext(PastureContext);
  if (context === undefined) {
    throw new Error('usePasture must be used within a PastureProvider');
  }
  return context;
}
