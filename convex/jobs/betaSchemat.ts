import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

export const jobTypesEnum = z.enum([
  'inference/text-to-image',
  'inference/chat-completion',
  'inference/thread-title-completion',
  'files/ingest-image-url',
  'files/optimize-image',
])
export const jobStatusEnum = z.enum(['queued', 'active', 'complete', 'failed'])

export const jobErrorSchema = z.object({
  code: z.enum(['unhandled', 'invalid_job', 'timeout', 'endpoint_error']),
  message: z.string(),
  fatal: z.boolean(),
})

export const jobsBetaFields = {
  type: jobTypesEnum,
  status: jobStatusEnum,
  errors: jobErrorSchema.array().optional(),

  threadId: zid('threads').optional(),
  messageId: zid('messages').optional(),
  imageId: zid('images').optional(),

  queuedTime: z.number(),
  startedTime: z.number().optional(),
  endedTime: z.number().optional(),
}
