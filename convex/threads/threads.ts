import { PaginationOptions, paginationOptsValidator } from 'convex/server'
import { v } from 'convex/values'
import { Id } from '../_generated/dataModel'
import { query } from '../functions'
import { QueryCtx } from '../types'
import { getUser } from '../users'
import { assert } from '../util'

export const getThread = async (ctx: QueryCtx, id: Id<'threads'>) => {
  const thread = await ctx.table('threads').getX(id)
  assert(!thread.deletionTime, 'Thread is deleted')
  const owner = await getUser(ctx, thread.userId)
  return {
    ...thread,
    owner,
  }
}

export const getMessages = async (
  ctx: QueryCtx,
  { id, paginationOpts }: { id: Id<'threads'>; paginationOpts: PaginationOptions },
) => {
  const results = await ctx
    .table('threads')
    .getX(id)
    .edgeX('messages')
    .order('desc')
    .filter((q) => q.eq(q.field('deletionTime'), undefined))
    .paginate(paginationOpts)
    .map(async (message) => ({
      ...message,
      job: await ctx
        .table('jobs')
        .order('desc', 'messageId')
        .filter((q) => q.eq(q.field('deletionTime'), undefined))
        .filter((q) => q.eq(q.field('messageId'), message._id))
        .first(),
    }))

  return {
    ...results,
    page: results.page.reverse(),
  }
}

export const get = query({
  args: {
    id: v.id('threads'),
  },
  handler: async (ctx, { id }) => await getThread(ctx, id),
})

export const listMessages = query({
  args: {
    id: v.id('threads'),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { id, paginationOpts }) => await getMessages(ctx, { id, paginationOpts }),
})
