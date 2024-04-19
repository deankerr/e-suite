import { zid } from 'convex-helpers/server/zod'
import { ConvexError } from 'convex/values'
import ky from 'ky'

import { api, internal } from './_generated/api'
import { internalAction, query } from './functions'
import { sinkin } from './providers/sinkin'

export const get = query({
  args: {
    generationId: zid('generations'),
  },
  handler: async (ctx, { generationId }) => await ctx.table('generations').getX(generationId),
})

export const getByMessageId = query({
  args: {
    messageId: zid('messages'),
  },
  handler: async (ctx, { messageId }) => {
    const generation = await ctx
      .table('generations', 'messageId', (q) => q.eq('messageId', messageId))
      .first()
    if (!generation) return null

    const generated_images = await generation.edge('generated_images')
    return {
      generation,
      generated_images,
    }
  },
})

export const textToImage = internalAction({
  args: {
    generationId: zid('generations'),
  },
  handler: async (ctx, { generationId }) => {
    const generation = await ctx.runQuery(api.generation.get, { generationId })

    const {
      _id,
      _creationTime,
      metadata: _meta,
      provider: __prov,
      width,
      height,
      n,
      ...parameters
    } = generation

    const { result, error } = await sinkin.textToImage({
      parameters,
      dimensions: { width, height, n },
    })

    if (error) {
      throw new ConvexError(error)
    }

    console.log('result', result)

    // TODO move to seperate action
    await Promise.all(
      result.images.map(async (sourceUrl) => {
        const sourceBlob = await ky.get(sourceUrl).blob()
        const sourceFileId = await ctx.storage.store(sourceBlob)

        await ctx.runMutation(internal.generated_images.create, {
          width,
          height,
          blurDataUrl: '',
          color: '',
          sourceFileId,
          fileId: sourceFileId,
          sourceUrl,
          generationId: generation._id,
        })
      }),
    )
  },
})
