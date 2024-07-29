import { paginationOptsValidator } from 'convex/server'
import { v } from 'convex/values'

import { internal } from '../_generated/api'
import { internalMutation, mutation, query } from '../functions'
import { messageFields } from '../schema'
import { emptyPage } from '../utils'
import { getThreadBySlugOrId } from './threads'

import type { Doc, Id } from '../_generated/dataModel'
import type { QueryCtx } from '../types'

export const getMessage = async (ctx: QueryCtx, messageId: string) => {
  const id = ctx.unsafeDb.normalizeId('messages', messageId)
  return id ? await ctx.table('messages').get(id) : null
}

export const getMessageJobs = async (ctx: QueryCtx, messageId: Id<'messages'>) => {
  const jobs = await ctx.table('jobs3', 'messageId', (q) => q.eq('messageId', messageId))
  return jobs
}

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

export const getMessageImages = async (ctx: QueryCtx, messageId: Id<'messages'>) => {
  const images = await ctx
    .table('images', 'messageId', (q) => q.eq('messageId', messageId))
    .filter((q) => q.eq(q.field('deletionTime'), undefined))
  return images
}

export const getMessageEdges = async (ctx: QueryCtx, message: Doc<'messages'>) => {
  return {
    ...message,
    jobs: await getMessageJobs(ctx, message._id),
    images: await getMessageImages(ctx, message._id),
    audio: await getMessageAudio(ctx, message._id),
  }
}

// * get single message by slug:series
export const getSeriesMessage = query({
  args: {
    slug: v.string(),
    series: v.number(),
  },
  handler: async (ctx, args) => {
    const thread = await getThreadBySlugOrId(ctx, args.slug)
    if (!thread) return null

    const messageEnt = await ctx.table('messages').get('threadId_series', thread._id, args.series)
    if (!messageEnt || messageEnt.deletionTime) {
      return null
    }

    const message = await getMessageEdges(ctx, messageEnt)
    return message
  },
})

export const list = query({
  args: {
    slugOrId: v.string(),
    paginationOpts: paginationOptsValidator,
    filters: v.optional(
      v.object({
        role: v.optional(v.union(v.literal('assistant'), v.literal('user'))),
        hasContent: v.optional(v.union(v.literal('image'), v.literal('audio'))),
      }),
    ),
  },
  handler: async (ctx, { slugOrId, paginationOpts, filters = {} }) => {
    const thread = await getThreadBySlugOrId(ctx, slugOrId)
    if (!thread) return emptyPage()

    const baseQuery =
      filters.hasContent === 'image'
        ? filters.role
          ? ctx.table('messages', 'threadId_role_hasImageContent', (q) =>
              q.eq('threadId', thread._id).eq('role', filters.role!).eq('hasImageContent', true),
            )
          : ctx.table('messages', 'threadId_hasImageContent', (q) =>
              q.eq('threadId', thread._id).eq('hasImageContent', true),
            )
        : filters.hasContent === 'audio'
          ? ctx.table('messages', 'threadId_contentType', (q) =>
              q.eq('threadId', thread._id).eq('contentType', 'audio'),
            )
          : filters.role
            ? ctx.table('messages', 'threadId_role', (q) =>
                q.eq('threadId', thread._id).eq('role', filters.role!),
              )
            : ctx.table('messages', 'threadId', (q) => q.eq('threadId', thread._id))

    const result = await baseQuery
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .order('desc')
      .paginate(paginationOpts)
      .map((message) => getMessageEdges(ctx, message))

    return result
  },
})

export const update = mutation({
  args: {
    messageId: v.id('messages'),

    role: messageFields.role,
    name: v.optional(v.string()),
    text: v.optional(v.string()),
  },
  handler: async (ctx, { messageId, role, name, text }) => {
    return await ctx
      .table('messages')
      .getX(messageId)
      .patch({
        role,
        name: name || undefined,
        text: text || undefined,
      })
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

export const streamText = internalMutation({
  args: {
    messageId: v.id('messages'),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.skipRules.table('messages').getX(args.messageId).patch({ text: args.text })
  },
})
