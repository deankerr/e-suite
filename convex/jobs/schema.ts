import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

export type JobTypes = z.infer<typeof jobTypesEnum>

export const jobStatusEnum = z.enum(['queued', 'active', 'complete', 'failed'])
export const jobTypesEnum = z.enum([
  'chat-completion',
  'title-completion',
  'text-to-image',
  'text-to-speech',
  'fetch-image',
])
export const jobResultTypesEnum = z.enum(['message', 'url', 'error', 'openai-chat-completion-json'])

export const jobResultSchema = z.object({ type: jobResultTypesEnum, value: z.string() })

export const jobFields = {
  type: jobTypesEnum,
  status: jobStatusEnum,
  results: jobResultSchema.array(),

  messageId: zid('messages'),
  threadId: zid('threads'),

  metrics: z
    .object({
      active: z.object({
        startedTime: z.number(),
        endedTime: z.number(),
      }),
    })
    .optional(),
}
