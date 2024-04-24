import { z } from 'zod'

import {
  generatedImageFields,
  generationFields,
  messageFields,
  ridField,
  threadFields,
  userFields,
} from './schema'

const ridFields = {
  rid: ridField,
  private: z.boolean(),
}

const units = {
  generated_image: z
    .object({ ...generatedImageFields, ...ridFields })
    .omit({ sourceUrl: true, sourceFileId: true })
    .describe('external'),
  generation: z.object({ ...generationFields }).describe('external'),
  message: z.object({ ...messageFields, ...ridFields }).describe('external'),
  thread: z.object({ ...threadFields, ...ridFields }).describe('external'),
  user: z.object({ ...userFields, rid: z.string() }).describe('external'),
}

const messageXL = z
  .object({
    data: units.message,
    generation: units.generation.nullable(),
    generated_images: units.generated_image.array().nullable(),
  })
  .describe('external')

export const external = {
  unit: units,
  xl: {
    message: messageXL,
  },
}
