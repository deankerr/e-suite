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

export type Vendor = z.infer<typeof vendorSchema>
export const vendorSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  url: z.string(),
})
