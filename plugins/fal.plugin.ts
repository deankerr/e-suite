import 'server-only'
import { ENV } from '@/lib/env'
import { RouteContext } from '@/lib/route'
import * as fal from '@fal-ai/serverless-client'
import z from 'zod'
import { falSchema } from './fal.schema'
import { openaiImageGenerationResponseSchema } from './openai.schema'

fal.config({
  credentials: ENV.FALAI_API_KEY,
})

type ImgRes = z.infer<typeof openaiImageGenerationResponseSchema>

export const falPlugin = {
  imageGeneration: async ({ input, log }: RouteContext) => {
    console.log('fal image generation')
    const { function_id } = falSchema.image.generation.getFunctionId.parse(input)

    const body = falSchema.image.generation[function_id].parse(input)
    log.add('vendorRequestBody', body)

    const response = await fal.run(function_id, { input: body })
    log.add('vendorResponseBody', response)

    const res = falSchema.image.generation.response.parse(response)

    const fmt: ImgRes = {
      created: Date.now(),
      data: res.images.map((img) => ({ url: img.url })),
    }

    log.add('responseBody', fmt)

    return Response.json(fmt)
  },
}

const negative =
  'cartoon, painting, illustration, (worst quality, low quality, normal quality:2), (epicnegative:0.9)'
// "runwayml/stable-diffusion-v1-5" "SG161222/Realistic_Vision_V2.0"
