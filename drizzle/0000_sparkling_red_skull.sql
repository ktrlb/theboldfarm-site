CREATE TABLE "goats" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"birth_date" text,
	"birth_type" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"is_for_sale" boolean DEFAULT false NOT NULL,
	"registered" boolean DEFAULT false NOT NULL,
	"horn_status" text NOT NULL,
	"dam" text,
	"sire" text,
	"bio" text NOT NULL,
	"status" text NOT NULL,
	"photos" text[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "grazing_rotations" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"pasture_id" bigserial NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date,
	"is_current" boolean DEFAULT false NOT NULL,
	"animal_type" text NOT NULL,
	"animal_count" integer,
	"animal_ids" integer[],
	"grazing_pressure" text,
	"pasture_quality_start" integer,
	"pasture_quality_end" integer,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pasture_observations" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"pasture_id" bigserial NOT NULL,
	"observation_date" date NOT NULL,
	"quality_rating" integer,
	"forage_height" numeric(5, 2),
	"moisture_level" text,
	"weed_pressure" text,
	"bare_spots_percentage" numeric(5, 2),
	"needs_reseeding" boolean DEFAULT false NOT NULL,
	"needs_mowing" boolean DEFAULT false NOT NULL,
	"needs_fertilizing" boolean DEFAULT false NOT NULL,
	"photos" text[] DEFAULT '{}' NOT NULL,
	"notes" text,
	"observed_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pasture_rest_periods" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"pasture_id" bigserial NOT NULL,
	"start_date" date NOT NULL,
	"planned_end_date" date,
	"actual_end_date" date,
	"reason" text,
	"recovery_actions" text[] DEFAULT '{}' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pastures" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"area_size" numeric(10, 2),
	"area_unit" text DEFAULT 'acres' NOT NULL,
	"shape_data" json,
	"quality_rating" integer,
	"forage_type" text,
	"water_source" boolean DEFAULT false NOT NULL,
	"shade_available" boolean DEFAULT false NOT NULL,
	"fencing_type" text,
	"fencing_condition" text,
	"notes" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"description" text NOT NULL,
	"in_stock" boolean DEFAULT true NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"photos" text[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "property_map" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" text DEFAULT 'The Bold Farm' NOT NULL,
	"total_area" numeric(10, 2),
	"area_unit" text DEFAULT 'acres' NOT NULL,
	"boundary_data" json,
	"map_image_url" text,
	"map_svg" text,
	"map_scale" numeric(10, 2),
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "grazing_rotations" ADD CONSTRAINT "grazing_rotations_pasture_id_pastures_id_fk" FOREIGN KEY ("pasture_id") REFERENCES "public"."pastures"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pasture_observations" ADD CONSTRAINT "pasture_observations_pasture_id_pastures_id_fk" FOREIGN KEY ("pasture_id") REFERENCES "public"."pastures"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pasture_rest_periods" ADD CONSTRAINT "pasture_rest_periods_pasture_id_pastures_id_fk" FOREIGN KEY ("pasture_id") REFERENCES "public"."pastures"("id") ON DELETE cascade ON UPDATE no action;