-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
DO $$ BEGIN
 CREATE TYPE "Role" AS ENUM('ADMIN', 'USER');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"checksum" varchar(64) NOT NULL,
	"finished_at" timestamp with time zone,
	"migration_name" varchar(255) NOT NULL,
	"logs" text,
	"rolled_back_at" timestamp with time zone,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"applied_steps_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Engine" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"model" text NOT NULL,
	"providerId" text NOT NULL,
	"displayName" text NOT NULL,
	"description" text,
	"url" text,
	"license" text,
	"contextLength" integer,
	"promptFormat" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"available" boolean DEFAULT true NOT NULL,
	"comment" text[] DEFAULT 'RRAY[',
	"costInputNanoUSD" integer NOT NULL,
	"costOutputNanoUSD" integer NOT NULL,
	"creator" text NOT NULL,
	"instructType" text,
	"outputTokenLimit" integer,
	"providerModelId" text NOT NULL,
	"tokenizer" text,
	"stopTokens" text[] DEFAULT 'RRAY[',
	"parameterSizeMil" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Provider" (
	"id" text PRIMARY KEY NOT NULL,
	"displayName" text NOT NULL,
	"url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Agent" (
	"id" text PRIMARY KEY NOT NULL,
	"ownerId" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"name" text DEFAULT 'Untitled' NOT NULL,
	"image" text DEFAULT '' NOT NULL,
	"engineId" text NOT NULL,
	"parameters" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "User" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text,
	"image" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"workbench" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"firstName" text,
	"lastName" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Engine" ADD CONSTRAINT "Engine_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Agent" ADD CONSTRAINT "Agent_engineId_fkey" FOREIGN KEY ("engineId") REFERENCES "Engine"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Agent" ADD CONSTRAINT "Agent_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

*/