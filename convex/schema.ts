import { defineEnt, defineEntSchema, getEntDefinitions } from 'convex-ents'
import { zid, zodToConvex, zodToConvexFields } from 'convex-helpers/server/zod'
import { v } from 'convex/values'
import { ms } from 'itty-time'
import { z } from 'zod'

import { generationVoteNames, imageSrcsetWidths, ridLength } from './constants'
import { jobFields } from './jobs/schema'
import { messageFields, threadFields } from './threads/schema'

const timeToDelete = ms('1 day')

export const ridField = z.string().length(ridLength)

const jobs = defineEnt(zodToConvexFields(jobFields)).deletion('soft').edge('message').edge('thread')

// TODO migrate
const speech = defineEnt({
  jobId: v.optional(v.id('_scheduled_functions')),
  parameters: v.object({
    Engine: v.optional(v.string()),
    VoiceId: v.optional(v.string()),
    model_id: v.optional(v.string()),
    provider: v.string(),
    voice_id: v.optional(v.string()),
    voice_settings: v.optional(
      v.object({
        similarity_boost: v.float64(),
        stability: v.float64(),
      }),
    ),
  }),
  storageId: v.id('_storage'),
  text: v.string(),
  textHash: v.string(),
  voiceRef: v.string(),
})

//* Images
export const srcsetField = z
  .object({
    width: z.number().refine((val) => imageSrcsetWidths.some((width) => width === val)),
    fileId: zid('_storage'),
  })
  .array()

const sharedImageFields = {
  width: z.number(),
  height: z.number(),

  sourceUrl: z.string(),
  sourceFileId: zid('_storage'),

  // optimized
  fileId: zid('_storage'),

  blurDataUrl: z.string(),
  color: z.string(),
}

//* App Images
export const appImageFields = { ...sharedImageFields, srcset: srcsetField }
const app_images = defineEnt(zodToConvexFields(appImageFields)).index('sourceUrl', ['sourceUrl'])

//* Generated Images
export const generatedImageFields = {
  ...sharedImageFields,
  srcset: srcsetField.optional(),
  // parameters: generationParameters.optional(), // TODO fix
}
const generated_images = defineEnt(zodToConvexFields(generatedImageFields))
  .deletion('scheduled', {
    delayMs: timeToDelete,
  })
  .field('rid', zodToConvex(ridField), { unique: true })
  .field('private', zodToConvex(z.boolean()), { index: true })
  .edge('message')
  .edges('generation_votes', { ref: true })

//* Votes
export const generationVoteFields = {
  vote: z.enum(generationVoteNames),

  userId: zid('users').optional(),
  ip: z.string().optional(),
  constituent: z.string().uuid(),
  metadata: z.any().optional(),
}
const generation_votes = defineEnt(zodToConvexFields(generationVoteFields))
  .deletion('scheduled', { delayMs: timeToDelete })
  .edge('generated_image')
  .index('userId', ['userId'])
  .index('ip', ['ip'])
  .index('constituent_vote', ['constituent', 'generated_imageId'])

//* Messages
const messages = defineEnt(zodToConvexFields(messageFields))
  .deletion('scheduled', { delayMs: timeToDelete })
  .field('rid', zodToConvex(ridField), { unique: true })
  .field('private', zodToConvex(z.boolean()), { index: true })
  .edges('generated_images', { ref: true, deletion: 'soft' })
  .edges('jobs', { ref: true, deletion: 'soft' })
  .edge('thread')
  .edge('user')

//* Threads

const threads = defineEnt(zodToConvexFields(threadFields))
  .deletion('scheduled', { delayMs: timeToDelete })
  .field('rid', zodToConvex(ridField), { unique: true })
  .field('private', zodToConvex(z.boolean()), { index: true })
  .edges('messages', { ref: true, deletion: 'soft' })
  .edges('jobs', { ref: true, deletion: 'soft' })
  .edge('user')

//* Users
export const userFields = {
  name: z.string(),
  imageUrl: z.string(),
  role: z.enum(['user', 'admin']),
}
const users = defineEnt(zodToConvexFields(userFields))
  .deletion('scheduled', { delayMs: timeToDelete })
  .field('rid', zodToConvex(ridField), { unique: true })
  .field('tokenIdentifier', zodToConvex(z.string()), { unique: true })
  .edges('users_api_keys', { ref: true })
  .edges('threads', { ref: true, deletion: 'soft' })
  .edges('messages', { ref: true })

//* API Keys
export const usersApiKeysFields = {
  valid: z.boolean(),
}
const users_api_keys = defineEnt(zodToConvexFields(usersApiKeysFields))
  .deletion('scheduled', { delayMs: timeToDelete })
  .field('secret', zodToConvex(z.string()), { unique: true })
  .edge('user')

//* Schema
const schema = defineEntSchema(
  {
    app_images,

    generated_images,
    generation_votes,

    jobs,

    messages,
    threads,
    users,
    users_api_keys,

    // TODO migrate
    speech,
  },
  {
    schemaValidation: false,
  },
)

export default schema
export const entDefinitions = getEntDefinitions(schema)
