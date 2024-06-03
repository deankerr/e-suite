import { asyncMap } from 'convex-helpers'
import { z } from 'zod'

import { query } from '../functions'
import { messageWithContentSchema, threadWithContentSchema } from '../shared/structures'
import { emptyPage, zPaginationOptValidator } from '../utils'

import type { EFileAttachmentRecord } from '../shared/structures'
import type { Ent, QueryCtx } from '../types'

const latestMessagesWithThreadAmount = 8

//* message helpers
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

const getMessageJobs = async (ctx: QueryCtx, message: Ent<'messages'>) => {
  const jobs = await ctx.table('jobs', 'messageId', (q) => q.eq('messageId', message._id))
  return jobs
}

const getMessageContent = async (ctx: QueryCtx, message: Ent<'messages'>, threadSlug: string) => {
  return {
    ...message,
    threadSlug,
    files: await getFilesContent(ctx, message.files),
    jobs: await getMessageJobs(ctx, message),
    owner: await message.edgeX('user'),
  }
}

//* thread helpers
export const getValidThreadBySlugOrId = async (ctx: QueryCtx, slug: string) => {
  const threadBySlug = await ctx.table('threads', 'slug', (q) => q.eq('slug', slug)).unique()

  if (threadBySlug) return threadBySlug && !threadBySlug.deletionTime ? threadBySlug : null

  const id = ctx.unsafeDb.normalizeId('threads', slug)
  const threadById = id ? await ctx.table('threads').get(id) : null
  return threadById && !threadById.deletionTime ? threadById : null
}

export const getThreadContentHelper = async (ctx: QueryCtx, thread: Ent<'threads'>) => {
  const messages = await thread
    .edge('messages')
    .order('desc')
    .filter((q) => q.eq(q.field('deletionTime'), undefined))
    .take(latestMessagesWithThreadAmount)
    .map(async (message) => await getMessageContent(ctx, message, thread.slug))

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

export const getThreadIndexContent = query({
  args: {
    index: z.tuple([z.string(), z.string(), z.string()]),
  },
  handler: async (ctx, { index }) => {
    const [threadRing, messageRing] = index
    const thread = await getValidThreadBySlugOrId(ctx, threadRing)
    if (!thread) return null

    const messageSeries = Number(messageRing)
    const messages = messageSeries
      ? await ctx
          .table('messages', 'threadId_series', (q) =>
            q.eq('threadId', thread._id).eq('series', messageSeries),
          )
          .filter((q) => q.eq(q.field('deletionTime'), undefined))
          .map((message) => getMessageContent(ctx, message, thread.slug))
      : []

    const result = {
      ...thread,
      messages: messages.reverse(),
      owner: await thread.edgeX('user'),
    }

    return threadWithContentSchema.parse(result)
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

// list user's threads
export const listThreads = query({
  args: {},
  handler: async (ctx: QueryCtx) => {
    const viewerId = ctx.viewerId
    if (!viewerId) return null

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
      .map((m) => getMessageContent(ctx, m, thread.slug))

    return {
      ...result,
      page: messageWithContentSchema.array().parse(result.page),
    }
  },
})
