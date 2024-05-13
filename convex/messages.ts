import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

import { internal } from './_generated/api'
import { createCompletionJob } from './completion'
import { internalQuery, mutation, query } from './functions'
import { completionParameters, generationParameters, messageFields, ridField } from './schema'
import { generateRid } from './utils'

// *** public queries ***
// next.js page title/description
export const getPageMetadata = query({
  args: {
    rid: ridField,
  },
  handler: async (ctx, { rid }) => {
    const message = await ctx.table('messages', 'rid', (q) => q.eq('rid', rid)).unique()
    if (!message || message.deletionTime) return null

    const title = `Message from ${message.name ?? message.role}`
    const description = `it's the e/suite - ${title}`

    return {
      title,
      description,
    }
  },
})

export const create = mutation({
  args: {
    threadId: zid('threads'),
    message: z.object(messageFields),
    completions: completionParameters.array().optional(),
    generations: generationParameters.array().optional(),
    private: z.boolean().default(true),
  },
  handler: async (
    ctx,
    { threadId, message: messageFields, completions = [], generations = [], ...args },
  ) => {
    const rid = await generateRid(ctx, 'messages')
    const user = await ctx.viewerX()

    const message = await ctx
      .table('messages')
      .insert({ threadId, ...messageFields, rid, userId: user._id, private: args.private })
      .get()

    const asstMessageId =
      message.role !== 'assistant' && completions.length > 0
        ? await ctx
            .table('messages')
            .insert({
              threadId,
              role: 'assistant',
              rid: await generateRid(ctx, 'messages'),
              userId: user._id,
              private: args.private,
            })
        : null

    for (const parameters of completions) {
      await createCompletionJob(ctx, { parameters, messageId: asstMessageId ?? message._id })
    }

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
// *** end public queries ****

const messageContextAmount = 20
export const getContext = internalQuery({
  args: {
    messageId: zid('messages'),
  },
  handler: async (ctx, { messageId }) => {
    const targetMessage = await ctx.table('messages').getX(messageId)
    const thread = await targetMessage.edgeX('thread')

    const contextMessages = await ctx
      .table('messages', 'threadId', (q) => q.eq('threadId', thread._id))
      .order('desc')
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .filter((q) => q.lt(q.field('_creationTime'), targetMessage._creationTime))
      .filter((q) => q.neq(q.field('text'), undefined))
      .take(messageContextAmount)
      .map(({ role, name, text }) => ({ role, name, content: text! }))

    const messages = contextMessages.toReversed()

    return messages
  },
})
