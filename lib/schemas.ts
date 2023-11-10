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
  parameters: jsonRecord,
})

//? handle parameters
export const suiteAgentUpdateMergeSchema = suiteAgentSchema
  .omit({
    id: true,
    ownerId: true,
    createdAt: true,
    updatedAt: true,
    parameters: true,
  })
  .partial()
export type SuiteAgentUpdateMergeObject = z.infer<typeof suiteAgentUpdateMergeSchema>
