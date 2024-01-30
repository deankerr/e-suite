import 'server-only'
import { db, t } from '@/lib/drizzle'
import { eq } from 'drizzle-orm'

export async function create(values: (typeof t.models.$inferInsert)[]) {
  await db.insert(t.models).values(values)
}

export async function update(id: string, values: Partial<typeof t.models.$inferInsert>) {
  await db.update(t.models).set(values).where(eq(t.models.id, id))
}

export async function get(id: string) {
  return await db.query.models.findFirst({ where: eq(t.models, id) })
}

export async function getAll() {
  return await db.query.models.findMany()
}
