'use server'

import modelAliases from '@/config/model-aliases.json'
import { createAdminDao } from '@/data/admin'
import {
  addVendorModelListData,
  getLatestModelListDataForVendorId,
} from '@/data/admin/vendor-model-data'
import { InsertModels, InsertResources, SelectResources } from '@/data/types'
import * as schema from '@/drizzle/database.schema'
import { actionValidator } from '@/lib/action-validator'
import { db } from '@/lib/drizzle'
import { openaiPlugin } from '@/plugins/openai.plugin'
import { openrouterPlugin } from '@/plugins/openrouter.plugin'
import { togetheraiPlugin } from '@/plugins/togetherai.plugin'
import { VendorId } from '@/schema/vendor'
import { differenceInHours } from 'date-fns'
import { desc, eq } from 'drizzle-orm'
import { createInsertSchema } from 'drizzle-zod'
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
  const adminDao = await createAdminDao()
  console.log('💃 Building resource records')
  const builtResources: InsertResources[] = []

  //* process local lists
  const local = openaiPlugin.models.list()
  for (const model of local) {
    builtResources.push({
      ...model,
      isRestricted: getIsRestricted(model.id),
      isAvailable: true,
    })
  }

  //* process remote lists
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
  const currentResources = await adminDao.resources.getAll()
  const newResources: InsertResources[] = []

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
      //* add tweaks
      r.isRestricted = getIsRestricted(r.modelAliasId)

      const endpointModelId = r.endpointModelId.toLowerCase() as keyof typeof modelAliases
      if (endpointModelId in modelAliases) {
        r.modelAliasId = modelAliases[endpointModelId]
      }

      newResources.push(r)
    }
  }

  if (newResources.length) {
    console.log(
      'adding %d new resources %o',
      newResources.length,
      newResources.map((r) => r.modelAliasId),
    )

    await adminDao.resources.create(newResources)
    revalidatePath('/admin')
  } else {
    console.log('no new resources')
  }
})

export const buildModels = actionValidator(z.void(), async () => {
  const adminDao = await createAdminDao()
  console.log('💃 Building model records')

  const newModels: InsertModels[] = []
  const resources = await adminDao.resources.getAll()
  //* get unique model aliases
  const aliases = new Set(resources.map((r) => r.modelAliasId))

  for (const alias of aliases) {
    const openrouterResource = resources.find(
      (r) => r.modelAliasId === alias && r.vendorId === 'openrouter',
    )
    const togetheraiResource = resources.find(
      (r) => r.modelAliasId === alias && r.vendorId === 'togetherai',
    )

    //* prefer together's values if available, but openrouter's id
    const modelValues: Partial<InsertModels> = {
      ...(openrouterResource?.vendorModelData as object),
      ...(togetheraiResource?.vendorModelData as object),
    }
    if (openrouterResource) modelValues.id = openrouterResource.modelAliasId

    const model = createModel(modelValues)
    if (!model?.creatorName) console.log(model)
    if (model) newModels.push(model)
  }

  for (const m of newModels) {
    console.log('# new model:', m.id)
    console.log(m)
    console.log()
  }

  await adminDao.models.create(newModels)
  revalidatePath('/admin')
})

function createModel(model: Partial<InsertModels>): InsertModels | null {
  const validate = createInsertSchema(schema.models, {
    id: z.string().min(1),
    category: (schema) =>
      schema.category.refine((val) => {
        if (val === '') return 'unknown'
        return val
      }),
    name: z.string().min(1),
    creatorName: z
      .string()
      .nullish()
      .transform((val) => {
        if (!val || typeof val !== 'string') {
          //* hope that the first word is the creator
          const firstWord = model.name?.match(/^\w+[^\W]/)
          return firstWord ? firstWord[0] : 'unknown'
        }
        return val
      })
      .transform((val) => {
        if (val.startsWith('Nous')) return 'Nous Research'
        if (val === 'Yi') return '01.AI'
        return val
      }),
    url: z
      .string()
      .nullish()
      .transform((val) => (val === '' ? null : val)),
    license: (schema) => schema.license.transform((val) => (val === '' ? null : val)),
    stopTokens: z.string().array(),
    tags: z.string().array(),
  })

  const parse = validate.safeParse(model)
  if (!parse.success) {
    console.log('failed to parse model', model.id)
    console.log(parse.error.errors)
    return null
  }
  return parse.data
}

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

//* helpers
function isResourceEqual(r1: Partial<SelectResources>, r2: SelectResources) {
  if (
    r1.inputCost1KTokens !== r2.inputCost1KTokens ||
    r1.outputCost1KTokens !== r2.outputCost1KTokens ||
    r1.tokenOutputLimit !== r2.tokenOutputLimit
  ) {
    return false
  }
  return true
}

function getIsRestricted(id: string) {
  return (
    id.startsWith('openai/gpt-4') &&
    !['openai/gpt-4-1106-preview', 'openai/gpt-4-vision-preview'].includes(id)
  )
}
