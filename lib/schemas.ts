import z from 'zod'

const parameterKeys = [
  'temperature',
  'max_tokens',
  'frequency_penalty',
  'presence_penalty',
  'repetition_penalty',
  'top_p',
  'top_k',
  'stop',
  'stop_token',
]

export const schemaEngine = z.object({})
export const schemaAgentParameters = z
  .object({
    fieldsEnabled: z
      .string()
      .array()
      .transform((fieldsEnabled) => [
        // only allowed, unique keys
        ...new Set(fieldsEnabled.filter((field) => parameterKeys.includes(field))),
      ]),
    temperature: z.number(),
    max_tokens: z.number(),
    frequency_penalty: z.number(),
    presence_penalty: z.number(),
    repetition_penalty: z.number(),
    top_p: z.number(),
    top_k: z.number(),
    stop: z.string().array(),
    stop_token: z.string().array(),
  })
  .partial()

export const schemaAgentParametersRecord = z.record(schemaAgentParameters)

export const schemaAgent = z.object({
  id: z.string(),
  // owner
  ownerId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),

  name: z.string(),
  image: z.string(),

  engineId: z.string(),
  engine: z.any(),
  parameters: schemaAgentParametersRecord,
})
export type Agent = z.infer<typeof schemaAgent>

export const schemaAgentMerge = schemaAgent
  .omit({ id: true, ownerId: true, createdAt: true, updatedAt: true, parameters: true })
  .partial()
export type AgentUpdate = z.infer<typeof schemaAgentMerge>

export const schemaWorkbench = z
  .object({
    tabs: z.array(
      z.object({
        id: z.string(),
        agentId: z.string(),
      }),
    ),
    focusedTabId: z.string(),
    inferenceParameterForms: schemaAgentParametersRecord,
  })
  .catch({
    tabs: [],
    focusedTabId: '',
    inferenceParameterForms: {},
  })
