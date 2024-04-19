import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

import { internal } from './_generated/api'
import { slugIdLength } from './constants'
import { mutation, query } from './functions'
import { generateRandomString, zPaginationOptValidator } from './lib/utils'
import { generationFields, messageFields } from './schema'
import { runWithRetries } from './utils'

import type { MutationCtx } from './types'

const generateSlugId = async (ctx: MutationCtx): Promise<string> => {
  const slugId = generateRandomString(slugIdLength)
  const existing = await ctx.table('messages', 'slugId', (q) => q.eq('slugId', slugId)).first()
  return existing ? generateSlugId(ctx) : slugId
}

export const create = mutation({
  args: {
    threadId: zid('threads'),
    message: z.object(messageFields),
    generation: z.object(generationFields).optional(),
  },
  handler: async (ctx, { threadId, message, generation }) => {
    const slugId = await generateSlugId(ctx)
    const messageId = await ctx.table('messages').insert({ threadId, ...message, slugId })

    if (generation) {
      const generationId = await ctx.table('generations').insert({
        ...generation,
        messageId,
      })

      await runWithRetries(ctx, internal.generation.textToImage, { generationId })
    }

    return messageId
  },
})

export const get = query({
  args: {
    messageId: zid('messages'),
  },
  handler: async (ctx, { messageId }) => {
    const message = await ctx.table('messages').getX(messageId)
    return message
  },
})

export const getBySlugId = query({
  args: {
    slugId: z.string(),
  },
  handler: async (ctx, { slugId }) => {
    const thread = await ctx.table('messages', 'slugId', (q) => q.eq('slugId', slugId)).firstX()
    return thread
  },
})

export const list = query({
  args: {
    threadId: zid('threads'),
    order: z.enum(['asc', 'desc']).default('asc'),
    paginationOpts: zPaginationOptValidator,
  },
  handler: async (ctx, { threadId, order, paginationOpts }) => {
    const messages = await ctx
      .table('messages', 'threadId', (q) => q.eq('threadId', threadId))
      .order(order)
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .paginate(paginationOpts)

    return messages
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
