import { defineEnt } from 'convex-ents'
import { zid, zodToConvex, zodToConvexFields } from 'convex-helpers/server/zod'
import { ms } from 'itty-time'
import { z } from 'zod'

import {
  fileAttachmentRecordSchema,
  inferenceSchema,
  messageRolesEnum,
  metadataKVSchema,
} from './shared/structures'
import { zMessageName, zMessageTextContent, zThreadTitle } from './shared/utils'

const timeToDelete = ms('1 day')

export const messageFields = {
  role: messageRolesEnum,
  name: zMessageName.optional(),
  content: zMessageTextContent.optional(),

  inference: inferenceSchema.optional(),
  files: fileAttachmentRecordSchema.array().optional(),

  metadata: metadataKVSchema.array().optional(),
  voiceover: z
    .object({
      text: z.string().optional(),
      textHash: z.string(),
      resourceKey: z.string(),
      speechFileId: zid('speech_files').optional(),
    })
    .optional(),
}
const messages = defineEnt(zodToConvexFields(messageFields))
  .deletion('scheduled', { delayMs: timeToDelete })
  .field('series', zodToConvex(z.number()), { index: true })
  .edge('thread')
  .edge('user')
  .index('threadId_series', ['threadId', 'series'])
  .index('speechId', ['voiceover.speechFileId'])
  .index('threadId_role', ['threadId', 'role'])

export const threadFields = {
  title: zThreadTitle.optional(),
  instructions: zMessageTextContent.optional(),
  inference: inferenceSchema,
  slashCommands: z
    .object({
      id: z.string(),
      command: z.string(),
      commandType: z.enum(['startsWith', 'includesWord']),
      inference: inferenceSchema,
    })
    .array(),
  voiceovers: z
    .object({
      default: z.string(),
      names: z
        .object({
          name: z.string(),
          resourceKey: z.string(),
        })
        .array()
        .optional(),
    })
    .optional(),

  updatedAtTime: z.number(),
  metadata: metadataKVSchema.array().optional(),
}
const threads = defineEnt(zodToConvexFields(threadFields))
  .deletion('scheduled', { delayMs: timeToDelete })
  .field('slug', zodToConvex(z.string()), { unique: true })
  .edges('messages', { ref: true, deletion: 'soft' })
  .edge('user')
