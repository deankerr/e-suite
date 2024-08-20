import * as vb from 'valibot'

import { api, internal } from '../../_generated/api'
import { ResourceKey } from '../../lib/valibot'
import * as Fal from '../actions/textToImage/fal'
import * as Sinkin from '../actions/textToImage/sinkin'
import { jobErrorHandling } from '../helpers'

import type { Id } from '../../_generated/dataModel'
import type { Pipeline } from '../types'

export type TextToImagePipelineInput = vb.InferOutput<typeof InitialInput>

const InitialInput = vb.object({
  messageId: vb.pipe(
    vb.string(),
    vb.transform((input) => input as Id<'messages'>),
  ),
  threadId: vb.pipe(
    vb.string(),
    vb.transform((input) => input as Id<'threads'>),
  ),
  resourceKey: vb.string(),
  prompt: vb.string(),
  loras: vb.optional(
    vb.array(
      vb.object({
        path: vb.string(),
        scale: vb.optional(vb.number()),
      }),
    ),
  ),
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
        return jobErrorHandling(async () => {
          const { initial } = vb.parse(vb.object({ initial: InitialInput }), input)

          const model = await ctx.runQuery(api.db.models.getImageModel, {
            resourceKey: initial.resourceKey,
          })

          const { endpoint } = vb.parse(ResourceKey, initial.resourceKey)
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
        }, 'textToImage.inference')
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
