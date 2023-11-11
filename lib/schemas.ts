import { Prisma } from '@prisma/client'
import z from 'zod'
import { fromZodError } from 'zod-validation-error'

export const jsonRecord = z.record(z.unknown())
const jsonRecordArray = jsonRecord.array()

export function validateJsonRecord(jsonValue: Prisma.JsonValue) {
  const result = jsonRecord.safeParse(jsonValue)

  if (!result.success) {
    console.error('validateJsonRecord fail:', fromZodError(result.error))
    return
  } else {
    return result.data
  }
}

export function validateWorkbench(data: unknown) {
  const workbench = workbenchSchema.safeParse(data)
  if (workbench.success) {
    return workbench.data
  } else {
    console.error(fromZodError(workbench.error))
    return { ...workbenchDefault }
  }
}

export const workbenchSchema = z.object({
  tabs: z.array(
    z.object({
      id: z.string(), // tabId
      agentId: z.string(), // TODO handle new agent
      open: z.boolean(),
    }),
  ),
  active: z.string(), // tabId
})
export type SuiteWorkbench = z.infer<typeof workbenchSchema>

export const suiteWorkbenchUpdateMergeSchema = workbenchSchema.partial()
export type SuiteWorkbenchUpdateMergeObject = z.infer<typeof suiteWorkbenchUpdateMergeSchema>

const workbenchDefault: SuiteWorkbench = {
  tabs: [],
  active: '',
}

/*
  parameters: {
    [key: engineId]: {
      values: {
        temperature: 1,
        max_tokens: 100,
        ...
      },
      enabled: {
        max_tokens: true
        ...
      }
    }
  }
*/
export const suiteInferenceParametersSchema = z.record(
  z.object({
    values: z
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
      .partial(),
    enabled: z.record(z.boolean()),
  }),
)
export type SuiteInferenceParametersSchema = z.infer<typeof suiteInferenceParametersSchema>

export const suiteAgentSchema = z.object({
  id: z.string().min(1), //? isCUID
  //? owner?
  ownerId: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),

  name: z.string().min(1),
  image: z.string(),

  //? engine?
  engineId: z.string().min(1),
  parameters: suiteInferenceParametersSchema,
})

//? handle parameters
export const suiteAgentUpdateMergeSchema = suiteAgentSchema
  .omit({
    id: true,
    ownerId: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial()
export type SuiteAgentUpdateMergeObject = z.infer<typeof suiteAgentUpdateMergeSchema>
