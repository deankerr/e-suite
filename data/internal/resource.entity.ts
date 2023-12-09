import 'server-only'
import { db, t } from '@/lib/drizzle'
import { eq } from 'drizzle-orm'

export async function create(values: (typeof t.resources.$inferInsert)[]) {
  await db.insert(t.resources).values(values)
}

export async function update(id: string, values: Partial<typeof t.resources.$inferInsert>) {
  await db.update(t.resources).set(values).where(eq(t.resources.id, id))
}

export async function get(id: string) {
  return await db.query.resources.findFirst({ where: eq(t.resources, id) })
}

export async function getAll() {
  return await db.query.resources.findMany()
}
