import { partial } from 'convex-helpers/validators'
import { v } from 'convex/values'

import { internalMutation, mutation, query } from './functions'
import { userFields } from './schema'
import { generateRandomString } from './utils'

const userBySchema = v.union(
  v.object({ id: v.id('users') }),
  v.object({ tokenIdentifier: v.string() }),
)

export const create = internalMutation({
  args: {
    fields: v.object({
      ...userFields,
      tokenIdentifier: v.string(),
    }),
  },
  handler: async (ctx, { fields }) => await ctx.table('users').insert({ ...fields }),
})

export const update = internalMutation({
  args: {
    by: userBySchema,
    fields: v.object(partial(userFields)),
  },
  handler: async (ctx, { by, fields }) => {
    if ('id' in by) return await ctx.table('users').getX(by.id).patch(fields)
    return await ctx.table('users').getX('tokenIdentifier', by.tokenIdentifier).patch(fields)
  },
})

export const remove = internalMutation({
  args: {
    by: userBySchema,
  },
  handler: async (ctx, { by }) => {
    if ('id' in by) return await ctx.table('users').getX(by.id).delete()
    return await ctx.table('users').getX('tokenIdentifier', by.tokenIdentifier).delete()
  },
})

// * Users API Keys
export const generateNewApiKey = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.viewerX()

    // invalidate all current keys
    await ctx
      .table('users_api_keys', 'userId', (q) => q.eq('userId', user._id))
      .map(async (apiKey) => {
        if (apiKey.valid) await apiKey.patch({ valid: false })
      })

    const secret = `sk_${generateRandomString(32)}`
    return await ctx.table('users_api_keys').insert({ secret, valid: true, userId: user._id })
  },
})

export const getViewer = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.viewer()
  },
})
