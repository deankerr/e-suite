import { ENV } from '@/lib/env'
import { RouteContext } from '@/lib/RouteContext'
import * as fal from '@fal-ai/serverless-client'
import z from 'zod'
import { falSchema } from './fal.schema'
import { openaiImageGenerationResponseSchema } from './openai.schema'

fal.config({
  credentials: ENV.FALAI_API_KEY,
})

type ImgRes = z.infer<typeof openaiImageGenerationResponseSchema>

export const falPlugin = {
  imageGeneration: async (input: unknown, ctx: RouteContext) => {
    console.log('fal imggen')
    const { function_id } = falSchema.image.generation.getFunctionId.parse(input)
    console.log('function_id', function_id)

    const body = falSchema.image.generation[function_id].parse(input)
    ctx.log({ tag: 'vendor-request', data: body, vendorId: 'fal' })

    console.log('body', body)
    const response = await fal.run(function_id, { input: body })
    ctx.log({ tag: 'vendor-response', data: body, vendorId: 'fal' })

    const res = falSchema.image.generation.response.parse(response)

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
