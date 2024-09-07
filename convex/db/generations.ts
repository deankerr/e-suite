import { asyncMap, omit, pick } from 'convex-helpers'
import { nullable } from 'convex-helpers/validators'
import { paginationOptsValidator } from 'convex/server'
import { v } from 'convex/values'
import { nanoid } from 'nanoid/non-secure'

import { internal } from '../_generated/api'
import { internalMutation, mutation, query } from '../functions'
import { paginatedReturnFields } from '../lib/utils'
import { generationV2Fields, runConfigTextToImageV2 } from '../schema'
import { getImageV2Edges, imagesReturn } from './images'

import type { Ent, QueryCtx, RunConfigTextToImageV2 } from '../types'

export const generationsReturn = v.object({
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
  images: v.array(imagesReturn),
})

export const getGenerationEdges = async (ctx: QueryCtx, generation: Ent<'generations_v2'>) => {
  const doc = omit(generation.doc(), ['output'])
  return {
    ...doc,
    input: generation.input as RunConfigTextToImageV2,
    images: await ctx
      .table('images_v2', 'generationId', (q) => q.eq('generationId', generation._id))
      .map(async (image) => getImageV2Edges(ctx, image)),
  }
}

export const get = query({
  args: {
    generationId: v.id('generations_v2'),
  },
  handler: async (ctx, { generationId }) => {
    return await ctx
      .table('generations_v2')
      .get(generationId)
      .then(async (gen) => (gen ? await getGenerationEdges(ctx, gen) : null))
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
      .map(async (gen) => await getGenerationEdges(ctx, gen))
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

    return {
      runId,
      generationIds: ids,
    }
  },
  returns: v.object({
    runId: v.string(),
    generationIds: v.array(v.id('generations_v2')),
  }),
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
