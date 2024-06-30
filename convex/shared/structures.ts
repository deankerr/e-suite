import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

export const imageFileSchema = z.object({
  fileId: zid('_storage'),
  isOriginFile: z.boolean(),

  category: z.literal('image'),
  format: z.string(),

  width: z.number(),
  height: z.number(),

  imageId: zid('images'),
})

export const userSchema = z.object({
  _id: zid('users'),
  _creationTime: z.number(),
  deletionTime: z.undefined(),

  name: z.string(),
  imageUrl: z.string(),
  role: z.enum(['user', 'admin']),
})

export type EImage = z.infer<typeof imageSchema>
export const imageSchema = z.object({
  _id: zid('images'),
  _creationTime: z.number(),
  deletionTime: z.undefined(),

  width: z.number(),
  height: z.number(),
  blurDataUrl: z.string(),
  color: z.string(),
})

export const metadataKVSchema = z.object({ key: z.string(), value: z.string() })

export type EChatCompletionInference = z.infer<typeof chatCompletionInferenceSchema>
export const chatCompletionInferenceSchema = z.object({
  type: z.literal('chat-completion'),
  resourceKey: z.string(),
  endpoint: z.string(),
  endpointModelId: z.string(),
  stream: z.boolean().optional(),
  maxHistoryMessages: z.number().optional(),

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
  resourceKey: z.string(),
  endpoint: z.string(),
  endpointModelId: z.string(),

  prompt: z.string(),
  width: z.number(),
  height: z.number(),
  n: z.number(),
})

export type EInferenceConfig = z.infer<typeof inferenceSchema>
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
