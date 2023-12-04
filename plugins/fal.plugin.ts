import { ENV } from '@/lib/env'
import { RouteContext } from '@/lib/RouteContext'
import * as fal from '@fal-ai/serverless-client'
import z from 'zod'
import { falImageGenerationRequestSchema, falImageGenerationResponseSchema } from './fal.schema'
import { openaiImageGenerationResponseSchema } from './openai.schema'

fal.config({
  credentials: ENV.FALAI_API_KEY,
})

type ImgRes = z.infer<typeof openaiImageGenerationResponseSchema>

export const falPlugin = {
  imageGeneration: async (input: unknown, ctx: RouteContext) => {
    const body = falImageGenerationRequestSchema.parse(input)
    ctx.log({ tag: 'vendor-request', data: body, vendorId: 'fal' })

    const response = await fal.run('110602490-lora', { input: body })
    ctx.log({ tag: 'vendor-response', data: body, vendorId: 'fal' })

    const res = falImageGenerationResponseSchema.parse(response)

    const fmt: ImgRes = {
      created: Date.now(),
      data: res.images.map((img) => ({ url: img.url })),
    }

    ctx.log({ tag: 'response-body', data: body, vendorId: 'fal' })
    return Response.json(fmt)
  },
}

const negative =
  'cartoon, painting, illustration, (worst quality, low quality, normal quality:2), (epicnegative:0.9)'
// "runwayml/stable-diffusion-v1-5" "SG161222/Realistic_Vision_V2.0"
