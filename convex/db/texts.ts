import { nullable } from 'convex-helpers/validators'
import { v } from 'convex/values'

import { mutation, query } from '../functions'

const textPromptsReturn = v.object({
  _id: v.id('texts'),
  _creationTime: v.number(),
  title: v.string(),
  content: v.string(),
  type: v.literal('prompt'),
  userId: v.id('users'),
})

export const getPrompt = query({
  args: {
    _id: v.string(),
  },
  handler: async (ctx, { _id }) => {
    const id = ctx.table('texts').normalizeId(_id)
    if (!id) return null

    const text = await ctx.table('texts').get(id)
    if (!text || text.type !== 'prompt' || text.deletionTime) {
      return null
    }

    return { ...text, type: 'prompt' as const, title: text.title ?? 'Untitled Prompt' }
  },
  returns: nullable(textPromptsReturn),
})

export const listPrompts = query({
  args: {},
  handler: async (ctx) => {
    const viewer = await ctx.viewerX()
    return await ctx
      .table('texts', 'userId_type', (q) => q.eq('userId', viewer._id).eq('type', 'prompt'))
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .map((text) => ({
        ...text,
        type: 'prompt' as const,
        title: text.title ?? 'Untitled Prompt',
      }))
  },
  returns: v.array(textPromptsReturn),
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

export const deletePrompt = mutation({
  args: {
    _id: v.id('texts'),
  },
  handler: async (ctx, { _id }) => {
    return await ctx.table('texts').getX(_id).delete()
  },
})
