import 'server-only'
import * as schema from '@/drizzle/schema'
import { db } from '@/lib/drizzle'

type CreateApiLog = typeof schema.apiLogs.$inferInsert

export async function createApiLog(values: CreateApiLog) {
  try {
    console.log('insert api log')
    await db.insert(schema.apiLogs).values(values)
    console.log('log success')
  } catch (err) {
    console.log('DB ERROR')
    if (err instanceof Error) {
      console.error(err)
    } else {
      console.error(err)
    }
  }
}
