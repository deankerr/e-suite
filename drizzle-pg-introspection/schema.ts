import { pgTable, pgEnum, varchar, timestamp, text, integer, foreignKey, boolean, jsonb } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const role = pgEnum("Role", ['ADMIN', 'USER'])


export const prismaMigrations = pgTable("_prisma_migrations", {
	id: varchar("id", { length: 36 }).primaryKey().notNull(),
	checksum: varchar("checksum", { length: 64 }).notNull(),
	finishedAt: timestamp("finished_at", { withTimezone: true, mode: 'string' }),
	migrationName: varchar("migration_name", { length: 255 }).notNull(),
	logs: text("logs"),
	rolledBackAt: timestamp("rolled_back_at", { withTimezone: true, mode: 'string' }),
	startedAt: timestamp("started_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	appliedStepsCount: integer("applied_steps_count").default(0).notNull(),
});

export const engine = pgTable("Engine", {
	id: text("id").primaryKey().notNull(),
	type: text("type").notNull(),
	model: text("model").notNull(),
	providerId: text("providerId").notNull().references(() => provider.id, { onDelete: "restrict", onUpdate: "cascade" } ),
	displayName: text("displayName").notNull(),
	description: text("description"),
	url: text("url"),
	license: text("license"),
	contextLength: integer("contextLength"),
	promptFormat: text("promptFormat"),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { precision: 3, mode: 'string' }).notNull(),
	available: boolean("available").default(true).notNull(),
	comment: text("comment").default('RRAY[').array(),
	costInputNanoUsd: integer("costInputNanoUSD").notNull(),
	costOutputNanoUsd: integer("costOutputNanoUSD").notNull(),
	creator: text("creator").notNull(),
	instructType: text("instructType"),
	outputTokenLimit: integer("outputTokenLimit"),
	providerModelId: text("providerModelId").notNull(),
	tokenizer: text("tokenizer"),
	stopTokens: text("stopTokens").default('RRAY[').array(),
	parameterSizeMil: integer("parameterSizeMil"),
});

export const provider = pgTable("Provider", {
	id: text("id").primaryKey().notNull(),
	displayName: text("displayName").notNull(),
	url: text("url").notNull(),
});

export const agent = pgTable("Agent", {
	id: text("id").primaryKey().notNull(),
	ownerId: text("ownerId").notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { precision: 3, mode: 'string' }).notNull(),
	name: text("name").default('Untitled').notNull(),
	image: text("image").default('').notNull(),
	engineId: text("engineId").notNull().references(() => engine.id, { onDelete: "restrict", onUpdate: "cascade" } ),
	parameters: jsonb("parameters").default({}).notNull(),
});

export const user = pgTable("User", {
	id: text("id").primaryKey().notNull(),
	email: text("email"),
	image: text("image"),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { precision: 3, mode: 'string' }).notNull(),
	workbench: jsonb("workbench").default({}).notNull(),
	firstName: text("firstName"),
	lastName: text("lastName"),
});