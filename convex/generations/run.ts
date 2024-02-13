import { v } from 'convex/values'
import z from 'zod'
import { api, internal } from '../_generated/api'
import { internalAction } from '../_generated/server'
import { createGenerationRequest, parseApiInferenceResponse } from '../providers/sinkin'
import { assert, error } from '../util'

export const generate = internalAction({
  args: {
    imageId: v.id('images'),
  },
  handler: async (ctx, { imageId }): Promise<void> => {
    try {
      const image = await ctx.runQuery(internal.files.images.get, { id: imageId })
      assert(image.parameters, 'Generation parameters missing')

      const imageModel = await ctx.runQuery(api.generations.imageModels.get, {
        id: image.parameters.imageModelId,
      })

      const parameters = {
        ...image.parameters,
        model: imageModel.sinkin?.refId ?? '',
        width: image.width,
        height: image.height,
      }
      const { url, options } = createGenerationRequest(parameters)

      const response = await fetch(url, options)
      const json = await response.json()
      const parsed = parseApiInferenceResponse(json)

      if (parsed.error) {
        throw error(parsed.error.message, { error })
      }

      const sourceUrl = first.parse(parsed.result.images)

      await ctx.runMutation(internal.files.images.addSourceUrl, {
        id: imageId,
        sourceUrl,
      })

      await ctx.runMutation(internal.jobs.event, {
        type: 'generation',
        imageId,
        status: 'complete',
      })
    } catch (err) {
      const event = {
        type: 'generation' as const,
        imageId,
        status: 'error' as const,
        message: err instanceof Error ? `${err.name}: ${err.message}` : 'Unknown error',
      }
      await ctx.runMutation(internal.jobs.event, event)
      throw err
    }
  },
})

const first = z
  .array(z.string())
  .min(1)
  .transform((arr) => arr[0]!)
