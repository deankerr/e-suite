import { messageSchema } from '@/schema/message'
import z, { ZodTypeAny } from 'zod'

export const openaiCreateChatSchema = z.object({
  model: z.string(),
  messages: messageSchema.array(),
  stream: z.boolean().optional(),

  frequency_penalty: z.number().min(-2).max(2).step(0.01).optional(),
  max_tokens: z.number().min(1).step(1).optional(), //? max per model?
  presence_penalty: z.number().min(-2).max(2).step(0.01).optional(),
  stop: z.string().array().min(0).max(4).optional(),
  temperature: z.number().min(0).max(2).step(0.01).optional(),
  top_p: z.number().min(0).max(2).step(0.01).optional(),
})
