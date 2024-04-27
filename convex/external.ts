import { z } from 'zod'

import {
  generatedImageFields,
  generationFields,
  messageFields,
  ridField,
  threadFields,
  userFields,
} from './schema'

const baseFields = {
  _id: z.string(),
  _creationTime: z.number(),
}

const ridFields = {
  rid: ridField,
  private: z.boolean(),
}

const units = {
  generated_image: z
    .object({ ...generatedImageFields, ...ridFields, ...baseFields })
    .omit({ sourceUrl: true, sourceFileId: true })
    .describe('external'),
  generation: z
    .object({
      ...generationFields,
      ...ridFields,
      ...baseFields,
    })
    .describe('external generation'),
  message: z.object({ ...messageFields, ...ridFields, ...baseFields }).describe('external'),
  thread: z.object({ ...threadFields, ...ridFields, ...baseFields }).describe('external'),
  user: z.object({ ...userFields, rid: z.string(), ...baseFields }).describe('external'),
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
  },
}

export type Thread = z.infer<typeof units.thread>
export type MessageContent = z.infer<typeof messageXL>
export type Generation = z.infer<typeof generationWithImage>
export type GeneratedImage = z.infer<typeof units.generated_image>
