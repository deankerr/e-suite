import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

import { internal } from './_generated/api'
import { external } from './external'
import { mutation, query } from './functions'
import { generationParameters, messageFields, ridField } from './schema'
import { generateRid } from './utils'

import type { Ent, QueryCtx } from './types'

// *** public queries ***
// eslint-disable-next-line @typescript-eslint/require-await
export const getMessageEntXL = async (ctx: QueryCtx, message: Ent<'messages'>) => {
  const xl = {
    message,
    generated_images: await message.edge('generated_images'),
  }

  return external.xl.message.parse(xl)
}

export const get = query({
  args: {
    rid: ridField,
  },
  handler: async (ctx, { rid }) => {
    const message = await ctx.table('messages', 'rid', (q) => q.eq('rid', rid)).unique()
    if (!message || message.deletionTime) return null

    return await getMessageEntXL(ctx, message)
  },
})

// agent
export const getById = query({
  args: {
    messageId: zid('messages'),
  },

  handler: async (ctx, { messageId }) => {
    const message = await ctx.table('messages').getX(messageId)
    if (message.deletionTime) return null
    return external.unit.message.parse(message)
  },
})

// next.js page title/description
export const getPageMetadata = query({
  args: {
    rid: ridField,
  },
  handler: async (ctx, { rid }) => {
    const message = await ctx.table('messages', 'rid', (q) => q.eq('rid', rid)).unique()
    if (!message || message.deletionTime) return null

    const title = `Message from ${message.name ?? message.role}`
    // const icon = generations.length ? ' ✴️' : ''
    const description = `it's the e/suite - ${title}`

    return {
      title,
      description,
    }
  },
})
// *** end public queries ****

export const create = mutation({
  args: {
    threadId: zid('threads'),
    message: z.object(messageFields),
    generations: generationParameters.array().optional(),
    private: z.boolean().default(true),
  },
  handler: async (ctx, { threadId, message: messageFields, generations = [], ...args }) => {
    const rid = await generateRid(ctx, 'messages')
    const user = await ctx.viewerX()

    const message = await ctx
      .table('messages')
      .insert({ threadId, ...messageFields, rid, userId: user._id, private: args.private })
      .get()

    for (const parameters of generations) {
      const generationJobId = await ctx
        .table('generation_jobs')
        .insert({ parameters, messageId: message._id, status: 'pending' })

      await ctx.scheduler.runAfter(0, internal.generation_jobs.run, { generationJobId })
    }

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
