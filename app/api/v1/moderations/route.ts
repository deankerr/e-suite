import { route } from '@/lib/route'
import { openaiPlugin } from '@/plugins/openai.plugin'
import {
  openaiModerationRequestSchema,
  openaiModerationResponseSchema,
} from '@/plugins/openai.schema'

export const runtime = 'edge'

const moderationRouteRequestSchema = openaiModerationRequestSchema
const moderationRouteResponseSchema = openaiModerationResponseSchema

export const POST = route({
  access: 'authorized',
  input: moderationRouteRequestSchema,
  handler: async (ctx) => {
    const response = await openaiPlugin.moderation(ctx)
    return response
  },
})
