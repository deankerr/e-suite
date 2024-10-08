import { nullable } from 'convex-helpers/validators'
import { ConvexError, v } from 'convex/values'

import { internal } from '../../_generated/api'
import { mutation, query } from '../../functions'
import { modelParametersFields, runFields } from '../../schema'
import { updateKvMetadata } from '../helpers/kvMetadata'
import { createMessage, messageCreateFields } from '../helpers/messages'
import { getThread } from '../helpers/threads'
import { getOrCreateUserThread } from '../threads'

const textMessagesReturn = v.object({
  _id: v.id('texts'),
  _creationTime: v.number(),
  title: v.optional(v.string()),
  content: v.string(),
  type: v.string(),
  userId: v.id('users'),
  updatedAt: v.number(),
  runId: v.optional(v.id('runs')),
})

const runReturnFields = {
  ...runFields,
  _id: v.id('runs'),
  _creationTime: v.number(),
  threadId: v.id('threads'),
  userId: v.id('users'),
  texts: v.optional(v.array(textMessagesReturn)),
}

export const create = mutation({
  args: {
    threadId: v.string(),

    model: v.object({
      provider: v.string(),
      id: v.string(),
    }),
    modelParameters: v.optional(v.object(modelParametersFields)),
    instructions: v.optional(v.string()),

    stream: v.optional(v.boolean()),
    maxMessages: v.optional(v.number()),
    prependNamesToMessageContent: v.optional(v.boolean()),
    kvMetadata: v.optional(v.record(v.string(), v.string())),

    appendMessages: v.optional(v.array(v.object(messageCreateFields))),
  },
  handler: async (ctx, { threadId, appendMessages = [], ...args }) => {
    const thread = await getOrCreateUserThread(ctx, threadId)
    if (!thread) throw new ConvexError('invalid thread id')

    const kvMetadata = updateKvMetadata(thread.kvMetadata, {
      set: {
        'esuite:model:id': args.model.id,
        'esuite:model:provider': args.model.provider,
      },
    })
    await thread.patch({ updatedAtTime: Date.now(), kvMetadata })

    for (const messageArgs of appendMessages) {
      await createMessage(ctx, {
        threadId: thread._id,
        userId: thread.userId,
        ...messageArgs,
      })
    }

    const runId = await ctx.table('runs').insert({
      stream: true,
      ...args,
      threadId: thread._id,
      userId: thread.userId,

      status: 'queued',
      updatedAt: Date.now(),
    })

    await ctx.scheduler.runAfter(0, internal.action.run.run, {
      runId,
    })

    return {
      runId,
      threadId: thread._id,
      threadSlug: thread.slug,
    }
  },
  returns: v.object({
    runId: v.id('runs'),
    threadId: v.id('threads'),
    threadSlug: v.string(),
  }),
})

export const list = query({
  args: {
    threadId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { threadId, limit = 20 }) => {
    const thread = await getThread(ctx, threadId)
    if (!thread) return null

    const runs = await ctx
      .table('runs', 'threadId', (q) => q.eq('threadId', thread._id))
      .order('desc')
      .take(Math.min(limit, 100))
      .map(async (run) => ({
        ...run,
        providerMetadata: undefined,
        texts: await ctx
          .table('texts', 'runId', (q) => q.eq('runId', run._id))
          .filter((q) => q.eq(q.field('deletionTime'), undefined))
          .map((text) => text.doc()),
      }))
    return runs
  },
  returns: nullable(v.array(v.object(runReturnFields))),
})
