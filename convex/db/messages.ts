import { asyncMap, omit, pruneNull } from 'convex-helpers'
import { literals, nullable, optional } from 'convex-helpers/validators'
import { ConvexError, v } from 'convex/values'

import { internal } from '../_generated/api'
import { internalMutation, mutation, query } from '../functions'
import { ENV } from '../lib/env'
import { messageFields } from '../schema'
import { extractValidUrlsFromText } from '../shared/helpers'
import { getImageV2ByOwnerIdSourceUrl, imagesReturn } from './images'
import { getThreadBySlugOrId } from './threads'
import { getUserIsViewer } from './users'

import type { Doc, Id } from '../_generated/dataModel'
import type { Ent, MutationCtx, QueryCtx } from '../types'
import type { WithoutSystemFields } from 'convex/server'

export const messageReturnFields = {
  _id: v.id('messages'),
  _creationTime: v.number(),
  role: literals('system', 'assistant', 'user'),
  name: v.optional(v.string()),
  text: v.optional(v.string()),

  series: v.number(),
  threadId: v.id('threads'),
  threadSlug: v.string(),
  userId: v.id('users'),
  userIsViewer: v.boolean(),

  images: optional(v.array(imagesReturn)),

  kvMetadata: v.record(v.string(), v.string()),
}

// * query helpers
export const getMessageAudio = async (ctx: QueryCtx, messageId: Id<'messages'>) => {
  const audio = await ctx
    .table('audio', 'messageId', (q) => q.eq('messageId', messageId))
    .filter((q) => q.eq(q.field('deletionTime'), undefined))
    .map(async (a) => ({
      ...a,
      fileUrl: a.fileId ? await ctx.storage.getUrl(a.fileId) : undefined,
    }))
  return audio
}

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
  const urls = extractValidUrlsFromText(message.text || '').filter(
    (url) => url.hostname !== ENV.APP_HOSTNAME,
  )

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
  returns: v.union(v.null(), v.object(messageReturnFields)),

  handler: async (ctx, args) => {
    const id = ctx.unsafeDb.normalizeId('messages', args.messageId)
    const message = id ? await ctx.table('messages').get(id) : null

    return message ? await getMessageEdges(ctx, message) : null
  },
})

export const getDoc = query({
  args: {
    messageId: v.id('messages'),
  },
  handler: async (ctx, args) => {
    return await ctx.table('messages').get(args.messageId).doc()
  },
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
  opts?: {
    skipRules?: boolean
    evaluateUrls?: boolean
  },
) => {
  const skipRules = opts?.skipRules ?? false
  const evaluateUrls = opts?.evaluateUrls ?? true

  const prev = await ctx.skipRules
    .table('threads')
    .getX(fields.threadId)
    .edge('messages')
    .order('desc')
    .first()
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

  if (!evaluateUrls) return message

  if (message.text) {
    const urls = extractValidUrlsFromText(message.text).filter(
      (url) => url.hostname !== ENV.APP_HOSTNAME,
    )
    if (urls.length > 0) {
      await ctx.scheduler.runAfter(0, internal.action.evaluateMessageUrls.run, {
        urls: urls.map((url) => url.toString()),
        ownerId: message.userId,
      })
    }
  }

  return message
}

export const update = mutation({
  args: {
    messageId: v.id('messages'),

    role: v.optional(messageFields.role),
    name: v.optional(v.string()),
    text: v.optional(v.string()),

    kv: v.optional(
      v.object({
        delete: v.optional(v.array(v.string())),
        set: v.optional(v.record(v.string(), v.string())),
        setUnique: v.optional(v.record(v.string(), v.string())),
      }),
    ),
  },
  handler: async (ctx, { messageId, kv, ...args }) => {
    const message = await ctx.table('messages').getX(messageId)

    if (args.name === '') args.name = undefined
    if (args.text === '') args.text = undefined

    const kvMetadata = omit(message.kvMetadata ?? {}, kv?.delete ?? [])
    if (kv?.set) {
      Object.assign(kvMetadata, kv.set)
    }

    if (kv?.setUnique) {
      const currentKeys = Object.keys(kvMetadata)
      const duplicateKeys = Object.keys(kv.setUnique).filter((key) => currentKeys.includes(key))
      if (duplicateKeys.length > 0) {
        throw new ConvexError({
          message: `Duplicate key(s) in setUnique: ${duplicateKeys.join(', ')}`,
          duplicateKeys,
        })
      }
      Object.assign(kvMetadata, kv.setUnique)
    }

    return await ctx
      .table('messages')
      .getX(messageId)
      .patch({ ...args, kvMetadata })
  },
})

export const updateSR = internalMutation({
  args: {
    messageId: v.id('messages'),

    role: messageFields.role,
    name: v.optional(v.string()),
    text: v.optional(v.string()),
  },
  handler: async (ctx, { messageId, role, name, text }) => {
    return await ctx.skipRules
      .table('messages')
      .getX(messageId)
      .patch({
        role,
        name: name || undefined,
        text: text || undefined,
      })
  },
})

export const streamText = internalMutation({
  args: {
    messageId: v.id('messages'),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.skipRules.table('messages').getX(args.messageId).patch({ text: args.text })
  },
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
})
