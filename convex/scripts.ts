import { api, internal } from './_generated/api'
import { internalAction } from './_generated/server'
import { internalQuery } from './functions'

import type { Id } from './_generated/dataModel'
import type { ImageModel } from './generations/imageModels'

export const getUrlsForImageIds = internalQuery(
  async (ctx, { imageIds }: { imageIds: Id<'images'>[] }) => {
    return ctx
      .table('images')
      .getManyX(imageIds)
      .map(async (image) => image.sourceUrl)
  },
)

type ImageModelExport = ImageModel & { imageUrl?: string; imageSourceUrl?: string }
export const exportImageModelData = internalAction(async (ctx) => {
  const list: ImageModelExport[] = await ctx.runQuery(api.generations.imageModels.list)

  return list.map((model) => {
    const { image, ...rest } = model
    if (!image) throw new Error(`missing image for ${model.name}, ${model._id}`)
    return {
      ...rest,
      imageUrl: image?.url,
      imageSourceUrl: image?.sourceUrl,
    }
  })
})

type ImageModelImport = ImageModel & { imageUrl?: string; imageSourceUrl: string }
export const importImageModelDataImages = internalAction(
  async (ctx, { data }: { data: ImageModelImport[] }) => {
    await Promise.all(
      data.map(async (imageModel) => {
        await ctx.runMutation(internal.files.images.createFromSourceUrl, {
          sourceUrl: imageModel.imageSourceUrl,
        })
      }),
    )
  },
)

export const importImageModelData = internalAction(
  async (ctx, { data }: { data: ImageModelImport[] }) => {
    await Promise.all(
      data.map(async (imageModel) => {
        const imageId = await ctx.runQuery(internal.files.images.getIdBySourceUrl, {
          sourceUrl: imageModel.imageSourceUrl,
        })

        if (!imageId) throw new Error(`missing image for ${imageModel.name}, ${imageModel._id}`)

        await ctx.runMutation(api.generations.imageModels.create, {
          fields: {
            name: imageModel.name,
            description: imageModel.description,
            base: imageModel.base,
            type: imageModel.type,
            nsfw: imageModel.nsfw,
            imageId,
            tags: imageModel.tags.map((tag) => tag),

            civitaiId: imageModel.civitaiId,
            huggingFaceId: 'huggingFaceId' in imageModel ? imageModel.huggingFaceId : undefined,

            sinkin: imageModel.sinkin,
          },
        })
      }),
    )
  },
)
