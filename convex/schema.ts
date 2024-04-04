import { defineEnt, defineEntSchema, getEntDefinitions } from 'convex-ents'
import { zid, zodToConvex, zodToConvexFields } from 'convex-helpers/server/zod'
import z from 'zod'

import {
  completionProviders,
  maxInputStringLength,
  maxMessageNameStringLength,
  messageRoles,
} from './constants'

//* Permissions
const permissionsSchema = z.object({
  public: z.boolean(),
})

//* Parameters
export const completionParametersSchema = z.object({
  model: z.string(),
  max_tokens: z.number().optional(),
  stop: z.string().array().optional(),
  temperature: z.number().optional(),
  top_p: z.number().optional(),
  top_k: z.number().optional(),
  repetition_penalty: z.number().optional(),
})

//* Messages
export const messagesFields = {
  role: z.enum(messageRoles),
  name: z
    .string()
    .transform((value) => value.slice(0, maxMessageNameStringLength))
    .optional(),
  content: z
    .string()
    .transform((value) => value.slice(0, maxInputStringLength))
    .optional(),
  inference: z
    .object({
      jobId: zid('_scheduled_functions').optional(),
      provider: z.enum(completionProviders),
      type: z.enum(['chatCompletion', 'completion']),
      parameters: completionParametersSchema,
    })
    .optional(),
  persistant: z.boolean().optional(),
}
const messages = defineEnt(zodToConvexFields(messagesFields))
  .deletion('soft')
  .edge('thread')
  .index('persistant', ['persistant'])

//* Threads
export const threadsFields = {
  title: z.string().optional(),
  permissions: permissionsSchema.optional(),
}
const threads = defineEnt(zodToConvexFields(threadsFields))
  .deletion('soft')
  .edges('messages', { ref: true })
  .edge('user')

//* Users
export const usersFields = {
  name: z.string(),
  imageUrl: z.string(),
  role: z.enum(['user', 'admin']),
}
const users = defineEnt(zodToConvexFields(usersFields))
  .deletion('soft')
  .field('tokenIdentifier', zodToConvex(z.string()), { unique: true })
  .edges('users_api_keys', { ref: true })
  .edges('threads', { ref: true })

export const usersApiKeysFields = {
  valid: z.boolean(),
}
const users_api_keys = defineEnt(zodToConvexFields(usersApiKeysFields))
  .deletion('soft')
  .field('secret', zodToConvex(z.string()), { unique: true })
  .edge('user')

//* Schema
const schema = defineEntSchema(
  {
    messages,
    threads,
    users,
    users_api_keys,
  },
  { schemaValidation: false },
)

export default schema
export const entDefinitions = getEntDefinitions(schema)
