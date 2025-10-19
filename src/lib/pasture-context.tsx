"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "./supabase";
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

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!supabase) {
        console.error('Supabase not configured');
        setError('Database connection not configured');
        setLoading(false);
        return;
      }

      // Fetch pastures
      const { data: pasturesData, error: pasturesError } = await supabase
        .from('pastures')
        .select('*')
        .order('name', { ascending: true });

      if (pasturesError) throw pasturesError;

      // Fetch rotations
      const { data: rotationsData, error: rotationsError } = await supabase
        .from('grazing_rotations')
        .select('*')
        .order('start_date', { ascending: false });

      if (rotationsError) throw rotationsError;

      // Fetch observations
      const { data: observationsData, error: observationsError } = await supabase
        .from('pasture_observations')
        .select('*')
        .order('observation_date', { ascending: false });

      if (observationsError) throw observationsError;

      // Fetch rest periods
      const { data: restPeriodsData, error: restPeriodsError } = await supabase
        .from('pasture_rest_periods')
        .select('*')
        .order('start_date', { ascending: false });

      if (restPeriodsError) throw restPeriodsError;

      // Fetch property map
      const { data: propertyMapData, error: propertyMapError } = await supabase
        .from('property_map')
        .select('*')
        .limit(1)
        .single();

      if (propertyMapError && propertyMapError.code !== 'PGRST116') {
        console.error('Property map error:', propertyMapError);
      }

      // Enrich pastures with related data
      const enrichedPastures: PastureWithDetails[] = (pasturesData || []).map(pasture => {
        const currentRotation = (rotationsData || []).find(
          r => r.pasture_id === pasture.id && r.is_current
        );
        
        const activeRestPeriod = (restPeriodsData || []).find(
          rp => rp.pasture_id === pasture.id && rp.is_active
        );

        const lastObservation = (observationsData || []).find(
          obs => obs.pasture_id === pasture.id
        );

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
      setRotations(rotationsData || []);
      setObservations(observationsData || []);
      setRestPeriods(restPeriodsData || []);
      setPropertyMap(propertyMapData || null);
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
      if (!supabase) throw new Error('Supabase not configured');

      const { error } = await supabase
        .from('pastures')
        .insert([pasture])
        .select()
        .single();

      if (error) throw error;

      await fetchData(); // Refresh all data
    } catch (err) {
      console.error('Error adding pasture:', err);
      throw err;
    }
  };

  // Update pasture
  const updatePasture = async (id: number, updates: Partial<Pasture>) => {
    try {
      if (!supabase) throw new Error('Supabase not configured');

      const { error } = await supabase
        .from('pastures')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      await fetchData();
    } catch (err) {
      console.error('Error updating pasture:', err);
      throw err;
    }
  };

  // Delete pasture
  const deletePasture = async (id: number) => {
    try {
      if (!supabase) throw new Error('Supabase not configured');

      const { error } = await supabase
        .from('pastures')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchData();
    } catch (err) {
      console.error('Error deleting pasture:', err);
      throw err;
    }
  };

  // Add rotation
  const addRotation = async (rotation: Omit<GrazingRotation, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (!supabase) throw new Error('Supabase not configured');

      // If this is a current rotation, mark others as not current
      if (rotation.is_current) {
        await supabase
          .from('grazing_rotations')
          .update({ is_current: false })
          .eq('pasture_id', rotation.pasture_id);
      }

      const { error } = await supabase
        .from('grazing_rotations')
        .insert([rotation])
        .select()
        .single();

      if (error) throw error;

      await fetchData();
    } catch (err) {
      console.error('Error adding rotation:', err);
      throw err;
    }
  };

  // Update rotation
  const updateRotation = async (id: number, updates: Partial<GrazingRotation>) => {
    try {
      if (!supabase) throw new Error('Supabase not configured');

      const { error } = await supabase
        .from('grazing_rotations')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      await fetchData();
    } catch (err) {
      console.error('Error updating rotation:', err);
      throw err;
    }
  };

  // End rotation
  const endRotation = async (id: number, endDate: string, qualityEnd: number) => {
    try {
      if (!supabase) throw new Error('Supabase not configured');

      const { error } = await supabase
        .from('grazing_rotations')
        .update({
          end_date: endDate,
          pasture_quality_end: qualityEnd,
          is_current: false
        })
        .eq('id', id);

      if (error) throw error;

      await fetchData();
    } catch (err) {
      console.error('Error ending rotation:', err);
      throw err;
    }
  };

  // Add observation
  const addObservation = async (observation: Omit<PastureObservation, 'id' | 'created_at'>) => {
    try {
      if (!supabase) throw new Error('Supabase not configured');

      const { error } = await supabase
        .from('pasture_observations')
        .insert([observation])
        .select()
        .single();

      if (error) throw error;

      await fetchData();
    } catch (err) {
      console.error('Error adding observation:', err);
      throw err;
    }
  };

  // Start rest period
  const startRestPeriod = async (restPeriod: Omit<PastureRestPeriod, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (!supabase) throw new Error('Supabase not configured');

      const { error } = await supabase
        .from('pasture_rest_periods')
        .insert([restPeriod])
        .select()
        .single();

      if (error) throw error;

      await fetchData();
    } catch (err) {
      console.error('Error starting rest period:', err);
      throw err;
    }
  };

  // End rest period
  const endRestPeriod = async (id: number, actualEndDate: string) => {
    try {
      if (!supabase) throw new Error('Supabase not configured');

      const { error } = await supabase
        .from('pasture_rest_periods')
        .update({
          actual_end_date: actualEndDate,
          is_active: false
        })
        .eq('id', id);

      if (error) throw error;

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

  // Initial data fetch
  useEffect(() => {
    fetchData();
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


