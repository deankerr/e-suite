import 'server-only'
import * as schema from '@/drizzle/schema'
import { db } from '@/lib/drizzle'
import { eq } from 'drizzle-orm'

//* Engines
export async function getEnginesList() {
  return await db.query.engines.findMany({
    with: {
      vendor: true,
    },
  })
}

export async function getEngineById({ id }: { id: string }) {
  return await db.query.engines.findFirst({
    where: eq(schema.engines.id, id),
    with: {
      vendor: true,
    },
  })
}
