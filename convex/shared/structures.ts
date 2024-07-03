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
