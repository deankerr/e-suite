import * as falClient from '@fal-ai/serverless-client'
import * as vb from 'valibot'

import { ENV } from '../../lib/env'

falClient.config({
  credentials: ENV.FAL_API_KEY,
})

const modelId = 'fal-ai/idefics-2-8b'

const Response = vb.object({
  output: vb.string(),
})

export const generateImageCaption = async (args: { url: string }) => {
  const response = await falClient.subscribe(modelId, {
    input: {
      image_url: args.url,
      prompt:
        "What's in this image? Caption everything you see in great detail. If it has text, do an OCR and extract all of it.",
    },
  })

  const { output } = vb.parse(Response, response)
  return { caption: output, modelId }
}
