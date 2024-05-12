import { zid } from 'convex-helpers/server/zod'

import { mutation } from './functions'
import { threadFields } from './schema'
import { generateRid } from './utils'

// *** public queries ***
export const create = mutation({
  args: {
    title: threadFields.title,
  },
  handler: async (ctx, { title }) => {
    const user = await ctx.viewerX()
    const rid = await generateRid(ctx, 'threads')
    const threadId = await ctx
      .table('threads')
      .insert({ title, userId: user._id, rid, private: true })
    return threadId
  },
})

export const remove = mutation({
  args: {
    threadId: zid('threads'),
  },
  handler: async (ctx, { threadId }) => {
    await ctx.table('threads').getX(threadId).delete()
  },
})
// *** end public queries ***
