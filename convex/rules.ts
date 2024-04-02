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

export async function getViewerIdWithApi(
  ctx: Omit<QueryCtx, 'table' | 'viewerId' | 'viewer' | 'viewerX'>,
  apiKey?: string,
): Promise<Id<'users'> | null> {
  const user = await ctx.auth.getUserIdentity()
  if (user) {
    const viewer = await ctx.skipRules.table('users').get('tokenIdentifier', user.tokenIdentifier)
    if (viewer) {
      console.log(`authenticated ${viewer.name} ${viewer._id} via jwt`)
      return viewer._id
    }
  }

  if (apiKey) {
    const userApiKey = await ctx.skipRules
      .table('users_api_keys', 'secret', (q) => q.eq('secret', apiKey))
      .filter((q) => q.and(q.eq(q.field('valid'), true), q.eq(q.field('deletionTime'), undefined)))
      .unique()

    if (userApiKey) {
      const viewer = await ctx.skipRules.table('users').get(userApiKey.userId)
      if (viewer) {
        console.log('authenticated', viewer.name, viewer._id, 'via api key')
        return viewer._id
      }
    }
  }

  return null
}
