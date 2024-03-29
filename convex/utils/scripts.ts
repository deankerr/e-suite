import { Infer } from 'convex/values'

import { api, internal } from '../_generated/api'
import { internalAction } from '../_generated/server'
import { internalMutation, internalQuery } from '../functions'
import { awsSpeechParametersFields, elevenlabsSpeechParametersFields } from '../schema'

import type { Id } from '../_generated/dataModel'
import type { ImageModel } from '../generations/imageModels'

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

export const convertVoiceoversToSpeech = internalMutation(async (ctx) => {
  const voiceovers = await ctx.table('voiceovers').take(1000)
  if (voiceovers.length === 0) return

  voiceovers.forEach(async (vo) => {
    const { provider, storageId, text, textSha256, messageId } = vo
    if (storageId) {
      const parameters = (
        'elevenlabs' in vo.parameters
          ? { ...vo.parameters.elevenlabs, provider: 'elevenlabs' as const }
          : { ...vo.parameters.aws, provider: 'aws' as const }
      ) as Infer<typeof elevenlabsSpeechParametersFields> | Infer<typeof awsSpeechParametersFields>
      const voiceId = parameters.provider === 'aws' ? parameters.VoiceId : parameters.voice_id
      const speechId = await ctx.table('speech').insert({
        text,
        textHash: textSha256,
        storageId,
        parameters,
        voiceRef: `${provider}/${voiceId}`,
      })
      const message = await ctx.skipRules.table('messages').get(messageId)
      if (message) await message.patch({ speechId })
    }
    await ctx.unsafeDb.delete(vo._id)
  })

  await ctx.scheduler.runAfter(2000, internal.utils.scripts.convertVoiceoversToSpeech, {})
})
