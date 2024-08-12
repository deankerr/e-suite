import * as vb from 'valibot'

import { internal } from '../../_generated/api'
import { jobErrorHandling } from '../helpers'

import type { Id } from '../../_generated/dataModel'
import type { Pipeline } from '../types'

export type IngestImageUrlPipelineInput = vb.InferOutput<typeof InitialInput>

const InitialInput = vb.object({
  url: vb.string(),
  messageId: vb.pipe(
    vb.string(),
    vb.transform((input) => input as Id<'messages'>),
  ),
})

export const ingestImageUrlPipeline: Pipeline = {
  name: 'ingestImageUrl',
  schema: InitialInput,
  steps: [
    {
      name: 'createImage',
      retryLimit: 3,
      action: async (ctx, input) => {
        return jobErrorHandling(async () => {
          const {
            initial: { url, messageId },
          } = vb.parse(vb.object({ initial: InitialInput }), input)

          const { fileId, metadata } = await ctx.runAction(internal.lib.sharp.storeImageFromUrl, {
            url,
          })

          const imageId = await ctx.runMutation(internal.db.images.createImage, {
            fileId,
            ...metadata,
            sourceUrl: url,
            messageId,
          })

          return { imageId, fileId }
        }, 'ingestImageUrl.createImage')
      },
    },
  ],
}
