import z from 'zod'

// TODO complete
export const schemaEngine = z.object({
  id: z.string(),
  model: z.string(),
  providerId: z.string(),
  displayName: z.string(),
  creatorName: z.string(),
})

export const schemaAgentParameters = z
  .object({
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

export const schemaAgent = z.object({
  id: z.string(),
  // owner
  ownerId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),

  name: z.string(),
  image: z.string(),

  engine: schemaEngine,
  engineId: z.string(),
  parameters: z.record(schemaAgentParameters),
})

export const schemaWorkbench = z
  .object({
    tabs: z.array(
      z.object({
        // Tab
        id: z.string(),
        agentId: z.string(),
        isOpen: z.boolean(),
      }),
    ),
    activeTabId: z.string(),
  })
  .catch({
    tabs: [],
    activeTabId: '',
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
