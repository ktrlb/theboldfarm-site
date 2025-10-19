import { pgTable, bigserial, text, decimal, boolean, timestamp, integer, json, date } from 'drizzle-orm/pg-core';

// Goats table
export const goats = pgTable('goats', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  name: text('name').notNull(),
  type: text('type').notNull(),
  birth_date: text('birth_date'),
  birth_type: text('birth_type').notNull().$type<'exact' | 'year'>(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  is_for_sale: boolean('is_for_sale').notNull().default(false),
  registered: boolean('registered').notNull().default(false),
  horn_status: text('horn_status').notNull(),
  dam: text('dam'),
  sire: text('sire'),
  bio: text('bio').notNull(),
  status: text('status').notNull(),
  photos: text('photos').array().notNull().default([]),
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
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Grazing rotations table
export const grazingRotations = pgTable('grazing_rotations', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  pasture_id: bigserial('pasture_id', { mode: 'number' }).notNull().references(() => pastures.id, { onDelete: 'cascade' }),
  start_date: date('start_date').notNull(),
  end_date: date('end_date'),
  is_current: boolean('is_current').notNull().default(false),
  animal_type: text('animal_type').notNull(),
  animal_count: integer('animal_count'),
  animal_ids: integer('animal_ids').array(),
  grazing_pressure: text('grazing_pressure'),
  pasture_quality_start: integer('pasture_quality_start'),
  pasture_quality_end: integer('pasture_quality_end'),
  notes: text('notes'),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Pasture observations table
export const pastureObservations = pgTable('pasture_observations', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  pasture_id: bigserial('pasture_id', { mode: 'number' }).notNull().references(() => pastures.id, { onDelete: 'cascade' }),
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
  pasture_id: bigserial('pasture_id', { mode: 'number' }).notNull().references(() => pastures.id, { onDelete: 'cascade' }),
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
  map_image_url: text('map_image_url'),
  map_svg: text('map_svg'),
  map_scale: decimal('map_scale', { precision: 10, scale: 2 }),
  notes: text('notes'),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Export types for use in components
export type Goat = typeof goats.$inferSelect;
export type NewGoat = typeof goats.$inferInsert;
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



