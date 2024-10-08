import { omit, pick } from 'convex-helpers'
import { nullable } from 'convex-helpers/validators'
import { ConvexError, v } from 'convex/values'

import { internal } from '../_generated/api'
import { internalMutation, mutation, query } from '../functions'
import { generateSlug } from '../lib/utils'
import { threadFields } from '../schema'
import { updateKvMetadata, updateKvValidator } from './helpers/kvMetadata'
import { createMessage, messageCreateFields } from './helpers/messages'
import { getThread, getThreadEdges, getThreadX, threadReturnFields } from './helpers/threads'
import { getUserPublic } from './users'

import type { Id } from '../_generated/dataModel'
import type { EThread, MutationCtx, QueryCtx } from '../types'

// * Helpers
const getEmptyThread = async (ctx: QueryCtx): Promise<EThread | null> => {
  const viewer = await ctx.viewer()
  const user = viewer ? await getUserPublic(ctx, viewer._id) : null
  if (!user) return null

  return {
    _id: 'new' as Id<'threads'>,
    _creationTime: Date.now(),
    slug: 'new',
    title: 'New Thread',

    updatedAtTime: Date.now(),
    userId: user._id,
    user,
    kvMetadata: {},
  }
}

export const getOrCreateUserThread = async (ctx: MutationCtx, threadId?: string) => {
  const user = await ctx.viewerX()

  if (!threadId || threadId === 'new') {
    // * create thread
    const thread = await ctx
      .table('threads')
      .insert({
        userId: user._id,
        slug: await generateSlug(ctx),
        updatedAtTime: Date.now(),
      })
      .get()

    return thread
  }

  const id = ctx.table('threads').normalizeId(threadId)
  const thread = id ? await ctx.table('threads').getX(id) : null

  if (thread?.userId !== user._id || thread.deletionTime) return null
  return thread
}

// * Queries
export const get = query({
  args: {
    slugOrId: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.slugOrId === 'new') {
      const emptyThread = await getEmptyThread(ctx)
      return emptyThread
    }

    const thread = await getThread(ctx, args.slugOrId)
    if (!thread) return null

    return await getThreadEdges(ctx, thread)
  },
  returns: nullable(v.object(threadReturnFields)),
})

export const list = query({
  args: {},
  handler: async (ctx) => {
    const viewerId = ctx.viewerId
    if (!viewerId) return null

    const threads = await ctx
      .table('threads', 'userId', (q) => q.eq('userId', viewerId))
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .map(async (thread) => await getThreadEdges(ctx, omit(thread, ['latestRunConfig'])))

    return threads
  },
  returns: nullable(v.array(v.object(threadReturnFields))),
})

// * Mutations
export const create = mutation({
  args: pick(threadFields, ['title', 'instructions', 'favourite', 'kvMetadata']),
  handler: async (ctx, args) => {
    const user = await ctx.viewerX()
    const slug = await generateSlug(ctx)

    const id = await ctx.table('threads').insert({
      ...args,
      updatedAtTime: Date.now(),
      userId: user._id,
      slug: await generateSlug(ctx),
    })

    return {
      id,
      slug,
    }
  },
  returns: v.object({ id: v.id('threads'), slug: v.string() }),
})

export const update = mutation({
  args: {
    ...omit(threadFields, ['updatedAtTime', 'kvMetadata']),
    threadId: v.string(),
    updateKv: v.optional(updateKvValidator),
  },
  handler: async (ctx, { threadId, updateKv, ...fields }) => {
    const thread = await getThreadX(ctx, threadId)
    const kvMetadata = updateKvMetadata(thread.kvMetadata, updateKv)

    return await ctx
      .table('threads')
      .getX(thread._id)
      .patch({ ...fields, kvMetadata, updatedAtTime: Date.now() })
  },
  returns: v.id('threads'),
})

export const updateSR = internalMutation({
  args: {
    ...omit(threadFields, ['updatedAtTime', 'kvMetadata']),
    threadId: v.string(),
    updateKv: v.optional(updateKvValidator),
  },
  handler: async (ctx, { threadId, updateKv, ...fields }) => {
    const thread = await getThreadX(ctx, threadId)
    const kvMetadata = updateKvMetadata(thread.kvMetadata, updateKv)

    return await ctx.skipRules
      .table('threads')
      .getX(thread._id)
      .patch({ ...fields, kvMetadata, updatedAtTime: Date.now() })
  },
  returns: v.id('threads'),
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
  returns: v.null(),
})

// * append message
export const append = mutation({
  args: {
    threadId: v.optional(v.string()),
    message: v.object(messageCreateFields),
  },
  handler: async (ctx, args) => {
    const thread = await getOrCreateUserThread(ctx, args.threadId)
    if (!thread) throw new ConvexError('invalid thread')

    const message = await createMessage(ctx, {
      threadId: thread._id,
      userId: thread.userId,
      ...args.message,
    })

    return {
      threadId: thread._id,
      slug: thread.slug,
      messageId: message._id,
      series: message.series,
    }
  },
  returns: v.object({
    threadId: v.id('threads'),
    slug: v.string(),
    messageId: v.id('messages'),
    series: v.number(),
  }),
})
