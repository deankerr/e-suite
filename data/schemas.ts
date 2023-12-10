import z from 'zod'

export type InferenceParameters = z.infer<typeof inferenceParametersSchema>
export type InferenceParametersRecord = z.infer<typeof inferenceParametersRecordSchema>
export const inferenceParametersSchema = z
  .object({
    temperature: z.number(),
    max_tokens: z.number(),
    frequency_penalty: z.number(),
    presence_penalty: z.number(),
    repetition_penalty: z.number(),
    top_p: z.number(),
    top_k: z.number(),
    stop: z.string().array(),
    stop_token: z.string(),
  })
  .partial()
export const inferenceParametersRecordSchema = z.record(inferenceParametersSchema)

export const vendorIds = [
  'openai',
  'openrouter',
  'togetherai',
  'fal',
  'replicate',
  'huggingface',
] as const
export const vendorIdSchema = z.enum(vendorIds)
export type VendorId = z.infer<typeof vendorIdSchema>

export const roleSchema = z.enum(['user', 'assistant', 'system', 'tool', 'function'])
export type Role = z.infer<typeof roleSchema>
export type Message = z.infer<typeof messageSchema>

export const messageSchema = z.object({
  role: roleSchema,
  name: z.string().optional(),
  content: z.string(),
})
