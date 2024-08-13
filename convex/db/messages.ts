import { pick } from 'convex-helpers'
import { v } from 'convex/values'

import { internal } from '../_generated/api'
import { internalMutation, mutation } from '../functions'
import { messageFields } from '../schema'
import { getUserPublic } from './users'

import type { Id } from '../_generated/dataModel'
import type { Ent, QueryCtx } from '../types'

export const getMessage = async (ctx: QueryCtx, messageId: string) => {
  const id = ctx.unsafeDb.normalizeId('messages', messageId)
  return id ? await ctx.table('messages').get(id) : null
}

export const getMessageJobs = async (ctx: QueryCtx, messageId: Id<'messages'>) => {
  const jobs = await ctx
    .table('jobs3', 'messageId', (q) => q.eq('messageId', messageId))
    .map(async (job) => {
      const fields = pick(job, ['_id', '_creationTime', 'updatedAt', 'status', 'input'])
      return {
        ...fields,
        name: job.pipeline,
        error: job.status === 'failed' ? job.stepResults.at(-1)?.error : undefined,
      }
    })
  return jobs
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

export const getMessageImages = async (ctx: QueryCtx, messageId: Id<'messages'>) => {
  const images = await ctx
    .table('images', 'messageId', (q) => q.eq('messageId', messageId))
    .filter((q) => q.eq(q.field('deletionTime'), undefined))
  return images
}

export const getMessageEdges = async (ctx: QueryCtx, message: Ent<'messages'>) => {
  return {
    ...message,
    jobs: await getMessageJobs(ctx, message._id),
    images: await getMessageImages(ctx, message._id),
    audio: await getMessageAudio(ctx, message._id),
    user: await getUserPublic(ctx, message.userId),
  }
}

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

export const streamText = internalMutation({
  args: {
    messageId: v.id('messages'),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.skipRules.table('messages').getX(args.messageId).patch({ text: args.text })
  },
})
