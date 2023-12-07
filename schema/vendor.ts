import z from 'zod'

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
