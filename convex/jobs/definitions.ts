import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

import type { ZodTypeAny } from 'zod'

type JobDefinition = {
  handler: string
  required: ZodTypeAny
}

export type JobNames = keyof typeof jobDefinitions
export type JobDefinitions = typeof jobDefinitions

export const jobDefinitions = {
  'files/create-image-from-url': {
    handler: 'internal.files.createImageFromUrl.run',
    required: z.object({
      url: z.string(),
      messageId: zid('messages'),
    }),
  },

  'files/optimize-image-file': {
    handler: 'internal.files.optimizeImageFile.run',
    required: z.object({
      imageId: zid('images'),
    }),
  },

  'inference/chat-completion': {
    handler: 'internal.inference.chatCompletion.run',
    required: z.object({
      messageId: zid('messages'),
    }),
  },

  'inference/chat-completion-stream': {
    handler: 'internal.inference.chatCompletionStream.run',
    required: z.object({
      messageId: zid('messages'),
    }),
  },

  'inference/text-to-image': {
    handler: 'internal.inference.textToImage.run',
    required: z.object({
      messageId: zid('messages'),
    }),
  },

  'inference/thread-title-completion': {
    handler: 'internal.inference.threadTitleCompletion.run',
    required: z.object({
      threadId: zid('threads'),
    }),
  },
} satisfies Record<string, JobDefinition>
