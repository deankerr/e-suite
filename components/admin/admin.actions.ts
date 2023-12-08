'use server'

import { addResources, addVendorModelListData, InsertResource } from '@/data/admin/resource.dal'
import * as schema from '@/drizzle/database.schema'
import { actionValidator } from '@/lib/action-validator'
import { db } from '@/lib/drizzle'
import { openaiPlugin } from '@/plugins/openai.plugin'
import { openrouterPlugin } from '@/plugins/openrouter.plugin'
import { togetheraiPlugin } from '@/plugins/togetherai.plugin'
import { VendorId } from '@/schema/vendor'
import { differenceInHours } from 'date-fns'
import { desc, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import z from 'zod'

const modelLists = {
  openrouter: openrouterPlugin.models.list,
  togetherai: togetheraiPlugin.models.list,
  openai: openaiPlugin.models.list,
}
const oneDay = 86400000

const refreshIntervalHours = 24

const remoteResources: { vendorId: VendorId; handler: () => Promise<any> }[] = [
  { vendorId: 'openrouter', handler: openrouterPlugin.models.list },
  { vendorId: 'togetherai', handler: togetheraiPlugin.models.list },
  { vendorId: 'openai', handler: openaiPlugin.models.list },
]

export const fetchVendorModelLists = actionValidator(z.void(), async ({ user }) => {
  // TODO admin check
  console.log('👯‍♀️ Fetching vendor model lists')

  const handler: Promise<any>[] = []

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
      handler.push(
        remote
          .handler()
          .then(
            async (value) =>
              await addVendorModelListData([{ vendorId: remote.vendorId, data: value }]),
          ),
      )
    }
  }

  if (handler.length === 0) {
    console.log('nothing to do')
    return
  }

  await Promise.allSettled(handler)
  revalidatePath('/admin')
  console.log('done')
})

export const buildResourceRecords = actionValidator(z.void(), async () => {
  console.log('👯‍♀️ Building resource records')
  for (const { vendorId } of remoteResources) {
    if (vendorId === 'openai') continue

    const modelListData = await db.query.vendorModelListData.findFirst({
      where: eq(schema.vendorModelListData.vendorId, vendorId),
      orderBy: [desc(schema.vendorModelListData.retrievedAt)],
    })

    if (!modelListData) {
      console.warn('no model availability data for', vendorId)
      continue
    }

    console.log('build', vendorId, modelListData.id)
    const processed =
      vendorId === 'openrouter'
        ? openrouterPlugin.models.processList(modelListData.data)
        : vendorId === 'togetherai'
        ? togetheraiPlugin.models.processList(modelListData.data)
        : null

    if (processed) await addResources(processed)
  }
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
