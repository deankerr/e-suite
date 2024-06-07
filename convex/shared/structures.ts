import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

import { imageSchema, jobSchema, threadSchema, userSchema } from './entities'

export const metadataKVSchema = z.object({ key: z.string(), value: z.string() })

export type EChatModel = z.infer<typeof chatModelSchema>
export const chatModelSchema = z.object({
  modelType: z.literal('chat'),
  endpoint: z.string(),
  endpointModelId: z.string(),
  resourceId: z.string(),

  name: z.string(),
  creatorName: z.string().optional(),
  description: z.string().optional(),
  coverImageUrl: z.string().optional(),

  contextLength: z.number(),
})

export type EImageModel = z.infer<typeof imageModelSchema>
export const imageModelSchema = z.object({
  modelType: z.literal('image'),
  endpoint: z.string(),
  endpointModelId: z.string(),
  resourceId: z.string(),

  name: z.string(),
  creatorName: z.string().optional(),
  description: z.string().optional(),
  coverImageUrl: z.string().optional(),
})

export type EChatCompletionInference = z.infer<typeof chatCompletionInferenceSchema>
export const chatCompletionInferenceSchema = z.object({
  type: z.literal('chat-completion'),
  endpoint: z.string(),
  model: z.string(),
  stream: z.boolean().optional(),

  max_tokens: z.number().optional(),
  stop: z.string().array().optional(),
  temperature: z.number().optional(),
  top_p: z.number().optional(),
  top_k: z.number().optional(),
  repetition_penalty: z.number().optional(),
})

export type ETextToImageInference = z.infer<typeof textToImageInferenceSchema>
export const textToImageInferenceSchema = z.object({
  type: z.literal('text-to-image'),
  endpoint: z.string(),
  model: z.string(),

  prompt: z.string(),
  width: z.number(),
  height: z.number(),
  n: z.number(),
})

export type EInference = z.infer<typeof inferenceSchema>
export const inferenceSchema = z.discriminatedUnion('type', [
  chatCompletionInferenceSchema,
  textToImageInferenceSchema,
])

export type EFileAttachmentRecord = z.infer<typeof fileAttachmentRecordSchema>
export const fileAttachmentRecordSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('image'), id: zid('images') }),
  z.object({ type: z.literal('image_url'), url: z.string() }),
])

export type EFileAttachmentRecordWithContent = z.infer<typeof fileAttachmentRecordWithContentSchema>
export const fileAttachmentRecordWithContentSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('image'), id: zid('images'), image: imageSchema }),
  z.object({ type: z.literal('image_url'), url: z.string() }),
])

export type EMessageRole = keyof typeof messageRole
export const messageRole = {
  system: 'system',
  assistant: 'assistant',
  user: 'user',
}
export const messageRolesEnum = z.enum(['system', 'assistant', 'user'])

export type EMessageWithContent = z.infer<typeof messageWithContentSchema>
export const messageWithContentSchema = z.object({
  _id: zid('messages'),
  _creationTime: z.number(),
  deletionTime: z.undefined(),
  threadId: zid('threads'),
  threadSlug: z.string(),
  series: z.number(),

  role: messageRolesEnum,
  name: z.string().optional(),
  content: z.string().optional(),

  inference: inferenceSchema.optional(),
  files: z.array(fileAttachmentRecordWithContentSchema).optional(),
  jobs: z.array(jobSchema),

  owner: userSchema,
})

export type EThreadWithContent = z.infer<typeof threadWithContentSchema>
export const threadWithContentSchema = threadSchema.merge(
  z.object({
    config: inferenceSchema,
    saved: inferenceSchema.array(),
    messages: z.array(messageWithContentSchema),
    owner: userSchema,
  }),
)
