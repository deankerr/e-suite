import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

import { generationProviders, generationVoteNames, messageRoles } from './constants'
import { jobStatusEnum, jobTypesEnum } from './jobs/schema'
import { ridField } from './schema'
import { inferenceSchema } from './threads/schema'

const generationVote = z.object({
  _id: zid('generation_votes'),
  deletionTime: z.undefined().optional(),

  vote: z.enum(generationVoteNames),
})

const image = z.object({
  _id: zid('images'),
  _creationTime: z.number(),
  deletionTime: z.undefined().optional(),

  width: z.number(),
  height: z.number(),
  blurDataUrl: z.string(),
  color: z.string(),
})

const job = z
  .object({
    deletionTime: z.undefined().optional(),

    type: jobTypesEnum,
    status: jobStatusEnum,

    metrics: z
      .object({
        startTime: z.number().optional(),
        endTime: z.number().optional(),
      })
      .optional(),
  })
  .transform(({ type, status, metrics }) => {
    const start = metrics?.startTime
    const end = metrics?.endTime
    const time = start && end ? end - start : 0
    return {
      type,
      status,
      time,
    }
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

  inference: inferenceSchema.optional(),

  series: z.number(),
})

const thread = z.object({
  _id: zid('threads'),
  _creationTime: z.number(),
  deletionTime: z.undefined().optional(),

  title: z.string().optional(),

  slug: z.string(),
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
  generationVote,
  image,
  job,
  model,
  message,
  thread,
  user,
  self,
}

export type EImage = z.infer<typeof image>
export type EMessage = z.infer<typeof message>
export type EThread = z.infer<typeof thread>
