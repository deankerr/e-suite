import { zid } from 'convex-helpers/server/zod'
import * as R from 'remeda'
import { z } from 'zod'

import { internal } from './_generated/api'
import { internalAction, internalMutation, internalQuery, mutation, query } from './functions'
import { sinkin } from './providers/sinkin'
import SinkinModels from './providers/sinkin.models.json'
import { generationFields, generationResultField, generationVoteFields } from './schema'
import { generateRid, insist, runWithRetries, zPaginationOptValidator } from './utils'

import type { Ent, MutationCtx } from './types'

export const textToImageModels = SinkinModels

//* queries
export const getI = internalQuery({
  args: {
    generationId: zid('generations'),
  },
  handler: async (ctx, { generationId }) => await ctx.table('generations').get(generationId),
})

export const getManyI = internalQuery({
  args: {
    generationIds: zid('generations').array(),
  },
  handler: async (ctx, { generationIds }) => await ctx.table('generations').getManyX(generationIds),
})

export const _list = query({
  args: {
    paginationOpts: zPaginationOptValidator,
    order: z.enum(['asc', 'desc']).default('desc'),
  },
  handler: async (ctx, { paginationOpts, order }) => {
    return await ctx
      .table('generations')
      .order(order)
      .paginate(paginationOpts)
      .map(async (generation) => ({
        ...generation,
        image: await generation.edge('generated_image'),
      }))
  },
})

//* mutations
export const remove = mutation({
  args: {
    generationId: zid('generations'),
  },
  handler: async (ctx, { generationId }) => {
    return await ctx.table('generations').getX(generationId).delete()
  },
})

export const result = internalMutation({
  args: {
    generationId: zid('generations'),
    result: generationResultField,
  },
  handler: async (ctx, { generationId, result }) => {
    await ctx.table('generations').getX(generationId).patch({ result })

    if (result.type === 'url')
      await runWithRetries(ctx, internal.lib.sharp.generationFromUrl, {
        sourceUrl: result.message,
        generationId,
      })
  },
})

//* Inference
// Helper
export const runGenerationInference = async (ctx: MutationCtx, message: Ent<'messages'>) => {
  const inference = message.inference?.generation
  insist(inference, 'message lacks generation parameters')

  await Promise.all(
    inference.dimensions.map(async ({ width, height, n }) => {
      const parameters = {
        ...inference.parameters,
        width,
        height,
      }

      const generationIds = await Promise.all(
        [...Array(n)].map(async (_) => {
          const generation = {
            ...parameters,
            rid: await generateRid(ctx, 'generations'),
            private: message.private,
            messageId: message._id,
          }
          return await ctx.table('generations').insert(generation)
        }),
      )

      await runWithRetries(ctx, internal.generation.textToImage, {
        generationIds,
        parameters,
      })
    }),
  )
}

//* Action
export const textToImage = internalAction({
  args: {
    generationIds: zid('generations').array(),
    parameters: z.object(generationFields),
  },
  handler: async (ctx, { generationIds, parameters }) => {
    const { result, error } = await sinkin.textToImage({
      parameters,
      n: generationIds.length,
    })

    // returned error = task failed successfully (no retry)
    if (error) {
      await Promise.all(
        generationIds.map(
          async (generationId) =>
            await ctx.runMutation(internal.generation.result, {
              generationId,
              result: { type: 'error', message: error.message },
            }),
        ),
      )
      return
    }

    const pairs = R.zip(generationIds, result.images)
    await Promise.all(
      pairs.map(
        async ([generationId, url]) =>
          await ctx.runMutation(internal.generation.result, {
            generationId,
            result: { type: 'url', message: url },
          }),
      ),
    )
  },
})

//* Votes
export const vote = mutation({
  args: {
    generationId: zid('generations'),
    ...generationVoteFields,
  },
  handler: async (ctx, { generationId, ip, userId, details, vote }) => {
    const existingVotes = await ctx
      .table('generation_votes', 'generationId', (q) => q.eq('generationId', generationId))
      .filter((q) => q.or(q.eq(q.field('userId'), userId), q.eq(q.field('ip'), ip)))

    if (existingVotes.length > 0) {
      if (existingVotes.length > 1) console.warn('multiple ip votes', existingVotes)
      const first = existingVotes[0]!

      await first.replace({
        vote: first.vote === vote ? 'none' : vote,
        generationId,
        ip,
        userId,
        details,
      })
    } else {
      await ctx.table('generation_votes').insert({ generationId, ip, userId, details, vote })
    }
  },
})

export const getVotes = query({
  args: {
    generationId: zid('generations'),
  },
  handler: async (ctx, { generationId }) => {
    const votes =
      (await ctx.table('generation_votes', 'generationId', (q) =>
        q.eq('generationId', generationId),
      )) ?? []

    const tally = R.pipe(
      votes,
      R.groupBy.strict((v) => v.vote),
      R.omit(['none']),
      R.mapValues((value) => value?.length ?? 0),
    )
    return tally
  },
})
