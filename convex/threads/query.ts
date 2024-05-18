import { z } from 'zod'

import { query } from '../functions'
import { emptyPage, zPaginationOptValidator } from '../utils'
import { zClient } from '../validators'

import type { Ent, QueryCtx } from '../types'

//* helpers
const messageWithContent = async (message: Ent<'messages'>) => {
  return {
    ...message,
    images: await message.edge('images').filter((q) => q.eq(q.field('deletionTime'), undefined)),
    jobs: await message.edge('jobs').filter((q) => q.eq(q.field('deletionTime'), undefined)),
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
      .take(20)
      .map(messageWithContent)

    return zClient.threadWithMessages.parse({
      ...thread,
      messages,
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

    return zClient.thread.array().parse(threads)
  },
})

export const listRecentMessages = query({
  args: {
    slug: z.string(),
    limit: z.number().default(8),
  },
  handler: async (ctx, args) => {
    const thread = await getValidThread(ctx, args.slug)
    if (!thread) return null

    const messages = await thread
      .edge('messages')
      .order('desc')
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .take(args.limit)
      .map(messageWithContent)

    return zClient.messageContent.array().parse(messages)
  },
})

// paginated list of messages for a thread
export const pageMessages = query({
  args: {
    slug: z.string(),
    paginationOpts: zPaginationOptValidator,
  },
  handler: async (ctx: QueryCtx, args) => {
    const thread = await getValidThread(ctx, args.slug)
    if (!thread) return emptyPage()

    const result = await ctx
      .table('messages', 'threadId', (q) => q.eq('threadId', thread._id))
      .order('desc')
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .paginate(args.paginationOpts)
      .map(messageWithContent)

    return {
      ...result,
      page: zClient.messageContent.array().parse(result.page),
    }
  },
})

export const getMessage = query({
  args: {
    slug: z.string(),
    messageIndex: z.string(),
  },
  handler: async (ctx, args) => {
    const thread = await getValidThread(ctx, args.slug)
    if (!thread) return null

    const series = Number(args.messageIndex)
    if (isNaN(series)) throw new Error(`invalid index ${args.messageIndex}`)

    const message = await ctx
      .table('messages', 'threadId_series', (q) =>
        q.eq('threadId', thread._id).eq('series', series),
      )
      .unique()

    if (!message) return null
    const messageContent = await messageWithContent(message)
    return zClient.messageContent.parse(messageContent)
  },
})
