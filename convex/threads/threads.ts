import { v } from 'convex/values'
import z from 'zod'

import { internal } from '../_generated/api'
import { internalMutation, internalQuery, mutation, query } from '../functions'
import { messagesFields, permissionsFields, threadsFields } from '../schema'
import { createSpeech, getSpeech } from '../speech'
import { getUser } from '../users'
import { assert } from '../util'
import { messageValidator } from '../validators'

import type { Doc, Id } from '../_generated/dataModel'
import type { Speech } from '../speech'
import type { MutationCtx, QueryCtx } from '../types'
import type { User } from '../users'

export type Thread = Doc<'threads'> & { messages: Message[]; owner: User }

export type Message = Doc<'messages'> & {
  job?: Doc<'jobs'> | null
  speech: Speech | null
}

export const getThread = async (ctx: QueryCtx, id?: Id<'threads'>): Promise<Thread> => {
  if (!id) {
    // "empty" thread
    return {
      _id: '' as Id<'threads'>,
      _creationTime: Date.now(),
      messages: [],
      owner: await getUser(ctx, ctx.viewerIdX()),
      userId: ctx.viewerIdX(),
      permissions: { private: true },
      title: 'New Chat',
    }
  }

  const thread = await ctx.table('threads').getX(id)
  assert(!thread.deletionTime, 'Thread is deleted')

  const messages = await thread
    .edge('messages')
    .order('desc')
    .filter((q) => q.eq(q.field('deletionTime'), undefined))
    .take(20)
    .map(async (message) => {
      return {
        ...message,
        job: await ctx
          .table('jobs', 'messageId', (q) => q.eq('messageId', message._id))
          .order('desc')
          .first(),

        speech: await getSpeech(ctx, message?.speechId),
      }
    })

  const owner = await getUser(ctx, thread.userId)
  return {
    ...thread,
    messages: messages.reverse(),
    owner,
  }
}

export const createThread = async (ctx: MutationCtx) => {
  return await ctx
    .table('threads')
    .insert({
      userId: ctx.viewerIdX(),
      permissions: { private: true },
    })
    .get()
}

const getOrCreateThread = async (ctx: MutationCtx, id?: Id<'threads'>) => {
  if (!id) return await createThread(ctx)
  const thread = await ctx.table('threads').getX(id)
  assert(!thread.deletionTime, 'Thread is deleted')
  return thread
}

export const get = query({
  args: {
    id: v.optional(v.id('threads')),
  },
  handler: async (ctx, { id }) => {
    if (!id) return getThread(ctx, id)

    const thread = await ctx.table('threads').get(id)
    if (!thread || thread.deletionTime !== undefined) {
      return null
    }
    return await getThread(ctx, id)
  },
})

export const list = query({
  args: {},
  handler: async (ctx) => {
    if (!ctx.viewerId) return []
    return await ctx
      .table('threads', 'userId', (q) => q.eq('userId', ctx.viewerIdX()))
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
  },
})

export const createThreadFor = internalMutation({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, { userId }) => {
    return await ctx.skipRules.table('threads').insert({
      userId,
      title: `thread ${new Date().toISOString()}`,
      permissions: { private: true },
    })
  },
})

export const send = mutation({
  args: {
    threadId: v.optional(v.id('threads')),
    messages: v.array(v.object(messagesFields)),
    systemPrompt: v.optional(v.string()),
    permissions: v.optional(permissionsFields),
  },
  handler: async (ctx, args) => {
    const thread = await getOrCreateThread(ctx, args.threadId)

    if (args.systemPrompt && thread.systemPrompt !== args.systemPrompt) {
      await thread.patch({ systemPrompt: args.systemPrompt })
    }

    for (const message of args.messages) {
      const name = z
        .string()
        .optional()
        .transform((v) => (v ? v.slice(0, 30) : undefined))
        .parse(message.name)
      if (message.role === 'user' && name !== undefined)
        await ctx.table('threads').getX(thread._id).patch({ name })

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

        await ctx
          .table('threads')
          .getX(thread._id)
          .patch({ parameters: message.inferenceParameters })
      }
    }

    if (!thread.title)
      await ctx.scheduler.runAfter(15, internal.threads.inference.generateThreadTitle, {
        threadId: thread._id,
      })

    return thread._id
  },
})

