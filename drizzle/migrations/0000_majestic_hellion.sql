CREATE TABLE `engines` (
	`id` text PRIMARY KEY NOT NULL,
	`category` text NOT NULL,
	`model` text NOT NULL,
	`displayName` text NOT NULL,
	`description` text,
	`url` text,
	`license` text,
	`contextLength` integer,
	`promptFormat` text,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`isAvailable` integer NOT NULL,
	`comment` text,
	`costInputNanoUsd` integer NOT NULL,
	`costOutputNanoUsd` integer NOT NULL,
	`creator` text NOT NULL,
	`instructType` text,
	`outputTokenLimit` integer,
	`tokenizer` text,
	`stopTokens` text,
	`parameterSize` integer,
	`vendorId` text NOT NULL,
	`providerModelId` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `vendors` (
	`id` text PRIMARY KEY NOT NULL,
	`displayName` text NOT NULL,
	`url` text NOT NULL
);
