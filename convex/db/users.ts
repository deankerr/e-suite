import { omit } from 'convex-helpers'

import type { Id } from '../_generated/dataModel'
import type { QueryCtx } from '../types'

export const getUserPrivate = async (ctx: QueryCtx, userId: Id<'users'>) => {
  const user = await ctx.table('users').get(userId)
  if (!user) return null
  const isViewer = ctx.viewerId === user._id
  return { ...omit(user, ['tokenIdentifier']), isViewer }
}

export const getUserPublic = async (ctx: QueryCtx, userId: Id<'users'>) => {
  const user = await ctx.table('users').get(userId)
  if (!user) return null
  const isViewer = ctx.viewerId === user._id
  return { ...omit(user, ['tokenIdentifier', 'runConfigs']), isViewer }
}
