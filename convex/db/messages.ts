import { asyncMap, omit, pruneNull } from 'convex-helpers'
import { literals, nullable, optional } from 'convex-helpers/validators'
import { ConvexError, v } from 'convex/values'

import { internal } from '../_generated/api'
import { internalMutation, mutation, query } from '../functions'
import { messageFields } from '../schema'
import { extractValidUrlsFromText } from '../shared/helpers'
import { updateKvMetadata, updateKvValidator } from './helpers/kvMetadata'
import { getImageV2ByOwnerIdSourceUrl, imagesReturn } from './images'
import { getThreadBySlugOrId } from './threads'
import { getUserIsViewer } from './users'

import type { Doc, Id } from '../_generated/dataModel'
import type { Ent, MutationCtx, QueryCtx } from '../types'
import type { WithoutSystemFields } from 'convex/server'

export const messageReturnFields = {
  // doc
  _id: v.id('messages'),
  _creationTime: v.number(),
  role: literals('system', 'assistant', 'user'),
  name: v.optional(v.string()),
  text: v.optional(v.string()),
  kvMetadata: v.record(v.string(), v.string()),
  runId: v.optional(v.id('runs')),

  // fields
  series: v.number(),
  threadId: v.id('threads'),
  userId: v.id('users'),

  // edges
  images: optional(v.array(imagesReturn)),
  threadSlug: v.string(),
  userIsViewer: v.boolean(),
}

// * query helpers
export const getMessageEdges = async (ctx: QueryCtx, message: Ent<'messages'>) => {
  const thread = await message.edgeX('thread')
  return {
    ...message.doc(),
    contentType: undefined,
    threadSlug: thread.slug,
    userIsViewer: getUserIsViewer(ctx, message.userId),
    images: await getMessageUrlImages(ctx, message),
    kvMetadata: message.kvMetadata ?? {},
  }
}

export const getMessageUrlImages = async (ctx: QueryCtx, message: Ent<'messages'>) => {
  const urls = extractValidUrlsFromText(message.text || '')

  const results = await asyncMap(
    urls,
    async (url) => await getImageV2ByOwnerIdSourceUrl(ctx, message.userId, url.toString()),
  )
  return pruneNull(results)
}

// * queries
export const get = query({
  args: {
    messageId: v.string(),
  },
  handler: async (ctx, args) => {
    const id = ctx.unsafeDb.normalizeId('messages', args.messageId)
    const message = id ? await ctx.table('messages').get(id) : null

    return message ? await getMessageEdges(ctx, message) : null
  },
  returns: v.union(v.null(), v.object(messageReturnFields)),
})

export const getDoc = query({
  args: {
    messageId: v.id('messages'),
  },
  handler: async (ctx, args) => {
    const message = await ctx.table('messages').get(args.messageId).doc()
    if (!message) return null
    return {
      ...message,
      kvMetadata: message.kvMetadata ?? {},
    }
  },
  returns: nullable(v.object(omit(messageReturnFields, ['images', 'threadSlug', 'userIsViewer']))),
})

export const listLatest = query({
  args: {
    threadId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { threadId, limit = 20 }) => {
    const thread = await getThreadBySlugOrId(ctx, threadId)
    if (!thread) return null

    const result = await ctx
      .table('messages', 'threadId', (q) => q.eq('threadId', thread._id))
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .order('desc')
      .take(Math.min(limit, 200))
      .map(async (message) => await getMessageEdges(ctx, message))

    return result.reverse()
  },
  returns: nullable(v.array(v.object(messageReturnFields))),
})

// * mutations
export const createMessage = async (
  ctx: MutationCtx,
  fields: Omit<WithoutSystemFields<Doc<'messages'>>, 'series' | 'deletionTime'>,
  options?: {
    skipRules?: boolean
    evaluateUrls?: boolean
    generateThreadTitle?: boolean
  },
) => {
  const skipRules = options?.skipRules ?? false
  const evaluateUrls = options?.evaluateUrls ?? fields.role === 'user'
  const generateThreadTitle = options?.generateThreadTitle ?? fields.role === 'assistant'

  const thread = await ctx.skipRules.table('threads').getX(fields.threadId)

  const prev = await thread.edge('messages').order('desc').first()
  const series = prev ? prev.series + 1 : 1

  const message = skipRules
    ? await ctx.skipRules
        .table('messages')
        .insert({ ...fields, series })
        .get()
    : await ctx
        .table('messages')
        .insert({ ...fields, series })
        .get()

  if (evaluateUrls) {
    if (message.text) {
      const urls = extractValidUrlsFromText(message.text)

      if (urls.length > 0) {
        await ctx.scheduler.runAfter(0, internal.action.evaluateMessageUrls.run, {
          urls: urls.map((url) => url.toString()),
          ownerId: message.userId,
        })
      }
    }
  }

  if (generateThreadTitle && !thread.title) {
    await ctx.scheduler.runAfter(0, internal.action.generateThreadTitle.run, {
      messageId: message._id,
    })
  }

  return message
}

export const create = mutation({
  args: {
    threadId: v.string(),
    ...omit(messageFields, ['runId']),
  },
  handler: async (ctx, { threadId, ...fields }) => {
    const thread = await getThreadBySlugOrId(ctx, threadId)
    if (!thread) throw new ConvexError('invalid thread')

    const message = await createMessage(ctx, {
      ...fields,
      threadId: thread._id,
      userId: thread.userId,
    })

    return {
      threadId: thread._id,
      slug: thread.slug,
      id: message._id,
      series: message.series,
    }
  },
  returns: v.object({
    threadId: v.id('threads'),
    slug: v.string(),
    id: v.id('messages'),
    series: v.number(),
  }),
})

export const update = mutation({
  args: {
    messageId: v.id('messages'),

    role: v.optional(messageFields.role),
    name: v.optional(v.string()),
    text: v.optional(v.string()),

    updateKv: v.optional(updateKvValidator),
  },
  handler: async (ctx, { messageId, updateKv, ...args }) => {
    const message = await ctx.table('messages').getX(messageId)

    if (args.name === '') args.name = undefined
    if (args.text === '') args.text = undefined

    const kvMetadata = updateKvMetadata(message.kvMetadata, updateKv)

    return await ctx
      .table('messages')
      .getX(messageId)
      .patch({ ...args, kvMetadata })
  },
  returns: v.id('messages'),
})

export const updateSR = internalMutation({
  args: {
    messageId: v.id('messages'),

    role: messageFields.role,
    name: v.optional(v.string()),
    text: v.optional(v.string()),

    updateKv: v.optional(updateKvValidator),
  },
  handler: async (ctx, { messageId, updateKv, ...args }) => {
    const message = await ctx.skipRules.table('messages').getX(messageId)

    if (args.name === '') args.name = undefined
    if (args.text === '') args.text = undefined

    const kvMetadata = updateKvMetadata(message.kvMetadata, updateKv)

    return await ctx.skipRules
      .table('messages')
      .getX(messageId)
      .patch({ ...args, kvMetadata })
  },
  returns: v.id('messages'),
})

export const streamText = internalMutation({
  args: {
    messageId: v.id('messages'),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.skipRules.table('messages').getX(args.messageId).patch({ text: args.text })
  },
  returns: v.id('messages'),
})

export const remove = mutation({
  args: {
    messageId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx
      .table('messages')
      .getX(args.messageId as Id<'messages'>)
      .delete()

    await ctx.scheduler.runAfter(0, internal.deletion.scheduleFileDeletion, {})
  },
  returns: v.null(),
})
