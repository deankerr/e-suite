import { z } from 'zod'

import { validators } from '../external'

import type { Id } from '../_generated/dataModel'
import type { Ent, QueryCtx } from '../types'
import type { ZPaginationOptValidator } from '../utils'

//* validators
const messageWithContentSchema = validators.message.merge(
  z.object({ images: validators.generatedImage.array().optional() }),
)

const threadWithMessagesSchema = validators.thread.merge(
  z.object({ messages: messageWithContentSchema.array().optional() }),
)

const threadSchema = validators.thread

//* helpers
const messageWithContent = async (message: Ent<'messages'>) => {
  return {
    ...message,
    images: await message
      .edge('generated_images')
      .filter((q) => q.eq(q.field('deletionTime'), undefined)),
  }
}

//* queries
// get any thread
export const getThread = async (ctx: QueryCtx, args: { threadId: string }) => {
  const id = ctx.unsafeDb.normalizeId('threads', args.threadId)
  const thread = id ? await ctx.table('threads').get(id) : null
  if (!thread || thread.deletionTime) return null

  const messages = await thread.edge('messages').order('desc').take(8).map(messageWithContent)

  return threadWithMessagesSchema.parse({
    ...thread,
    messages,
  })
}

// list user's threads
export const listThreads = async (ctx: QueryCtx) => {
  const viewerId = ctx.viewerId
  if (!viewerId) return []

  const threads = await ctx
    .table('threads', 'userId', (q) => q.eq('userId', viewerId))
    .order('desc')
    .filter((q) => q.eq(q.field('deletionTime'), undefined))

  return threadSchema.array().parse(threads)
}

// paginated list of messages for a thread
export const listMessages = async (
  ctx: QueryCtx,
  {
    threadId,
    paginationOpts,
  }: { threadId: Id<'threads'>; paginationOpts: ZPaginationOptValidator },
) => {
  const result = await ctx
    .table('messages', 'threadId', (q) => q.eq('threadId', threadId))
    .order('desc')
    .filter((q) => q.eq(q.field('deletionTime'), undefined))
    .paginate(paginationOpts)
    .map(messageWithContent)

  return messageWithContentSchema.array().parse(result)
}
