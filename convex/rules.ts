import { addEntRules } from 'convex-ents'

import { entDefinitions } from './schema'

import type { Id } from './_generated/dataModel'
import type { QueryCtx } from './types'

export function getEntDefinitionsWithRules(ctx: QueryCtx): typeof entDefinitions {
  return addEntRules(entDefinitions, {
    users: {
      write: async ({ ent: user }) => {
        // no viewer (internal) or viewer is user
        return !ctx.viewerId || ctx.viewerId === user?._id
      },
    },
  })
}

export async function getViewerId(
  ctx: Omit<QueryCtx, 'table' | 'viewerId' | 'viewer' | 'viewerX'>,
): Promise<Id<'users'> | null> {
  const user = await ctx.auth.getUserIdentity()
  if (user === null) {
    return null
  }
  const viewer = await ctx.skipRules.table('users').get('tokenIdentifier', user.tokenIdentifier)
  return viewer?._id ?? null
}
