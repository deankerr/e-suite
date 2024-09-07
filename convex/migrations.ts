import { makeMigration } from 'convex-helpers/server/migrations'
import { nanoid } from 'nanoid/non-secure'

import { internalMutation } from './_generated/server'
import { generateTimestampId } from './lib/utils'
import { imageModels } from './shared/imageModels'

import type { RunConfigTextToImageV2 } from './types'

const migration = makeMigration(internalMutation, {
  migrationTable: 'migrations',
})

export const myMigration = migration({
  table: 'images_v1',
  migrateOne: async (ctx, doc) => {
    const createdAt = doc.originalCreationTime ?? doc._creationTime
    const imageId = await ctx.db.insert('images_v2', {
      blurDataUrl: doc.blurDataUrl,
      createdAt,
      fileId: doc.fileId,
      format: doc.format,
      height: doc.height,
      width: doc.width,
      color: doc.color,
      id: generateTimestampId(createdAt),
      ownerId: doc.ownerId,
      sourceType: doc.sourceType === 'userMessageUrl' ? 'message-url' : 'generation',
      sourceUrl: doc.sourceUrl,
      runId: nanoid(),
    })

    const metadata = await ctx.db
      .query('images_metadata')
      .withIndex('imageId', (q) => q.eq('imageId', doc._id))
      .collect()

    for (const m of metadata) {
      if (m.data.type === 'captionOCR_V0') {
        await ctx.db.insert('images_metadata_v2', {
          imageId,
          data: {
            type: 'caption',
            modelId: m.data.captionModelId,
            title: m.data.captionTitle,
            description: m.data.captionDescription,
            ocr: [m.data.captionOCR],
            version: 1,
          },
        })
      } else if (m.data.type === 'captionOCR_V1') {
        await ctx.db.insert('images_metadata_v2', {
          imageId,
          data: {
            type: 'caption',
            modelId: m.data.modelId,
            title: m.data.title,
            description: m.data.description,
            ocr: m.data.ocr_texts,
            version: 2,
          },
        })
      } else if (m.data.type === 'generationData_V0') {
        await ctx.db.insert('images_metadata_v2', {
          imageId,
          data: {
            type: 'generation',
            modelId: m.data.modelId,
            prompt: m.data.prompt,
            modelName: m.data.modelName,
            provider: m.data.endpointId,
            version: 1,
          },
        })
      }
    }

    if (doc.generationId) {
      const generation = await ctx.db.get(doc.generationId)
      if (generation) {
        const input = generation.input as RunConfigTextToImageV2
        const model = imageModels.find((m) => m.modelId === input.modelId)

        await ctx.db.insert('images_metadata_v2', {
          imageId,
          data: {
            type: 'generation',
            modelId: input.modelId,
            prompt: input.prompt,
            provider: 'fal',
            modelName: model?.name ?? '',
            version: 1,
          },
        })
      }
    }
  },
})
