import * as falClient from '@fal-ai/serverless-client'
import * as vb from 'valibot'

import type { ActionCtx } from '../../_generated/server'

falClient.config({
  credentials: process.env.FAL_API_KEY!,
})

const Response = vb.object({
  nsfw_probability: vb.number(),
})

export const evaluateNsfwProbability = async (ctx: ActionCtx, args: { url: string }) => {
  const response = await falClient.subscribe('fal-ai/imageutils/nsfw', {
    input: {
      image_url: args.url,
    },
  })

  const { nsfw_probability } = vb.parse(Response, response)
  return { nsfwProbability: nsfw_probability }
}
