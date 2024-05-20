import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

export type JobTypes = z.infer<typeof jobTypesEnum>

export const jobStatusEnum = z.enum(['queued', 'active', 'complete', 'failed'])
export const jobTypesEnum = z.enum([
  'chat-completion',
  'chat-completion-stream',
  'title-completion',
  'text-to-image',
  'text-to-speech',
  'ingest-image-url',
])
export const jobResultTypesEnum = z.enum([
  'message',
  'url',
  'image',
  'error',
  'openai-chat-completion-json',
])

export const jobResultSchema = z.object({ type: jobResultTypesEnum, value: z.string() })

export const jobFields = {
  type: jobTypesEnum,
  status: jobStatusEnum,
  results: jobResultSchema.array(),

  previousJobId: zid('jobs').optional(),
  messageId: zid('messages'),
  threadId: zid('threads'),

  metrics: z
    .object({
      startTime: z.number().optional(),
      endTime: z.number().optional(),
    })
    .optional(),
}
