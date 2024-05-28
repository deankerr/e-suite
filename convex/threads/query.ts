import { asyncMap } from 'convex-helpers'
import { z } from 'zod'

import { query } from '../functions'
import { zClient } from '../shared/schemas'
import { threadWithContentSchema } from '../shared/structures'
import { emptyPage, zPaginationOptValidator } from '../utils'

import type { EFileAttachmentRecord } from '../shared/structures'
import type { Ent, QueryCtx } from '../types'

//* helpers
const getMessageContent = async (ctx: QueryCtx, message: Ent<'messages'>) => {
  const files = message.files
    ? await asyncMap(message?.files, async (file) => {
        if (file.type === 'image') {
          return {
            ...file,
            image: await ctx.table('images').getX(file.id),
          }
        }

        return file
      })
    : undefined

  const jobs = await ctx.table('jobs', 'messageId', (q) => q.eq('messageId', message._id))

  return {
    ...message,
    files,
    jobs,
    user: await message.edgeX('user'),
  }
}

const getFilesContent = async (ctx: QueryCtx, files?: EFileAttachmentRecord[]) => {
  if (!files) return undefined
  return await asyncMap(files, async (file) => {
    if (file.type === 'image') {
      return {
        ...file,
        image: await ctx.table('images').getX(file.id),
      }
    }

    return file
  })
}

export const getValidThreadBySlugOrId = async (ctx: QueryCtx, slug: string) => {
  const threadBySlug = await ctx.table('threads', 'slug', (q) => q.eq('slug', slug)).unique()
  if (threadBySlug) return threadBySlug && !threadBySlug.deletionTime ? threadBySlug : null

  const id = ctx.unsafeDb.normalizeId('threads', slug)
  const threadById = id ? await ctx.table('threads').get(id) : null
  return threadById && !threadById.deletionTime ? threadById : null
}

const config_thread_messages = 8
export const getThreadContentHelper = async (ctx: QueryCtx, thread: Ent<'threads'>) => {
  const messages = await thread
    .edge('messages')
    .order('desc')
    .filter((q) => q.eq(q.field('deletionTime'), undefined))
    .take(config_thread_messages)
    .map(async (message) => ({
      ...message,
      files: await getFilesContent(ctx, message.files),
      jobs: await ctx.table('jobs', 'messageId', (q) => q.eq('messageId', message._id)),
      owner: await message.edgeX('user'),
    }))

  const result = {
    ...thread,
    messages: messages.reverse(),
    owner: await thread.edgeX('user'),
  }

  return threadWithContentSchema.parse(result)
}

//* queries
export const getThreadContent = query({
  args: {
    slugOrId: z.string(),
  },
  handler: async (ctx, args) => {
    const thread = await getValidThreadBySlugOrId(ctx, args.slugOrId)
    if (!thread) return null

    return await getThreadContentHelper(ctx, thread)
  },
})

export const listViewerThreads = query({
  args: {},
  handler: async (ctx: QueryCtx) => {
    const viewer = await ctx.viewer()
    if (!viewer) return { threads: [], viewer }

    const threads = await ctx
      .table('threads', 'userId', (q) => q.eq('userId', viewer._id))
      .order('desc')
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .map(async (thread) => await getThreadContentHelper(ctx, thread))

    return { threads, viewer }
  },
})

// get any thread
export const getThread = query({
  args: {
    slug: z.string(),
  },
  handler: async (ctx: QueryCtx, { slug }) => {
    const thread = await getValidThreadBySlugOrId(ctx, slug)
    if (!thread) return null

    const messages = await thread
      .edge('messages')
      .order('desc')
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .take(0)
      .map((m) => getMessageContent(ctx, m))

    return zClient.threadWithContent.parse({
      ...thread,
      messages,
      user: await thread.edgeX('user'),
    })
  },
})

// list user's threads
export const listThreads = query({
  args: {},
  handler: async (ctx: QueryCtx) => {
    const viewerId = ctx.viewerId
    if (!viewerId) return []

    const threads = await ctx
      .table('threads', 'userId', (q) => q.eq('userId', viewerId))
      .order('desc')
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .map(async (thread) => await getThreadContentHelper(ctx, thread))

    return threads
  },
})

// paginated list of messages for a thread
export const listMessages = query({
  args: {
    slug: z.string(),
    paginationOpts: zPaginationOptValidator,
    series: z.number().optional(),
  },
  handler: async (ctx: QueryCtx, args) => {
    const thread = await getValidThreadBySlugOrId(ctx, args.slug)
    if (!thread) return emptyPage()

    const result = await ctx
      .table('messages', 'threadId', (q) => q.eq('threadId', thread._id))
      .order('desc')
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .paginate(args.paginationOpts)
      .map((m) => getMessageContent(ctx, m))

    return {
      ...result,
      page: zClient.messageContent.array().parse(result.page),
    }
  },
})

export const getMessageSeries = query({
  args: {
    slug: z.string(),
    series: z.string(),
  },
  handler: async (ctx, args) => {
    const thread = await getValidThreadBySlugOrId(ctx, args.slug)
    if (!thread) return null

    const series = Number(args.series)
    if (isNaN(series)) throw new Error(`invalid index ${args.series}`)

    const messages = await ctx
      .table('messages', 'threadId_series', (q) =>
        q.eq('threadId', thread._id).eq('series', series),
      )
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .map((m) => getMessageContent(ctx, m))

    return zClient.messageContent.array().parse(messages)
  },
})
