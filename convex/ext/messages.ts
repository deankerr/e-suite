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

export const latest = query({
  args: {},
  handler: async (ctx) => {
    const userId = ctx.viewerId
    if (!userId) return null

    const messages = await ctx
      .table('messages', 'userId', (q) => q.eq('userId', userId))
      .order('desc')
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .take(20)
      .map(async (m) => {
        const message = validators.message.parse(m)
        const images = await m.edge('generated_images')

        return {
          ...message,
          images: validators.generatedImage.array().parse(images),
        }
      })
    return messages
  },
})
