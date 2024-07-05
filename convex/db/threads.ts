import { omit } from 'convex-helpers'
import { partial } from 'convex-helpers/validators'
import { v } from 'convex/values'

import { internal } from '../_generated/api'
import { mutation, query } from '../functions'
import { createJob } from '../jobs'
import { createJob as createJobNext } from '../jobsNext'
import { inferenceConfigV, threadFields } from '../schema'
import { defaultChatInferenceConfig } from '../shared/defaults'
import { createError, insist } from '../shared/utils'
import { generateSlug } from '../utils'
import { getChatModelByResourceKey } from './chatModels'
import { getImageModelByResourceKey } from './imageModels'
import { getMessageCommand, getNextMessageSeries } from './messages'

import type { Id } from '../_generated/dataModel'
import type { Ent, InferenceConfig, MutationCtx, QueryCtx } from '../types'

export const getThreadBySlugOrId = async (ctx: QueryCtx, slugOrId: string) => {
  const id = ctx.unsafeDb.normalizeId('threads', slugOrId)
  const thread = id
    ? await ctx.table('threads').get(id)
    : await ctx.table('threads', 'slug', (q) => q.eq('slug', slugOrId)).unique()
  return thread && !thread.deletionTime ? thread : null
}

export const getOrCreateThread = async (
  ctx: MutationCtx,
  args: { threadId: string; userId: Id<'users'>; uiConfig?: InferenceConfig },
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
    slugOrId: v.string(),
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
    threadId: v.optional(v.string()),
    message: v.optional(
      v.object({
        name: v.optional(v.string()),
        content: v.optional(v.string()),
      }),
    ),
    inference: v.optional(inferenceConfigV),
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

      if (userMessage.content) {
        await ctx.scheduler.runAfter(0, internal.files.links.analyzeUrlsInText, {
          text: userMessage.content,
          messageId: userMessage._id,
        })
      }

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

    // TODO new job system
    if (inference.endpoint === 'anthropic') {
      const jobName = 'inference/chat-completion-ai'

      const jobId = await createJobNext(ctx, {
        name: jobName,
        fields: {
          messageId: asstMessage._id,
        },
      })

      return {
        threadId: thread._id,
        slug: thread.slug,
        messageId: asstMessage._id,
        series: asstMessage.series,
        jobId,
      }
    }

    if (inference.type === 'text-to-image') {
      const jobId = await createJobNext(ctx, {
        name: 'inference/textToImageNext',
        fields: {
          messageId: asstMessage._id,
        },
      })

      return {
        threadId: thread._id,
        slug: thread.slug,
        messageId: asstMessage._id,
        series: asstMessage.series,
        jobId,
      }
    }

    if (inference.type === 'sound-generation') {
      const jobId = await createJobNext(ctx, {
        name: 'inference/textToAudio',
        fields: {
          messageId: asstMessage._id,
        },
      })

      return {
        threadId: thread._id,
        slug: thread.slug,
        messageId: asstMessage._id,
        series: asstMessage.series,
        jobId,
      }
    }

    const jobName = inference.type === 'chat-completion' ? 'inference/chat-completion' : null

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

const updateArgs = v.object(partial(omit(threadFields, ['updatedAtTime'])))
export const update = mutation({
  args: {
    threadId: v.string(),
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
    threadId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx
      .table('threads')
      .getX(args.threadId as Id<'threads'>)
      .delete()
  },
})
