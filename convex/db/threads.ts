import { omit } from 'convex-helpers'
import { z } from 'zod'

import { mutation, query } from '../functions'
import { createJob } from '../jobs'
import { defaultChatInferenceConfig } from '../shared/defaults'
import { EInferenceConfig, inferenceSchema } from '../shared/structures'
import { createError, insist, zMessageName, zMessageTextContent } from '../shared/utils'
import { generateSlug } from '../utils'
import { threadFields } from '../zschema'
import { getChatModelByResourceKey } from './chatModels'
import { getImageModelByResourceKey } from './imageModels'
import { getMessageCommand, getNextMessageSeries } from './messages'

import type { Id } from '../_generated/dataModel'
import type { Ent, MutationCtx, QueryCtx } from '../types'

export const getThreadBySlugOrId = async (ctx: QueryCtx, slugOrId: string) => {
  const id = ctx.unsafeDb.normalizeId('threads', slugOrId)
  const thread = id
    ? await ctx.table('threads').get(id)
    : await ctx.table('threads', 'slug', (q) => q.eq('slug', slugOrId)).unique()
  return thread && !thread.deletionTime ? thread : null
}

export const getOrCreateThread = async (
  ctx: MutationCtx,
  args: { threadId: string; userId: Id<'users'>; uiConfig?: EInferenceConfig },
) => {
  const thread = await getThreadBySlugOrId(ctx, args.threadId)
  if (thread) {
    return await ctx.table('threads').getX(thread._id).patch({ updatedAtTime: Date.now() }).get()
  }

  return await ctx
    .table('threads')
    .insert({
      userId: args.userId,
      slug: await generateSlug(ctx),
      updatedAtTime: Date.now(),
      inference: args.uiConfig ?? defaultChatInferenceConfig,
      slashCommands: [],
    })
    .get()
}

export const getThreadExtras = async (ctx: QueryCtx, thread: Ent<'threads'>) => {
  const model =
    thread.inference.type === 'chat-completion'
      ? await getChatModelByResourceKey(ctx, thread.inference.resourceKey)
      : thread.inference.type === 'text-to-image'
        ? await getImageModelByResourceKey(ctx, thread.inference.resourceKey)
        : null
  return { ...thread, model }
}

export const get = query({
  args: {
    slugOrId: z.string(),
  },
  handler: async (ctx, args) => {
    const thread = await getThreadBySlugOrId(ctx, args.slugOrId)
    if (!thread) return null

    return await getThreadExtras(ctx, thread)
  },
})

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = ctx.viewerId
    if (!userId) return []

    const threads = await ctx
      .table('threads', 'userId', (q) => q.eq('userId', userId))
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .map(async (thread) => await getThreadExtras(ctx, thread))

    return threads
  },
})

export const append = mutation({
  args: {
    threadId: z.string().optional(),
    message: z
      .object({
        name: zMessageName.optional(),
        content: zMessageTextContent.optional(),
      })
      .optional(),
    inference: inferenceSchema.optional(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.viewerX()
    const thread = await getOrCreateThread(ctx, {
      threadId: args.threadId ?? '',
      userId: user._id,
      uiConfig: args.inference,
    })

    const messageCommand = getMessageCommand(thread, args.message?.content)
    const inference = messageCommand?.inference ?? args.inference

    let series = await getNextMessageSeries(thread)

    if (args.message) {
      const userMessage = await ctx
        .table('messages')
        .insert({
          ...args.message,
          role: 'user',
          threadId: thread._id,
          series: series++,
          userId: user._id,
        })
        .get()

      if (!inference)
        return {
          threadId: thread._id,
          slug: thread.slug,
          messageId: userMessage._id,
          series: userMessage.series,
        }
    }

    if (!inference) {
      throw createError('No message or inference provided', { fatal: true, code: 'bad_request' })
    }

    const asstMessage = await ctx
      .table('messages')
      .insert({
        role: 'assistant',
        threadId: thread._id,
        series,
        userId: user._id,
        inference,
      })
      .get()

    const jobName =
      inference.type === 'chat-completion'
        ? 'inference/chat-completion'
        : inference.type === 'text-to-image'
          ? 'inference/text-to-image'
          : inference.type === 'sound-generation'
            ? 'inference/sound-generation'
            : null

    insist(jobName, 'invalid inference job')

    const jobId = await createJob(ctx, jobName, {
      messageId: asstMessage._id,
    })

    return {
      threadId: thread._id,
      slug: thread.slug,
      messageId: asstMessage._id,
      series: asstMessage.series,
      jobId,
    }
  },
})

const updateArgs = z.object(omit(threadFields, ['updatedAtTime'])).partial()
export const update = mutation({
  args: {
    threadId: z.string(),
    fields: updateArgs,
  },
  handler: async (ctx, args) => {
    return await ctx
      .table('threads')
      .getX(args.threadId as Id<'threads'>)
      .patch({ ...args.fields, updatedAtTime: Date.now() })
  },
})

export const remove = mutation({
  args: {
    threadId: z.string(),
  },
  handler: async (ctx, args) => {
    return await ctx
      .table('threads')
      .getX(args.threadId as Id<'threads'>)
      .delete()
  },
})
