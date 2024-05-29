import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

import { internalMutation, mutation } from '../functions'
import { createJob } from '../jobs/runner'
import {
  chatCompletionInferenceSchema,
  inferenceAttachmentSchema,
  textToImageInferenceSchema,
} from '../shared/structures'
import { insist } from '../shared/utils'
import { generateSlug } from '../utils'
import { getValidThreadBySlugOrId } from './query'
import { messageFields, zMessageName, zMessageTextContent, zThreadTitle } from './schema'

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
    primary: z.enum(['chatCompletion', 'textToImage']).default('chatCompletion'),
    chatCompletion: chatCompletionInferenceSchema.optional(),
    textToImage: textToImageInferenceSchema.optional(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.viewerX()
    const slug = await generateSlug(ctx)

    await ctx.table('threads').insert({
      title: args.title,
      userId: user._id,
      slug,
      inferenceConfig: {
        primary: args.primary,
        chatCompletion: args.chatCompletion ?? {
          type: 'chat-completion',
          endpoint: 'together',
          parameters: {
            model: 'meta-llama/Llama-3-70b-chat-hf',
          },
        },
        textToImage: args.textToImage ?? {
          type: 'text-to-image',
          endpoint: 'fal',
          parameters: {
            model: 'fal-ai/hyper-sdxl',
            prompt: '',
            width: 1024,
            height: 1024,
            n: 4,
          },
        },
        custom: [],
      },
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

export const updateInferenceConfig = mutation({
  args: {
    threadId: z.string(),
    config: inferenceAttachmentSchema,
  },
  handler: async (ctx, args) => {
    const thread = await getValidThreadBySlugOrId(ctx, args.threadId)
    insist(thread, 'invalid thread')

    switch (args.config.type) {
      case 'chat-completion':
        return await ctx
          .table('threads')
          .getX(thread._id)
          .patch({
            inferenceConfig: {
              ...thread.inferenceConfig,
              chatCompletion: args.config,
            },
          })
      case 'text-to-image':
        return await ctx
          .table('threads')
          .getX(thread._id)
          .patch({
            inferenceConfig: {
              ...thread.inferenceConfig,
              textToImage: args.config,
            },
          })
    }
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
      }
    }

    return messageId
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

export const streamCompletionContent = internalMutation({
  args: {
    messageId: zid('messages'),
    text: z.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.table('messages').getX(args.messageId).patch({ content: args.text })
  },
})
