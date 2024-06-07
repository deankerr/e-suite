import { omit } from 'convex-helpers'
import { z } from 'zod'

import { mutation, query } from '../functions'
import { threadFields } from '../schema'
import { getThreadShape } from '../shared/shape'

import type { Id } from '../_generated/dataModel'
import type { EThread } from '../shared/types'
import type { QueryCtx } from '../types'

export const getThreadBySlugOrId = async (ctx: QueryCtx, slugOrId: string) => {
  const id = ctx.unsafeDb.normalizeId('threads', slugOrId)
  const thread = id
    ? await ctx.table('threads').get(id)
    : await ctx.table('threads', 'slug', (q) => q.eq('slug', slugOrId)).unique()
  return thread && !thread.deletionTime ? thread : null
}

export const get = query({
  args: {
    slugOrId: z.string(),
  },
  handler: async (ctx, args): Promise<EThread | null> => {
    const thread = await getThreadBySlugOrId(ctx, args.slugOrId)
    return thread ? getThreadShape(thread) : null
  },
})

export const list = query({
  args: {},
  handler: async (ctx): Promise<EThread[]> => {
    const userId = ctx.viewerId
    if (!userId) return []

    const threads = await ctx
      .table('threads', 'userId', (q) => q.eq('userId', userId))
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .map(getThreadShape)

    return threads
  },
})

const updateArgs = omit(threadFields, ['updatedAtTime'])
export const update = mutation({
  args: {
    threadId: z.string(),
    ...updateArgs,
  },
  handler: async (ctx, args) => {
    return await ctx
      .table('threads')
      .getX(args.threadId as Id<'threads'>)
      .patch({ ...args, updatedAtTime: Date.now() })
  },
})

export const remove = mutation({
  args: {
    threadId: z.string(),
  },
  handler: async (ctx, args) => {
    return await ctx
      .table('threads')
      .getX(args.threadId as Id<'threads'>)
      .delete()
  },
})
