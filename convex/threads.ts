import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

import { external } from './external'
import { mutation, query } from './functions'
import { getMessageEntXL } from './messages'
import { ridField, threadFields } from './schema'
import { emptyPage, generateRid, zPaginationOptValidator } from './utils'

// *** public queries ***
export const get = query({
  args: {
    rid: ridField,
  },
  handler: async (ctx, { rid }) => {
    const thread = await ctx.table('threads', 'rid', (q) => q.eq('rid', rid)).unique()
    if (!thread || thread.deletionTime) return null

    return external.unit.thread.parse(thread)
  },
})

export const list = query({
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
  },
})

export const messages = query({
  args: {
    rid: ridField,
    order: z.enum(['asc', 'desc']).default('desc'),
    paginationOpts: zPaginationOptValidator,
  },
  handler: async (ctx, { rid, order, paginationOpts }) => {
    const thread = await ctx.table('threads', 'rid', (q) => q.eq('rid', rid)).unique()
    if (!thread) return emptyPage()

    const pager = await ctx
      .table('messages', 'threadId', (q) => q.eq('threadId', thread._id))
      .order(order)
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .paginate(paginationOpts)
      .map(async (message) => await getMessageEntXL(ctx, message))

    return pager
  },
})
// *** end public queries ***

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
