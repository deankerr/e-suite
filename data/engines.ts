import { getUserSession } from './auth'
import 'server-only'
import * as schema from '@/drizzle/schema'
import { db } from '@/lib/drizzle'
import { invariant } from '@/lib/utils'
import { Engine } from '@/schema/dto'
import { and, eq } from 'drizzle-orm'

export async function getEngines(): Promise<Engine[]> {
  const user = await getUserSession()

  const engines = await db.query.engines.findMany({ with: { vendor: true } })
  return engines
}

export async function getEngine(id: string): Promise<Engine> {
  const user = await getUserSession()

  const engine = await db.query.engines.findFirst({
    where: eq(schema.engines.id, id),
    with: { vendor: true },
  })
  invariant(engine, 'Engine not found.')

  return engine
}
