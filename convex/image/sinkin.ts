import z from 'zod'
import { api, internal } from '../_generated/api'
import type { Id } from '../_generated/dataModel'
import { action, internalAction, internalMutation, internalQuery } from '../_generated/server'
import type { ImageModel, ImageModelProvider } from '../schema'

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

export const registerAvailableModels = internalAction(async (ctx) => {
  const apiModelData = await apiGetModels()
  const modelDataList = [
    ...apiModelData.models.map((model) => ({ ...model, type: 'checkpoint' as const })),
    ...apiModelData.loras.map((lora) => ({
      ...lora,
      civitai_model_id: getIdFromUrl(lora.link),
      type: 'lora' as const,
    })),
  ]

  //* query imageModelProviders for existing entries
  const sinkinModelProviders = await ctx.runQuery(internal.imageModelProviders.listByProvider, {
    key: 'sinkin',
  })

  for (const modelData of modelDataList) {
    if (
      sinkinModelProviders.find((p) => p.key === 'sinkin' && p.providerModelId === modelData.id)
    ) {
      console.log(`existing record for "${modelData.name}" (apiModelId: ${modelData.id})`)
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

    //* search for existing imageModel by civitaiId
    const civitaiId = modelData.civitai_model_id?.toString() ?? null
    const imageModel = civitaiId
      ? await ctx.runQuery(api.imageModels.getByCivitaiId, {
          civitaiId,
        })
      : null

    if (imageModel) {
      console.log(
        `linking imageModelProvider ${modelData.name} [${imageModelProviderId}] to imageModel ${imageModel.name} [${imageModel._id}]`,
      )
      if (imageModel.sinkinProviderId || imageModel.sinkinApiModelId) {
        console.error(
          `sinkin provider already added to imageModel ${imageModel.name} [${imageModel._id}]`,
        )
        continue
      }
      //* add provider to existing model
      await ctx.runMutation(internal.imageModels.update, {
        doc: {
          ...imageModel,
          sinkinProviderId: imageModelProviderId,
          sinkinApiModelId: modelData.id,
        },
      })
    } else if (civitaiId) {
      //* create new imageModel from provider
      const newImageModel: ImageModel = {
        name: modelData.name,
        description: '',
        base: modelData.name.includes('XL') ? 'sdxl' : 'sd1.5',
        type: modelData.type,
        nsfw: 'unclassified',
        images: [],
        tags: ['_new'],

        civitaiId,
        civitaiModelDataId: null,

        sinkinProviderId: imageModelProviderId,
        sinkinApiModelId: modelData.id,

        hidden: false, //? start hidden
      }

      await ctx.runMutation(internal.imageModels.create, {
        doc: newImageModel,
      })

      console.log('new imageModel:', newImageModel)
    } else {
      console.warn(
        `imageModelProvider ${modelData.name} [${imageModelProviderId}] is not linked to any imageModel`,
      )
    }
  }
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
      civitai_model_id: z.number().optional(),
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
