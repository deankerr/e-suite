import { omit } from 'convex-helpers'
import { literals, partial } from 'convex-helpers/validators'
import { ConvexError, v } from 'convex/values'

import { internal } from '../_generated/api'
import { mutation, query } from '../functions'
import { threadFields } from '../schema'
import { defaultChatInferenceConfig, defaultImageInferenceConfig } from '../shared/defaults'
import { getInferenceConfig } from '../shared/utils'
import { generateSlug } from '../utils'
import { getChatModelByResourceKey } from './chatModels'
import { getImageModelByResourceKey } from './imageModels'

import type { Id } from '../_generated/dataModel'
import type { Ent, InferenceConfig, MutationCtx, QueryCtx } from '../types'

// * new

const getUserThread = async (ctx: MutationCtx, threadId: string) => {
  const user = await ctx.viewerX()
  const id = ctx.table('threads').normalizeId(threadId)
  const thread = id ? await ctx.table('threads').getX(id) : null

  if (thread?.userId !== user._id || thread.deletionTime) return null
  return thread
}

// * --

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

const updateArgs = v.object(partial(omit(threadFields, ['updatedAtTime', 'metadata'])))
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

export const updateCurrentModel = mutation({
  args: {
    threadId: v.string(),
    type: literals('chat', 'image'),
    resourceKey: v.string(),
  },
  handler: async (ctx, args) => {
    const thread = await getUserThread(ctx, args.threadId)
    if (!thread) throw new ConvexError('invalid thread')

    const model =
      args.type === 'chat'
        ? await getChatModelByResourceKey(ctx, args.resourceKey)
        : await getImageModelByResourceKey(ctx, args.resourceKey)
    if (!model) throw new ConvexError('invalid model')

    const { chatConfig, textToImageConfig } = getInferenceConfig(thread.inference)
    if (model.type === 'chat') {
      const prev = chatConfig ?? defaultChatInferenceConfig
      await thread.patch({
        inference: {
          ...prev,
          endpoint: model.endpoint,
          endpointModelId: model.endpointModelId,
          resourceKey: model.resourceKey,
        },
      })
    } else {
      const prev = textToImageConfig ?? defaultImageInferenceConfig
      await thread.patch({
        inference: {
          ...prev,
          endpoint: model.endpoint,
          endpointModelId: model.endpointModelId,
          resourceKey: model.resourceKey,
        },
      })
    }
  },
})

export const remove = mutation({
  args: {
    threadId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx
      .table('threads')
      .getX(args.threadId as Id<'threads'>)
      .delete()

    await ctx.scheduler.runAfter(0, internal.deletion.scheduleFileDeletion, {})
  },
})
