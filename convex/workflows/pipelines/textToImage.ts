import * as vb from 'valibot'

import { fal_textToImage } from '../actions/endpoints'
import * as Ingest from '../actions/ingest'

import type { Id } from '../../_generated/dataModel'
import type { Pipeline } from '../types'

const InferenceSchema = vb.object({
  messageId: vb.string(),
  resourceKey: vb.string(),
  prompt: vb.string(),
  n: vb.optional(vb.number()),
  size: vb.optional(vb.string()),
  width: vb.optional(vb.number()),
  height: vb.optional(vb.number()),
})

const IngestImagesSchema = vb.object({
  imageUrls: vb.array(vb.string()),
})

export const textToImagePipeline: Pipeline = {
  name: 'textToImage',
  steps: [
    {
      name: 'inference',
      retryLimit: 3,
      action: async (ctx, input, previousResults) => {
        try {
          const parsedInput = vb.parse(InferenceSchema, input)
          const result = await fal_textToImage(parsedInput)
          return result
        } catch (err) {
          throw err
        }
      },
    },
    {
      name: 'ingestImages',
      retryLimit: 3,
      action: async (ctx, input, previousResults) => {
        try {
          const parsedInput = vb.parse(InferenceSchema, input)
          const parsedPrev = vb.parse(IngestImagesSchema, previousResults.at(-1))

          const result = await Ingest.images(ctx, {
            imageUrls: parsedPrev.imageUrls,
            messageId: parsedInput.messageId as Id<'messages'>,
          })
          return result
        } catch (err) {
          throw err
        }
      },
    },
  ],
}
