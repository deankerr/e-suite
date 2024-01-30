import 'server-only'
import * as schema from '@/drizzle/database.schema'
import { db } from '@/lib/drizzle'
import { desc, eq, type InferInsertModel } from 'drizzle-orm'
import { VendorId } from '../schemas'

export async function getVendorModelListData() {
  return await db.query.vendorModelListData.findMany({
    orderBy: desc(schema.vendorModelListData.retrievedAt),
  })
}

export async function getLatestModelListDataForVendorId(vendorId: VendorId) {
  return await db.query.vendorModelListData.findFirst({
    where: eq(schema.vendorModelListData.vendorId, vendorId),
    orderBy: desc(schema.vendorModelListData.retrievedAt),
  })
}

export async function addVendorModelListData(
  data: InferInsertModel<typeof schema.vendorModelListData>[],
) {
  await db.insert(schema.vendorModelListData).values(data)
}
