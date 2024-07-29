import * as vb from 'valibot'

import * as Ingest from '../actions/ingest'
import * as Fal from '../actions/textToImage/fal'

import type { Id } from '../../_generated/dataModel'
import type { Pipeline } from '../types'

export type TextToImagePipelineInput = vb.InferOutput<typeof InitialInput>

const InitialInput = vb.object({
  messageId: vb.pipe(
    vb.string(),
    vb.transform((input) => input as Id<'messages'>),
  ),
  resourceKey: vb.string(),
  prompt: vb.string(),
  n: vb.optional(vb.number()),
  size: vb.optional(vb.string()),
  width: vb.optional(vb.number()),
  height: vb.optional(vb.number()),
})

const InferenceResult = vb.object({
  initial: InitialInput,
  inference: vb.object({ imageUrls: vb.array(vb.string()) }),
})

export const textToImagePipeline: Pipeline = {
  name: 'textToImage',
  schema: InitialInput,
  steps: [
    {
      name: 'inference',
      retryLimit: 3,
      action: async (_, input) => {
        try {
          const { initial } = vb.parse(vb.object({ initial: InitialInput }), input)
          const { imageUrls } = await Fal.textToImage(initial)
          return { imageUrls }
        } catch (err) {
          throw err
        }
      },
    },

    {
      name: 'ingestImages',
      retryLimit: 3,
      action: async (ctx, input) => {
        try {
          const { initial, inference } = vb.parse(InferenceResult, input)

          const result = await Ingest.images(ctx, {
            imageUrls: inference.imageUrls,
            messageId: initial.messageId as Id<'messages'>,
          })
          return result
        } catch (err) {
          throw err
        }
      },
    },
  ],
}
