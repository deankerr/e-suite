import * as vb from 'valibot'

import { internal } from '../../_generated/api'
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

export const textToImagePipeline: Pipeline = {
  name: 'textToImage',
  schema: InitialInput,
  steps: [
    {
      name: 'inference',
      retryLimit: 3,
      action: async (ctx, input) => {
        try {
          const { initial } = vb.parse(vb.object({ initial: InitialInput }), input)
          const result = await Fal.textToImage(initial)

          for (const url of result.imageUrls) {
            await ctx.runMutation(internal.workflows.jobs.createIngestImageUrlJob, {
              url,
              messageId: initial.messageId,
            })
          }

          return result
        } catch (err) {
          throw err
        }
      },
    },
  ],
}
