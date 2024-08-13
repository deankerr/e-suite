import * as vb from 'valibot'

import { internal } from '../../_generated/api'
import { classifyImageObjects } from '../actions/classifyImageObjects'
import { evaluateNsfwProbability } from '../actions/evaluateNsfwProbability'
import { generateImageMetadata } from '../actions/generateImageMetadata'
import { jobErrorHandling } from '../helpers'

import type { Id } from '../../_generated/dataModel'
import type { Pipeline } from '../types'

export type GenerateImageMetadataPipelineInput = vb.InferOutput<typeof InitialInput>

const InitialInput = vb.object({
  imageId: vb.pipe(
    vb.string(),
    vb.transform((input) => input as Id<'images'>),
  ),
  url: vb.string(),
})

export const generateImageMetadataPipeline: Pipeline = {
  name: 'generateImageMetadata',
  schema: InitialInput,
  steps: [
    {
      name: 'caption',
      retryLimit: 3,
      action: async (ctx, input) => {
        return jobErrorHandling(async () => {
          const {
            initial: { imageId, url },
          } = vb.parse(vb.object({ initial: InitialInput }), input)

          const result = await generateImageMetadata({ url })
          const { title, description, text } = result.object.image

          await ctx.runMutation(internal.db.images.updateImage, {
            imageId,
            captionTitle: title,
            captionDescription: description,
            captionOCR: text.length > 0 ? text.join('\n') : undefined,
            captionModelId: 'gpt-4o-mini',
          })

          return result
        }, 'generateImageMetadata.caption')
      },
    },
    {
      name: 'objects',
      retryLimit: 3,
      action: async (ctx, input) => {
        return jobErrorHandling(async () => {
          const {
            initial: { imageId, url },
          } = vb.parse(vb.object({ initial: InitialInput }), input)

          const result = await classifyImageObjects({ url })

          if ('error' in result) {
            return { error: result.error }
          }

          const { objects, modelId } = result

          await ctx.runMutation(internal.db.images.updateImage, {
            imageId,
            objects,
            objectsModelId: modelId,
          })

          return { objects, objectsModelId: modelId }
        }, 'generateImageMetadata.objects')
      },
    },
    {
      name: 'nsfwProbability',
      retryLimit: 3,
      action: async (ctx, input) => {
        return jobErrorHandling(async () => {
          const {
            initial: { imageId, url },
          } = vb.parse(vb.object({ initial: InitialInput }), input)
          const { nsfwProbability } = await evaluateNsfwProbability({ url })

          await ctx.runMutation(internal.db.images.updateImage, {
            imageId,
            nsfwProbability,
          })

          return { nsfwProbability }
        }, 'generateImageMetadata.nsfwProbability')
      },
    },
  ],
}
