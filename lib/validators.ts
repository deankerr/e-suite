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
