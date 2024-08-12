import * as vb from 'valibot'

import { internal } from '../../_generated/api'
import { classifyImageContent } from '../actions/classifyImageContent'
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
          const { title, description } = result.object.image

          await ctx.runMutation(internal.db.images.updateImage, {
            imageId,
            captionTitle: title,
            captionText: description,
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

          const { object } = await classifyImageContent({ url })
          await ctx.runMutation(internal.db.images.updateImage, {
            imageId,
            objects: object.results,
            objectsModelId: object.modelId,
          })
          return object
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
