import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

import { slugIdLength } from './constants'
import { mutation, query } from './functions'
import { generateRandomString, zPaginationOptValidator } from './lib/utils'
import { threadFields } from './schema'

import type { MutationCtx } from './types'

const generateSlugid = async (ctx: MutationCtx): Promise<string> => {
  const slugId = generateRandomString(slugIdLength)
  const existing = await ctx.table('threads', 'slugId', (q) => q.eq('slugId', slugId)).first()
  return existing ? generateSlugid(ctx) : slugId
}

export const create = mutation({
  args: {
    title: threadFields.title,
  },
  handler: async (ctx, { title }) => {
    const user = await ctx.viewerX()
    const slugId = await generateSlugid(ctx)
    const threadId = await ctx.table('threads').insert({ title, userId: user._id, slugId })
    return threadId
  },
})

export const get = query({
  args: {
    threadId: zid('threads'),
  },
  handler: async (ctx, { threadId }) => {
    const thread = await ctx.table('threads').get(threadId)
    return thread
  },
})

export const getBySlugId = query({
  args: {
    slugId: z.string(),
  },
  handler: async (ctx, { slugId }) => {
    const thread = await ctx.table('threads', 'slugId', (q) => q.eq('slugId', slugId)).first()
    return thread
  },
})

export const list = query({
  args: {
    limit: z.number().gte(1).lte(100).default(20),
  },
  handler: async (ctx, { limit }) => {
    const viewerId = ctx.viewerId
    if (!viewerId) return []

    return await ctx
      .table('threads', 'userId', (q) => q.eq('userId', viewerId))
      .order('desc')
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .take(limit)
  },
})

export const remove = mutation({
  args: {
    threadId: zid('threads'),
  },
  handler: async (ctx, { threadId }) => {
    await ctx.table('threads').getX(threadId).delete()
  },
})

export const feed = query({
  args: {
    paginationOpts: zPaginationOptValidator,
  },
  handler: async (ctx, { paginationOpts }) => {
    const gen = await ctx
      .table('generated_images')
      .order('desc')
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .paginate(paginationOpts)
      .map(async (gen) => ({
        image: gen,
        generation: await gen.edgeX('generation'),
      }))

    return gen
  },
})
