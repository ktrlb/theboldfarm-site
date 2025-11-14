import { pgTable, bigserial, bigint, text, decimal, boolean, timestamp, integer, json, date } from 'drizzle-orm/pg-core';

// Animals table (generalized - supports goats, cows, horses, etc.)
export const animals = pgTable('animals', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  name: text('name').notNull(),
  animal_type: text('animal_type').notNull().default('Goat'), // 'Goat', 'Cow', 'Horse', etc.
  type: text('type').notNull(), // Subtype like 'Dairy Doe', 'Breeding Buck', 'Beef Cow', 'Dairy Cow', etc.
  birth_date: text('birth_date'),
  birth_type: text('birth_type').notNull().$type<'exact' | 'year'>(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull().default('0'),
  is_for_sale: boolean('is_for_sale').notNull().default(false),
  registered: boolean('registered').notNull().default(false),
  horn_status: text('horn_status'), // For goats primarily, nullable for other animals
  dam: text('dam'), // Mother's name
  sire: text('sire'), // Father's name
  bio: text('bio').notNull().default(''),
  status: text('status').notNull().default('Active'),
  photos: text('photos').array().notNull().default([]),
  custom_fields: json('custom_fields'), // For animal-type-specific fields (e.g., breed, weight, coat color, etc.)
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Products table
export const products = pgTable('products', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  description: text('description').notNull(),
  in_stock: boolean('in_stock').notNull().default(true),
  featured: boolean('featured').notNull().default(false),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// Pastures table
export const pastures = pgTable('pastures', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  area_size: decimal('area_size', { precision: 10, scale: 2 }),
  area_unit: text('area_unit').notNull().default('acres'),
  shape_data: json('shape_data'),
  quality_rating: integer('quality_rating'),
  forage_type: text('forage_type'),
  water_source: boolean('water_source').notNull().default(false),
  shade_available: boolean('shade_available').notNull().default(false),
  fencing_type: text('fencing_type'),
  fencing_condition: text('fencing_condition'),
  notes: text('notes'),
  custom_fields: json('custom_fields'),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Grazing rotations table
export const grazingRotations = pgTable('grazing_rotations', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  pasture_id: bigint('pasture_id', { mode: 'number' }).notNull().references(() => pastures.id, { onDelete: 'cascade' }),
  start_date: date('start_date').notNull(),
  end_date: date('end_date'),
  is_current: boolean('is_current').notNull().default(false),
  animal_type: text('animal_type').notNull(), // 'Goat', 'Cow', 'Horse', etc.
  animal_count: integer('animal_count'),
  animal_ids: integer('animal_ids').array(), // Array of animal IDs
  grazing_pressure: text('grazing_pressure'),
  pasture_quality_start: integer('pasture_quality_start'),
  pasture_quality_end: integer('pasture_quality_end'),
  notes: text('notes'),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Animal health records table
export const animalHealthRecords = pgTable('animal_health_records', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  animal_id: bigint('animal_id', { mode: 'number' }).notNull().references(() => animals.id, { onDelete: 'cascade' }),
  record_date: date('record_date').notNull(),
  record_type: text('record_type').notNull(), // 'Vaccination', 'Health Check', 'Treatment', 'Injury', 'Illness', 'Medication', 'De-worming', 'Breeding', 'Kidding', 'Disbudding/Dehorning', etc.
  title: text('title').notNull(),
  description: text('description'),
  veterinarian: text('veterinarian'), // Vet name or clinic
  medications: text('medications').array().default([]), // Array of medication names
  dosages: json('dosages'), // Medication dosages and schedules
  cost: decimal('cost', { precision: 10, scale: 2 }),
  next_due_date: date('next_due_date'), // For vaccinations, treatments with follow-ups
  attachments: text('attachments').array().default([]), // URLs to documents/photos
  notes: text('notes'),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Pasture observations table
export const pastureObservations = pgTable('pasture_observations', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  pasture_id: bigint('pasture_id', { mode: 'number' }).notNull().references(() => pastures.id, { onDelete: 'cascade' }),
  observation_date: date('observation_date').notNull(),
  quality_rating: integer('quality_rating'),
  forage_height: decimal('forage_height', { precision: 5, scale: 2 }),
  moisture_level: text('moisture_level'),
  weed_pressure: text('weed_pressure'),
  bare_spots_percentage: decimal('bare_spots_percentage', { precision: 5, scale: 2 }),
  needs_reseeding: boolean('needs_reseeding').notNull().default(false),
  needs_mowing: boolean('needs_mowing').notNull().default(false),
  needs_fertilizing: boolean('needs_fertilizing').notNull().default(false),
  photos: text('photos').array().notNull().default([]),
  notes: text('notes'),
  observed_by: text('observed_by'),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// Pasture rest periods table
export const pastureRestPeriods = pgTable('pasture_rest_periods', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  pasture_id: bigint('pasture_id', { mode: 'number' }).notNull().references(() => pastures.id, { onDelete: 'cascade' }),
  start_date: date('start_date').notNull(),
  planned_end_date: date('planned_end_date'),
  actual_end_date: date('actual_end_date'),
  reason: text('reason'),
  recovery_actions: text('recovery_actions').array().notNull().default([]),
  is_active: boolean('is_active').notNull().default(true),
  notes: text('notes'),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Property map table
export const propertyMap = pgTable('property_map', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  name: text('name').notNull().default('The Bold Farm'),
  total_area: decimal('total_area', { precision: 10, scale: 2 }),
  area_unit: text('area_unit').notNull().default('acres'),
  boundary_data: json('boundary_data'),
  map_center: json('map_center'), // [lng, lat] array
  map_zoom: decimal('map_zoom', { precision: 3, scale: 1 }), // zoom level (0-20)
  map_image_url: text('map_image_url'),
  map_svg: text('map_svg'),
  map_scale: decimal('map_scale', { precision: 10, scale: 2 }),
  notes: text('notes'),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Image albums table
export const imageAlbums = pgTable('image_albums', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  images: text('images').array().notNull().default([]),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Image placements table - maps images to specific page sections
export const imagePlacements = pgTable('image_placements', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  page_section: text('page_section').notNull(), // e.g., 'home-hero', 'home-cta', 'about-hero', 'goats-hero'
  image_url: text('image_url').notNull(),
  priority: integer('priority').notNull().default(0), // Higher priority = used first if multiple images
  description: text('description'), // User notes about why this image was chosen
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Gates table
export const gates = pgTable('gates', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  name: text('name').notNull(),
  type: text('type').notNull().default('permanent'), // 'permanent' | 'temporary'
  lng: decimal('lng', { precision: 10, scale: 6 }).notNull(),
  lat: decimal('lat', { precision: 10, scale: 6 }).notNull(),
  is_open: boolean('is_open').notNull().default(false),
  connected_pasture_ids: integer('connected_pasture_ids').array(),
  notes: text('notes'),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Export types for use in components
export type Animal = typeof animals.$inferSelect;
export type NewAnimal = typeof animals.$inferInsert;
// Legacy aliases for backwards compatibility (TypeScript only, not database)
export type Goat = Animal;
export type NewGoat = NewAnimal;
export type AnimalHealthRecord = typeof animalHealthRecords.$inferSelect;
export type NewAnimalHealthRecord = typeof animalHealthRecords.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Pasture = typeof pastures.$inferSelect;
export type NewPasture = typeof pastures.$inferInsert;
export type GrazingRotation = typeof grazingRotations.$inferSelect;
export type NewGrazingRotation = typeof grazingRotations.$inferInsert;
export type PastureObservation = typeof pastureObservations.$inferSelect;
export type NewPastureObservation = typeof pastureObservations.$inferInsert;
export type PastureRestPeriod = typeof pastureRestPeriods.$inferSelect;
export type NewPastureRestPeriod = typeof pastureRestPeriods.$inferInsert;
export type PropertyMap = typeof propertyMap.$inferSelect;
export type NewPropertyMap = typeof propertyMap.$inferInsert;
export type ImageAlbum = typeof imageAlbums.$inferSelect;
export type NewImageAlbum = typeof imageAlbums.$inferInsert;

export type Gate = typeof gates.$inferSelect;
export type NewGate = typeof gates.$inferInsert;
export type ImagePlacement = typeof imagePlacements.$inferSelect;
export type NewImagePlacement = typeof imagePlacements.$inferInsert;



