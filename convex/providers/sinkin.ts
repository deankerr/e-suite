import z from 'zod'

import { assert } from '../util'

import type { GenerationParameters } from '../schema'

const getSinkinApiKey = () => {
  const apiKey = process.env.SINKIN_API_KEY
  assert(apiKey, 'Sinkin API key not provided')
  return apiKey
}

export const createGenerationRequest = (
  parameters: GenerationParameters & { model: string; width: number; height: number },
) => {
  const paramsKey: Record<string, (value: any) => [string, string]> = {
    model: (value: string) => ['model_id', value],
    width: (value: number) => ['width', value.toString()],
    height: (value: number) => ['height', value.toString()],
    prompt: (value: string) => ['prompt', value],
    negativePrompt: (value: string) => ['negative_prompt', value],
    seed: (value: number) => ['seed', value.toString()],
    scheduler: (value: string) => ['scheduler', value],
    steps: (value: number) => ['steps', value.toString()],
    guidance: (value: string) => ['guidance', value],
    lcm: (value: boolean) => ['lcm', String(value)],
    n: (value: number) => ['num_images', String(value)],
  }

  const params = Object.entries(parameters).reduce(
    (acc, [key, value]) => {
      const res = paramsKey[key]
      if (res) return [...acc, res(value)]
      return acc
    },
    [['access_token', getSinkinApiKey()]],
  )
  const body = new URLSearchParams(params)

  return {
    url: 'https://sinkin.ai/m/inference',
    options: {
      method: 'POST',
      body,
    },
  }
}

export const parseApiInferenceResponse = (data: unknown) => {
  // check error code
  const { error_code } = z.object({ error_code: z.number() }).parse(data)

  if (error_code > 0) {
    // is error, get message
    const { message } = z.object({ message: z.string() }).parse(data)
    return { error: { error_code, message } }
  }

  const parsed = z
    .object({
      inf_id: z.string(),
      credit_cost: z.number(),
      images: z.array(z.string()),
    })
    .parse(data)

  return { result: parsed }
}

// export const registerAvailableModels = internalAction(async (ctx) => {
//   const apiModelData = await apiGetModels()
//   const modelDataList = [
//     ...apiModelData.models.map((model) => ({ ...model, type: 'checkpoint' as const })),
//     ...apiModelData.loras.map((lora) => ({
//       ...lora,
//       civitai_model_id: getIdFromUrl(lora.link) ?? undefined,
//       type: 'lora' as const,
//     })),
//   ]

//   //* query imageModelProviders for existing entries
//   const sinkinModelProviders = await ctx.runQuery(internal.imageModelProviders.listByProvider, {
//     key: 'sinkin',
//   })

//   for (const modelData of modelDataList) {
//     if (
//       sinkinModelProviders.find((p) => p.key === 'sinkin' && p.providerModelId === modelData.id)
//     ) {
//       console.log(`existing record for "${modelData.name}" (apiModelId: ${modelData.id})`)
//       continue
//     }

//     const modelProvider: WithoutSystemFields<ImageModelProvider> = {
//       key: 'sinkin',
//       providerModelId: modelData.id,
//       providerModelData: modelData,
//       imageModelId: null,
//       hidden: false,
//     }

//     //* create provider
//     const imageModelProviderId = await ctx.runMutation(internal.imageModelProviders.create, {
//       doc: modelProvider,
//     })

//     //* search for existing imageModel by civitaiId
//     const civitaiId = modelData.civitai_model_id?.toString() ?? null
//     const imageModel = civitaiId
//       ? await ctx.runQuery(internal.imageModels.getByCivitaiId, {
//           civitaiId,
//         })
//       : null

//     if (imageModel) {
//       console.log(
//         `linking imageModelProvider ${modelData.name} [${imageModelProviderId}] to imageModel ${imageModel.name} [${imageModel._id}]`,
//       )
//       if (imageModel.sinkinProviderId || imageModel.sinkinApiModelId) {
//         console.error(
//           `sinkin provider already added to imageModel ${imageModel.name} [${imageModel._id}]`,
//         )
//         continue
//       }
//       //* add provider to existing model
//       await ctx.runMutation(internal.imageModels.update, {
//         doc: {
//           ...imageModel,
//           sinkinProviderId: imageModelProviderId,
//           sinkinApiModelId: modelData.id,
//         },
//       })
//     } else if (civitaiId) {
//       //* create new imageModel from provider
//       const imageId = await ctx.runMutation(internal.files.images.fromUrl, {
//         sourceUrl: modelData.cover_img,
//         sourceInfo: 'provider:sinkin',
//       })
//       const newImageModel: WithoutSystemFields<ImageModel> = {
//         name: modelData.name,
//         description: '',
//         base: modelData.name.includes('XL') ? 'sdxl' : 'sd1.5',
//         type: modelData.type,
//         nsfw: 'unknown',
//         imageIds: [imageId],
//         tags: ['_new'],

//         civitaiId,
//         civitaiModelDataId: null,

//         sinkinProviderId: imageModelProviderId,
//         sinkinApiModelId: modelData.id,

//         hidden: false, //? start hidden
//       }

//       await ctx.runMutation(internal.imageModels.create, {
//         doc: newImageModel,
//       })

//       console.log('new imageModel:', newImageModel)
//     } else {
//       console.warn(
//         `imageModelProvider ${modelData.name} [${imageModelProviderId}] is not linked to any imageModel`,
//       )
//     }
//   }
// })

// export const getModelsApi = action(async (ctx) => await apiGetModels())

// const apiGetModels = async () => {
//   console.log(`[sinkin] /api/models`)
//   const body = new FormData()
//   body.set('access_token', process.env.SINKIN_API_KEY as string)

//   const response = await fetch('https://sinkin.ai/api/models', {
//     method: 'POST',
//     body,
//   })
//   if (!response.ok) throw new Error(`[sinkin] request failed: ${response.statusText}`)
//   //TODO handle error message response
//   const json = await response.json()
//   return apiGetModelsResponseSchema.parse(json)
// }

// const getIdFromUrl = (url: string) => {
//   const match = url.match(/\/(\d+)/)
//   const id = (match && match[1]) ?? null
//   return id
// }

// const apiGetModelsResponseSchema = z.object({
//   error_code: z.number(),
//   models: z
//     .object({
//       civitai_model_id: z
//         .number()
//         .transform((id) => String(id))
//         .optional(),
//       cover_img: z.string(),
//       id: z.string(),
//       link: z.string(),
//       name: z.string(),
//       tags: z.string().array().optional(),
//     })
//     .array(),
//   loras: z
//     .object({
//       cover_img: z.string(),
//       id: z.string(),
//       link: z.string(),
//       name: z.string(),
//     })
//     .array(),
//   message: z.string().optional(),
// })

// export const sinkinApiGetModelsResponseSchema = apiGetModelsResponseSchema

// export const sinkinImageProviderData = v.object({
//   civitai_model_id: v.optional(v.string()),
//   cover_img: v.string(),
//   id: v.string(),
//   link: v.string(),
//   name: v.string(),
//   type: v.union(v.literal('checkpoint'), v.literal('lora')),
//   tags: v.optional(v.array(v.string())),
// })
