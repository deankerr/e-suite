// @ts-nocheck
import { asyncMap } from 'convex-helpers'
import { makeFunctionReference } from 'convex/server'
import { v } from 'convex/values'

import { internalAction, internalMutation } from './functions'

import type { newMessageFields } from './schema'
import type { Infer } from 'convex/values'

export const autoRunMigrations = internalAction({
  args: {
    fn: v.string(),
    cursor: v.union(v.string(), v.null()),
    batchSize: v.number(),
  },
  handler: async (ctx, { fn, cursor, batchSize }) => {
    let isDone = false
    while (!isDone) {
      const args = { cursor, numItems: batchSize }
      ;({ isDone, cursor } = await ctx.runMutation(makeFunctionReference<'mutation'>(fn), args))
    }
  },
})

export const step1_migrateImageFilesBatch = internalMutation({
  args: {
    cursor: v.union(v.string(), v.null()),
    numItems: v.number(),
  },
  handler: async (ctx, args) => {
    // for each image, find the original image_file and add its storage id to fileId.
    // migrate sourceUrl/caption fields to new format
    // non files originals can be deleted
    // prod: images 3009, image_files 9,813
    // NOTE generation data should be added in another step in available

    const { cursor, numItems } = args

    const { page, isDone, continueCursor } = await ctx
      .table('images')
      .paginate({ cursor, numItems })

    await asyncMap(page, async (image) => {
      const imageFiles = await image.edgeX('files')
      const original = imageFiles.filter((f) => f.isOriginFile)[0]

      if (!original) throw new Error(`no original found for ${image._id}`)
      await image.patch({
        fileId: original.fileId,
        format: original.format,
        sourceUrl: image.originUrl,
        captionText: image.caption?.text,
        captionModelId: image.caption?.modelId,
        generationData: undefined,
      })

      for (const file of imageFiles) {
        if (!file.isOriginFile) {
          await ctx.storage.delete(file.fileId)
        }

        await ctx.skipRules.table('files').getX(file._id).delete()
      }
    })

    console.log(page.length)
    return { cursor: continueCursor, isDone }
  },
})

type ReferencesArray = Infer<(typeof newMessageFields)['references']>
type ContentType = Infer<(typeof newMessageFields)['contentType']>
export const step2_migrateMessageBatch = internalMutation(async (ctx, args) => {
  /*
    for each message:
      - iterate the files array if present
        - images: 
          - add message/thread/user ids to image ent
          ~ if generated, add generation data to image ent
          ~ otherwise add url to message references
        - sound_effects:
          - create new audio ent from sound_effect
          - delete sound_effect
        - image_urls: ignore
        record the contentType based on file found (should only be one)

      - migrate `content` to `text`
      - set contentType, hasImageReference
      - remove `files`, `content`

      prod: messages 42,264, others minimal
  */

  const { cursor, numItems } = args as { cursor: string; numItems: number }

  const result = await ctx.skipRules.table('messages').paginate({ cursor, numItems })
  const { page, isDone, continueCursor } = result

  for (const message of page) {
    let contentType: ContentType = 'text'
    const references: Required<ReferencesArray> = []
    let hasImageReference = false

    if (message.files) {
      for (const file of message.files) {
        if (file.type === 'image') {
          contentType = 'image'
          const image = await ctx.skipRules.table('images').getX(file.id)

          if (message.inference?.type === 'text-to-image') {
            // generated images
            await image.patch({
              messageId: message._id,
              threadId: message.threadId,
              userId: message.userId,
              generationData: {
                endpointId: message.inference.endpoint,
                modelId: message.inference.endpointModelId,
                modelName: message.inference.endpointModelId,
                prompt: message.inference.prompt,
              },
            })
          } else {
            // referenced image
            references.push({
              url: image.sourceUrl!, // NOTE will exist after step 1
              contentType: 'image',
              imageId: image._id,
            })
            hasImageReference = true

            await image.patch({
              messageId: message._id,
              threadId: message.threadId,
              userId: message.userId,
            })
          }
        }

        // sound effects
        if (file.type === 'sound_effect') {
          contentType = 'audio'
          const soundEffect = await ctx.table('sound_effect_files').getX(file.id)

          await ctx.table('audio').insert({
            fileId: soundEffect.fileId,
            generationData: {
              endpointId: 'elevenlabs',
              modelId: 'sound-generation',
              modelName: 'ElevenLabs Sound Generation',
              prompt: soundEffect.text,
            },
            messageId: message._id,
            threadId: message.threadId,
            userId: message.userId,
          })

          await soundEffect.delete()
        }
      }
    }

    await message.patch({
      text: message.content,
      content: undefined,
      references: references.length > 0 ? references : undefined,
      hasImageReference,
      contentType,
    })
  }

  console.log(page.length, continueCursor, isDone)
  return { cursor: continueCursor, isDone }
})

export const step3_deleteSpeechFiles = internalMutation(async (ctx) => {
  const sf = await ctx.table('speech_files')
  await asyncMap(sf, async (s) => await s.delete())
})

// ? may need
export const ensureImg = internalMutation(async (ctx) => {
  const images = await ctx.table('images').filter((q) => q.eq(q.field('threadId'), undefined))
  console.log(images.length)

  for (const image of images) {
    const message = await ctx.skipRules.table('messages').get(image.messageId)
    if (!message) {
      await image.delete()
      continue
    }

    await image.patch({
      threadId: message.threadId,
      userId: message.userId,
    })
  }
})

// TODO
export const delMsgVoiceovers = internalMutation({
  args: {
    cursor: v.union(v.string(), v.null()),
    numItems: v.number(),
  },
  handler: async (ctx, args) => {
    const { page, isDone, continueCursor } = await ctx.skipRules.table('messages').paginate(args)

    for (const message of page) {
      if (!message.voiceover) continue
      await message.patch({ voiceover: undefined })
    }

    return { cursor: continueCursor, isDone }
  },
})
