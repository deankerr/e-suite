import { createProtectedRoute } from '@/lib/protected-route'
import { falTestRun } from '@/plugins/fal.plugin'
import { openaiPlugin } from '@/plugins/openai.plugin'
import {
  openaiImageGenerationRequestSchema,
  openaiImageGenerationResponseSchema,
} from '@/plugins/openai.schema'

export const runtime = 'edge'

const imageGenerationRequestSchema = openaiImageGenerationRequestSchema
const imageGenerationResponseSchema = openaiImageGenerationResponseSchema

export const POST = createProtectedRoute({
  inputSchema: imageGenerationRequestSchema,
  handler: async (input) => {
    await falTestRun()
    const response = await openaiPlugin.imageGeneration(input)
    return response
  },
  outputSchema: imageGenerationResponseSchema,
})
