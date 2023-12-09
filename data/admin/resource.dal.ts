import 'server-only'
import * as schema from '@/drizzle/database.schema'
import { db } from '@/lib/drizzle'
import { VendorId } from '@/schema/vendor'
import { desc, eq, InferSelectModel, type InferInsertModel } from 'drizzle-orm'

export type InsertResource = InferInsertModel<typeof schema.resources>
export type SelectResource = InferSelectModel<typeof schema.resources>
export type InsertModel = InferInsertModel<typeof schema.models>
export type SelectModel = InferSelectModel<typeof schema.models>

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

export async function addResources(resources: InsertResource[]) {
  if (resources.length > 0)
    await db.insert(schema.resources).values(resources).onConflictDoNothing()
}

export async function getAllResources() {
  return await db.query.resources.findMany()
}

export async function getResourcesByVendorId(vendorId: VendorId) {
  return await db.query.resources.findMany({ where: eq(schema.resources.vendorId, vendorId) })
}

export async function getAllModels() {
  return await db.query.models.findMany()
}

export async function addModels(models: InsertModel[]) {
  const ids = await db
    .insert(schema.models)
    .values(models)
    .onConflictDoNothing()
    .returning({ id: schema.models.id })
  console.log('inserted %d models', ids.length)
}

export async function deleteAllResources() {
  // eslint-disable-next-line drizzle/enforce-delete-with-where
  await db.delete(schema.resources)
  console.log('deleted all resources')
}

export async function deleteAllModels() {
  // eslint-disable-next-line drizzle/enforce-delete-with-where
  await db.delete(schema.models)
  console.log('deleted all models')
}
