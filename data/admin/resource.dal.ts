import 'server-only'
import * as schema from '@/drizzle/database.schema'
import { db } from '@/lib/drizzle'
import { type InferInsertModel } from 'drizzle-orm'

export async function getVendorModelListData() {
  return await db.query.vendorModelListData.findMany({})
}

export async function addVendorModelListData(
  data: InferInsertModel<typeof schema.vendorModelListData>[],
) {
  console.log('data/add models', data)
  await db.insert(schema.vendorModelListData).values(data)
}
