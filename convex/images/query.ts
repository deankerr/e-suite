import { z } from 'zod'

import { internalQuery } from '../functions'

export const get = internalQuery({
  args: {
    imageId: z.string(),
  },
  handler: async (ctx, { imageId }) => {
    const id = ctx.unsafeDb.normalizeId('images', imageId)
    return id ? await ctx.table('images').get(id) : null
  },
})
