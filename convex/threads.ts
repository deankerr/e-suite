import { zid } from 'convex-helpers/server/zod'
import z from 'zod'

import { mutation, query } from './functions'
import { getSlug } from './lib/slug'
import { createMessage } from './messages'
import { messagesFields, threadsFields } from './schema'

const publicThreadsSchema = z.object({
  ...threadsFields,
  _id: zid('threads'),
  _creationTime: z.number(),
})

//* CRUD
export const create = mutation({
  args: {
    ...threadsFields,
    messages: z.object(messagesFields).array().optional(),
  },
  handler: async (ctx, { messages = [], ...fields }) => {
    const user = await ctx.viewerX()
    const slug = await getSlug(ctx, 'threads')
    const threadId = await ctx.table('threads').insert({ ...fields, userId: user._id, slug })

    for (const message of messages) await createMessage(ctx, { threadId, message })

    return threadId
  },
})

export const get = query({
  args: {
    threadId: zid('threads'),
  },
  handler: async (ctx, { threadId }) => {
    const thread = await ctx.table('threads').getX(threadId)
    return publicThreadsSchema.parse(thread)
  },
})

export const list = query({
  args: {
    limit: z.number().gte(1).lte(100).default(20),
  },
  handler: async (ctx, { limit }) => {
    const user = await ctx.viewerX()
    return await ctx
      .table('threads', 'userId', (q) => q.eq('userId', user._id))
      .order('desc')
      .take(limit)
      .map((thread) => publicThreadsSchema.parse(thread))
  },
})
