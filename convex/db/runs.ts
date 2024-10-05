import { literals } from 'convex-helpers/validators'
import { ConvexError, v } from 'convex/values'
import { z } from 'zod'

import { internal } from '../_generated/api'
import { internalMutation, mutation } from '../functions'
import { modelParametersFields } from '../schema'
import { updateKvMetadata } from './helpers/kvMetadata'
import { createMessage } from './messages'
import { getOrCreateUserThread } from './threads'

import type { MutationCtx } from '../types'

export const create = mutation({
  args: {
    threadId: v.string(),

    model: v.object({
      provider: v.string(),
      id: v.string(),
    }),
    modelParameters: v.optional(v.object(modelParametersFields)),
    instructions: v.optional(v.string()),

    maxMessages: v.optional(v.number()),
    prependNamesToMessageContent: v.optional(v.boolean()),
    stream: v.optional(v.boolean()),

    appendMessages: v.optional(
      v.array(
        v.object({
          role: literals('assistant', 'user'),
          name: v.optional(v.string()),
          text: v.optional(v.string()),
        }),
      ),
    ),
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
      startedAt: 0,
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

export const activate = internalMutation({
  args: {
    runId: v.id('runs'),
  },
  handler: async (ctx, { runId }) => {
    const run = await ctx.skipRules.table('runs').getX(runId)
    if (run.status !== 'queued') throw new ConvexError('run is not queued')

    await run.patch({
      status: 'active',
      updatedAt: Date.now(),
      startedAt: Date.now(),
    })

    const limit = run.maxMessages ?? 20

    const messages = await ctx.skipRules
      .table('messages', 'threadId', (q) =>
        q.eq('threadId', run.threadId).lt('_creationTime', run._creationTime),
      )
      .order('desc')
      .filter((q) =>
        q.and(q.eq(q.field('deletionTime'), undefined), q.neq(q.field('text'), undefined)),
      )
      .take(limit)
      .map((message) => {
        if (run.prependNamesToMessageContent) {
          return {
            role: message.role,
            content:
              message.role === 'user' && message.name
                ? `${message.name}: ${message.text}`
                : (message.text as string),
          }
        } else {
          return {
            role: message.role,
            name: message.role === 'user' ? message.name : undefined,
            content: message.text as string,
          }
        }
      })

    const thread = await ctx.table('threads').getX(run.threadId)

    return {
      run: run.doc(),
      messages: messages.reverse(),
      threadInstructions: thread.instructions,
    }
  },
})

export const complete = internalMutation({
  args: {
    runId: v.id('runs'),
    text: v.string(),
    finishReason: v.string(),
    usage: v.object({
      promptTokens: v.number(),
      completionTokens: v.number(),
      totalTokens: v.number(),
    }),
  },
  handler: async (ctx, { runId, text, finishReason, usage }) => {
    const run = await ctx.skipRules.table('runs').getX(runId)
    if (run.status !== 'active') throw new ConvexError('run is not active')

    const message = await createMessage(
      ctx,
      {
        threadId: run.threadId,
        userId: run.userId,
        role: 'assistant',
        text,
        runId,
      },
      { skipRules: true },
    )

    const cost = await getInferenceCost(ctx, {
      promptTokens: usage.promptTokens,
      completionTokens: usage.completionTokens,
      model: run.model,
    })

    await run.patch({
      status: 'done',
      updatedAt: Date.now(),
      endedAt: Date.now(),
      finishReason,
      usage,
      cost,
      messageId: message._id,
    })
  },
})

async function getInferenceCost(
  ctx: MutationCtx,
  {
    promptTokens,
    completionTokens,
    model,
  }: { promptTokens: number; completionTokens: number; model: { id: string; provider: string } },
) {
  try {
    const chatModel = await ctx
      .table('chat_models')
      .filter((q) =>
        q.and(q.eq(q.field('modelId'), model.id), q.eq(q.field('provider'), model.provider)),
      )
      .first()
    if (!chatModel) return

    return (
      (promptTokens * chatModel.pricing.tokenInput +
        completionTokens * chatModel.pricing.tokenOutput) /
      1_000_000
    )
  } catch (err) {
    console.error(err)
    return
  }
}

export const fail = internalMutation({
  args: {
    runId: v.id('runs'),
    errors: v.array(v.string()),
  },
  handler: async (ctx, { runId, ...args }) => {
    const run = await ctx.skipRules.table('runs').getX(runId)
    if (run.status !== 'active') throw new ConvexError('run is not active')

    const errors = [...(run.errors ?? []), ...args.errors]

    await run.patch({
      status: 'failed',
      updatedAt: Date.now(),
      endedAt: Date.now(),
      errors,
    })
  },
})

const openRouterMetadataSchema = z.object({
  id: z.string(),
  total_cost: z.number(),
  finish_reason: z.string(),
  tokens_prompt: z.number(),
  tokens_completion: z.number(),
})

export const updateProviderMetadata = internalMutation({
  args: {
    runId: v.id('runs'),
    providerMetadata: v.any(),
  },
  handler: async (ctx, { runId, providerMetadata }) => {
    const run = await ctx.skipRules.table('runs').getX(runId)

    const parsed = openRouterMetadataSchema.safeParse(providerMetadata)
    if (parsed.success) {
      const { total_cost, finish_reason, tokens_prompt, tokens_completion } = parsed.data

      await run.patch({
        updatedAt: Date.now(),
        finishReason: finish_reason,
        usage: {
          promptTokens: tokens_prompt,
          completionTokens: tokens_completion,
          totalTokens: tokens_prompt + tokens_completion,
        },
        cost: total_cost,
        providerMetadata,
      })
    } else {
      await run.patch({
        updatedAt: Date.now(),
        providerMetadata,
      })
    }
  },
})
