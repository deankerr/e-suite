import { asyncMap } from 'convex-helpers'
import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

import { internalMutation, mutation, query } from '../functions'
import { createJob } from '../jobs'
import { defaultChatInferenceConfig } from '../shared/defaults'
import { getMessageShape, getThreadShape } from '../shared/shape'
import {
  fileAttachmentRecordWithContentSchema,
  inferenceSchema,
  messageRolesEnum,
  metadataKVSchema,
} from '../shared/structures'
import { zMessageName, zMessageTextContent } from '../shared/utils'
import { generateSlug } from '../utils'
import { getThreadBySlugOrId } from './threads'

import type { Id } from '../_generated/dataModel'
import type { Ent, QueryCtx } from '../types'

const getNextMessageSeries = async (thread: Ent<'threads'>) => {
  const prev = await thread.edge('messages').order('desc').first()
  return (prev?.series ?? 0) + 1
}

const getFileAttachmentContent = async (ctx: QueryCtx, files?: Ent<'messages'>['files']) => {
  if (!files) return undefined
  const filesWithContent = await asyncMap(files, async (file) => {
    if (file.type === 'image') {
      return {
        ...file,
        image: await ctx.table('images').get(file.id),
      }
    }

    return file
  })
  // ? replace
  return fileAttachmentRecordWithContentSchema.array().parse(filesWithContent)
}

const getMessageJobs = async (ctx: QueryCtx, message: Ent<'messages'>) => {
  const jobs = await ctx.table('jobs', 'messageId', (q) => q.eq('messageId', message._id))
  return jobs
}

const getMessageEdges = async (ctx: QueryCtx, message: Ent<'messages'>) => {
  const shape = getMessageShape(message)
  return {
    ...shape,
    files: await getFileAttachmentContent(ctx, message.files),
    jobs: await getMessageJobs(ctx, message),
    speech: message.speechId ? await ctx.table('speech').get(message.speechId) : undefined,
  }
}

//* get single message by slug:series
export const getSeries = query({
  args: {
    slug: z.string(),
    series: z.number(),
  },
  handler: async (ctx, args) => {
    const thread = await getThreadBySlugOrId(ctx, args.slug)
    if (!thread) return null

    const messages = await ctx
      .table('messages', 'threadId_series', (q) =>
        q.eq('threadId', thread._id).eq('series', args.series),
      )
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .map(async (message) => await getMessageEdges(ctx, message))

    return {
      thread: getThreadShape(thread),
      messages: messages.reverse(),
    }
  },
})

export const list = query({
  args: {
    threadId: z.string(),
    limit: z.number().max(200).default(50),
    order: z.enum(['asc', 'desc']).default('desc'),
  },
  handler: async (ctx, args) => {
    const threadId = ctx.unsafeDb.normalizeId('threads', args.threadId)
    if (!threadId) return []

    const messages = await ctx
      .table('messages', 'threadId', (q) => q.eq('threadId', threadId))
      .order(args.order)
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .take(args.limit)
      .map(async (message) => await getMessageEdges(ctx, message))

    return messages.reverse()
  },
})

// TODO dedupe/clarify run
export const create = mutation({
  args: {
    threadId: z.string().optional(),
    message: z.object({
      name: zMessageName.optional(),
      content: zMessageTextContent.optional(),
    }),
    inference: inferenceSchema.optional(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.viewerX()
    const thread = args.threadId
      ? await ctx
          .table('threads')
          .getX(args.threadId as Id<'threads'>)
          .patch({ updatedAtTime: Date.now() })
          .get()
      : await ctx
          .table('threads')
          .insert({
            userId: user._id,
            slug: await generateSlug(ctx),
            updatedAtTime: Date.now(),
            config: {
              ui: args.inference ?? defaultChatInferenceConfig,
              saved: [],
            },
          })
          .get()

    const nextSeriesNumber = await getNextMessageSeries(thread)
    const userMessageId = await ctx.table('messages').insert({
      ...args.message,
      role: 'user',
      threadId: thread._id,
      series: nextSeriesNumber,
      userId: user._id,
    })

    //* saved run commands
    const inferenceCommand = thread.config.saved.find(
      (c) => c.command && args.message.content?.startsWith(c.command),
    )
    //^ mutate inference prompt
    if (inferenceCommand && inferenceCommand.inference.type === 'text-to-image') {
      const content = args.message.content ?? ''
      const command = inferenceCommand.command ?? ''
      inferenceCommand.inference.prompt = content.replace(command, '').trim()
    }

    const inference = inferenceCommand?.inference ?? args.inference

    if (!inference) return { threadId: thread._id, messageId: userMessageId }

    const asstMessageId = await ctx.table('messages').insert({
      role: 'assistant',
      threadId: thread._id,
      series: nextSeriesNumber + 1,
      userId: user._id,
      inference,
    })

    const jobName =
      inference.type === 'chat-completion' ? 'inference/chat-completion' : 'inference/text-to-image'
    const jobId = await createJob(ctx, jobName, {
      messageId: asstMessageId,
    })

    return { threadId: thread._id, messageId: asstMessageId, jobId }
  },
})

// TODO dedupe/clarify create
export const run = mutation({
  args: {
    threadId: z.string().optional(),
    inference: inferenceSchema,
  },
  handler: async (ctx, args) => {
    const user = await ctx.viewerX()
    const thread = args.threadId
      ? await ctx
          .table('threads')
          .getX(args.threadId as Id<'threads'>)
          .patch({ updatedAtTime: Date.now() })
          .get()
      : await ctx
          .table('threads')
          .insert({
            userId: user._id,
            slug: await generateSlug(ctx),
            updatedAtTime: Date.now(),
            config: {
              ui: args.inference ?? defaultChatInferenceConfig,
              saved: [],
            },
          })
          .get()

    const nextSeriesNumber = await getNextMessageSeries(thread)

    const asstMessageId = await ctx.table('messages').insert({
      role: 'assistant',
      threadId: thread._id,
      series: nextSeriesNumber + 1,
      userId: user._id,
      inference: args.inference,
    })

    const jobName =
      args.inference.type === 'chat-completion'
        ? 'inference/chat-completion'
        : 'inference/text-to-image'
    const jobId = await createJob(ctx, jobName, {
      messageId: asstMessageId,
    })

    return { threadId: thread._id, messageId: asstMessageId, jobId }
  },
})

export const update = mutation({
  args: {
    messageId: z.string(),

    role: messageRolesEnum,
    name: zMessageName.optional(),
    content: zMessageTextContent.optional(),
    metadata: metadataKVSchema.array().optional(),
  },
  handler: async (ctx, args) => {
    return await ctx
      .table('messages')
      .getX(args.messageId as Id<'messages'>)
      .patch(args)
  },
})

export const remove = mutation({
  args: {
    messageId: z.string(),
  },
  handler: async (ctx, args) => {
    return await ctx
      .table('messages')
      .getX(args.messageId as Id<'messages'>)
      .delete()
  },
})

export const streamCompletionContent = internalMutation({
  args: {
    messageId: zid('messages'),
    content: z.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.table('messages').getX(args.messageId).patch({ content: args.content })
  },
})
