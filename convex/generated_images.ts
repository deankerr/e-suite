import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

import { internal } from './_generated/api'
import { internalMutation, internalQuery, mutation } from './functions'
import { generatedImageFields, ridField, srcsetField } from './schema'
import { generateRid, runWithRetries } from './utils'

// *** public queries ***
export const getHttp = internalQuery({
  args: {
    rid: ridField,
  },
  handler: async (ctx, { rid }) => {
    const generated_image = await ctx
      .table('generated_images', 'rid', (q) => q.eq('rid', rid))
      .unique()
    if (!generated_image || generated_image.deletionTime) return null

    return generated_image
  },
})
// *** end public queries ***

export const create = internalMutation({
  args: {
    ...generatedImageFields,
    generationJobId: zid('generation_jobs'),
  },
  handler: async (ctx, { generationJobId, ...fields }) => {
    const job = await ctx.table('generation_jobs').getX(generationJobId)

    const rid = await generateRid(ctx, 'generated_images')
    const generatedImageId = await ctx.table('generated_images').insert({
      ...fields,
      messageId: job.messageId,
      parameters: job.parameters,
      rid,
      private: false, // TODO
    })

    await runWithRetries(ctx, internal.lib.sharp.generatedImageSrcset, {
      fileId: fields.fileId,
      generatedImageId,
    })
  },
})

export const remove = mutation({
  args: {
    generatedImageId: zid('generated_images'),
  },
  handler: async (ctx, { generatedImageId }) => {
    await ctx.table('generated_images').getX(generatedImageId).delete()
  },
})

export const updateSrcset = internalMutation({
  args: {
    generatedImageId: zid('generated_images'),
    srcset: srcsetField,
  },
  handler: async (ctx, { generatedImageId, srcset }) => {
    return await ctx.table('generated_images').getX(generatedImageId).patch({ srcset })
  },
})

export const checkSrcset = internalMutation({
  args: {
    generatedImageId: z.string(),
  },
  handler: async (ctx, { generatedImageId }) => {
    const id = ctx.unsafeDb.normalizeId('generated_images', generatedImageId)
    if (!id) return

    const image = await ctx.table('generated_images').getX(id)
    if (!image.srcset) {
      await runWithRetries(ctx, internal.lib.sharp.generatedImageSrcset, {
        fileId: image.fileId,
        generatedImageId: image._id,
      })
      console.log('checkSrcset:', image._id)
    }
  },
})
