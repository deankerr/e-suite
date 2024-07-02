import { asyncMap } from 'convex-helpers'
import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

import { internalMutation, mutation, query } from '../functions'
import { EImage, messageRolesEnum, metadataKVSchema } from '../shared/structures'
import { zMessageName, zMessageTextContent, zStringToMessageRole } from '../shared/utils'
import { emptyPage, zPaginationOptValidator } from '../utils'
import { getSpeechFile } from './speechFiles'
import { getOrCreateThread, getThreadBySlugOrId } from './threads'

import type { Id } from '../_generated/dataModel'
import type { Ent, QueryCtx } from '../types'

export const getNextMessageSeries = async (thread: Ent<'threads'>) => {
  const prev = await thread.edge('messages').order('desc').first()
  return (prev?.series ?? 0) + 1
}

export const getMessage = async (ctx: QueryCtx, messageId: string) => {
  const id = ctx.unsafeDb.normalizeId('messages', messageId)
  return id ? await ctx.table('messages').get(id) : null
}

const getFileAttachmentContent = async (ctx: QueryCtx, files?: Ent<'messages'>['files']) => {
  if (!files) return undefined
  const filesWithContent = await asyncMap(files, async (file) => {
    if (file.type === 'image') {
      return {
        ...file,
        image: (await ctx.table('images').get(file.id)) as EImage | null,
      }
    }

    if (file.type === 'sound_effect') {
      return {
        ...file,
        soundEffect: await ctx.table('sound_effect_files').get(file.id),
      }
    }

    return file
  })

  return filesWithContent
}

export const getMessageJobs = async (ctx: QueryCtx, message: Ent<'messages'>) => {
  const jobs = await ctx.table('jobs', 'messageId', (q) => q.eq('messageId', message._id))
  return jobs
}

export const getMessageEdges = async (ctx: QueryCtx, message: Ent<'messages'>) => {
  // const shape = getMessageShape(message)
  return {
    ...message,
    files: await getFileAttachmentContent(ctx, message.files),
    jobs: await getMessageJobs(ctx, message),
    voiceover: message.voiceover?.speechFileId
      ? await getSpeechFile(ctx, message.voiceover.speechFileId)
      : undefined,
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
    slug: z.string(),
    series: z.number(),
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

export const list = query({
  args: {
    threadId: z.string(),
    limit: z.number().max(200).default(25),
    order: z.enum(['asc', 'desc']).default('desc'),
  },
  handler: async (ctx, args) => {
    const threadId = ctx.unsafeDb.normalizeId('threads', args.threadId)
    if (!threadId) return []

    const messages = await ctx
      .table('messages', 'threadId', (q) => q.eq('threadId', threadId))
      .order(args.order)
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .take(args.limit)
      .map(async (message) => await getMessageEdges(ctx, message))

    return messages.reverse()
  },
})

export const paginate = query({
  args: {
    threadId: z.string(),
    order: z.enum(['asc', 'desc']).default('desc'),
    paginationOpts: zPaginationOptValidator,
  },
  handler: async (ctx, args) => {
    const threadId = ctx.unsafeDb.normalizeId('threads', args.threadId)
    if (!threadId) return emptyPage()

    // console.log(args.paginationOpts)

    const results = await ctx
      .table('messages', 'threadId', (q) => q.eq('threadId', threadId))
      .order(args.order)
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .paginate(args.paginationOpts)
      .map(async (message) => await getMessageEdges(ctx, message))

    return results
  },
})

export const create = mutation({
  args: {
    threadId: z.string().optional(),
    role: zStringToMessageRole,
    name: zMessageName.optional(),
    content: zMessageTextContent,
    metadata: metadataKVSchema.array().optional(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.viewerX()
    const thread = await getOrCreateThread(ctx, {
      threadId: args.threadId ?? '',
      userId: user._id,
    })

    const series = await getNextMessageSeries(thread)
    const messageId = await ctx.table('messages').insert({
      role: args.role,
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
    messageId: z.string(),

    role: messageRolesEnum,
    name: zMessageName.optional(),
    content: zMessageTextContent.optional(),
    metadata: metadataKVSchema.array().optional(),
  },
  handler: async (ctx, args) => {
    return await ctx
      .table('messages')
      .getX(args.messageId as Id<'messages'>)
      .patch(args)
  },
})

export const remove = mutation({
  args: {
    messageId: z.string(),
  },
  handler: async (ctx, args) => {
    return await ctx
      .table('messages')
      .getX(args.messageId as Id<'messages'>)
      .delete()
  },
})

export const streamCompletionContent = internalMutation({
  args: {
    messageId: zid('messages'),
    content: z.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.skipRules
      .table('messages')
      .getX(args.messageId)
      .patch({ content: args.content })
  },
})
