import { asyncMap } from 'convex-helpers'
import { filter } from 'convex-helpers/server/filter'
import { paginationOptsValidator } from 'convex/server'
import { v } from 'convex/values'

import { internalMutation, mutation, query } from '../functions'
import { kvListV, messageFields } from '../schema'
import { zStringToMessageRole } from '../shared/utils'
import { emptyPage } from '../utils'
import { getSpeechFile } from './speechFiles'
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

export const getMessageEdges = async (ctx: QueryCtx, message: Doc<'messages'>) => {
  const images = await ctx
    .table('images', 'messageId', (q) => q.eq('messageId', message._id))
    .filter((q) => q.eq(q.field('deletionTime'), undefined))

  const audio = await ctx
    .table('audio', 'messageId', (q) => q.eq('messageId', message._id))
    .filter((q) => q.eq(q.field('deletionTime'), undefined))

  return {
    ...message,
    jobs: await getMessageJobs(ctx, message._id),
    voiceover: message.voiceover?.speechFileId
      ? await getSpeechFile(ctx, message.voiceover.speechFileId)
      : undefined,
    images,
    audio,
  }
}

export const getShapedMessage = async (ctx: QueryCtx, messageId: string) => {
  const message = await getMessage(ctx, messageId)
  return message ? await getMessageEdges(ctx, message) : null
}

export const getMessageCommand = (thread: Ent<'threads'>, text?: string) => {
  if (!text) return null

  const config = thread.slashCommands.find((c) =>
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

export const content = query({
  args: {
    slugOrId: v.string(),
    hasAssistantRole: v.boolean(),
    hasImageFiles: v.boolean(),
    hasSoundEffectFiles: v.boolean(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const thread = await getThreadBySlugOrId(ctx, args.slugOrId)
    if (!thread) return emptyPage()

    // NOTE using unsafeDb for super filter
    const hasFilter = args.hasImageFiles || args.hasSoundEffectFiles || args.hasAssistantRole
    const initQuery = hasFilter
      ? ctx.unsafeDb
          .query('messages')
          .withIndex('threadId_role', (q) => q.eq('threadId', thread._id).eq('role', 'assistant'))
      : ctx.unsafeDb.query('messages').withIndex('threadId', (q) => q.eq('threadId', thread._id))

    const results = await filter(initQuery, async (message) => {
      if (message.deletionTime) return false
      if (!hasFilter) return true

      if (args.hasAssistantRole) return true
      if (args.hasImageFiles && message.files?.some((file) => file.type === 'image')) return true
      if (args.hasSoundEffectFiles && message.files?.some((file) => file.type === 'sound_effect'))
        return true

      return false
    })
      .order('desc')
      .paginate(args.paginationOpts)

    return {
      ...results,
      page: await asyncMap(results.page, async (message) => await getMessageEdges(ctx, message)),
    }
  },
})

export const create = mutation({
  args: {
    threadId: v.optional(v.string()),
    role: v.string(),
    name: v.optional(v.string()),
    content: v.string(),
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
      role: zStringToMessageRole.parse(args.role),
      name: args.name,
      content: args.content,
      metadata: args.metadata,
      threadId: thread._id,
      series,
      userId: user._id,
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
    content: v.optional(v.string()),
    metadata: v.optional(kvListV),
  },
  handler: async (ctx, { messageId, ...fields }) => {
    return await ctx.table('messages').getX(messageId).patch(fields)
  },
})

export const remove = mutation({
  args: {
    messageId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx
      .table('messages')
      .getX(args.messageId as Id<'messages'>)
      .delete()
  },
})

export const streamText = internalMutation({
  args: {
    messageId: v.id('messages'),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.skipRules
      .table('messages')
      .getX(args.messageId)
      .patch({ content: args.content })
  },
})
