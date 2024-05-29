import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

export const imageFileSchema = z.object({
  fileId: zid('_storage'),
  isOriginFile: z.boolean(),

  category: z.literal('image'),
  format: z.string(),

  width: z.number(),
  height: z.number(),

  imageId: zid('images'),
})

export const jobSchema = z.object({
  name: z.string(),
  status: z.enum(['queued', 'active', 'complete', 'failed']),
  errors: z
    .object({
      code: z.string(),
      message: z.string(),
      fatal: z.boolean(),
    })
    .array()
    .optional(),

  queuedTime: z.number(),
  startedTime: z.number().optional(),
  endedTime: z.number().optional(),
})

export type EImage = z.infer<typeof imageSchema>
export const imageSchema = z.object({
  _id: zid('images'),
  _creationTime: z.number(),
  deletionTime: z.undefined(),

  width: z.number(),
  height: z.number(),
  blurDataUrl: z.string(),
  color: z.string(),
})

export const threadSchema = z.object({
  _id: zid('threads'),
  _creationTime: z.number(),
  deletionTime: z.undefined(),

  title: z.string().optional(),
  slug: z.string(),
})

export const userSchema = z.object({
  _id: zid('users'),
  _creationTime: z.number(),
  deletionTime: z.undefined(),

  name: z.string(),
  imageUrl: z.string(),
  role: z.enum(['user', 'admin']),
})
