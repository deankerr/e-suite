import * as vb from 'valibot'

import { api, internal } from '../../_generated/api'
import * as Fal from '../actions/textToImage/fal'
import * as Sinkin from '../actions/textToImage/sinkin'

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

          const model = await ctx.runQuery(api.db.models.getImageModel, {
            resourceKey: initial.resourceKey,
          })

          const [endpoint] = initial.resourceKey.split('::')
          const handler = getEndpointHandler(endpoint)
          const result = await handler({
            ...initial,
            model,
          })

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

const getEndpointHandler = (endpoint: string) => {
  switch (endpoint) {
    case 'fal':
      return Fal.textToImage
    case 'sinkin':
      return Sinkin.textToImage
    default:
      throw new Error(`unknown endpoint: ${endpoint}`)
  }
}
