import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

import { external } from './external'
import { mutation, query } from './functions'
import { runGenerationInference } from './generation'
import { messageFields, ridField } from './schema'
import { generateRid, zPaginationOptValidator } from './utils'

import type { Ent, QueryCtx } from './types'

export const create = mutation({
  args: {
    threadId: zid('threads'),
    message: z.object(messageFields),
  },
  handler: async (ctx, { threadId, message: messageFields }) => {
    const rid = await generateRid(ctx, 'messages')
    const user = await ctx.viewerX()

    const message = await ctx
      .table('messages')
      .insert({ threadId, ...messageFields, rid, userId: user._id, private: true })
      .get()

    if (message.inference?.generation) await runGenerationInference(ctx, message)

    return message._id
  },
})

export const remove = mutation({
  args: {
    messageId: zid('messages'),
  },
  handler: async (ctx, { messageId }) => {
    await ctx.table('messages').getX(messageId).delete()
  },
})

export const getMessageEntXL = async (ctx: QueryCtx, message: Ent<'messages'>) => {
  const generations = await message.edge('generations').map(async (generation) => ({
    ...generation,
    image: await generation.edge('generated_image'),
  }))

  const xl = {
    message,
    generations: generations.length ? generations : null,
  }

  return external.xl.message.parse(xl)
}

export const get = query({
  args: {
    rid: ridField,
  },
  handler: async (ctx, { rid }) => {
    const message = await ctx.table('messages', 'rid', (q) => q.eq('rid', rid)).firstX()
    return await getMessageEntXL(ctx, message)
  },
})

export const list = query({
  args: {
    order: z.enum(['asc', 'desc']).default('desc'),
    paginationOpts: zPaginationOptValidator,
  },
  handler: async (ctx, { order, paginationOpts }) => {
    const pager = await ctx
      .table('messages')
      .order(order)
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .paginate(paginationOpts)
      .map(async (message) => await getMessageEntXL(ctx, message))

    return pager
  },
})
