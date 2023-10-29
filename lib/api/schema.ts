import z from 'zod'
import { ADAPTERS, PLATFORMS } from '../platform/platforms'

const messages = z.array(
  z.object({
    role: z.enum(['user', 'assistant', 'system', 'function']),
    name: z.string().optional(),
    content: z.string(),
  }),
)
export type Messages = z.infer<typeof messages>

export const eChatRequestSchema = z
  .object({
    engineId: z.string(),
    messages,
    parameters: z
      .object({
        prompt: z.string().optional(),
        messages: messages.optional(),
        // TODO everything else?
      })
      .passthrough(),
  })
  .passthrough()
export type EChatRequestSchema = z.infer<typeof eChatRequestSchema>

const eChatEngine = z.object({
  id: z.string(), // our id
  type: z.enum(ADAPTERS),
  platform: z.enum(PLATFORMS),
  model: z.string(), // our name string
  messages: z.boolean(),
  prompt: z.boolean(),
  suggestedPromptFormat: z.string().optional(), // suggested from togetherAI
  suggestedStopToken: z.string().optional(), // - can be wrong?
  parameters: z.record(z.string(), z.unknown()),
  // schema: typeof z.ZodAny,
  metadata: z.object({
    label: z.string(), // human friendly name
    creator: z.string(),
    description: z.string(),
    license: z.string(),
  }),
})
export type EChatEngine = z.infer<typeof eChatEngine>
