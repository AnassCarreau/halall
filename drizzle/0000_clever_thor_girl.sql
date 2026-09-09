CREATE TABLE "products" (
	"barcode" varchar(32) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"brand" text,
	"status" text NOT NULL,
	"has_meat" boolean DEFAULT false NOT NULL,
	"conflicts" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"explanation" text,
	"source" text DEFAULT 'OFF' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
