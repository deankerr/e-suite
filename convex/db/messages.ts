import { omit } from 'convex-helpers'
import { nullable } from 'convex-helpers/validators'
import { v } from 'convex/values'

import { internal } from '../_generated/api'
import { internalMutation, mutation, query } from '../functions'
import { messageFields } from '../schema'
import { updateKvMetadata, updateKvValidator } from './helpers/kvMetadata'
import { createMessage, getMessageEdges, messageReturnFields } from './helpers/messages'
import { getThreadX } from './helpers/threads'

import type { Id } from '../_generated/dataModel'

// * queries
export const get = query({
  args: {
    messageId: v.string(),
  },
  handler: async (ctx, args) => {
    const id = ctx.unsafeDb.normalizeId('messages', args.messageId)
    const message = id ? await ctx.table('messages').get(id) : null

    return message ? await getMessageEdges(ctx, message) : null
  },
  returns: v.union(v.null(), v.object(messageReturnFields)),
})

export const getDoc = query({
  args: {
    messageId: v.id('messages'),
  },
  handler: async (ctx, args) => {
    const message = await ctx.table('messages').get(args.messageId).doc()
    if (!message) return null
    return {
      ...message,
      kvMetadata: message.kvMetadata ?? {},
    }
  },
  returns: nullable(v.object(omit(messageReturnFields, ['images', 'threadSlug', 'userIsViewer']))),
})

// * mutations
export const create = mutation({
  args: {
    threadId: v.string(),
    ...omit(messageFields, ['runId']),
  },
  handler: async (ctx, { threadId, ...fields }) => {
    const thread = await getThreadX(ctx, threadId)

    const message = await createMessage(ctx, {
      ...fields,
      threadId: thread._id,
      userId: thread.userId,
    })

    return {
      threadId: thread._id,
      slug: thread.slug,
      id: message._id,
      series: message.series,
    }
  },
  returns: v.object({
    threadId: v.id('threads'),
    slug: v.string(),
    id: v.id('messages'),
    series: v.number(),
  }),
})

export const update = mutation({
  args: {
    messageId: v.id('messages'),

    role: v.optional(messageFields.role),
    name: v.optional(v.string()),
    text: v.optional(v.string()),

    updateKv: v.optional(updateKvValidator),
  },
  handler: async (ctx, { messageId, updateKv, ...args }) => {
    const message = await ctx.table('messages').getX(messageId)

    if (args.name === '') args.name = undefined
    if (args.text === '') args.text = undefined

    const kvMetadata = updateKvMetadata(message.kvMetadata, updateKv)

    return await ctx
      .table('messages')
      .getX(messageId)
      .patch({ ...args, kvMetadata })
  },
  returns: v.id('messages'),
})

export const updateSR = internalMutation({
  args: {
    messageId: v.id('messages'),

    role: messageFields.role,
    name: v.optional(v.string()),
    text: v.optional(v.string()),

    updateKv: v.optional(updateKvValidator),
  },
  handler: async (ctx, { messageId, updateKv, ...args }) => {
    const message = await ctx.skipRules.table('messages').getX(messageId)

    if (args.name === '') args.name = undefined
    if (args.text === '') args.text = undefined

    const kvMetadata = updateKvMetadata(message.kvMetadata, updateKv)

    return await ctx.skipRules
      .table('messages')
      .getX(messageId)
      .patch({ ...args, kvMetadata })
  },
  returns: v.id('messages'),
})

export const streamText = internalMutation({
  args: {
    messageId: v.id('messages'),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.skipRules.table('messages').getX(args.messageId).patch({ text: args.text })
  },
  returns: v.id('messages'),
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
  returns: v.null(),
})
