import { asyncMap, pick } from 'convex-helpers'
import { z } from 'zod'

import { mutation, query } from '../functions'
import { createJob } from '../jobs'
import { fileAttachmentRecordWithContentSchema, inferenceSchema } from '../shared/structures'
import { zMessageName, zMessageTextContent } from '../shared/utils'

import type { E_Message } from '../shared/types'
import type { Ent, QueryCtx } from '../types'

const messageShape = (message: Ent<'messages'>): E_Message =>
  pick(message, [
    '_id',
    '_creationTime',
    'threadId',
    'role',
    'name',
    'content',
    'inference',
    'series',
    'metadata',
    'userId',
  ])

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

export const list = query({
  args: {
    threadId: z.string(),
    limit: z.number().max(200).default(50),
    order: z.enum(['asc', 'desc']).default('desc'),
  },
  handler: async (ctx, args): Promise<E_Message[]> => {
    const threadId = ctx.unsafeDb.normalizeId('threads', args.threadId)
    if (!threadId) return []

    const messages = await ctx
      .table('messages', 'threadId', (q) => q.eq('threadId', threadId))
      .order(args.order)
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .take(args.limit)
      .map(async (message) => {
        const shape = messageShape(message)
        const files = await getFileAttachmentContent(ctx, message.files)
        return { ...shape, files }
      })

    return messages.reverse()
  },
})

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
    if (!args.threadId) throw new Error('Not implemented') // TODO create thread
    const threadId = ctx.unsafeDb.normalizeId('threads', args.threadId)
    const thread = threadId ? await ctx.table('threads').getX(threadId) : null
    if (!thread) throw new Error(`invalid thread: ${args.threadId}`)

    await ctx.table('threads').getX(thread._id).patch({ latestActivityTime: Date.now() })

    const nextSeriesNumber = await getNextMessageSeries(thread)
    const userMessageId = await ctx.table('messages').insert({
      ...args.message,
      role: 'user',
      threadId: thread._id,
      series: nextSeriesNumber,
      userId: user._id,
    })

    if (!args.inference) return { threadId: thread._id, messageId: userMessageId }

    const asstMessageId = await ctx.table('messages').insert({
      ...args.message,
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
