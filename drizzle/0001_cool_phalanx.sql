CREATE TABLE "gates" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" text DEFAULT 'permanent' NOT NULL,
	"lng" numeric(10, 6) NOT NULL,
	"lat" numeric(10, 6) NOT NULL,
	"is_open" boolean DEFAULT false NOT NULL,
	"connected_pasture_ids" integer[],
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "image_albums" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"images" text[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "image_placements" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"page_section" text NOT NULL,
	"image_url" text NOT NULL,
	"priority" integer DEFAULT 0 NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pastures" ADD COLUMN "custom_fields" json;--> statement-breakpoint
ALTER TABLE "property_map" ADD COLUMN "map_center" json;--> statement-breakpoint
ALTER TABLE "property_map" ADD COLUMN "map_zoom" numeric(3, 1);--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "photos";