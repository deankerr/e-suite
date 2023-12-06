import 'server-only'
import * as schema from '@/drizzle/schema'
import { db } from '@/lib/drizzle'

export async function addApiLog({
  requestId,
  payload,
}: {
  requestId: string
  payload: Record<string, string | undefined>
}) {
  const { host, path, authId, vendorId, errorCode } = payload
  await db
    .insert(schema.apiLog)
    .values({ requestId, data: payload, host, path, authId, vendorId, errorCode })
}
