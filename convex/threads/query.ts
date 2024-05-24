import { asyncMap } from 'convex-helpers'
import { z } from 'zod'

import { query } from '../functions'
import { zClient } from '../shared/schemas'
import { emptyPage, zPaginationOptValidator } from '../utils'

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

export const getValidThread = async (ctx: QueryCtx, slug: string) => {
  const threadBySlug = await ctx.table('threads', 'slug', (q) => q.eq('slug', slug)).unique()
  if (threadBySlug) return threadBySlug && !threadBySlug.deletionTime ? threadBySlug : null

  const id = ctx.unsafeDb.normalizeId('threads', slug)
  const threadById = id ? await ctx.table('threads').get(id) : null
  return threadById && !threadById.deletionTime ? threadById : null
}

//* queries
// get any thread
export const getThread = query({
  args: {
    slug: z.string(),
  },
  handler: async (ctx: QueryCtx, { slug }) => {
    const thread = await getValidThread(ctx, slug)
    if (!thread) return null

    const messages = await thread
      .edge('messages')
      .order('desc')
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .take(0)
      .map((m) => getMessageContent(ctx, m))

    return zClient.threadWithMessages.parse({
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
      .map(async (thread) => ({ ...thread, user: await thread.edgeX('user') }))

    return zClient.thread.array().parse(threads)
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
    const thread = await getValidThread(ctx, args.slug)
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
    const thread = await getValidThread(ctx, args.slug)
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
