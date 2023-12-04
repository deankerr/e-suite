import 'server-only'
import * as schema from '@/drizzle/schema'
import { db } from '@/lib/drizzle'

type CreateApiLog = typeof schema.apiLogs.$inferInsert

export async function createApiLog(values: CreateApiLog) {
  await db.insert(schema.apiLogs).values(values)
}
