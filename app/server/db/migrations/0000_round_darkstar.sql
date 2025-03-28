CREATE TABLE "items_categories" (
	"id" serial PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories_description_translations" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer NOT NULL,
	"language" text NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories_name_translations" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer NOT NULL,
	"language" text NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shopping_cart" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"item_id" integer NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"picture" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "item_translations_name" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_id" integer NOT NULL,
	"language" text NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "item_variant_description_translations" (
	"id" serial PRIMARY KEY NOT NULL,
	"variant_id" integer NOT NULL,
	"language" text NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "item_variants" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_id" integer NOT NULL,
	"scale_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "items" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stl_files" (
	"id" serial PRIMARY KEY NOT NULL,
	"variant_id" integer NOT NULL,
	"type" text NOT NULL,
	"url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "variant_declinations" (
	"id" serial PRIMARY KEY NOT NULL,
	"variant_id" integer NOT NULL,
	"material_id" integer NOT NULL,
	"stl_id" integer NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"publish" boolean NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scale_description_translations" (
	"id" serial PRIMARY KEY NOT NULL,
	"scale_id" integer NOT NULL,
	"language" text NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scales" (
	"id" serial PRIMARY KEY NOT NULL,
	"scale" text NOT NULL,
	CONSTRAINT "scales_scale_unique" UNIQUE("scale")
);
--> statement-breakpoint
CREATE TABLE "materials_description_translations" (
	"id" serial PRIMARY KEY NOT NULL,
	"material_id" integer NOT NULL,
	"language" text NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "materials_name_translations" (
	"id" serial PRIMARY KEY NOT NULL,
	"material_id" integer NOT NULL,
	"language" text NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "items_materials" (
	"id" serial PRIMARY KEY NOT NULL
);
--> statement-breakpoint
ALTER TABLE "categories_description_translations" ADD CONSTRAINT "categories_description_translations_category_id_items_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."items_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories_name_translations" ADD CONSTRAINT "categories_name_translations_category_id_items_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."items_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shopping_cart" ADD CONSTRAINT "shopping_cart_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shopping_cart" ADD CONSTRAINT "shopping_cart_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_translations_name" ADD CONSTRAINT "item_translations_name_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_variant_description_translations" ADD CONSTRAINT "item_variant_description_translations_variant_id_item_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."item_variants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_variants" ADD CONSTRAINT "item_variants_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_variants" ADD CONSTRAINT "item_variants_scale_id_scales_id_fk" FOREIGN KEY ("scale_id") REFERENCES "public"."scales"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_category_id_items_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."items_categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stl_files" ADD CONSTRAINT "stl_files_variant_id_item_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."item_variants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "variant_declinations" ADD CONSTRAINT "variant_declinations_variant_id_item_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."item_variants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "variant_declinations" ADD CONSTRAINT "variant_declinations_material_id_items_materials_id_fk" FOREIGN KEY ("material_id") REFERENCES "public"."items_materials"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "variant_declinations" ADD CONSTRAINT "variant_declinations_stl_id_stl_files_id_fk" FOREIGN KEY ("stl_id") REFERENCES "public"."stl_files"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scale_description_translations" ADD CONSTRAINT "scale_description_translations_scale_id_scales_id_fk" FOREIGN KEY ("scale_id") REFERENCES "public"."scales"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "materials_description_translations" ADD CONSTRAINT "materials_description_translations_material_id_items_materials_id_fk" FOREIGN KEY ("material_id") REFERENCES "public"."items_materials"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "materials_name_translations" ADD CONSTRAINT "materials_name_translations_material_id_items_materials_id_fk" FOREIGN KEY ("material_id") REFERENCES "public"."items_materials"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "item_language_unique_idx" ON "item_translations_name" USING btree ("item_id","language");