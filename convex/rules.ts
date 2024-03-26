import { addEntRules } from 'convex-ents'

import { entDefinitions } from './schema'

import type { Id } from './_generated/dataModel'
import type { QueryCtx } from './types'

export function getEntDefinitionsWithRules(ctx: QueryCtx): typeof entDefinitions {
  return addEntRules(entDefinitions, {
    apiKeys: {
      read: async (apiKeys) => {
        return ctx.viewerId === apiKeys.ownerId
      },
    },

    generations: {
      read: async (generation) => {
        // only owner can read private generations
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

    messages: {
      write: async ({ operation, ent: message, value }) => {
        // only owner can create
        if (operation === 'create') {
          const thread = await ctx.skipRules.table('threads').getX(value.threadId)
          return ctx.viewerId === thread.userId
        }

        // only owner can update/delete
        const thread = await message.edgeX('thread')
        return ctx.viewerId === thread.userId
      },
    },

    threads: {
      read: async (thread) => {
        // only owner can read private threads
        if (thread.permissions.private) {
          return ctx.viewerId === thread.userId
        }
        return true
      },
      write: async ({ operation, ent: thread, value }) => {
        // only owner can update/delete
        if (operation === 'update' || operation === 'delete') {
          return ctx.viewerId === thread.userId
        }
        // must be logged in to create
        return ctx.viewerId === value.userId
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
