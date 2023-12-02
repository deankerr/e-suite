import { createProtectedRoute } from '@/lib/protected-route'
import { openaiPlugin } from '@/plugins/openai.plugin'
import {
  openaiModerationRequestSchema,
  openaiModerationResponseSchema,
} from '@/plugins/openai.schema'

const moderationRouteRequestSchema = openaiModerationRequestSchema
const moderationRouteResponseSchema = openaiModerationResponseSchema

export const POST = createProtectedRoute({
  inputSchema: moderationRouteRequestSchema,
  handler: async (input) => {
    const response = await openaiPlugin.moderation(input)
    return response
  },
  outputSchema: moderationRouteResponseSchema,
})
