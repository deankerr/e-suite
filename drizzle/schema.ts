import type { InferenceParametersRecord } from '@/schema/dto'
import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { dateTimeStamp } from './customTypes'

//* Engines
export const engines = sqliteTable('engines', {
  id: text('id').primaryKey().notNull(),
  category: text('category').notNull(), //? enum
  model: text('model').notNull(),
  displayName: text('displayName').notNull(),
  creatorName: text('creator').notNull(),
  isAvailable: integer('isAvailable', { mode: 'boolean' }).notNull(),
  isRestricted: integer('isAvailable', { mode: 'boolean' }).notNull(),
  costInputNanoUsd: integer('costInputNanoUsd').notNull(),
  costOutputNanoUsd: integer('costOutputNanoUsd').notNull(),
  createdAt: dateTimeStamp('createdAt')
    .notNull()
    .$default(() => new Date()),
  updatedAt: dateTimeStamp('updatedAt')
    .notNull()
    .$default(() => new Date()),

  vendorId: text('vendorId').notNull(),
  vendorModelId: text('providerModelId').notNull(),

  description: text('description'),
  url: text('url'),
  license: text('license'),
  contextLength: integer('contextLength'),
  promptFormat: text('promptFormat'),
  comment: text('comment'),
  instructType: text('instructType'),
  outputTokenLimit: integer('outputTokenLimit'),
  tokenizer: text('tokenizer'),
  stopTokens: text('stopTokens', { mode: 'json' })
    .$type<string[]>()
    .$default(() => []),
  parameterSize: integer('parameterSize'),
})

export const enginesRelations = relations(engines, ({ one, many }) => ({
  vendor: one(vendors, { fields: [engines.vendorId], references: [vendors.id] }),
  engines: many(agents),
}))

//* Vendors
export const vendors = sqliteTable('vendors', {
  id: text('id').primaryKey().notNull(),
  displayName: text('displayName').notNull(),
  url: text('url').notNull(),
})

export const vendorsRelations = relations(vendors, ({ many }) => ({
  engines: many(engines),
}))

//* Agents
export const agents = sqliteTable('agents', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey()
    .notNull(),
  ownerId: text('ownerId').notNull(),

  name: text('name').notNull(),
  image: text('image').notNull(),
  engineId: text('engineId').notNull(),
  engineParameters: text('engineParameters', { mode: 'json' })
    .$type<InferenceParametersRecord>()
    .notNull()
    .$default(() => ({})),

  createdAt: dateTimeStamp('createdAt')
    .notNull()
    .$default(() => new Date()),
  updatedAt: dateTimeStamp('updatedAt')
    .notNull()
    .$default(() => new Date()),
})

export const agentsRelations = relations(agents, ({ one }) => ({
  owner: one(users, { fields: [agents.ownerId], references: [users.id] }),
  engine: one(engines, { fields: [agents.engineId], references: [engines.id] }),
}))

//* Users
export const users = sqliteTable('users', {
  id: text('id').primaryKey().notNull(),
  firstName: text('firstName'),
  lastName: text('lastName'),
  email: text('email'),
  image: text('image'),

  createdAt: dateTimeStamp('createdAt')
    .notNull()
    .$default(() => new Date()),
  updatedAt: dateTimeStamp('updatedAt')
    .notNull()
    .$default(() => new Date()),
})

export const userRelations = relations(users, ({ many }) => ({
  agents: many(agents),
}))

//* Logs
export const apiLogs = sqliteTable('api_logs', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey()
    .notNull(),
  route: text('route').notNull(),
  tag: text('tag').notNull(),
  requestId: text('request_id').notNull(),
  createdAt: dateTimeStamp('created_at')
    .$default(() => new Date())
    .notNull(),
  authId: text('auth_id'),
  vendorId: text('vendor_id'),
  errorCode: text('error_code'),
  data: text('data', { mode: 'json' }).notNull(),
})

export const apiLog = sqliteTable('api_log', {
  host: text('host'),
  path: text('path'),
  authId: text('auth_id'),
  vendorId: text('vendor_id'),
  errorCode: text('error_code'),
  data: text('data', { mode: 'json' }),

  createdAt: dateTimeStamp('created_at')
    .$default(() => new Date())
    .notNull(),
  requestId: text('request_id').notNull(),
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey()
    .notNull(),
})
