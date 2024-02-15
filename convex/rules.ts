import { addEntRules } from 'convex-ents'
import { Id } from './_generated/dataModel'
import { entDefinitions } from './schema'
import { QueryCtx } from './types'

export function getEntDefinitionsWithRules(ctx: QueryCtx): typeof entDefinitions {
  return addEntRules(entDefinitions, {
    apiKeys: {
      read: async (apiKeys) => {
        return ctx.viewerId === apiKeys.ownerId
      },
    },

    generations: {
      read: async (generation) => {
        if (generation.permissions.private) {
          return ctx.viewerId === generation.authorId
        }
        return true
      },
      write: async ({ operation, ent: generation, value }) => {
        // only owner can update/delete
        if (operation === 'update' || operation === 'delete') {
          return ctx.viewerId === generation.authorId
        }
        // must be logged in to create
        return ctx.viewerId === value.authorId
      },
    },
  })
}

export async function getViewerId(
  ctx: Omit<QueryCtx, 'table' | 'viewerId' | 'viewer' | 'viewerX' | 'viewerIdX'>,
): Promise<Id<'users'> | null> {
  const user = await ctx.auth.getUserIdentity()
  if (user === null) {
    return null
  }
  const viewer = await ctx.skipRules.table('users').get('tokenIdentifier', user.tokenIdentifier)
  return viewer?._id ?? null
}
