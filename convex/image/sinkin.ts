import z from 'zod'
import { api, internal } from '../_generated/api'
import type { Id } from '../_generated/dataModel'
import { action, internalAction, internalMutation } from '../_generated/server'

//todo refactor
export const send = action(async (ctx, { id, prompt, negative_prompt, size, model }) => {
  try {
    const body = new URLSearchParams()
    body.set('access_token', process.env.SINKIN_API_KEY as string)
    body.set('prompt', prompt as string)
    body.set('negative_prompt', negative_prompt as string)
    body.set('model_id', model as string)

    const response = await fetch('https://sinkin.ai/m/inference', {
      method: 'POST',
      body,
    })
    const data = await response.json()

    const parsed = z
      .object({
        images: z.string().array(),
      })
      .parse(data)

    const imageIds: Id<'_storage'>[] = await Promise.all(
      parsed.images.map(async (url) => {
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`failed to download: ${response.statusText}`)
        }

        const buffer = await response.arrayBuffer()
        const blob = new Blob([buffer], { type: 'image/png' })
        return await ctx.storage.store(blob)
      }),
    )
    await ctx.runMutation(api.generations.update, {
      id: id as Id<'xgenerations'>,
      patch: { results: imageIds },
    })
  } catch (err) {
    console.error(err)
  }
})

//todo rm
export const getModels = action(async (ctx) => {
  const body = new FormData()
  body.set('access_token', process.env.SINKIN_API_KEY as string)

  const response = await fetch('https://sinkin.ai/api/models', {
    method: 'POST',
    body,
  })
  const data = await response.json()
})

//todo rm
export const updateModelsData = internalAction(async (ctx) => {
  console.log('fetching sinkin model data')
  const body = new FormData()
  body.set('access_token', process.env.SINKIN_API_KEY as string)

  const response = await fetch('https://sinkin.ai/api/models', {
    method: 'POST',
    body,
  })
  if (!response.ok) throw new Error(response.statusText)

  const data = await response.json()
  await ctx.runMutation(internal.providers.updateProviderModelsData, { name: 'sinkin', data })
  console.log('done')
})

export const fetchAvailableModels = internalAction(async (ctx) => {
  console.log(`[sinkin] fetchAvailableModels`)
  const data = await apiGetModels()
  await ctx.runMutation(internal.image.sinkin.createModelListCache, data)

  console.log('[sinkin] model list')
  for (const model of data.models) {
    console.log(`[sinkin] model: ${model.id} ${model.name} civit_id:${model.civitai_model_id}`)
    const result = await ctx.runAction(internal.image.civitai.fetchModelDataForId, {
      civit_id: model.civitai_model_id,
    })
    if (!result) console.error('[sinkin] failed to fetch civit data')
  }

  console.log(`[sinkin] lora list`)
  for (const lora of data.loras) {
    //! brittle
    const civit_id = lora.link.replace('https://civitai.com/models/', '').split('/')[0]
    console.log(`[sinkin] lora: ${lora.id} ${lora.name} civit_id:${civit_id}`)
    const result = await ctx.runAction(internal.image.civitai.fetchModelDataForId, { civit_id })
    if (!result) console.error('[sinkin] failed to fetch civit data')
  }

  console.log(`[sinkin] done`)
})

export const createModelListCache = internalMutation(async (ctx, data) => {
  return await ctx.db.insert('sinkin_model_list_cache', data)
})

const apiGetModels = async () => {
  console.log(`[sinkin] /api/models`)
  const body = new FormData()
  body.set('access_token', process.env.SINKIN_API_KEY as string)

  const response = await fetch('https://sinkin.ai/api/models', {
    method: 'POST',
    body,
  })
  if (!response.ok) throw new Error(`[sinkin] request failed: ${response.statusText}`)
  //TODO handle error message response
  const json = await response.json()
  return apiGetModelsResponseSchema.parse(json)
}

const apiGetModelsResponseSchema = z.object({
  error_code: z.number(),
  models: z
    .object({
      civitai_model_id: z.coerce.string(),
      cover_img: z.string(),
      id: z.string(),
      link: z.string(),
      name: z.string(),
      tags: z.string().array().optional(),
    })
    .array(),
  loras: z
    .object({
      cover_img: z.string(),
      id: z.string(),
      link: z.string(),
      name: z.string(),
    })
    .array(),
  message: z.string().optional(),
})
