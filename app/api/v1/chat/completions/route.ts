import { AppError } from '@/lib/error'
import { createProtectedRoute } from '@/lib/protected-route'
import { openaiPlugin } from '@/plugins/openai.plugin'
import { openrouterPlugin } from '@/plugins/openrouter.plugin'
import { togetheraiPlugin } from '@/plugins/togetherai.plugin'
import { messageSchema, roleSchema } from '@/schema/message'
import { vendorIdSchema } from '@/schema/vendor'
import z from 'zod'

export type ChatRouteRequest = z.infer<typeof chatRouteRequestSchema>
export type ChatRouteResponse = z.infer<typeof chatRouteResponseSchema>

//* Request
const chatRouteRequestSchema = z
  .object({
    vendorId: vendorIdSchema,
    engineId: z.string().min(1), // temp
    model: z.string().min(1), // to be sent to vendor api
    messages: messageSchema.array().min(1),
  })
  .passthrough()

//* Response
//^ non-streaming non-web ui only?
const choicesSchema = z.array(
  z.object({
    index: z.number(),
    message: z.object({
      content: z.string(),
      role: roleSchema,
      tool_calls: z.unknown(), // TODO
      function_call: z.unknown(), // TODO
    }),
    finish_reason: z.string(),
  }),
)

const usageSchema = z.object({
  prompt_tokens: z.number(),
  completion_tokens: z.number(),
  total_tokens: z.number(),
})

export const chatRouteResponseSchema = z.object({
  id: z.string(),
  object: z.string(),
  created: z.number(),
  model: z.string(),
  system_fingerprint: z.string(),
  choices: choicesSchema,
  usage: usageSchema,
})

export const POST = createProtectedRoute({
  inputSchema: chatRouteRequestSchema,
  handler: async (input, user) => {
    if (input.vendorId === 'openai') return await openaiPlugin.chat(input)
    if (input.vendorId === 'openrouter') return await openrouterPlugin.chat(input)
    if (input.vendorId === 'togetherai') return await togetheraiPlugin.chat(input)
    throw new AppError('invalid_client_request', 'Invalid vendor id', { vendorId: input.vendorId })
  },
  outputSchema: z.any(),
})
