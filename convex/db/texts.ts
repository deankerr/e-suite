import { nullable } from 'convex-helpers/validators'
import { ConvexError, v } from 'convex/values'

import { internalMutation, mutation, query } from '../functions'

const textPromptsReturn = v.object({
  _id: v.id('texts'),
  _creationTime: v.number(),
  title: v.string(),
  content: v.string(),
  type: v.literal('prompt'),
  userId: v.id('users'),
  updatedAt: v.number(),
})

export const getPrompt = query({
  args: {
    _id: v.string(),
  },
  handler: async (ctx, { _id }) => {
    const id = ctx.table('texts').normalizeId(_id)
    const text = id ? await ctx.table('texts').get(id) : null
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
      return await ctx.table('texts').getX(_id).patch({ title, content, updatedAt: Date.now() })
    } else {
      return await ctx.table('texts').insert({
        title,
        content,
        type: 'prompt',
        userId: viewer._id,
        updatedAt: Date.now(),
      })
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

export const createMessageText = internalMutation({
  args: {
    runId: v.union(v.id('runs'), v.id('runs_v2')),
    userId: v.id('users'),
  },
  handler: async (ctx, { runId, userId }) => {
    return await ctx.skipRules.table('texts').insert({
      type: 'message',
      content: '',
      updatedAt: Date.now(),
      userId,
      runId,
    })
  },
})

export const streamToText = internalMutation({
  args: {
    textId: v.id('texts'),
    content: v.string(),
  },
  handler: async (ctx, { textId, content }) => {
    const text = await ctx.skipRules.table('texts').getX(textId)
    if (text.type !== 'message' || text.deletionTime) {
      throw new ConvexError('invalid stream message text target')
    }

    return await text.patch({ content })
  },
})

export const deleteText = internalMutation({
  args: {
    textId: v.id('texts'),
  },
  handler: async (ctx, { textId }) => {
    return await ctx.skipRules.table('texts').getX(textId).delete()
  },
})
