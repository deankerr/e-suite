import z from 'zod'

export type Vendor = z.infer<typeof vendorSchema>

export type InferenceParameters = z.infer<typeof inferenceParametersSchema>
export type InferenceParametersRecord = z.infer<typeof inferenceParametersRecordSchema>

export const vendorSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  url: z.string(),
})

// const engineSchema = z.object({
//   id: z.string(),
//   category: z.string(), //? enum
//   model: z.string(),
//   isAvailable: z.boolean(),
//   isRestricted: z.boolean(),
//   displayName: z.string(),
//   creatorName: z.string(),
//   costInputNanoUsd: z.number(),
//   costOutputNanoUsd: z.number(),
//   createdAt: z.date(),
//   updatedAt: z.date(),

//   vendorId: z.string(),
//   vendor: vendorSchema,
//   vendorModelId: z.string(),

//   description: z.string().nullable(),
//   url: z.string().nullable(),
//   license: z.string().nullable(),
//   contextLength: z.number().nullable(),
//   promptFormat: z.string().nullable(),
//   comment: z.string().nullable(),
//   instructType: z.string().nullable(),
//   outputTokenLimit: z.number().nullable(),
//   tokenizer: z.string().nullable(),
//   stopTokens: z.string().array().nullable(),
//   parameterSize: z.number().nullable(),
// })

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

const string32 = z
  .string()
  .transform((n) => n.trim())
  .refine((n) => n.length > 0)
  .transform((n) => (n.length > 32 ? n.slice(0, 32) : n))

// export const agentSchema = z.object({
//   id: z.string().min(1),
//   createdAt: z.date(),
//   updatedAt: z.date(),
//   engine: engineSchema,

//   name: string32,
//   image: z.string(),
//   engineId: z.string().min(1),
//   engineParameters: inferenceParametersRecordSchema,
// })

// export const createAgentSchema = agentSchema.pick({ name: true })

// export const updateAgentSchema = agentSchema
//   .pick({ id: true })
//   .merge(
//     agentSchema.pick({ name: true, image: true, engineId: true, engineParameters: true }).partial(),
//   )

// export const deleteAgentSchema = agentSchema.pick({ id: true })
