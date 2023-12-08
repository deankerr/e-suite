import 'server-only'
import * as schema from '@/drizzle/database.schema'
import { db } from '@/lib/drizzle'
import { type InferInsertModel } from 'drizzle-orm'

export type InsertResource = InferInsertModel<typeof schema.resources>
export type InsertModel = InferInsertModel<typeof schema.models>

export async function getVendorModelListData() {
  return await db.query.vendorModelListData.findMany({})
}

export async function addVendorModelListData(
  data: InferInsertModel<typeof schema.vendorModelListData>[],
) {
  console.log('data/add models', data)
  await db.insert(schema.vendorModelListData).values(data)
}

export async function addResources(resources: InsertResource[]) {
  console.log('db addResources %o', resources)
  if (resources.length > 0)
    await db.insert(schema.resources).values(resources).onConflictDoNothing()
}
