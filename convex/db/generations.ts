import { asyncMap, omit, pick } from 'convex-helpers'
import { nullable } from 'convex-helpers/validators'
import { paginationOptsValidator } from 'convex/server'
import { v } from 'convex/values'
import { nanoid } from 'nanoid/non-secure'

import { internal } from '../_generated/api'
import { internalMutation, mutation, query } from '../functions'
import { paginatedReturnFields } from '../lib/utils'
import { generationV2Fields, runConfigTextToImageV2 } from '../schema'
import { getImageV2Edges, imageReturnFields } from './images'

const generationsReturn = v.object({
  _id: v.id('generations_v2'),
  _creationTime: v.number(),
  ...pick(generationV2Fields, [
    'status',
    'updatedAt',
    'input',
    'runId',
    'ownerId',
    'input',
    'errors',
    'results',
    'workflow',
  ]),
  images: v.array(imageReturnFields),
})

export const get = query({
  args: {
    generationId: v.id('generations_v2'),
  },
  handler: async (ctx, { generationId }) => {
    return await ctx
      .table('generations_v2')
      .get(generationId)
      .then(async (gen) =>
        gen
          ? {
              ...omit(gen, ['output']),
              images: await ctx
                .table('images_v2', 'generationId', (q) => q.eq('generationId', gen._id))
                .map(async (image) => getImageV2Edges(ctx, image)),
            }
          : null,
      )
  },
  returns: nullable(generationsReturn),
})

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
        ...omit(gen, ['output']),
        images: await ctx
          .table('images_v2', 'generationId', (q) => q.eq('generationId', gen._id))
          .map(async (image) => getImageV2Edges(ctx, image)),
      }))
  },
  returns: v.object({ ...paginatedReturnFields, page: v.array(generationsReturn) }),
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

      await ctx.scheduler.runAfter(0, internal.action.generateTextToImage.run, {
        generationId: id,
      })

      return id
    })

    return ids
  },
  returns: v.array(v.id('generations_v2')),
})

export const activate = internalMutation({
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

export const complete = internalMutation({
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

export const fail = internalMutation({
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
