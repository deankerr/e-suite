import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

import { external } from './external'
import { mutation, query } from './functions'
import { getGenerationXL, runGenerationInference } from './generation'
import { messageFields, ridField } from './schema'
import { generateRid, zPaginationOptValidator } from './utils'

import type { Ent, QueryCtx } from './types'

export const create = mutation({
  args: {
    threadId: zid('threads'),
    message: z.object(messageFields),
    private: z.boolean().default(true),
  },
  handler: async (ctx, { threadId, message: messageFields, ...args }) => {
    const rid = await generateRid(ctx, 'messages')
    const user = await ctx.viewerX()

    const message = await ctx
      .table('messages')
      .insert({ threadId, ...messageFields, rid, userId: user._id, private: args.private })
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

export const getById = query({
  args: {
    messageId: zid('messages'),
  },

  handler: async (ctx, { messageId }) => {
    const message = await ctx.table('messages').getX(messageId)
    return external.unit.message.parse(message)
  },
})

export const getMessageEntXL = async (ctx: QueryCtx, message: Ent<'messages'>) => {
  const generations = await message
    .edge('generations')
    .map(async (generation) => await getGenerationXL(ctx, generation))

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

export const getPageMetadata = query({
  args: {
    rid: ridField,
  },
  handler: async (ctx, { rid }) => {
    const message = await ctx.table('messages', 'rid', (q) => q.eq('rid', rid)).firstX()
    const generations = await message.edge('generations')
    const title = generations?.[0]?.prompt ?? `Message from ${message.name ?? message.role}`
    // const icon = generations.length ? ' ✴️' : ''
    const description = `it's the e/suite - ${title}`

    return {
      title,
      description,
    }
  },
})