export const textToSpeech = mutation({
  args: {
    messageId: v.id('messages'),
  },
  handler: async (ctx, { messageId }) => {
    const message = await ctx.table('messages').getX(messageId)
    assert(!message.deletionTime, 'Message is deleted')

    const thread = await message.edgeX('thread')
    assert(!thread.deletionTime, 'Thread is deleted')

    const voiceRef =
      thread.voices?.find((voice) => message?.name && voice?.name === message?.name)?.voiceRef ??
      thread.voices?.find((voice) => voice.role === message.role)?.voiceRef ??
      'aws/Russell'

    const existingSpeech = await getSpeech(ctx, message.speechId)
    if (existingSpeech?.voiceRef === voiceRef) {
      // already exists/in progress
      return existingSpeech._id
    }

    // no content
    if (!message.content) return

    const speechId = await createSpeech(ctx, { text: message.content, voiceRef })
    await message.patch({ speechId })

    return speechId
  },
})

export const update = mutation({
  args: {
    id: v.id('threads'),
    fields: v.object({
      ...threadsFields,
      permissions: v.optional(threadsFields.permissions),
    }),
  },
  handler: async (ctx, { id, fields }) => {
    //TODO validation
    await ctx.table('threads').getX(id).patch(fields)
  },
})

//* Action/Internal interface

export const getMessageContext = internalQuery({
  args: {
    id: v.id('messages'),
  },
  handler: async (ctx, { id }) => {
    const message = await ctx.skipRules.table('messages').getX(id)
    const thread = await message.edgeX('thread')

    const messages = await thread
      .edgeX('messages')
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .filter((q) => q.lte(q.field('_creationTime'), message._creationTime))
      .docs()

    if (thread.systemPrompt) {
      const systemMessage = {
        role: 'system' as const,
        content: thread.systemPrompt,
        llmParameters: undefined,
      }
      return [systemMessage, ...messages]
    }
    return messages
  },
})

export const streamMessageContent = internalMutation({
  args: {
    id: v.id('messages'),
    content: v.string(),
  },
  handler: async (ctx, { id, content }) => {
    await ctx.skipRules.table('messages').getX(id).patch({ content })
  },
})

export const pushMessage = internalMutation({
  args: {
    id: v.id('threads'),
    message: v.object(messagesFields),
  },
  handler: async (ctx, { id, message }) => {
    const thread = await ctx.skipRules.table('threads').getX(id)
    assert(!thread.deletionTime, 'Thread is deleted')

    const parsed = messageValidator.parse(message)
    return await ctx.skipRules.table('messages').insert({
      ...parsed,
      threadId: id,
    })
  },
})

export const updateTitle = mutation({
  args: {
    id: v.id('threads'),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.title) return
    const title = args.title.slice(0, 64)
    await ctx.table('threads').getX(args.id).patch({ title })
  },
})

export const updatePermissions = mutation({
  args: {
    id: v.id('threads'),
    permissions: permissionsFields,
  },
  handler: async (ctx, { id, permissions }) =>
    await ctx.table('threads').getX(id).patch({ permissions }),
})

export const internalGet = internalQuery({
  args: {
    id: v.id('threads'),
  },
  handler: async (ctx, { id }) => await getThread(ctx.skipRules as any, id),
})

export const internalUpdate = internalMutation({
  args: {
    id: v.id('threads'),
    fields: v.object(threadsFields),
  },
  handler: async (ctx, { id, fields }) =>
    await ctx.skipRules.table('threads').getX(id).patch(fields),
})

export const remove = mutation({
  args: {
    id: v.id('threads'),
  },
  handler: async (ctx, { id }) => await ctx.table('threads').getX(id).delete(),
})

export const removeMessage = mutation({
  args: {
    id: v.id('messages'),
  },
  handler: async (ctx, { id }) => await ctx.table('messages').getX(id).delete(),
})
