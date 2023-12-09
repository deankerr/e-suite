'use server'

import {
  addModels,
  addResources,
  addVendorModelListData,
  deleteAllModels as dalDeleteAllModels,
  deleteAllResources as dalDeleteAllResources,
  getAllModels,
  getAllResources,
  getLatestModelListDataForVendorId,
  getResourcesByVendorId,
  InsertModel,
  InsertResource,
  SelectModel,
  SelectResource,
} from '@/data/admin/resource.dal'
import * as schema from '@/drizzle/database.schema'
import { actionValidator } from '@/lib/action-validator'
import { db } from '@/lib/drizzle'
import { invariant } from '@/lib/utils'
import { openaiPlugin } from '@/plugins/openai.plugin'
import { openrouterPlugin } from '@/plugins/openrouter.plugin'
import { togetheraiPlugin } from '@/plugins/togetherai.plugin'
import { VendorId } from '@/schema/vendor'
import { differenceInHours } from 'date-fns'
import { desc, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import z from 'zod'

const refreshIntervalHours = 24

const remoteResources: { vendorId: VendorId; handler: () => Promise<any> }[] = [
  { vendorId: 'openrouter', handler: openrouterPlugin.models.list },
  { vendorId: 'togetherai', handler: togetheraiPlugin.models.list },
]

export const fetchVendorModelLists = actionValidator(z.void(), async ({ user }) => {
  // TODO admin check
  console.log('💃 Fetching vendor model lists')

  for (const remote of remoteResources) {
    const [item] = await db
      .select()
      .from(schema.vendorModelListData)
      .where(eq(schema.vendorModelListData.vendorId, remote.vendorId))
      .orderBy(desc(schema.vendorModelListData.retrievedAt))
      .limit(1)

    if (
      !item?.retrievedAt ||
      differenceInHours(new Date(), item.retrievedAt) > refreshIntervalHours
    ) {
      console.log('refresh', remote.vendorId, 'resources')
      const data = await remote.handler()
      await addVendorModelListData([{ vendorId: remote.vendorId, data }])
    }
  }

  revalidatePath('/admin')
  console.log('done')
})

export const buildResourceRecords = actionValidator(z.void(), async () => {
  console.log('💃 Building resource records')
  const builtResources: InsertResource[] = []

  for (const { vendorId } of remoteResources) {
    const modelListData = await getLatestModelListDataForVendorId(vendorId)

    if (!modelListData) {
      console.warn('no model availability data for', vendorId)
      continue
    }

    const processed =
      vendorId === 'openrouter'
        ? openrouterPlugin.models.processList(modelListData.data)
        : vendorId === 'togetherai'
        ? togetheraiPlugin.models.processList(modelListData.data)
        : null

    if (processed) builtResources.push(...processed)
  }

  //* check for changes
  const currentResources = await getAllResources()
  const newResources: InsertResource[] = []

  for (const r of builtResources) {
    const existing = currentResources.find((c) => c.id === r.id)
    if (existing) {
      //* compare
      if (!isResourceEqual(r, existing)) {
        console.log('### update:', r.id)
        console.log('existing %o', existing)
        console.log('new %o', r)
        //TODO handle
      }
    } else {
      //* is new
      newResources.push(r)
    }
  }

  if (newResources.length) {
    console.log(
      'adding %d new resources %o',
      newResources.length,
      newResources.map((r) => r.modelAliasId),
    )
    await addResources(newResources)
    revalidatePath('/admin')
  } else {
    console.log('no new resources')
  }
})

export const buildModels = actionValidator(z.void(), async () => {
  console.log('💃 Building model records')

  const newModels: InsertModel[] = []
  const resources = await getAllResources()
  //* get unique model aliases
  const aliases = new Set(resources.map((r) => r.modelAliasId))

  for (const alias of aliases) {
    const openrouterResource = resources.find(
      (r) => r.modelAliasId === alias && r.vendorId === 'openrouter',
    )
    const togetheraiResource = resources.find(
      (r) => r.modelAliasId === alias && r.vendorId === 'togetherai',
    )

    const model: Partial<InsertModel> = {
      ...(openrouterResource?.vendorModelData as object),
      ...(togetheraiResource?.vendorModelData as object),
    }

    if (openrouterResource) model.id = openrouterResource.modelAliasId

    newModels.push(createModelRecord(model))
  }

  for (const m of newModels) {
    console.log('# new model:', m.id)
    console.log(m)
    console.log()
  }

  await addModels(newModels)
  revalidatePath('/admin')
})

export const deleteAllResources = actionValidator(z.void(), async () => {
  await dalDeleteAllResources()
  revalidatePath('/admin')
})

export const deleteAllModels = actionValidator(z.void(), async () => {
  await dalDeleteAllModels()
  revalidatePath('/admin')
})

export const getHfDatasheet = actionValidator(z.string(), async ({ data }) => {
  console.log('fetch', data)
  const response = await fetch(data)
  const text = await response.text()
  if (text) {
    console.log('success')
  } else {
    console.log('failure?')
  }
})

function isResourceEqual(r1: Partial<SelectResource>, r2: SelectResource) {
  if (
    r1.inputCost1KTokens !== r2.inputCost1KTokens ||
    r1.outputCost1KTokens !== r2.outputCost1KTokens ||
    r1.tokenOutputLimit !== r2.tokenOutputLimit
  ) {
    return false
  }
  return true
}

function createModelRecord(modelData: Partial<InsertModel>): InsertModel {
  const m = {
    ...modelData,
  }

  if (!m.id) m.id = 'unknown'
  if (!m.category) m.category = 'unknown'
  if (!m.name) m.name = 'unknown'
  if (!m.creatorName) m.creatorName = 'unknown'
  if (!m.isRestricted) m.isRestricted = false

  return m as InsertModel
}
