import { route } from '@/lib/route'
import { openaiPlugin } from '@/plugins/openai.plugin'
import { openaiSchema } from '@/plugins/openai.schema'

export const runtime = 'edge'

const moderationRouteRequestSchema = openaiSchema.moderations.request.describe('/moderations input')

export const POST = route({
  access: 'authorized',
  input: moderationRouteRequestSchema,
  handler: async (ctx) => {
    const response = await openaiPlugin.moderation(ctx)
    return response
  },
})
