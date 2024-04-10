/* eslint-disable @typescript-eslint/no-unused-vars */
import { internalMutation } from '../functions'
import { getSlug } from './slug'

export const migThreads = internalMutation({
  args: {},
  handler: async (ctx) => {
    const threads = await ctx.unsafeDb.query('threads').collect()

    for (const thread of threads) {
      if (thread.slug) continue
      const slug = await getSlug(ctx, 'threads')
      await ctx.unsafeDb.patch(thread._id, { slug, permissions: { public: false } })
    }
  },
})
