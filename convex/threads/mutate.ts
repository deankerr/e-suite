import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

import { internalMutation, mutation } from '../functions'
import { createJob } from '../jobs/runner'
import { defaultChatInferenceConfig, defaultImageInferenceConfig } from '../shared/defaults'
import { inferenceAttachmentSchema } from '../shared/structures'
import { insist } from '../shared/utils'
import { generateSlug } from '../utils'
import { getValidThreadBySlugOrId } from './query'
import { messageFields, zMessageName, zMessageTextContent, zThreadTitle } from './schema'

import type { EMessageRole } from '../shared/structures'
import type { Ent } from '../types'

//* helpers
const getNextMessageSeries = async (thread: Ent<'threads'>) => {
  const prev = await thread.edge('messages').order('desc').first()
  return (prev?.series ?? 0) + 1
}

//* mutations
export const createThread = mutation({
  args: {
    title: zThreadTitle.optional(),
    inference: inferenceAttachmentSchema.optional(),
    default: z.enum(['chat', 'image']).default('chat'),
  },
  handler: async (ctx, args) => {
    const user = await ctx.viewerX()
    const slug = await generateSlug(ctx)

    await ctx.table('threads').insert({
      title: args.title,
      userId: user._id,
      slug,
      config:
        args.inference ?? args.default === 'chat'
          ? defaultChatInferenceConfig
          : defaultImageInferenceConfig,
      saved: [],
    })
    return slug
  },
})

export const removeThread = mutation({
  args: {
    slug: z.string(),
  },
  handler: async (ctx, args) => {
    const thread = await getValidThreadBySlugOrId(ctx, args.slug)
    insist(thread, 'invalid thread')
    return await ctx.table('threads').getX(thread._id).delete()
  },
})

export const updateThreadTitle = mutation({
  args: {
    slug: z.string(),
    title: zThreadTitle,
  },
  handler: async (ctx, args) => {
    const thread = await getValidThreadBySlugOrId(ctx, args.slug)
    insist(thread, 'invalid thread')
    return await ctx.table('threads').getX(thread._id).patch({ title: args.title })
  },
})

export const updateThreadConfig = mutation({
  args: {
    threadId: z.string(),
    config: inferenceAttachmentSchema,
  },
  handler: async (ctx, args) => {
    const thread = await getValidThreadBySlugOrId(ctx, args.threadId)
    insist(thread, 'invalid thread')
    return await ctx
      .table('threads')
      .getX(thread._id)
      .patch({ config: { ...args.config, updatedTime: Date.now() } })
  },
})

export const createMessage = mutation({
  args: {
    threadId: z.string(),
    message: z.object(messageFields),
  },
  handler: async (ctx, args) => {
    const user = await ctx.viewerX()
    const thread = await getValidThreadBySlugOrId(ctx, args.threadId)
    insist(thread, 'invalid thread')

    const series = await getNextMessageSeries(thread)

    const messageId = await ctx.table('messages').insert({
      ...args.message,
      threadId: thread._id,
      series,
      userId: user._id,
    })

    if (args.message.inference && args.message.role === 'assistant') {
      if (args.message.inference.type === 'chat-completion') {
        await createJob(ctx, 'inference/chat-completion', {
          messageId,
        })
      }

      if (args.message.inference.type === 'text-to-image') {
        await createJob(ctx, 'inference/text-to-image', {
          messageId,
        })

        //* tti title generation
        if (!thread.title) {
          await ctx
            .table('threads')
            .getX(thread._id)
            .patch({ title: `Images: ${args.message.inference.parameters.prompt.slice(0, 256)}` })
        }
      }
    }

    return messageId
  },
})

export const editMessage = mutation({
  args: {
    messageId: zid('messages'),
    role: z
      .string()
      .refine((role) => ['user', 'assistant', 'system'].includes(role), 'invalid role'),
    name: zMessageName.optional(),
    text: zMessageTextContent.optional(),
  },
  handler: async (ctx, { messageId, role, name, text }) => {
    const id = ctx.unsafeDb.normalizeId('messages', messageId)
    return id
      ? await ctx
          .table('messages')
          .getX(id)
          .patch({
            role: role as EMessageRole,
            name: name || undefined,
            content: text || undefined,
          })
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

export const streamCompletionContent = internalMutation({
  args: {
    messageId: zid('messages'),
    text: z.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.table('messages').getX(args.messageId).patch({ content: args.text })
  },
})
