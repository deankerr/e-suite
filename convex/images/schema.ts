import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

export const imageFields = {
  width: z.number(),
  height: z.number(),

  originUrl: z.string(),
  originFileId: zid('_storage'),

  // optimized
  fileId: zid('_storage'),
  sourceSet: z.object({ width: z.number(), fileId: zid('_storage') }).array(),

  blurDataUrl: z.string(),
  color: z.string(),

  generationData: z.tuple([z.string(), z.string()]).array(),
}
