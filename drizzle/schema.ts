import { createId } from '@paralleldrive/cuid2'
import { relations, sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export type DrizzleEngine = typeof engines.$inferSelect
export type DrizzleNewEngine = typeof engines.$inferInsert

export type DrizzleVendor = typeof vendors.$inferSelect
export type DrizzleNewVendor = typeof vendors.$inferInsert

export type DrizzleAgent = typeof agents.$inferSelect
export type DrizzleNewAgent = typeof agents.$inferInsert

export type DrizzleUser = typeof users.$inferSelect
export type DrizzleNewUser = typeof users.$inferInsert

export const engines = sqliteTable('engines', {
  id: text('id').primaryKey().notNull(),
  category: text('category').notNull(),
  model: text('model').notNull(),
  displayName: text('displayName').notNull(),
  description: text('description'),
  url: text('url'),
  license: text('license'),
  contextLength: integer('contextLength'),
  promptFormat: text('promptFormat'),
  createdAt: text('createdAt')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text('updatedAt')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  isAvailable: integer('isAvailable', { mode: 'boolean' }).notNull(),
  comment: text('comment'),
  costInputNanoUsd: integer('costInputNanoUsd').notNull(),
  costOutputNanoUsd: integer('costOutputNanoUsd').notNull(),
  creatorName: text('creator').notNull(),
  instructType: text('instructType'),
  outputTokenLimit: integer('outputTokenLimit'),
  tokenizer: text('tokenizer'),
  stopTokens: text('stopTokens'),
  parameterSize: integer('parameterSize'),

  vendorId: text('vendorId').notNull(),
  vendorModelId: text('providerModelId').notNull(),
})

export const enginesRelations = relations(engines, ({ one, many }) => ({
  vendor: one(vendors, { fields: [engines.vendorId], references: [vendors.id] }),
  engines: many(agents),
}))

export const vendors = sqliteTable('vendors', {
  id: text('id').primaryKey().notNull(),
  displayName: text('displayName').notNull(),
  url: text('url').notNull(),
})

export const vendorsRelations = relations(vendors, ({ many }) => ({
  engines: many(engines),
}))

export const agents = sqliteTable('agents', {
  id: text('id').primaryKey().notNull(),
  ownerId: text('ownerId').notNull(),

  name: text('name').notNull(),
  image: text('image').notNull(),
  engineId: text('engineId').notNull(),
  engineParameters: text('engineParameters').notNull(),

  createdAt: text('createdAt')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text('updatedAt')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
})

export const agentsRelations = relations(agents, ({ one }) => ({
  owner: one(users, { fields: [agents.ownerId], references: [users.id] }),
  engine: one(engines, { fields: [agents.engineId], references: [engines.id] }),
}))

export const users = sqliteTable('users', {
  id: text('id')
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  firstName: text('firstName'),
  lastName: text('lastName'),
  email: text('email'),
  image: text('image'),

  createdAt: text('createdAt')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text('updatedAt')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
})

export const userRelations = relations(users, ({ many }) => ({
  agents: many(agents),
}))
