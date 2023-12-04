import { AppError } from '@/lib/error'
import { createProtectedRoute } from '@/lib/protected-route'
import { falPlugin } from '@/plugins/fal.plugin'
import { openaiPlugin } from '@/plugins/openai.plugin'
import {
  openaiImageGenerationRequestSchema,
  openaiImageGenerationResponseSchema,
} from '@/plugins/openai.schema'
import { vendorIdSchema } from '@/schema/vendor'
import z from 'zod'

export const runtime = 'edge'

const imageGenerationRequestSchema = openaiImageGenerationRequestSchema
  .merge(z.object({ vendorId: vendorIdSchema }))
  .passthrough()
const imageGenerationResponseSchema = openaiImageGenerationResponseSchema

export const POST = createProtectedRoute({
  inputSchema: imageGenerationRequestSchema,
  handler: async (input, ctx) => {
    if (input.vendorId === 'openai') return await openaiPlugin.imageGeneration(input)
    if (input.vendorId === 'fal') return await falPlugin.imageGeneration(input, ctx)
    throw new AppError('invalid_client_request', 'Invalid vendor id', { vendorId: input.vendorId })
  },
  outputSchema: imageGenerationResponseSchema,
})

// async function togetherai(params: ImageParams) {
//   console.log('togetherai', params)
//   const apiKey = env('TOGETHERAI_API_KEY')

//   const response = await fetch('https://api.together.xyz/inference', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${apiKey}`,
//     },
//     body: JSON.stringify(params),
//   })
//   if (!response.ok) throw new Error(`HTTP Error: ${response.status} ${response.statusText}`)

//   const result = responseSchema.togetherai.parse(await response.json())
//   const base64 = result.output.choices[0]?.image_base64 ?? raise('response missing expected data')
//   return NextResponse.json({ base64 })
// }

// async function replicate(params: ImageParams) {
//   try {
//     console.log('replicate')
//     const { prompt, model } = params
//     const api = new Replicate({ auth: env('REPLICATE_API_KEY') })
//     const input = { prompt }
//     const response = await api.run(model as `${string}/${string}:${string}`, { input })

//     const result = z.string().url().array().parse(response)
//     const url = result[0] ?? raise('replicate response missing data')
//     return NextResponse.json({ url })
//   } catch (error) {
//     if (error instanceof Error) {
//       const { message } = error
//       return sendErrorResponse({ message })
//     } else {
//       throw error
//     }
//   }
// }
