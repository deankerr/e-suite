import { zid } from 'convex-helpers/server/zod'
import { ConvexError } from 'convex/values'
import * as R from 'remeda'
import { z } from 'zod'

import { internal } from './_generated/api'
import { external } from './external'
import { internalAction, internalMutation, internalQuery, mutation, query } from './functions'
import { fal } from './providers/fal'
import { sinkin } from './providers/sinkin'
import { generationFields, generationResultField, generationVoteFields } from './schema'
import {
  generateRid,
  getImageGenerationSize,
  insist,
  runWithRetries,
  zPaginationOptValidator,
} from './utils'

import type { Ent, MutationCtx, QueryCtx } from './types'

// *** public queries ***
export const getGenerationXL = async (ctx: QueryCtx, generation: Ent<'generations'>) => {
  const votes = await generation.edge('generation_votes')
  const tally = R.pipe(
    votes,
    R.groupBy.strict(({ vote }) => (vote === 'none' ? undefined : vote)),
    R.mapValues((value) => value?.length ?? 0),
  )

  const size = getImageGenerationSize(generation.size)
  const generationXL = {
    ...generation,
    ...size,

    image: await generation.edge('generated_image'),
    votes: tally,
  }

  return external.xl.generation.parse(generationXL)
}

export const get = query({
  args: {
    rid: z.string(),
  },
  handler: async (ctx, { rid }) => {
    const generation = await ctx.table('generations', 'rid', (q) => q.eq('rid', rid)).unique()
    if (!generation || generation.deletionTime) return null

    return await getGenerationXL(ctx, generation)
  },
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
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .paginate(paginationOpts)
      .map(async (generation) => await getGenerationXL(ctx, generation))
  },
})
// *** end public queries ***

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

  const { sizes, ...generation } = inference

  await Promise.all(
    sizes.map(async ({ size, n }) => {
      const parameters = {
        ...generation,
        size,
      }

      const generationIds = await Promise.all(
        [...Array(n)].map(async (_) => {
          return await ctx.table('generations').insert({
            ...parameters,
            rid: await generateRid(ctx, 'generations'),
            private: message.private,
            messageId: message._id,
          })
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
    const input = {
      parameters,
      n: generationIds.length,
    }

    const { result, error } =
      parameters.provider === 'sinkin'
        ? await sinkin.textToImage(input)
        : await fal.textToImage(input)

    if (error) {
      if (error.noRetry) {
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

      throw new ConvexError({ ...error })
    }

    const pairs = R.zip(generationIds, result.urls)
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
    vote: generationVoteFields.vote,
    constituent: generationVoteFields.constituent,
  },
  handler: async (ctx, { generationId, vote, constituent }) => {
    const userId = ctx.viewerId ?? undefined

    const existingVote = await ctx
      .table('generation_votes', 'constituent_vote', (q) =>
        q.eq('constituent', constituent).eq('generationId', generationId),
      )
      .unique()

    if (existingVote) {
      if (existingVote.vote === vote) return null // repeat vote
      const hasAnonVoterLoggedIn = userId && !existingVote.userId
      const args = hasAnonVoterLoggedIn ? { vote, userId } : { vote }
      return await existingVote.patch(args)
    }

    return await ctx.table('generation_votes').insert({ generationId, vote, constituent, userId })
  },
})

export const getMyVote = query({
  args: {
    generationId: zid('generations'),
    constituent: generationVoteFields.constituent,
  },
  handler: async (ctx, { generationId, constituent }) => {
    const vote = await ctx
      .table('generation_votes', 'constituent_vote', (q) =>
        q.eq('constituent', constituent).eq('generationId', generationId),
      )
      .unique()

    return vote ? vote.vote : 'none'
  },
})

export const _generateFakeVotes = internalMutation({
  args: {},
  handler: async (ctx) => {
    const generations = await ctx.table('generations')
    const constituent = crypto.randomUUID()

    const votes = generations.flatMap(({ _id: generationId }) => {
      const best = [...Array(Math.floor(Math.random() * 10 + 1))].map((_) => ({
        constituent,
        vote: 'best' as const,
        generationId,
      }))
      const good = [...Array(Math.floor(Math.random() * 10 + 1))].map((_) => ({
        constituent,
        vote: 'good' as const,
        generationId,
      }))
      const poor = [...Array(Math.floor(Math.random() * 10 + 1))].map((_) => ({
        constituent,
        vote: 'poor' as const,
        generationId,
      }))
      const bad = [...Array(Math.floor(Math.random() * 10 + 1))].map((_) => ({
        constituent,
        vote: 'bad' as const,
        generationId,
      }))
      return [...best, ...good, ...poor, ...bad]
    })

    await ctx.table('generation_votes').insertMany(votes)
    console.log('created votes:', votes.length)
  },
})
