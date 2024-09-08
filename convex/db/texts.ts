import { ConvexError, v } from 'convex/values'

import { mutation, query } from '../functions'

export const getPrompt = query({
  args: {
    _id: v.id('texts'),
  },
  handler: async (ctx, { _id }) => {
    const text = await ctx.table('texts').getX(_id)
    if (text.type !== 'prompt') {
      throw new ConvexError('Invalid text id')
    }
    return text
  },
})

export const listPrompts = query({
  args: {},
  handler: async (ctx) => {
    const viewer = await ctx.viewerX()
    return await ctx.table('texts', 'userId_type', (q) =>
      q.eq('userId', viewer._id).eq('type', 'prompt'),
    )
  },
})

export const setPrompt = mutation({
  args: {
    _id: v.optional(v.id('texts')),
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, { _id, title, content }) => {
    const viewer = await ctx.viewerX()

    if (_id) {
      return await ctx.table('texts').getX(_id).patch({ title, content })
    } else {
      return await ctx.table('texts').insert({ title, content, type: 'prompt', userId: viewer._id })
    }
  },
})
