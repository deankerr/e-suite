import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

import { fileAttachmentRecordSchema, inferenceAttachmentSchema } from '../shared/structures'

export const zTruncate = (max: number, min = 0) =>
  z
    .string()
    .min(min)
    .transform((value) => value.slice(0, max))

export const zThreadTitle = zTruncate(256, 1)
export const zMessageName = zTruncate(64)
export const zMessageTextContent = zTruncate(32767)

export const messageRolesEnum = z.enum(['system', 'assistant', 'user'])

export const messageFields = {
  role: messageRolesEnum,
  name: zTruncate(64).optional(),
  content: z.string().optional(),

  inference: inferenceAttachmentSchema.optional(),
  files: fileAttachmentRecordSchema.array().optional(),

  metadata: z.string().array().array().optional(),
  speechId: zid('speech').optional(),
}

export const threadFields = {
  title: zTruncate(256).optional(),
  saved: inferenceAttachmentSchema.array(),
}
