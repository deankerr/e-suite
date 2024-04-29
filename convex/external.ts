import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

import {
  generatedImageFields,
  generationFields,
  messageFields,
  ridField,
  threadFields,
  userFields,
} from './schema'

import type { generationVoteNames } from './constants'

const ridFields = {
  rid: ridField,
  private: z.boolean(),
}

const units = {
  generated_image: z
    .object({
      ...generatedImageFields,
      ...ridFields,
      _creationTime: z.number(),
      _id: zid('generated_images'),
    })
    .omit({ sourceUrl: true, sourceFileId: true })
    .describe('external'),
  generation: z
    .object({
      ...generationFields,
      ...ridFields,
      votes: z.record(z.string(), z.number()),
      _creationTime: z.number(),
      _id: zid('generations'),
    })
    .describe('external generation'),
  message: z
    .object({ ...messageFields, ...ridFields, _creationTime: z.number(), _id: zid('messages') })
    .describe('external'),
  thread: z
    .object({ ...threadFields, ...ridFields, _creationTime: z.number(), _id: zid('threads') })
    .describe('external'),
  user: z
    .object({ ...userFields, rid: z.string(), _creationTime: z.number(), _id: zid('users') })
    .describe('external'),
}

const generationWithImage = units.generation.merge(
  z.object({
    image: units.generated_image.nullable(),
  }),
)

const messageXL = z
  .object({
    message: units.message,
    generations: generationWithImage.array().nullable(),
  })
  .describe('external')

export const external = {
  unit: units,
  xl: {
    message: messageXL,
    generation: generationWithImage,
  },
}

export type Thread = z.infer<typeof units.thread>
export type MessageContent = z.infer<typeof messageXL>
export type Generation = z.infer<typeof generationWithImage>
export type GeneratedImage = z.infer<typeof units.generated_image>
export type GenerationVoteNames = (typeof generationVoteNames)[number]
