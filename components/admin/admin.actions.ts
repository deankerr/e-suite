'use server'

import { addVendorModelListData } from '@/data/admin/vendor'
import * as schema from '@/drizzle/schema'
import { actionValidator } from '@/lib/action-validator'
import { db } from '@/lib/drizzle'
import { openrouterPlugin } from '@/plugins/openrouter.plugin'
import { togetheraiPlugin } from '@/plugins/togetherai.plugin'
import { VendorId } from '@/schema/vendor'
import { desc, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import z from 'zod'

const modelLists = {
  openrouter: openrouterPlugin.models.list,
  togetherai: togetheraiPlugin.models.list,
}
const oneDay = 86400000

export const fetchVendorModelLists = actionValidator(z.void(), async ({ user }) => {
  // TODO admin check
  console.log('👯‍♀️ Fetching vendor model lists')

  const getCurrentFor = async (vendorId: string) =>
    await db
      .select()
      .from(schema.vendorModelListData)
      .where(eq(schema.vendorModelListData.vendorId, vendorId))
      .orderBy(desc(schema.vendorModelListData.retrievedAt))
      .limit(1)

  const current = {
    openrouter: await getCurrentFor('openrouter'),
    togetherai: await getCurrentFor('togetherai'),
  }

  const fetchLists: Array<Promise<unknown>> = []

  if (Date.now() - (current.openrouter[0]?.retrievedAt.valueOf() ?? 0) > oneDay) {
    fetchLists.push(openrouterPlugin.models.list())
    console.log('Fetch openrouter')
  }
  if (Date.now() - (current.togetherai[0]?.retrievedAt.valueOf() ?? 0) > oneDay) {
    fetchLists.push(togetheraiPlugin.models.list())
    console.log('Fetch togetherai')
  }

  const data = await Promise.allSettled(fetchLists)

  const values: Array<{ vendorId: VendorId; data: unknown }> = []
  if (data[0]?.status === 'fulfilled') {
    values.push({ vendorId: 'openrouter', data: data[0].value })
  } else if (data[0]?.status === 'rejected') console.error('Failed to fetch openrouter')

  if (data[1]?.status === 'fulfilled') {
    values.push({ vendorId: 'togetherai', data: data[1].value })
  } else if (data[1]?.status === 'rejected') console.error('Failed to fetch togetherai')

  if (values.length > 0) {
    await addVendorModelListData(values)
    revalidatePath('/admin')
    console.log('done')
  } else {
    console.log('nothing to do')
  }
})
