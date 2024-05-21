import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

import { internalMutation, mutation } from '../functions'
import { createJob } from '../jobs/manage'
import { insist } from '../shared/utils'
import { generateSlug } from '../utils'
import { getValidThread } from './query'
import {
  inferenceSchema,
  messageFields,
  zMessageName,
  zMessageTextContent,
  zThreadTitle,
} from './schema'

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
    slug: z.string(),
  },
  handler: async (ctx, args) => {
    const thread = await getValidThread(ctx, args.slug)
    insist(thread, 'invalid thread')
    return await ctx.table('threads').getX(thread._id).delete()
  },
})

export const renameThread = mutation({
  args: {
    slug: z.string(),
    title: zThreadTitle,
  },
  handler: async (ctx, args) => {
    const thread = await getValidThread(ctx, args.slug)
    insist(thread, 'invalid thread')
    return await ctx.table('threads').getX(thread._id).patch({ title: args.title })
  },
})

export const completeThreadTitle = mutation({
  args: {
    slug: z.string(),
  },
  handler: async (ctx, args) => {
    const thread = await getValidThread(ctx, args.slug)
    insist(thread, 'invalid thread')

    const message = await thread.edge('messages').firstX()
    return await createJob(ctx, {
      type: 'title-completion',
      threadId: thread._id,
      messageId: message._id,
    })
  },
})

export const createMessage = mutation({
  args: {
    slug: z.string(),
    message: z.object(messageFields),
    inference: inferenceSchema.optional(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.viewerX()

    const thread = await getValidThread(ctx, args.slug)
    insist(thread, 'invalid thread')
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

export const editMessage = mutation({
  args: {
    messageId: zid('messages'),
    role: z.enum(['user', 'assistant', 'system']),
    name: zMessageName.optional(),
    text: zMessageTextContent,
  },
  handler: async (ctx, { messageId, role, name, text }) => {
    const id = ctx.unsafeDb.normalizeId('messages', messageId)
    return id
      ? await ctx
          .table('messages')
          .getX(id)
          .patch({ role, name: name || undefined, content: text })
      : null
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

export const updateMessage = internalMutation({
  args: {
    messageId: z.string(),
    text: z.string(),
  },
  handler: async (ctx, args) => {
    const id = ctx.unsafeDb.normalizeId('messages', args.messageId)
    return id ? await ctx.table('messages').getX(id).patch({ content: args.text }) : null
  },
})
