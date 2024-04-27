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
      status: z.enum(['pending', 'complete', 'failed']),
    })
    .describe('external generation'),
  message: z.object({ ...messageFields, ...ridFields, ...baseFields }).describe('external'),
  thread: z.object({ ...threadFields, ...ridFields, ...baseFields }).describe('external'),
  user: z.object({ ...userFields, rid: z.string(), ...baseFields }).describe('external'),
}

const messageXL = z
  .object({
    message: units.message,
    generations: units.generation
      .merge(
        z.object({
          image: units.generated_image.optional(),
        }),
      )
      .array()
      .nullable(),
  })
  .describe('external')

export const external = {
  unit: units,
  xl: {
    message: messageXL,
  },
}

export type Thread = z.infer<typeof units.thread>
export type GeneratedImage = z.infer<typeof units.generated_image>
export type MessageContent = z.infer<typeof messageXL>
