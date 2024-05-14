import { generateRid } from '../utils'

import type { MutationCtx } from '../types'

export const createThread = async (ctx: MutationCtx) => {
  const user = await ctx.viewerX()
  const rid = await generateRid(ctx, 'threads')

  const threadId = await ctx.table('threads').insert({ userId: user._id, rid, private: true })
  return threadId
}

export const removeThread = async (ctx: MutationCtx, args: { threadId: string }) => {
  const id = ctx.unsafeDb.normalizeId('threads', args.threadId)
  return id ? await ctx.table('threads').getX(id).delete() : null
}

export const renameThread = async (ctx: MutationCtx, args: { threadId: string; title: string }) => {
  const id = ctx.unsafeDb.normalizeId('threads', args.threadId)
  return id ? await ctx.table('threads').getX(id).patch({ title: args.title }) : null
}
