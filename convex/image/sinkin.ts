import z from 'zod'
import { api, internal } from '../_generated/api'
import type { Id } from '../_generated/dataModel'
import { action, internalAction, internalMutation, internalQuery } from '../_generated/server'
import type { ImageModelProvider } from '../schema'

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

export const listModelCacheLatest = internalQuery(async (ctx): Promise<SinkinModelListCache> => {
  return await ctx.db.query('sinkin_model_list_cache').order('desc').first()
})

export const listModelCacheAll = internalQuery(async (ctx) => {
  return await ctx.db.query('sinkin_model_list_cache').collect()
})

export const fetchAvailableModels = internalAction(async (ctx) => {
  console.log(`[sinkin] fetchAvailableModels`)
  const data = await apiGetModels()
  await ctx.runMutation(internal.image.sinkin.createModelListCache, data)

  console.log('[sinkin] model list')
  for (const model of data.models) {
    console.log(`[sinkin] model: ${model.id} ${model.name} civit_id:${model.civitai_model_id}`)
    try {
      await ctx.runAction(internal.image.civitai.fetchModelDataForId, {
        civit_id: model.civitai_model_id,
      })
    } catch (err) {
      console.error(err)
      console.log(model)
    }
  }

  console.log(`[sinkin] lora list`)
  for (const lora of data.loras) {
    const civit_id = getIdFromUrl(lora.link)
    console.log(`[sinkin] lora: ${lora.id} ${lora.name} civit_id:${civit_id}`)
    if (!civit_id) console.error('[sinkin] invalid civit_id')
    else {
      try {
        await ctx.runAction(internal.image.civitai.fetchModelDataForId, { civit_id })
      } catch (err) {
        console.error(err)
        console.log(lora)
      }
    }
  }

  console.log(`[sinkin] done`)
})

export const registerAvailableModels = internalAction(async (ctx) => {
  const apiModelData = await apiGetModels()

  //* query imageModelProviders for existing entries
  const sinkinModelProviders = await ctx.runQuery(internal.imageModelProviders.listByProvider, {
    key: 'sinkin',
  })

  //TODO loras
  for (const modelData of apiModelData.models) {
    if (
      sinkinModelProviders.find((p) => p.key === 'sinkin' && p.providerModelId === modelData.id)
    ) {
      console.log(`existing record for "${modelData.name}" (${modelData.id})`)
      continue
    }

    const modelProvider: ImageModelProvider = {
      key: 'sinkin',
      providerModelId: modelData.id,
      providerModelData: modelData,
      imageModelId: null,
      hidden: false,
    }

    //* create provider
    const imageModelProviderId = await ctx.runMutation(internal.imageModelProviders.create, {
      doc: modelProvider,
    })

    //* create or update imageModel
    //! some items without civitaiId will be duplicated
    const imageModel = await ctx.runQuery(api.imageModels.getByCivitaiId, {
      civitaiId: modelData.civitai_model_id,
    })
    if (imageModel) {
      const providers = { ...imageModel.providers, sinkin: imageModelProviderId }
      //* add provider to existing model
      await ctx.runMutation(internal.imageModels.updateProviders, {
        _id: imageModel._id,
        providers,
      })
    } else {
      //* create new imageModel from provider
      await ctx.runMutation(internal.imageModels.create, {
        doc: {
          name: modelData.name,
          description: '',
          base: 'unknown',
          type: 'checkpoint',
          nsfw: 'unclassified',
          images: [],
          tags: ['_new'],
          civitaiId: modelData.civitai_model_id,
          civitaiModelDataId: null,

          //TODO array
          providers: {
            openai: null,
            sinkin: imageModelProviderId,
          },

          hidden: false, //? start hidden
        },
      })

      //* schedule civitai lookup
      //TODO
    }
  }

  // //* normalize api model data
  // const modelDataList: ImageModelProvider[] = [
  //   ...apiModelData.models.map<ImageModelProvider>((data) => ({
  //     key: 'sinkin',
  //     providerModelId: data.id,
  //     providerModelData: data,
  //     imageModelId: null,
  //     hidden: false,
  //   })),

  //   ...apiModelData.loras.map<ImageModelProvider>((data) => ({
  //     key: 'sinkin',
  //     providerModelId: data.id,
  //     providerModelData: data,
  //     imageModelId: null,
  //     hidden: false,
  //   })),
  // ]

  //? query imageModels for existing entries
  // const imageModels = await ctx.runQuery(api.imageModels.list, {})
  //* filter out models other providers
  // const imageModelsSinkin = imageModels.filter((m) => m.providers.sinkin !== null)

  //* create imageModels for new items
  // for (const newModelData of )

  //* trigger civitai model data pulls
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

const getIdFromUrl = (url: string) => {
  const match = url.match(/\/(\d+)/)
  const id = (match && match[1]) ?? null
  return id
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
export type SinkinModelListCache = z.infer<typeof apiGetModelsResponseSchema>
