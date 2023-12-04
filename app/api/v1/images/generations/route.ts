import { createProtectedRoute } from '@/lib/protected-route'
import { openaiPlugin } from '@/plugins/openai.plugin'
import {
  openaiImageGenerationRequestSchema,
  openaiImageGenerationResponseSchema,
} from '@/plugins/openai.schema'

const imageGenerationRequestSchema = openaiImageGenerationRequestSchema
const imageGenerationResponseSchema = openaiImageGenerationResponseSchema

export const POST = createProtectedRoute({
  inputSchema: imageGenerationRequestSchema,
  handler: async (input) => {
    const response = await openaiPlugin.imageGeneration(input)
    return response
  },
  outputSchema: imageGenerationResponseSchema,
})
