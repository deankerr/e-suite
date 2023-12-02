import z from 'zod'
import { messageSchema, roleSchema } from '../message'
import { vendorIdSchema } from '../vendor'

// POST /v1/chat/completions
export const createChatApiSchema = z
  .object({
    vendorId: vendorIdSchema,
    engineId: z.string().min(1), // temp
    model: z.string().min(1), // to be sent to vendor api
    messages: messageSchema.array().min(1),
  })
  .passthrough()

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

export const chatCompletionApiResponseSchema = z.object({
  id: z.string(),
  object: z.string(),
  created: z.number(),
  model: z.string(),
  system_fingerprint: z.string(),
  choices: choicesSchema,
  usage: usageSchema,
})
export type ChatCompletionApiResponseSchema = z.infer<typeof chatCompletionApiResponseSchema>
