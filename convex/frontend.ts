import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

import { external } from './external'
import { mutation, query } from './functions'
import { getMessageEntXL } from './messages'
import { ridField, threadFields } from './schema'
import { emptyPage, generateRid, zPaginationOptValidator } from './utils'

export const listThreads = query({
  args: {
    limit: z.number().gte(1).lte(100).default(20),
  },
  handler: async (ctx, { limit }) => {
    const viewerId = ctx.viewerId
    if (!viewerId) return []

    return await ctx
      .table('threads', 'userId', (q) => q.eq('userId', viewerId))
      .order('desc')
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .take(limit)
      .map((thread) => external.unit.thread.parse(thread))
  },
})

export const listThreadMessages = query({
  args: {
    threadId: zid('threads'),
    limit: z.number().gte(1).lte(100).default(20),
  },
  handler: async (ctx, { threadId, limit }) => {
    const thread = await ctx.table('threads').getX(threadId)
    const messages = await thread
      .edge('messages')
      .order('desc')
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .take(limit)
      .map((message) => external.unit.message.parse(message))

    return messages
  },
})

export const getMessage = query({
  args: {
    messageId: zid('messages'),
  },
  handler: async (ctx, { messageId }) => {
    const message = await ctx.table('messages').getX(messageId)
    return external.unit.message.parse(message)
  },
})
