// import { api, internal } from './_generated/api'
// import { Doc, Id } from './_generated/dataModel'
// import { internalAction, internalMutation, query } from './_generated/server'

// type ImageModel = Omit<Doc<'image_models'>, '_id' | '_creationTime'>

// export const list = query(async (ctx) => await ctx.db.query('image_models').collect())

// export const listWithCacheData = query(async (ctx) => {
//   const modelList = await list(ctx, {})
//   const sinkin = await ctx.db.query('sinkin_model_list_cache').order("desc").first()

// })

// export const create = internalMutation(async (ctx, model: ImageModel) => {
//   return await ctx.db.insert('image_models', model)
// })

// export const update = internalMutation(
//   async (ctx, { id, data }: { id: Id<'image_models'>; data: Partial<ImageModel> }) => {
//     await ctx.db.patch(id, data)
//   },
// )

// export const buildImageModelList = internalAction(async (ctx) => {
//   const imageModels = await ctx.runQuery(api.image_models.list)
//   const sinkinCache = await ctx.runQuery(internal.image.sinkin.listModelCacheLatest)

//   for (const sinkinModel of sinkinCache.models) {
//     if (imageModels.find((m) => m.sinkin_id === sinkinModel.id)) continue

//     const model: ImageModel = {
//       name: sinkinModel.name,
//       description: '',
//       base: sinkinModel.name.includes('XL') ? 'sdxl' : 'sd-1.5',
//       type: 'checkpoint',
//       nsfw: 'high',
//       tags: ['_new'],
//       civit_id: sinkinModel.civitai_model_id,
//       sinkin_id: sinkinModel.id,
//       images: [],
//       hidden: false,
//     }

//     await ctx.runMutation(internal.image_models.create, model)
//     console.log(`[image_models] create ${model.type} "${model.name}"`)
//   }

//   for (const sinkinLora of sinkinCache.loras) {
//     if (imageModels.find((m) => m.sinkin_id === sinkinLora.id)) continue

//     const model: ImageModel = {
//       name: sinkinLora.name,
//       description: `${sinkinLora.name} / ${sinkinLora.link}`,
//       base: sinkinLora.name.includes('XL') ? 'sdxl' : 'sd-1.5',
//       type: 'lora',
//       nsfw: 'high',
//       tags: ['_new'],
//       civit_id: getIdFromUrl(sinkinLora.link),
//       sinkin_id: sinkinLora.id,
//       images: [],
//       hidden: false,
//     }

//     await ctx.runMutation(internal.image_models.create, model)
//     console.log(`[image_models] create ${model.type} "${model.name}"`)
//   }
// })

// const getIdFromUrl = (url: string) => {
//   const match = url.match(/\/(\d+)/)
//   const id = (match && match[1]) ?? null
//   return id
// }

// /*

// const images = parsed.modelVersions
//         .map((mv) =>
//           mv.images.map((img) => ({
//             model_version_name: mv.name,
//             type: img.type,
//             nsfw: img.nsfw,
//             url: img.url,
//             width: img.width,
//             height: img.height,
//             hash: img.hash,
//             file_id: null,
//           })),
//         )
//         .flat()
// */
