import { Prisma } from '@prisma/client'
import z from 'zod'
import { fromZodError } from 'zod-validation-error'

const jsonRecord = z.record(z.unknown())
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

export function validateUserWorkbench(data: unknown) {
  const workbench = workbenchSchema.safeParse(data)
  if (workbench.success) {
    return workbench.data
  } else {
    console.error(fromZodError(workbench.error))
    return {
      tabs: [],
      tabBar: [],
    }
  }
}

const workbenchSchema = z.object({
  tabs: z.array(
    z.object({
      id: z.string(), // tabId
      agentId: z.string(), // TODO no agent/new tab etc.
      focused: z.boolean(),
    }),
  ),
  tabBar: z.string().array(), // tabIds
})
