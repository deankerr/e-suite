import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

import { validators } from '../external'
import { query } from '../functions'
import { emptyPage, zPaginationOptValidator } from '../utils'

export const get = query({
  args: {
    rid: z.string(),
  },
  handler: async (ctx, { rid }) => {
    const thread = await ctx.table('threads', 'rid', (q) => q.eq('rid', rid)).unique()
    if (!thread || thread.deletionTime) return null
    return validators.thread.parse(thread)
  },
})

export const list = query({
  args: {
    order: z.enum(['asc', 'desc']).default('desc'),
    paginationOpts: zPaginationOptValidator,
  },
  handler: async (ctx, { order, paginationOpts }) => {
    const viewerId = ctx.viewerId
    if (!viewerId) return emptyPage()

    const pager = await ctx
      .table('threads', 'userId', (q) => q.eq('userId', viewerId))
      .order(order)
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .paginate(paginationOpts)
      .map((thread) => validators.thread.parse(thread))

    return pager
  },
})

export const messages = query({
  args: {
    threadId: zid('threads'),
    order: z.enum(['asc', 'desc']).default('desc'),
    paginationOpts: zPaginationOptValidator,
  },
  handler: async (ctx, { threadId, order, paginationOpts }) => {
    const pager = await ctx
      .table('messages', 'threadId', (q) => q.eq('threadId', threadId))
      .order(order)
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .paginate(paginationOpts)
      .map(async (m) => {
        const message = validators.message.parse(m)
        const images = await m.edge('generated_images')

        return {
          ...message,
          images: validators.generatedImage.array().parse(images),
        }
      })

    return pager
  },
})
