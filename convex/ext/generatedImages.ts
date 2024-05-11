import { z } from 'zod'

import { validators } from '../external'
import { query } from '../functions'

export const get = query({
  args: {
    rid: z.string(),
  },
  handler: async (ctx, { rid }) => {
    const generatedImage = await ctx
      .table('generated_images', 'rid', (q) => q.eq('rid', rid))
      .unique()
    if (!generatedImage || generatedImage.deletionTime) return null
    return validators.generatedImage.parse(generatedImage)
  },
})
