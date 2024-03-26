import { v } from 'convex/values'
import { customAlphabet } from 'nanoid'

import { internalMutation, internalQuery, mutation, query } from './functions'
import { assert } from './util'

export const get = query({
  args: {},
  handler: async (ctx) => {
    const ownerId = ctx.viewerIdX()
    const keys = await ctx.table('apiKeys', 'ownerId', (q) => q.eq('ownerId', ownerId))
    return keys
  },
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

export const createFor = internalMutation({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, { userId }) => {
    const ownerId = userId
    const nanoid = customAlphabet(
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
      32,
    )
    const key = nanoid()
    return await ctx.table('apiKeys').insert({ secret: key, ownerId })
  },
})

export const authorizeThreadOwner = internalQuery({
  args: {
    threadId: v.id('threads'),
    apiKey: v.string(),
  },
  handler: async (ctx, args) => {
    const apiKey = await ctx.skipRules.table('apiKeys').get('secret', args.apiKey)
    assert(apiKey, 'Invalid api key')

    const thread = await ctx.skipRules.table('threads').getX(args.threadId)
    assert(!thread.deletionTime, 'Thread is deleted')

    if (thread.userId === apiKey.ownerId) return thread.userId
    return null
  },
})
