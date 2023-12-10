import 'server-only'
import { db, t } from '@/lib/drizzle'
import { inferenceParametersRecordSchema } from '@/schema/dto'
import { and, eq } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import z from 'zod'

const schema = createSelectSchema(t.agents, {
  name: (s) => s.name.min(1).max(1),
  image: (s) => s.image.max(128),
  resourceParameters: inferenceParametersRecordSchema,
})

const id = z.object({ id: z.string() })

export const updateAgent = schema.partial().and(id)

const withResourceVendor = {
  resource: {
    with: {
      vendor: true,
    },
  },
} as const

export async function create(values: typeof t.agents.$inferInsert) {
  await db.insert(t.agents).values(values)
}

export async function update(id: string, values: Partial<typeof t.agents.$inferInsert>) {
  await db.update(t.agents).set(values).where(eq(t.agents.id, id))
}

export async function get(id: string) {
  return await db.query.agents.findFirst({
    where: eq(t.agents.id, id),
    with: withResourceVendor,
  })
}

//* user restricted
const insertSchema = createInsertSchema(t.agents, {
  id: (schema) => schema.id.transform((_) => undefined),
  ownerId: (schema) => schema.ownerId.transform((_) => undefined),
  created: (schema) => schema.created.transform((_) => undefined),
  updated: (schema) => schema.updated.transform((_) => undefined),
  resourceParameters: inferenceParametersRecordSchema,
})

export async function createOwnedBy(
  ownerId: string,
  { values }: { values: typeof t.agents.$inferInsert | object },
) {
  const parsed = insertSchema.parse(values)
  await db.insert(t.agents).values({ ...parsed, ownerId })
}

export async function getOwnedBy(ownerId: string, { id }: { id: string }) {
  return await db.query.agents.findFirst({
    where: and(eq(t.agents.id, id), eq(t.agents.ownerId, ownerId)),
    with: withResourceVendor,
  })
}

export async function getAllOwnedBy(ownerId: string) {
  return await db.query.agents.findMany({
    where: eq(t.agents.ownerId, ownerId),
    with: withResourceVendor,
  })
}

export async function updateOwnedBy(
  ownerId: string,
  {
    values,
  }: {
    values: Partial<typeof t.agents.$inferInsert>
  },
) {
  const { id, ...parsed } = updateAgent.parse(values)
  await db
    .update(t.agents)
    .set(parsed)
    .where(and(eq(t.agents.id, id), eq(t.agents.ownerId, ownerId)))
}

export async function deletedOwnedBy(ownerId: string, { id }: { id: string }) {
  await db.delete(t.agents).where(and(eq(t.agents.id, id), eq(t.agents.ownerId, ownerId)))
}
