import { zid } from 'convex-helpers/server/zod'
import { ConvexError } from 'convex/values'
import { z } from 'zod'

import { internal } from './_generated/api'
import { internalAction, internalQuery } from './functions'
import { sinkin } from './providers/sinkin'
import SinkinModels from './providers/sinkin.models.json'
import { insist } from './utils'

export const textToImageModels = SinkinModels

export const getI = internalQuery({
  args: {
    generationId: zid('generations'),
  },
  handler: async (ctx, { generationId }) => await ctx.table('generations').get(generationId),
})

export const textToImage = internalAction({
  args: {
    generationId: zid('generations'),
    dimensions: z.object({ width: z.number(), height: z.number(), n: z.number() }),
  },
  handler: async (ctx, { generationId, dimensions }): Promise<void> => {
    const generation = await ctx.runQuery(internal.generation.getI, { generationId })
    insist(generation, 'invalid generation id')

    const {
      _id,
      _creationTime,
      metadata: _meta,
      provider: _prov,
      dimensions: _dimensions,
      ...parameters
    } = generation

    const { result, error } = await sinkin.textToImage({
      parameters,
      dimensions,
    })

    if (error) {
      throw new ConvexError(error)
    }

    console.log('result', result)

    await Promise.all(
      result.images.map(
        async (sourceUrl) =>
          await ctx.runMutation(internal.generated_images.createFromUrl, {
            sourceUrl,
            generationId,
          }),
      ),
    )
  },
})
