import { paginationOptsValidator } from 'convex/server'
import { v } from 'convex/values'

import { internal } from '../_generated/api'
import { internalMutation, mutation, query } from '../functions'
import { kvListV, messageFields } from '../schema'
import { emptyPage, zStringToMessageRole } from '../utils'
import { getOrCreateThread, getThreadBySlugOrId } from './threads'

import type { Doc, Id } from '../_generated/dataModel'
import type { Ent, QueryCtx } from '../types'

export const getNextMessageSeries = async (thread: Ent<'threads'>) => {
  const prev = await thread.edge('messages').order('desc').first()
  return (prev?.series ?? 0) + 1
}

export const getMessage = async (ctx: QueryCtx, messageId: string) => {
  const id = ctx.unsafeDb.normalizeId('messages', messageId)
  return id ? await ctx.table('messages').get(id) : null
}

export const getMessageJobs = async (ctx: QueryCtx, messageId: Id<'messages'>) => {
  const jobs = await ctx.table('jobs', 'messageId', (q) => q.eq('messageId', messageId))
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

export const getShapedMessage = async (ctx: QueryCtx, messageId: string) => {
  const message = await getMessage(ctx, messageId)
  return message ? await getMessageEdges(ctx, message) : null
}

export const getMessageCommand = (thread: Ent<'threads'>, text?: string) => {
  if (!text) return null

  const config = thread.slashCommands?.find((c) =>
    c.commandType === 'startsWith'
      ? text.startsWith(c.command)
      : text.match(new RegExp(`\\s${c.command}\\s`)),
  )
  if (!config) return null

  const command = config.command ?? ''
  const textWithoutCommand = text.slice(command.length).trim()

  if ('prompt' in config.inference) {
    config.inference.prompt = textWithoutCommand
  }

  return { ...config, content: textWithoutCommand }
}

// * get single message by slug:series
export const getSeries = query({
  args: {
    slug: v.string(),
    series: v.number(),
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
      thread,
      messages: messages.reverse(),
    }
  },
})

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

export const create = mutation({
  args: {
    threadId: v.optional(v.string()),
    role: v.string(),
    name: v.optional(v.string()),
    text: v.string(),
    metadata: v.optional(kvListV),
  },
  handler: async (ctx, args) => {
    const user = await ctx.viewerX()
    const thread = await getOrCreateThread(ctx, {
      threadId: args.threadId ?? '',
      userId: user._id,
    })

    const series = await getNextMessageSeries(thread)
    const messageId = await ctx.table('messages').insert({
      contentType: 'text',
      role: zStringToMessageRole.parse(args.role),
      name: args.name,
      text: args.text,
      metadata: args.metadata,
      threadId: thread._id,
      series,
      userId: user._id,
      hasImageReference: false,
    })

    return {
      threadId: thread._id,
      slug: thread.slug,
      messageId: messageId,
      series,
    }
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
