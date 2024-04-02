import { addEntRules } from 'convex-ents'

import { entDefinitions } from './schema'

import type { Id } from './_generated/dataModel'
import type { QueryCtx } from './types'

export function getEntDefinitionsWithRules(ctx: QueryCtx): typeof entDefinitions {
  return addEntRules(entDefinitions, {
    threads: {
      read: async (thread) => {
        return thread.userId === ctx.viewerId
      },
    },
    users: {
      write: async ({ ent: user }) => {
        // no viewer (internal) or viewer is user
        return !ctx.viewerId || ctx.viewerId === user?._id
      },
    },
  })
}

export async function getViewerIdFromAuth(
  ctx: Omit<QueryCtx, 'table' | 'viewerId' | 'viewer' | 'viewerX'>,
): Promise<Id<'users'> | null> {
  const user = await ctx.auth.getUserIdentity()
  if (!user) return null

  const viewer = await ctx.skipRules.table('users').get('tokenIdentifier', user.tokenIdentifier)
  if (!viewer) return null

  console.debug(`authenticated ${viewer.role}/${viewer.name}/${viewer._id} via jwt`)
  return viewer._id
}

export async function getViewerIdFromApiKey(
  ctx: Omit<QueryCtx, 'table' | 'viewerId' | 'viewer' | 'viewerX'>,
  apiKey?: string,
) {
  if (!apiKey) return null

  const userApiKey = await ctx.skipRules
    .table('users_api_keys', 'secret', (q) => q.eq('secret', apiKey))
    .filter((q) => q.and(q.eq(q.field('valid'), true), q.eq(q.field('deletionTime'), undefined)))
    .unique()
  if (!userApiKey) return null

  const viewer = await ctx.skipRules.table('users').get(userApiKey.userId)
  if (!viewer) return null

  console.debug(`authenticated ${viewer.role}/${viewer.name}/${viewer._id} via api key`)
  return viewer._id
}
