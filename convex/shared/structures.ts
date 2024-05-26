import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

import { inferenceSchema } from '../threads/schema'
import { imageSchema, jobSchema, threadSchema, userSchema } from './entities'

export type EMessageRole = keyof typeof messageRole
export const messageRole = {
  system: 'system',
  assistant: 'assistant',
  user: 'user',
}
export const messageRolesEnum = z.enum(['system', 'assistant', 'user'])

export type EFileAttachmentRecord = z.infer<typeof fileAttachmentRecordSchema>
export const fileAttachmentRecordSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('image'), id: zid('images') }),
  z.object({ type: z.literal('image_url'), url: z.string() }),
])

export const fileAttachmentRecordWithContentSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('image'), id: zid('images'), image: imageSchema }),
  z.object({ type: z.literal('image_url'), url: z.string() }),
])

export type EMessageWithContent = z.infer<typeof messageWithContentSchema>
export const messageWithContentSchema = z.object({
  _id: zid('messages'),
  _creationTime: z.number(),
  deletionTime: z.undefined(),
  series: z.number(),

  role: messageRolesEnum,
  name: z.string().optional(),
  content: z.string().optional(),

  inference: inferenceSchema.optional(), // TODO move to structures
  files: z.array(fileAttachmentRecordWithContentSchema).optional(),
  jobs: z.array(jobSchema),

  owner: userSchema,
})

export type EThreadWithContent = z.infer<typeof threadWithContentSchema>
export const threadWithContentSchema = threadSchema.merge(
  z.object({
    messages: z.array(messageWithContentSchema),
    owner: userSchema,
  }),
)
