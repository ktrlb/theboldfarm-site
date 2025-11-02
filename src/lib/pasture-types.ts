// TypeScript types for Pasture Management System

export interface Pasture {
  id: number;
  name: string;
  description: string | null;
  area_size: number | null;
  area_unit: 'acres' | 'sq_ft' | 'sq_meters';
  shape_data: {
    type: 'polygon' | 'svg';
    coordinates?: number[][]; // [[x, y], [x, y], ...]
    svg_path?: string;
  } | null;
  quality_rating: number | null; // 1-5
  forage_type: string | null;
  water_source: boolean;
  shade_available: boolean;
  fencing_type: string | null;
  fencing_condition: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Needs Repair' | null;
  notes: string | null;
  custom_fields: Record<string, string | number | boolean | null> | null; // Custom user-defined fields
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GrazingRotation {
  id: number;
  pasture_id: number;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  animal_type: string;
  animal_count: number | null;
  animal_ids: number[] | null;
  grazing_pressure: 'Light' | 'Moderate' | 'Heavy' | 'Intensive' | null;
  pasture_quality_start: number | null; // 1-5
  pasture_quality_end: number | null; // 1-5
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PastureObservation {
  id: number;
  pasture_id: number;
  observation_date: string;
  quality_rating: number | null; // 1-5
  forage_height: number | null; // in inches
  moisture_level: 'Very Dry' | 'Dry' | 'Moderate' | 'Moist' | 'Wet' | 'Very Wet' | null;
  weed_pressure: 'None' | 'Low' | 'Moderate' | 'High' | 'Severe' | null;
  bare_spots_percentage: number | null;
  needs_reseeding: boolean;
  needs_mowing: boolean;
  needs_fertilizing: boolean;
  photos: string[];
  notes: string | null;
  observed_by: string | null;
  created_at: string;
}

export interface PastureRestPeriod {
  id: number;
  pasture_id: number;
  start_date: string;
  planned_end_date: string | null;
  actual_end_date: string | null;
  reason: string | null;
  recovery_actions: string[];
  is_active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PropertyMap {
  id: number;
  name: string;
  total_area: number | null;
  area_unit: 'acres' | 'sq_ft' | 'sq_meters';
  boundary_data: {
    type: 'polygon' | 'svg';
    coordinates?: number[][];
    svg_path?: string;
  } | null;
  map_image_url: string | null;
  map_svg: string | null;
  map_scale: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Helper types for form data
export type PastureFormData = Omit<Pasture, 'id' | 'created_at' | 'updated_at'>;
export type GrazingRotationFormData = Omit<GrazingRotation, 'id' | 'created_at' | 'updated_at'>;
export type PastureObservationFormData = Omit<PastureObservation, 'id' | 'created_at'>;
export type PastureRestPeriodFormData = Omit<PastureRestPeriod, 'id' | 'created_at' | 'updated_at'>;

// Pasture with related data for dashboard display
export interface PastureWithDetails extends Pasture {
  current_rotation?: GrazingRotation;
  rest_period?: PastureRestPeriod;
  days_resting?: number;
  last_observation?: PastureObservation;
}

// Constants for dropdowns and selections
export const FORAGE_TYPES = [
  'Mixed Grass',
  'Clover',
  'Browse',
  'Mixed Grass and Clover',
  'Alfalfa',
  'Timothy',
  'Orchardgrass',
  'Legume Mix',
  'Other'
] as const;

export const FENCING_TYPES = [
  'Electric',
  'Woven Wire',
  'T-Post',
  'High Tensile',
  'Combination',
  'Other'
] as const;

export const ANIMAL_TYPES = [
  'Goats',
  'Cows',
  'Chickens',
  'Mixed',
  'Other'
] as const;

export const RECOVERY_ACTIONS = [
  'Mowed',
  'Fertilized',
  'Reseeded',
  'Harrowed',
  'Dragged',
  'Limed',
  'Weed Treatment',
  'Irrigation',
  'Other'
] as const;



