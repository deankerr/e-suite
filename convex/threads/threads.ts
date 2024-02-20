import { PaginationOptions, paginationOptsValidator } from 'convex/server'
import { v } from 'convex/values'
import z from 'zod'
import { internal } from '../_generated/api'
import { Id } from '../_generated/dataModel'
import { mutation, query } from '../functions'
import { messagesFields, Permissions, permissionsFields } from '../schema'
import { MutationCtx, QueryCtx } from '../types'
import { getUser } from '../users'
import { assert } from '../util'

export const getThread = async (ctx: QueryCtx, id: Id<'threads'>) => {
  const thread = await ctx.table('threads').getX(id)
  assert(!thread.deletionTime, 'Thread is deleted')
  const messages = await thread
    .edgeX('messages')
    .order('desc')
    .filter((q) => q.eq(q.field('deletionTime'), undefined))
    .map(async (message) => ({
      ...message,
      job: await ctx
        .table('jobs')
        .order('desc', 'messageId')
        .filter((q) => q.eq(q.field('messageId'), message._id))
        .first(),
    }))
  const owner = await getUser(ctx, thread.userId)
  return {
    ...thread,
    messages,
    owner,
  }
}

export const getMessages = async (
  ctx: QueryCtx,
  { id, paginationOpts }: { id: Id<'threads'>; paginationOpts: PaginationOptions },
) => {
  const results = await ctx
    .table('threads')
    .getX(id)
    .edgeX('messages')
    .order('desc')
    .filter((q) => q.eq(q.field('deletionTime'), undefined))
    .paginate(paginationOpts)
    .map(async (message) => ({
      ...message,
      job: await ctx
        .table('jobs')
        .order('desc', 'messageId')
        .filter((q) => q.eq(q.field('deletionTime'), undefined))
        .filter((q) => q.eq(q.field('messageId'), message._id))
        .first(),
    }))

  return {
    ...results,
    page: results.page.reverse(),
  }
}

type NewThreadFields = {
  name?: string
  systemPrompt?: string
  permissions?: Permissions
}
export const createThread = async (ctx: MutationCtx, fields: NewThreadFields) => {
  return await ctx.table('threads').insert({
    userId: ctx.viewerIdX(),
    name: fields.name ?? `thread ${new Date().toISOString()}`,
    systemPrompt: fields.systemPrompt ?? '',
    permissions: fields.permissions ?? { private: true },
  })
}

export const getOrCreateThread = async (ctx: MutationCtx, id?: Id<'threads'>) => {
  const existing = id ? await ctx.table('threads').get(id) : null
  if (existing) return existing
  const thread = await createThread(ctx, {})
  return thread
}

export const get = query({
  args: {
    id: v.id('threads'),
  },
  handler: async (ctx, { id }) => await getThread(ctx, id),
})

export const listMessages = query({
  args: {
    id: v.id('threads'),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { id, paginationOpts }) => await getMessages(ctx, { id, paginationOpts }),
})

export const send = mutation({
  args: {
    threadId: v.id('threads'),
    messages: v.array(v.object(messagesFields)),
    systemPrompt: v.optional(v.string()),
    permissions: v.optional(permissionsFields),
  },
  handler: async (ctx, args) => {
    const thread = await ctx.table('threads').getX(args.threadId)
    assert(!thread.deletionTime, 'Thread is deleted')

    if (args.systemPrompt && thread.systemPrompt !== args.systemPrompt) {
      await thread.patch({ systemPrompt: args.systemPrompt })
    }

    for (const message of args.messages) {
      const name = z
        .string()
        .optional()
        .transform((v) => (v ? v.slice(0, 30) : undefined))
        .parse(message.name)
      const content = z
        .string()
        .transform((v) => v.slice(0, 32768))
        .parse(message.content)

      const messageId = await ctx
        .table('messages')
        .insert({ ...message, name, content, threadId: thread._id })
      if (message.inferenceParameters && message.role === 'assistant') {
        await ctx.scheduler.runAfter(0, internal.jobs.dispatch, {
          type: 'inference',
          messageId: messageId,
        })
      }
    }

    return thread._id
  },
})
