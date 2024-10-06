import { ConvexError, v } from 'convex/values'

import { getUserPublicX, userReturnFieldsPublic } from '../users'

import type { Ent, QueryCtx } from '../../types'
import type { AsObjectValidator, Infer } from 'convex/values'

export const threadReturnFields = {
  // doc
  _id: v.string(),
  _creationTime: v.number(),
  title: v.optional(v.string()),
  instructions: v.optional(v.string()),
  latestRunConfig: v.optional(v.any()),
  favourite: v.optional(v.boolean()),
  kvMetadata: v.record(v.string(), v.string()),
  updatedAtTime: v.number(),
  // + fields
  slug: v.string(),
  userId: v.id('users'),

  // edge
  user: userReturnFieldsPublic,
}

export const getThread = async (ctx: QueryCtx, xid: string) => {
  const id = ctx.table('threads').normalizeId(xid)
  const thread = id
    ? await ctx.table('threads').get(id)
    : await ctx.table('threads', 'slug', (q) => q.eq('slug', xid)).unique()
  return thread && !thread.deletionTime ? thread : null
}

export const getThreadX = async (ctx: QueryCtx, xid: string) => {
  const thread = await getThread(ctx, xid)
  if (!thread) throw new ConvexError({ message: 'invalid thread id', xid })
  return thread
}

export const getThreadEdges = async (
  ctx: QueryCtx,
  thread: Ent<'threads'>,
): Promise<Infer<AsObjectValidator<typeof threadReturnFields>>> => {
  return {
    ...thread,
    user: await getUserPublicX(ctx, thread.userId),
    kvMetadata: thread.kvMetadata ?? {},
  }
}
