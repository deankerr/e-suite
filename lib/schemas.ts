import z from 'zod'

// TODO complete
export const schemaEngine = z.object({
  id: z.string(),
  model: z.string(),
  providerId: z.string(),
  displayName: z.string(),
  creatorName: z.string(),
  includeParameters: z.record(z.unknown()),
})
export type Engine = z.infer<typeof schemaEngine>

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
  parameters: schemaAgentParametersRecord,
})
export type Agent = z.infer<typeof schemaAgent>

export const schemaAgentMerge = schemaAgent
  .omit({ id: true, ownerId: true, parameters: true })
  .partial()

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

export const schemaSuiteUserAll = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  emailVerified: z.string().nullable(),
  image: z.string().nullable(),

  role: z.enum(['USER', 'ADMIN']),
  workbench: schemaWorkbench,

  agents: z.array(schemaAgent),
})

export const schemaUser = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  emailVerified: z.string().nullable(),
  image: z.string().nullable(),

  role: z.enum(['USER', 'ADMIN']),

  agentIds: z.array(z.string()),
})
