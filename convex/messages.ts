import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

import { internal } from './_generated/api'
import { external } from './external'
import { mutation, query } from './functions'
import { generationFields, messageFields, ridField } from './schema'
import { generateRid, runWithRetries, zPaginationOptValidator } from './utils'

export const create = mutation({
  args: {
    threadId: zid('threads'),
    message: z.object(messageFields),
    generation: z.object(generationFields).optional(),
  },
  handler: async (ctx, { threadId, message, generation }) => {
    const rid = await generateRid(ctx, 'messages')
    const user = await ctx.viewerX()
    const messageId = await ctx
      .table('messages')
      .insert({ threadId, ...message, rid, userId: user._id, private: true })

    if (generation) {
      const generationId = await ctx.table('generations').insert({ ...generation, messageId })

      // schedule one job per dimension
      await Promise.all(
        generation.dimensions.map(async (dimensions) => {
          await runWithRetries(ctx, internal.generation.textToImage, { generationId, dimensions })
        }),
      )
    }

    return messageId
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

export const get = query({
  args: {
    rid: ridField,
  },
  handler: async (ctx, { rid }) => {
    const message = await ctx.table('messages', 'rid', (q) => q.eq('rid', rid)).firstX()

    const generation = await ctx
      .table('generations', 'messageId', (q) => q.eq('messageId', message._id))
      .first()

    const generated_images = generation
      ? await ctx.table('generated_images', 'messageId', (q) => q.eq('messageId', message._id))
      : null

    const xl = {
      data: message,
      generation,
      generated_images,
    }

    return external.xl.message.parse(xl)
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
      .map(async (message) => {
        const generation = await ctx
          .table('generations', 'messageId', (q) => q.eq('messageId', message._id))
          .first()

        const generated_images = generation
          ? await ctx.table('generated_images', 'messageId', (q) => q.eq('messageId', message._id))
          : null

        return {
          data: message,
          generation,
          generated_images,
        }
      })

    return {
      ...pager,
      page: external.xl.message.array().parse(pager.page),
    }
  },
})
