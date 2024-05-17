import { z } from 'zod'

import { validators } from '../external'
import { query } from '../functions'
import { emptyPage, zPaginationOptValidator } from '../utils'

import type { Ent, QueryCtx } from '../types'

export type MessageWithContent = z.infer<typeof messageWithContentSchema>

//* validators
const messageWithContentSchema = validators.message.merge(
  z.object({
    images: validators.image.array().optional(),
    jobs: validators.job.array().optional(),
  }),
)

const threadWithMessagesSchema = validators.thread.merge(
  z.object({ messages: messageWithContentSchema.array().optional() }),
)

const threadSchema = validators.thread

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

    return threadWithMessagesSchema.parse({
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

    return threadSchema.array().parse(threads)
  },
})

export const listRecentMessages = query({
  args: {
    slug: z.string(),
  },
  handler: async (ctx, args) => {
    const thread = await getValidThread(ctx, args.slug)
    if (!thread) return null

    const messages = await thread
      .edge('messages')
      .order('desc')
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .take(8)
      .map(messageWithContent)

    return messageWithContentSchema.array().parse(messages)
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
      page: messageWithContentSchema.array().parse(result.page),
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
    return messageWithContentSchema.parse(messageContent)
  },
})
