import { zid } from 'convex-helpers/server/zod'
import * as R from 'remeda'
import { z } from 'zod'

import { internal } from './_generated/api'
import { internalAction, internalMutation, internalQuery } from './functions'
import { sinkin } from './providers/sinkin'
import SinkinModels from './providers/sinkin.models.json'
import { generationFields, generationResultField } from './schema'
import { generateRid, insist, runWithRetries } from './utils'

import type { Ent, MutationCtx } from './types'

export const textToImageModels = SinkinModels

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
            private: true,
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
