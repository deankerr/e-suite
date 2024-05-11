import { asyncMap } from 'convex-helpers'
import { zid } from 'convex-helpers/server/zod'
import { ConvexError } from 'convex/values'
import { z } from 'zod'

import { internal } from './_generated/api'
import { internalAction, internalMutation, internalQuery } from './functions'
import { fal } from './providers/fal'
import { sinkin } from './providers/sinkin'
import { generationResultField } from './schema'
import { insist } from './utils'

import type { Id } from './_generated/dataModel'
import type { GenerationParameters } from './schema'
import type { MutationCtx } from './types'

type CreateGenerationJobParams = { parameters: GenerationParameters; messageId: Id<'messages'> }
export const createGenerationJob = async (ctx: MutationCtx, params: CreateGenerationJobParams) => {
  const generationJobId = await ctx.table('generation_jobs').insert({ ...params, status: 'queue' })
  await ctx.scheduler.runAfter(0, internal.generation_jobs.run, { generationJobId })
}

export const get = internalQuery({
  args: {
    generationJobId: zid('generation_jobs'),
  },
  handler: async (ctx, { generationJobId }) =>
    await ctx.table('generation_jobs').getX(generationJobId),
})

export const acquire = internalMutation({
  args: {
    generationJobId: zid('generation_jobs'),
  },
  handler: async (ctx, { generationJobId }) => {
    const job = await ctx.table('generation_jobs').getX(generationJobId)
    insist(job.status === 'pending', 'invalid job status')
    await job.patch({ status: 'active' })

    return job
  },
})

export const result = internalMutation({
  args: {
    generationJobId: zid('generation_jobs'),
    status: z.enum(['complete', 'failed']),
    result: generationResultField,
  },
  handler: async (ctx, { generationJobId, status, result }) => {
    const job = await ctx.table('generation_jobs').getX(generationJobId)
    await job.patch({ status, result })

    if (result.type === 'url') {
      await asyncMap(
        result.items,
        async (sourceUrl) =>
          await ctx.scheduler.runAfter(0, internal.lib.sharp.createGeneratedImageFromUrl, {
            sourceUrl,
            generationJobId,
          }),
      )
    }
  },
})

export const run = internalAction({
  args: {
    generationJobId: zid('generation_jobs'),
  },
  handler: async (ctx, { generationJobId }) => {
    const { parameters } = await ctx.runMutation(internal.generation_jobs.acquire, {
      generationJobId,
    })

    const { result, error } =
      parameters.provider === 'sinkin'
        ? await sinkin.textToImage({
            parameters: parameters as GenerationParameters,
            n: parameters.n,
          })
        : await fal.textToImage({ parameters: parameters as GenerationParameters, n: parameters.n })

    if (error) {
      if (error.noRetry) {
        await ctx.runMutation(internal.generation_jobs.result, {
          generationJobId,
          result: { type: 'error', items: [error.message] },
          status: 'failed',
        })
        return
      }

      throw new ConvexError({ ...error })
    }

    await ctx.runMutation(internal.generation_jobs.result, {
      generationJobId,
      result: { type: 'url', items: result.urls },
      status: 'complete',
    })
  },
})
