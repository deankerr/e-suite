import z from 'zod'
import { openaiCreateChatSchema } from './openai.schema'

export const openrouterCreateChatSchema = openaiCreateChatSchema.merge(
  z.object({
    transforms: z.string().array().optional(),
  }),
)
