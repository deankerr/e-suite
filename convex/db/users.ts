import { omit } from 'convex-helpers'

import type { Id } from '../_generated/dataModel'
import type { QueryCtx } from '../types'

export const getUser = async (ctx: QueryCtx, userId: Id<'users'>) => {
  const user = await ctx.table('users').get(userId)
  if (!user) return null
  const isViewer = ctx.viewerId === user._id
  return { ...omit(user, ['tokenIdentifier']), isViewer }
}
