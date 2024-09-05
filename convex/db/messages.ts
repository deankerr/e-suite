import { deprecated, literals } from 'convex-helpers/validators'
import { v } from 'convex/values'

import { internal } from '../_generated/api'
import { internalMutation, mutation, query } from '../functions'
import { messageFields } from '../schema'
import { getUserIsViewer } from './users'

import type { Id } from '../_generated/dataModel'
import type { Ent, QueryCtx } from '../types'

export const messageReturnFields = {
  _id: v.id('messages'),
  _creationTime: v.number(),
  role: literals('system', 'assistant', 'user'),
  name: v.optional(v.string()),
  text: v.optional(v.string()),

  series: v.number(),
  threadId: v.id('threads'),
  threadSlug: v.string(),
  userId: v.id('users'),
  userIsViewer: v.boolean(),

  contentType: deprecated,
}

export const getMessageAudio = async (ctx: QueryCtx, messageId: Id<'messages'>) => {
  const audio = await ctx
    .table('audio', 'messageId', (q) => q.eq('messageId', messageId))
    .filter((q) => q.eq(q.field('deletionTime'), undefined))
    .map(async (a) => ({
      ...a,
      fileUrl: a.fileId ? await ctx.storage.getUrl(a.fileId) : undefined,
    }))
  return audio
}

export const getMessageEdges = async (ctx: QueryCtx, message: Ent<'messages'>) => {
  const thread = await message.edgeX('thread')
  return {
    ...message.doc(),
    contentType: undefined,
    threadSlug: thread.slug,
    userIsViewer: getUserIsViewer(ctx, message.userId),
  }
}

export const get = query({
  args: {
    messageId: v.string(),
  },
  returns: v.union(v.null(), v.object(messageReturnFields)),

  handler: async (ctx, args) => {
    const id = ctx.unsafeDb.normalizeId('messages', args.messageId)
    const message = id ? await ctx.table('messages').get(id) : null

    return message ? await getMessageEdges(ctx, message) : null
  },
})

export const getDoc = query({
  args: {
    messageId: v.id('messages'),
  },
  handler: async (ctx, args) => {
    return await ctx.table('messages').get(args.messageId).doc()
  },
})

export const update = mutation({
  args: {
    messageId: v.id('messages'),

    role: messageFields.role,
    name: v.optional(v.string()),
    text: v.optional(v.string()),
  },
  handler: async (ctx, { messageId, role, name, text }) => {
    return await ctx
      .table('messages')
      .getX(messageId)
      .patch({
        role,
        name: name || undefined,
        text: text || undefined,
      })
  },
})

export const updateSR = internalMutation({
  args: {
    messageId: v.id('messages'),

    role: messageFields.role,
    name: v.optional(v.string()),
    text: v.optional(v.string()),
  },
  handler: async (ctx, { messageId, role, name, text }) => {
    return await ctx.skipRules
      .table('messages')
      .getX(messageId)
      .patch({
        role,
        name: name || undefined,
        text: text || undefined,
      })
  },
})

export const streamText = internalMutation({
  args: {
    messageId: v.id('messages'),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.skipRules.table('messages').getX(args.messageId).patch({ text: args.text })
  },
})

export const remove = mutation({
  args: {
    messageId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx
      .table('messages')
      .getX(args.messageId as Id<'messages'>)
      .delete()

    await ctx.scheduler.runAfter(0, internal.deletion.scheduleFileDeletion, {})
  },
})
