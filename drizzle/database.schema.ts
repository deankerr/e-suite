import type { InferenceParametersRecord } from '@/schema/dto'
import { createId } from '@paralleldrive/cuid2'
import { relations, sql } from 'drizzle-orm'
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { date, dateTimeStamp } from './custom-types'

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

//* logs
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

//* vendor model list (unprocessed)
export const vendorModelListData = sqliteTable('vendor_model_list_data', {
  vendorId: text('vendor_id').notNull(),
  retrievedAt: dateTimeStamp('retrieved_at')
    .$default(() => new Date())
    .notNull(),
  data: text('data', { mode: 'json' }),
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey()
    .notNull(),
})

//* common knowledge definitions of LLM models
export const models = sqliteTable('models', {
  id: text('id').primaryKey().notNull(), //* openai/gpt-3.5-turbo
  category: text('category').notNull(), //* chat/text-generation/image etc
  name: text('name').notNull(), //* OpenAI: GPT-3.5 Turbo
  creatorName: text('creator_name').notNull(), //* OpenAI

  isRestricted: integer('is_restricted', { mode: 'boolean' }).notNull(), //* resources also share this property?

  contextLength: integer('context_length'),
  architecture: text('architecture'), //* gpt / llama2 / mistral etc.
  instructType: text('instruct_type'), //* chatml, llama, vicuna etc.
  stopTokens: text('stop_tokens', { mode: 'json' })
    .$type<string[]>()
    .$default(() => []),

  parameterSize: text('parameter_size'),
  url: text('url'), //* datasheet/org website
  summary: text('summary'),
  description: text('description'),
  license: text('license'),
  tags: text('tags', { mode: 'json' }) //* hot, old, etc.
    .$type<string[]>()
    .$default(() => []),
  hfDatasheet: text('hf_datasheet', { mode: 'json' })
    .$default(() => {})
    .notNull(),
})

//* specific vendor+model inference endpoint details
export const resources = sqliteTable('resources', {
  id: text('id').primaryKey().notNull(), //* openrouter@openai/gpt-3.5-turbo
  modelAliasId: text('model_alias_id').notNull(), //* reference to our known models //? notNull? can refer to self
  vendorId: text('vendor_id').notNull(),
  endpointModelId: text('endpoint_model_id').notNull(), //* model id as defined by vendor

  isRestricted: integer('is_restricted', { mode: 'boolean' }).notNull(), //* models also share this property?
  isAvailable: integer('is_available', { mode: 'boolean' }).notNull(), //* eg. model removed from upstream

  inputCost1KTokens: real('input_cost_1k_tokens').notNull(),
  outputCost1KTokens: real('output_cost_1k_tokens').notNull(),
  tokenOutputLimit: integer('token_output_limit'),

  vendorModelData: text('vendor_model_data', { mode: 'json' })
    .$default(() => {})
    .notNull(),

  created: date('created')
    .$default(() => new Date())
    .notNull(),
})
