import { relations, sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export type DrizzleEngine = typeof engines.$inferSelect
export type DrizzleNewEngine = typeof engines.$inferInsert

export type DrizzleVendor = typeof vendors.$inferSelect
export type DrizzleNewVendor = typeof vendors.$inferInsert

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

export const enginesRelations = relations(engines, ({ one }) => ({
  vendor: one(vendors, { fields: [engines.vendorId], references: [vendors.id] }),
}))

export const vendors = sqliteTable('vendors', {
  id: text('id').primaryKey().notNull(),
  displayName: text('displayName').notNull(),
  url: text('url').notNull(),
})

export const vendorsRelations = relations(vendors, ({ many }) => ({
  engines: many(engines),
}))

export const agent = sqliteTable('agent', {
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

export const user = sqliteTable('user', {
  id: text('id').primaryKey().notNull(),
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
