import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

export const jobStatusEnum = z.enum(['queued', 'active', 'complete', 'failed'])

export const jobErrorSchema = z.object({
  code: z.enum([
    'unhandled',
    'invalid_acquire_job',
    'invalid_job_input',
    'invalid_job_output',
    'timeout',
    'endpoint_error',
    'invalid_error_code',
  ]),
  message: z.string(),
  fatal: z.boolean(),
})

export const jobAttributeFields = {
  threadId: zid('threads').optional(),
  messageId: zid('messages').optional(),
  imageId: zid('images').optional(),

  url: z.string().optional(),
  width: z.number().optional(),
}

export const jobFields = {
  name: z.string(),
  status: jobStatusEnum,
  errors: jobErrorSchema.array().optional(),

  queuedTime: z.number(),
  startedTime: z.number().optional(),
  endedTime: z.number().optional(),

  ...jobAttributeFields,
}
