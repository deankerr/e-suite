import { defineEnt, defineEntSchema, getEntDefinitions } from 'convex-ents'
import { zid, zodToConvex, zodToConvexFields } from 'convex-helpers/server/zod'
import z from 'zod'

import { maxInputStringLength, maxMessageNameStringLength, messageRoles } from './constants'

const permissionsSchema = z.object({
  public: z.boolean(),
})

export const completionParametersSchema = z.object({
  model: z.string(),
  max_tokens: z.number().optional(),
  stop: z.string().array().optional(),
  temperature: z.number().optional(),
  top_p: z.number().optional(),
  top_k: z.number().optional(),
  repetition_penalty: z.number().optional(),
})

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
      parameters: completionParametersSchema,
    })
    .optional(),
}
const messages = defineEnt(zodToConvexFields(messagesFields)).deletion('soft').edge('thread')

export const threadsFields = {
  title: z.string().optional(),
  permissions: permissionsSchema.optional(),
}
const threads = defineEnt(zodToConvexFields(threadsFields))
  .deletion('soft')
  .edges('messages', { ref: true })
  .edge('user')

export const usersFields = {
  name: z.string(),
  imageUrl: z.string(),
  role: z.enum(['user', 'admin']),
}
const users = defineEnt(zodToConvexFields(usersFields))
  .deletion('soft')
  .field('tokenIdentifier', zodToConvex(z.string()), { unique: true })
  .field('apiKey', zodToConvex(z.string().optional()), { index: true })
  .edges('threads', { ref: true })

const schema = defineEntSchema(
  {
    messages,
    threads,
    users,
  },
  { schemaValidation: false },
)

export default schema
export const entDefinitions = getEntDefinitions(schema)
