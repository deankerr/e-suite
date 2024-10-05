import { omit, pick } from 'convex-helpers'
import { literals, nullable } from 'convex-helpers/validators'
import { paginationOptsValidator } from 'convex/server'
import { ConvexError, v } from 'convex/values'

import { internal } from '../_generated/api'
import { internalMutation, mutation, query } from '../functions'
import { emptyPage, generateSlug, paginatedReturnFields } from '../lib/utils'
import { threadFields } from '../schema'
import { updateKvMetadata, updateKvValidator } from './helpers/kvMetadata'
import { createMessage, getMessageEdges, messageReturnFields } from './messages'
import { getUserIsViewer, getUserPublic } from './users'

import type { Id } from '../_generated/dataModel'
import type { Ent, EThread, MutationCtx, QueryCtx } from '../types'

export const threadReturnFields = {
  // doc
  _id: v.string(),
  _creationTime: v.number(),
  title: v.optional(v.string()),
  instructions: v.optional(v.string()),
  latestRunConfig: v.optional(v.any()),
  favourite: v.optional(v.boolean()),
  kvMetadata: v.record(v.string(), v.string()),
  updatedAtTime: v.number(),
  // + fields
  slug: v.string(),
  userId: v.id('users'),

  // edge
  userIsViewer: v.boolean(),
  user: v.any(),
}

// * Helpers
const getMessageBySeries = async (
  ctx: QueryCtx,
  { threadId, series }: { threadId: Id<'threads'>; series: number },
) => {
  const messageEnt = await ctx.table('messages').get('threadId_series', threadId, series)
  if (!messageEnt || messageEnt?.deletionTime) return null

  return await getMessageEdges(ctx, messageEnt)
}

export const getThreadBySlugOrId = async (ctx: QueryCtx, slugOrId: string) => {
  const id = ctx.unsafeDb.normalizeId('threads', slugOrId)
  const thread = id
    ? await ctx.table('threads').get(id)
    : await ctx.table('threads', 'slug', (q) => q.eq('slug', slugOrId)).unique()
  return thread && !thread.deletionTime ? thread : null
}

export const getThreadEdges = async (ctx: QueryCtx, thread: Ent<'threads'>) => {
  return {
    ...thread,
    user: await getUserPublic(ctx, thread.userId),
    userIsViewer: getUserIsViewer(ctx, thread.userId),
    kvMetadata: thread.kvMetadata ?? {},
  }
}

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
    userIsViewer: true,
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
    if (args.slugOrId === 'new') return await getEmptyThread(ctx)

    const thread = await getThreadBySlugOrId(ctx, args.slugOrId)
    if (!thread) return null

    return await getThreadEdges(ctx, thread)
  },
  returns: v.union(v.object(threadReturnFields), v.null()),
})

export const list = query({
  args: {},
  handler: async (ctx) => {
    const viewerId = ctx.viewerId
    if (!viewerId) return null

    const threads = await ctx
      .table('threads', 'userId', (q) => q.eq('userId', viewerId))
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .map(async (thread) => await getThreadEdges(ctx, thread))

    return threads
  },
  returns: nullable(v.array(v.object(threadReturnFields))),
})

export const listMessages = query({
  args: {
    slugOrId: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const thread = await getThreadBySlugOrId(ctx, args.slugOrId)
    if (!thread) return emptyPage()

    const messages = await thread
      .edge('messages')
      .order('desc')
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .paginate(args.paginationOpts)
      .map(async (message) => await getMessageEdges(ctx, message))

    return messages
  },
  returns: v.object({ ...paginatedReturnFields, page: v.array(v.object(messageReturnFields)) }),
})

export const getMessage = query({
  args: {
    slugOrId: v.string(),
    series: v.number(),
  },
  handler: async (ctx, args) => {
    const thread = await getThreadBySlugOrId(ctx, args.slugOrId)
    if (!thread) return null

    return await getMessageBySeries(ctx, { threadId: thread._id, series: args.series })
  },
  returns: v.union(v.object(messageReturnFields), v.null()),
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
    const thread = await getThreadBySlugOrId(ctx, threadId)
    if (!thread) throw new ConvexError('invalid thread')

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
    const thread = await getThreadBySlugOrId(ctx, threadId)
    if (!thread) throw new ConvexError('invalid thread')

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
    message: v.object({
      role: literals('assistant', 'user'),
      name: v.optional(v.string()),
      text: v.optional(v.string()),
    }),
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
