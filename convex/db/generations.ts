import { asyncMap, pick } from 'convex-helpers'
import { v } from 'convex/values'

import { internal } from '../_generated/api'
import { internalMutation, query } from '../functions'
import { generationFieldsV1 } from '../schema'

import type { MutationCtx } from '../types'
import type { Infer } from 'convex/values'

export const get = query({
  args: {
    generationId: v.id('generations_v1'),
  },
  handler: async (ctx, { generationId }) => {
    return await ctx.table('generations_v1').get(generationId)
  },
})

export const activate = internalMutation({
  args: {
    generationId: v.id('generations_v1'),
  },
  handler: async (ctx, { generationId }) => {
    const generation = await ctx.table('generations_v1').getX(generationId)
    if (generation.status !== 'pending') {
      throw new Error('Image generation is not pending')
    }

    await generation.patch({
      status: 'active',
      updatedAt: Date.now(),
    })

    return generation
  },
})

export const complete = internalMutation({
  args: {
    generationId: v.id('generations_v1'),
    ...pick(generationFieldsV1, ['results', 'output']),
  },
  handler: async (ctx, { generationId, results, output }) => {
    const generation = await ctx.table('generations_v1').getX(generationId)
    if (generation.status !== 'active') {
      throw new Error('Image generation is not active')
    }

    await generation.patch({
      status: 'completed',
      updatedAt: Date.now(),
      results,
      output,
    })

    await asyncMap(results, async (result) => {
      if (result.type === 'image') {
        await ctx.scheduler.runAfter(0, internal.action.ingestImageUrl.run, {
          messageId: generation.messageId,
          sourceType: 'generation',
          sourceUrl: result.url,
          generationId,
        })
      }
    })
  },
})

export const fail = internalMutation({
  args: {
    generationId: v.id('generations_v1'),
    ...pick(generationFieldsV1, ['output']),
  },
  handler: async (ctx, { generationId, output }) => {
    const generation = await ctx.table('generations_v1').getX(generationId)
    if (generation.status !== 'active') {
      throw new Error('Image generation is not active')
    }

    await generation.patch({
      status: 'failed',
      updatedAt: Date.now(),
      output,
    })
  },
})

const createArgs = v.object(
  pick(generationFieldsV1, ['input', 'messageId', 'threadId', 'userId', 'workflow']),
)
export const create = internalMutation({
  args: {
    ...createArgs.fields,
  },
  handler: async (ctx, { input, messageId, threadId, userId, workflow }) => {
    const generationId = await ctx.table('generations_v1').insert({
      input,
      messageId,
      threadId,
      userId,
      status: 'pending',
      updatedAt: Date.now(),
      results: [],
    })

    if (workflow === 'guided') {
      await ctx.scheduler.runAfter(0, internal.action.guidedTextToImage.run, {
        generationId,
      })
    } else {
      await ctx.scheduler.runAfter(0, internal.action.textToImage.run, {
        generationId,
      })
    }

    return generationId
  },
})

export const createGeneration = async (
  ctx: MutationCtx,
  { workflow, ...args }: Infer<typeof createArgs>,
) => {
  const generationId = await ctx.table('generations_v1').insert({
    ...args,
    status: 'pending',
    updatedAt: Date.now(),
    results: [],
  })

  if (workflow === 'guided') {
    await ctx.scheduler.runAfter(0, internal.action.guidedTextToImage.run, {
      generationId,
    })
  } else {
    await ctx.scheduler.runAfter(0, internal.action.textToImage.run, {
      generationId,
    })
  }

  return generationId
}
