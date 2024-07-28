import { fal_textToImage } from './actions/endpoints'
import * as Ingest from './actions/ingest'

import type { TextToImageWorkflow } from './types'

export const textToImageWorkflow: TextToImageWorkflow = {
  type: 'textToImage',
  steps: [
    {
      name: 'textToImageInference',
      retryLimit: 3,
      action: async (ctx, input, previousResults) => {
        console.log('wf 1 input', input)
        const images = await fal_textToImage(input)
        console.log('wf 1 output', images)
        return images
      },
    },
    {
      name: 'ingestImages',
      retryLimit: 3,
      action: async (ctx, input, previousResults) => {
        const prev = previousResults[0] as { imageUrls: string[] }
        console.log('wf 2 input', prev)

        const ids = await Ingest.images(ctx, {
          imageUrls: prev.imageUrls,
          messageId: input.messageId,
        })

        console.log('wf 2 output', ids)
        return ids
      },
    },
  ],
}
