import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

import { generationProviders, generationVoteNames, messageRoles } from './constants'
import { ridField } from './schema'

const appImage = z.object({
  _id: zid('app_images'),
  _creationTime: z.number(),
  deletionTime: z.undefined().optional(),

  width: z.number(),
  height: z.number(),
  blurDataUrl: z.string(),
  color: z.string(),
})

const generatedImage = z.object({
  _id: zid('generated_images'),
  _creationTime: z.number(),
  deletionTime: z.undefined().optional(),

  width: z.number(),
  height: z.number(),
  blurDataUrl: z.string(),
  color: z.string(),

  parameters: z.record(z.string(), z.any()),

  rid: ridField,
})

const generationVote = z.object({
  _id: zid('generation_votes'),
  deletionTime: z.undefined().optional(),

  vote: z.enum(generationVoteNames),
})

const model = z.object({
  model_id: z.string(),
  name: z.string(),
  provider: z.enum(generationProviders),
  resId: z.string(),
})

const message = z.object({
  _id: zid('messages'),
  _creationTime: z.number(),
  deletionTime: z.undefined().optional(),

  role: z.enum(messageRoles),
  name: z.string().optional(),
  content: z.string().optional(),

  rid: ridField,
})

const thread = z.object({
  _id: zid('threads'),
  _creationTime: z.number(),
  deletionTime: z.undefined().optional(),

  title: z.string().optional(),

  rid: ridField,
})

const user = z.object({
  _id: zid('users'),
  _creationTime: z.number(),
  deletionTime: z.undefined().optional(),

  name: z.string(),
  imageUrl: z.string(),
  role: z.enum(['user', 'admin']),

  rid: ridField,
})

const self = user.merge(z.object({ apiKey: z.string().optional() }))

export const validators = {
  appImage,
  generatedImage,
  generationVote,
  model,
  message,
  thread,
  user,
  self,
}

export type EGeneratedImage = z.infer<typeof generatedImage>
export type EMessage = z.infer<typeof message>
export type EThread = z.infer<typeof thread>
