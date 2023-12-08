import 'server-only'
import * as schema from '@/drizzle/database.schema'
import { db } from '@/lib/drizzle'
import { desc, type InferInsertModel } from 'drizzle-orm'

export type InsertResource = InferInsertModel<typeof schema.resources>
export type InsertModel = InferInsertModel<typeof schema.models>

export async function getVendorModelListData() {
  return await db.query.vendorModelListData.findMany({
    orderBy: desc(schema.vendorModelListData.retrievedAt),
  })
}

export async function addVendorModelListData(
  data: InferInsertModel<typeof schema.vendorModelListData>[],
) {
  await db.insert(schema.vendorModelListData).values(data)
}

export async function addResources(resources: InsertResource[]) {
  if (resources.length > 0)
    await db.insert(schema.resources).values(resources).onConflictDoNothing()
}
