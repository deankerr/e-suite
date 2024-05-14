import { z } from 'zod'

import { validators } from '../external'
import { query } from '../functions'

export const get = query({
  args: {
    rid: z.string(),
  },
  handler: async (ctx, { rid }) => {
    const message = await ctx.table('messages', 'rid', (q) => q.eq('rid', rid)).unique()
    if (!message || message.deletionTime) return { message: null, images: null }

    const images = await message
      .edge('generated_images')
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .map((image) => validators.generatedImage.parse(image))
    return { message: validators.message.parse(message), images }
  },
})
