import { nullable } from 'convex-helpers/validators'
import { ConvexError, v } from 'convex/values'
import { z } from 'zod'

import { internalMutation, query } from '../functions'
import { updateKvMetadata } from './helpers/kvMetadata'
import { createMessage } from './helpers/messages'
import { runReturnFields } from './helpers/runs'
import { getChatModel } from './models'

import type { Doc } from '../_generated/dataModel'
import type { Ent, MutationCtx } from '../types'

export const get = query({
  args: {
    runId: v.id('runs'),
  },
  handler: async (ctx, { runId }) => {
    const run = await ctx.table('runs').get(runId)
    return run ? { ...run, providerMetadata: undefined } : run
  },
  returns: nullable(v.object(runReturnFields)),
})

export const activate = internalMutation({
  args: {
    runId: v.id('runs'),
  },
  handler: async (ctx, { runId }) => {
    const run = await ctx.skipRules.table('runs').getX(runId)
    if (run.status !== 'queued') throw new ConvexError({ message: 'run is not queued', runId })

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

    // * response message
    const message = await createMessage(
      ctx,
      {
        threadId: run.threadId,
        userId: run.userId,
        role: 'assistant',
        runId,
        kvMetadata: {
          'esuite:run:hint': run.stream ? 'stream' : 'non-stream',
          'esuite:run:model-id': run.model.id,
        },
      },
      { skipRules: true },
    )

    await run.patch({
      status: 'active',
      updatedAt: Date.now(),
      startedAt: Date.now(),
      messageId: message._id,
    })

    return {
      run: run.doc(),
      messages: messages.reverse(),
      threadInstructions: thread.instructions,
    }
  },
})

async function getOrCreateRunMessage(ctx: MutationCtx, run: Ent<'runs'>) {
  const runMessage = run.messageId ? await ctx.skipRules.table('messages').get(run.messageId) : null
  if (runMessage) return runMessage

  return await createMessage(
    ctx,
    {
      threadId: run.threadId,
      userId: run.userId,
      role: 'assistant',
      runId: run._id,
    },
    { skipRules: true },
  )
}

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
    if (run.status !== 'active') throw new ConvexError({ message: 'run is not active', runId })

    const chatModel = await getChatModel(ctx, run.model.id)

    const runMessage = await getOrCreateRunMessage(ctx, run)
    const kvMetadata = runMessage.kvMetadata ?? {}
    await runMessage.patch({
      text,
      kvMetadata: updateKvMetadata(kvMetadata, {
        delete: ['esuite:run:hint'],
        set: {
          'esuite:run:model-id': run.model.id,
          'esuite:run:model-name': chatModel?.name,
        },
      }),
    })

    const cost = chatModel
      ? getInferenceCost({
          promptTokens: usage.promptTokens,
          completionTokens: usage.completionTokens,
          model: chatModel,
        })
      : undefined

    await run.patch({
      status: 'done',
      updatedAt: Date.now(),
      endedAt: Date.now(),
      finishReason,
      usage,
      cost,
      messageId: runMessage._id,
    })
  },
})

function getInferenceCost({
  promptTokens,
  completionTokens,
  model,
}: {
  promptTokens: number
  completionTokens: number
  model: Doc<'chat_models'>
}) {
  return (
    (promptTokens * model.pricing.tokenInput + completionTokens * model.pricing.tokenOutput) /
    1_000_000
  )
}

export const fail = internalMutation({
  args: {
    runId: v.id('runs'),
    errors: v.array(v.string()),
  },
  handler: async (ctx, { runId, ...args }) => {
    const run = await ctx.skipRules.table('runs').getX(runId)
    if (run.status !== 'active') throw new ConvexError({ message: 'run is not active', runId })

    const errors = [...(run.errors ?? []), ...args.errors]

    await run.patch({
      status: 'failed',
      updatedAt: Date.now(),
      endedAt: Date.now(),
      errors,
    })

    if (run.messageId) {
      try {
        await ctx.skipRules.table('messages').getX(run.messageId).delete()
      } catch (err) {
        console.error('Failed to delete run message', err)
      }
    }
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
