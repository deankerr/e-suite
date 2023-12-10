import { roleSchema, vendorIdSchema } from '@/data/schemas'
import { AppError } from '@/lib/error'
import { route } from '@/lib/route'
import { huggingfacePlugin } from '@/plugins/huggingface.plugin'
import { openaiPlugin } from '@/plugins/openai.plugin'
import { openrouterPlugin } from '@/plugins/openrouter.plugin'
import { togetheraiPlugin } from '@/plugins/togetherai.plugin'
import z from 'zod'

export const runtime = 'edge'

export type ChatRouteRequest = z.infer<typeof chatRouteRequestSchema>
export type ChatRouteResponse = z.infer<typeof chatRouteResponseSchema>

//* Request
const chatRouteRequestSchema = z
  .object({
    vendorId: vendorIdSchema,
    // engineId: z.string().min(1), // temp
    model: z.string().min(1), // to be sent to vendor api
    // messages: messageSchema.array().min(1),
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

const chatRouteResponseSchema = z.object({
  _raw: z.any(),
  id: z.string(),
  object: z.string(),
  created: z.number(),
  model: z.string(),
  system_fingerprint: z.string(),
  choices: choicesSchema,
  usage: usageSchema,
})

export const POST = route({
  access: 'authorized',
  input: chatRouteRequestSchema,
  handler: async (ctx) => {
    if (ctx.input.vendorId === 'openai') return await openaiPlugin.chat.completions(ctx)
    if (ctx.input.vendorId === 'openrouter') return await openrouterPlugin.chat.completions(ctx)
    if (ctx.input.vendorId === 'togetherai') return await togetheraiPlugin.chat.completions(ctx)
    if (ctx.input.vendorId === 'huggingface') return await huggingfacePlugin.chat.completions(ctx)
    throw new AppError('vendor_method_not_supported')
  },
})
