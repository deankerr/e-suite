import { z } from 'zod'

import { mutation } from '../functions'
import { createJob } from '../jobs/manage'
import { generateSlug, insist } from '../utils'
import { zThreadTitle } from '../validators'
import { getBySlugOrId } from './query'
import { inferenceSchema, messageFields } from './schema'

export const createThread = mutation({
  args: {
    title: zThreadTitle.optional(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.viewerX()
    const slug = await generateSlug(ctx)

    await ctx.table('threads').insert({ ...args, userId: user._id, slug })
    return slug
  },
})

export const removeThread = mutation({
  args: {
    threadId: z.string(),
  },
  handler: async (ctx, args) => {
    const id = ctx.unsafeDb.normalizeId('threads', args.threadId)
    return id ? await ctx.table('threads').getX(id).delete() : null
  },
})

export const renameThread = mutation({
  args: {
    threadId: z.string(),
    title: zThreadTitle,
  },
  handler: async (ctx, args) => {
    const id = ctx.unsafeDb.normalizeId('threads', args.threadId)
    return id ? await ctx.table('threads').getX(id).patch({ title: args.title }) : null
  },
})

export const completeThreadTitle = mutation({
  args: {
    threadId: z.string(),
  },
  handler: async (ctx, args) => {
    const id = ctx.unsafeDb.normalizeId('threads', args.threadId)
    if (!id) return
    const thread = await ctx.table('threads').getX(id)
    const message = await thread.edge('messages').firstX()
    return id
      ? await createJob(ctx, { type: 'title-completion', threadId: id, messageId: message._id })
      : null
  },
})

export const createMessage = mutation({
  args: {
    threadSlug: z.string(),
    message: z.object(messageFields),
    inference: inferenceSchema.optional(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.viewerX()

    const thread = await getBySlugOrId(ctx, args.threadSlug)
    insist(thread && !thread.deletionTime, 'invalid thread')
    const threadId = thread._id

    const lastMessage = await ctx
      .table('messages', 'threadId', (q) => q.eq('threadId', threadId))
      .order('desc')
      .first()
    const series = lastMessage?.series ?? 0

    const messageId = await ctx.table('messages').insert({
      threadId,
      ...args.message,
      series: series + 1,
      userId: user._id,
    })

    if (!args.inference) return messageId

    // todo could get created without valid job
    const targetMessageId =
      args.message.role === 'assistant'
        ? messageId
        : await ctx.table('messages').insert({
            threadId,
            role: 'assistant',
            series: series + 2,
            userId: user._id,
            inference: args.inference,
          })

    if (args.inference.type === 'chat-completion') {
      await createJob(ctx, { type: 'chat-completion', messageId: targetMessageId, threadId })
    }

    if (args.inference.type === 'text-to-image') {
      await createJob(ctx, { type: 'text-to-image', messageId: targetMessageId, threadId })
    }

    return targetMessageId
  },
})

export const removeMessage = mutation({
  args: {
    messageId: z.string(),
  },
  handler: async (ctx, args) => {
    const id = ctx.unsafeDb.normalizeId('messages', args.messageId)
    return id ? await ctx.table('messages').getX(id).delete() : null
  },
})
