import { defineEnt } from 'convex-ents'
import { v } from 'convex/values'
import { customAlphabet } from 'nanoid'
import { mutation, query } from './functions'

export const apiKeysEnt = defineEnt({
  secret: v.string(),
}).edge('user', { field: 'ownerId' })

export const get = query(async (ctx) => {
  const ownerId = ctx.viewerIdX()
  const keys = await ctx.table('apiKeys', 'ownerId', (q) => q.eq('ownerId', ownerId))
  return keys
})

export const create = mutation({
  args: {},
  handler: async (ctx) => {
    const ownerId = ctx.viewerIdX()
    const nanoid = customAlphabet(
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
      32,
    )
    const key = nanoid()
    return await ctx.table('apiKeys').insert({ secret: key, ownerId })
  },
})
