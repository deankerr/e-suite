import { asyncMap, omit, pick } from 'convex-helpers'
import { paginationOptsValidator } from 'convex/server'
import { v } from 'convex/values'
import { nanoid } from 'nanoid/non-secure'

import { internal } from '../_generated/api'
import { internalMutation, mutation, query } from '../functions'
import { generationFieldsV1, generationV2Fields, runConfigTextToImageV2 } from '../schema'

import type { MutationCtx } from '../types'
import type { Infer } from 'convex/values'

const createArgs = v.object(pick(generationFieldsV1, ['input', 'messageId', 'threadId', 'userId']))
export const createGeneration = async (ctx: MutationCtx, args: Infer<typeof createArgs>) => {
  const generationId = await ctx.table('generations_v1').insert({
    ...args,
    status: 'pending',
    updatedAt: Date.now(),
    results: [],
  })

  await ctx.scheduler.runAfter(0, internal.action.textToImage.run, {
    generationId,
  })

  return generationId
}

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

// => V2
export const list = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { paginationOpts }) => {
    const viewer = await ctx.viewerX()
    return await ctx
      .table('generations_v2', 'ownerId', (q) => q.eq('ownerId', viewer._id))
      .order('desc')
      .paginate(paginationOpts)
      .map(async (gen) => ({
        ...gen,
        images: await ctx
          .table('images_v2', 'generationId', (q) => q.eq('generationId', gen._id))
          .map(async (image) => ({
            ...image,
            fileUrl: await ctx.storage.getUrl(image.fileId),
          })),
      }))
  },
})

export const create = mutation({
  args: {
    inputs: v.array(runConfigTextToImageV2),
  },
  handler: async (ctx, { inputs }) => {
    const viewer = await ctx.viewerX()
    const runId = nanoid()

    const ids = await asyncMap(inputs, async (input) => {
      const id = await ctx.table('generations_v2').insert({
        status: 'queued',
        updatedAt: Date.now(),
        input: { ...input, configId: nanoid() },
        runId,
        ownerId: viewer._id,
      })

      await ctx.scheduler.runAfter(0, internal.action.generate.run, {
        generationId: id,
      })

      return id
    })

    return ids
  },
})

export const activateV2 = internalMutation({
  args: {
    generationId: v.id('generations_v2'),
  },
  handler: async (ctx, { generationId }) => {
    const generation = await ctx.table('generations_v2').getX(generationId)
    if (generation.status !== 'queued') {
      throw new Error('Generation is not queued')
    }

    await generation.patch({
      status: 'active',
      updatedAt: Date.now(),
    })

    return generation
  },
})

export const completeV2 = internalMutation({
  args: {
    generationId: v.id('generations_v2'),
    results: v.array(generationV2Fields.results.element),
    output: v.any(),
  },
  handler: async (ctx, { generationId, results, output }) => {
    const generation = await ctx.table('generations_v2').getX(generationId)
    if (generation.status !== 'active') {
      throw new Error('Image generation is not active')
    }

    await generation.patch({
      status: 'done',
      updatedAt: Date.now(),
      results,
      output,
    })

    for (const result of results) {
      await ctx.scheduler.runAfter(0, internal.action.ingestImageUrl.runV2, {
        sourceType: 'generation',
        sourceUrl: result.url,
        generationId,
        ownerId: generation.ownerId,
        runId: generation.runId,
      })
    }
  },
})

export const failV2 = internalMutation({
  args: {
    generationId: v.id('generations_v2'),
    ...pick(generationV2Fields, ['errors']),
  },
  handler: async (ctx, { generationId, errors }) => {
    const generation = await ctx.table('generations_v2').getX(generationId)
    if (generation.status !== 'active') {
      throw new Error('Image generation is not active')
    }

    await generation.patch({
      status: 'failed',
      updatedAt: Date.now(),
      errors,
    })
  },
})
