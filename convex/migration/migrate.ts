import { asyncMap } from 'convex-helpers'
import { z } from 'zod'

import { internalMutation } from '../functions'
import { generateRid } from '../utils'

import type { Id } from '../_generated/dataModel'
import type { ProdImage, ProdMessage } from './prodschema'

/*
  restore:
  - unique rids
*/

export const migrateMessages = internalMutation({
  args: {
    limit: z.number(),
  },
  handler: async (ctx, { limit }) => {
    const messages = await ctx
      .table('messages')
      .order('desc')
      .filter((q) => q.eq(q.field('rid'), undefined))
      .take(limit)

    await asyncMap(messages, async (message) => {
      const messageId = message._id as Id<'messages'>
      const prodMsg = message as unknown as ProdMessage

      // just delete errored and continue
      if (prodMsg.error) {
        await ctx.unsafeDb.delete(messageId)
        return
      }

      const rid = await generateRid(ctx, 'messages')
      const patches = {
        rid,
        private: false,
        permissions: undefined,
        slug: undefined,
      }

      // is text message, patch and continue
      if (typeof prodMsg.content === 'string') {
        await ctx.unsafeDb.patch(messageId, {
          ...patches,
          text: prodMsg.content,
        })
        return
      }

      if (prodMsg.inference && Array.isArray(prodMsg.content)) {
        const inf = prodMsg.inference
        const imageIds = prodMsg.content.map(({ imageId }) => imageId)
        if (imageIds.length === 0) {
          // ?
          console.log(messageId)
          return
        }

        const images = await ctx.table('images').getManyX(imageIds)

        await asyncMap(images, async (image) => {
          const prodImg = image as unknown as ProdImage

          const generationId = await ctx.table('generations').insert({
            result: { type: 'url', message: prodImg.sourceUrl ?? '(missing)' },
            provider: 'sinkin',
            metadata: [['byline', prodMsg.inference?.byline ?? '']],
            model_id: inf.parameters.model,
            width: prodImg.width,
            height: prodImg.height,
            prompt: inf.parameters.prompt,
            seed: 0,
            negative_prompt: inf.parameters.negativePrompt,

            rid: await generateRid(ctx, 'generations'),
            private: false,
            messageId,
          })

          await ctx.table('generated_images').insert({
            width: prodImg.width,
            height: prodImg.height,
            sourceUrl: prodImg.sourceUrl ?? '(missing)',
            sourceFileId: prodImg.sourceStorageId ?? prodImg.storageId!,

            fileId: prodImg.optimizedStorageId ?? prodImg.storageId!,
            blurDataUrl: prodImg.blurDataURL ?? '',
            color: prodImg.color ?? '#000000',

            rid: await generateRid(ctx, 'generated_images'),
            private: false,
            generationId,
          })

          await ctx.table('images').getX(image._id).delete()
        })

        await ctx
          .table('messages')
          .getX(messageId)
          .patch({
            ...patches,

            inference: {
              generation: {
                parameters: {
                  provider: 'sinkin',
                  model_id: prodMsg.inference.parameters.model,
                  prompt: prodMsg.inference.parameters.prompt,
                  negative_prompt: prodMsg.inference.parameters.negativePrompt,
                  seed: 0,
                },
                dimensions: [{ width: 999, height: 999, n: 1 }],
              },
            },
          })
      }
    })
  },
})
