import { ConvexError, v } from 'convex/values'
import * as vb from 'valibot'

import { internal } from '../../_generated/api'
import { internalMutation } from '../../functions'
import { evaluateNsfwProbability } from '../actions/evaluateNsfwProbability'
import { generateImageCaption } from '../actions/generateImageCaption'

import type { Id } from '../../_generated/dataModel'
import type { Pipeline } from '../types'

export type IngestImageUrlPipelineInput = vb.InferOutput<typeof InitialInput>

const InitialInput = vb.object({
  url: vb.string(),
  messageId: vb.pipe(
    vb.string(),
    vb.transform((input) => input as Id<'messages'>),
  ),
})

const CreateImageResult = vb.object({
  createImage: vb.object({
    imageId: vb.pipe(
      vb.string(),
      vb.transform((input) => input as Id<'images'>),
    ),
    fileId: vb.pipe(
      vb.string(),
      vb.transform((input) => input as Id<'_storage'>),
    ),
  }),
})

export const ingestImageUrlPipeline: Pipeline = {
  name: 'ingestImageUrl',
  schema: InitialInput,
  steps: [
    {
      name: 'createImage',
      retryLimit: 3,
      action: async (ctx, input) => {
        const {
          initial: { url, messageId },
        } = vb.parse(vb.object({ initial: InitialInput }), input)

        const { fileId, metadata } = await ctx.runAction(internal.lib.sharp.storeImageFromUrl, {
          url,
        })

        const imageId = await ctx.runMutation(internal.db.images.createImageWf, {
          fileId,
          ...metadata,
          sourceUrl: url,
          messageId,
        })

        return { imageId, fileId }
      },
    },
    {
      name: 'nsfwProbability',
      retryLimit: 3,
      action: async (ctx, input) => {
        const { createImage } = vb.parse(CreateImageResult, input)

        const url = await ctx.storage.getUrl(createImage.fileId)
        if (!url) throw new ConvexError('unable to get file url')

        const { nsfwProbability } = await evaluateNsfwProbability(ctx, { url })

        await ctx.runMutation(internal.workflows.pipelines.ingestImageUrl.addImageDetails, {
          imageId: createImage.imageId,
          nsfwProbability,
        })

        return { nsfwProbability }
      },
    },
    {
      name: 'caption',
      retryLimit: 3,
      action: async (ctx, input) => {
        const { createImage } = vb.parse(CreateImageResult, input)

        const url = await ctx.storage.getUrl(createImage.fileId)
        if (!url) throw new ConvexError('unable to get file url')

        const { caption, modelId } = await generateImageCaption(ctx, { url })

        await ctx.runMutation(internal.workflows.pipelines.ingestImageUrl.addImageDetails, {
          imageId: createImage.imageId,
          captionText: caption,
          captionModelId: modelId,
        })

        return { caption, modelId }
      },
    },
  ],
}

export const addImageDetails = internalMutation({
  args: {
    imageId: v.id('images'),
    nsfwProbability: v.optional(v.number()),
    captionText: v.optional(v.string()),
    captionModelId: v.optional(v.string()),
  },
  handler: async (ctx, { imageId, ...args }) => {
    const image = await ctx.skipRules.table('images').getX(imageId)
    return await image.patch(args)
  },
})
