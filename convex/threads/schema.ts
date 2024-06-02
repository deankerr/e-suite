import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

import { fileAttachmentRecordSchema, inferenceAttachmentSchema } from '../shared/structures'
import { zMessageName, zMessageTextContent, zThreadTitle } from '../shared/utils'

export const messageRolesEnum = z.enum(['system', 'assistant', 'user'])

export const messageFields = {
  role: messageRolesEnum,
  name: zMessageName.optional(),
  content: zMessageTextContent.optional(),

  inference: inferenceAttachmentSchema.optional(),
  files: fileAttachmentRecordSchema.array().optional(),

  metadata: z.string().array().array().optional(),
  speechId: zid('speech').optional(),
}

export const threadFields = {
  title: zThreadTitle.optional(),
  config: inferenceAttachmentSchema,
  saved: inferenceAttachmentSchema.array(),
  instructions: zMessageTextContent.optional(),
}
