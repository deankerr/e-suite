import { addEntRules } from 'convex-ents'

import { entDefinitions } from './schema'

import type { Id } from './_generated/dataModel'
import type { QueryCtx } from './types'

export function getEntDefinitionsWithRules(ctx: QueryCtx): typeof entDefinitions {
  return addEntRules(entDefinitions, {
    messages: {
      read: async (message) => {
        // if (message.private) return false
        const thread = await ctx.skipRules.table('threads').get(message.threadId)
        return thread !== null && thread.userId === ctx.viewerId
      },
      write: async ({ operation, ent: message, value }) => {
        if (operation === 'create') {
          const thread = await ctx.skipRules.table('threads').get(value.threadId)
          return thread?.userId === ctx.viewerId
        }

        return (await message.edge('thread')).userId === ctx.viewerId
      },
    },
    threads: {
      // eslint-disable-next-line @typescript-eslint/require-await
      read: async (thread) => {
        return thread.userId === ctx.viewerId
      },
      // eslint-disable-next-line @typescript-eslint/require-await
      write: async ({ operation, ent: thread, value }) => {
        if (operation === 'create') {
          return ctx.viewerId === value.userId
        }
        return ctx.viewerId === thread?.userId
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

  // console.debug(`authenticated ${viewer.role}/${viewer.name}/${viewer._id} via jwt`)
  return viewer._id
}

export async function getViewerIdFromApiKey(
  ctx: Omit<QueryCtx, 'table' | 'viewerId' | 'viewer' | 'viewerX'>,
  apiKey?: string,
): Promise<Id<'users'> | null> {
  if (!apiKey) return null

  const userApiKey = await ctx.skipRules
    .table('users_api_keys', 'secret', (q) => q.eq('secret', apiKey))
    .filter((q) => q.and(q.eq(q.field('valid'), true), q.eq(q.field('deletionTime'), undefined)))
    .unique()
  if (!userApiKey) return null

  const viewer = await ctx.skipRules.table('users').get(userApiKey.userId)
  if (!viewer) return null

  // console.debug(`authenticated ${viewer.role}/${viewer.name}/${viewer._id} via api key`)
  return viewer._id
}
