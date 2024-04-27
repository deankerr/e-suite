import { v } from 'convex/values'

import type { Infer } from 'convex/values'

// delete
// const clerkWebhookEvents = {
//   body: v.string(),
//   id: v.string(),
//   type: v.string(),
// }

// delete
// const imageModels = {
//   base: v.string(),
//   civitaiId: v.string(),
//   description: v.string(),
//   huggingFaceId: v.optional(v.string()),
//   imageId: v.id('images'),
//   name: v.string(),
//   nsfw: v.string(),
//   order: v.float64(),
//   sinkin: v.object({ refId: v.string() }),
//   tags: v.array(v.string()),
//   type: v.string(),
// }

const images = {
  blurDataURL: v.optional(v.string()),
  color: v.optional(v.string()),
  height: v.float64(),
  jobId: v.optional(v.id('_scheduled_functions')),
  metadata: v.optional(v.any()),
  nsfw: v.optional(v.string()),
  optimizedStorageId: v.optional(v.id('_storage')),
  optimizedUrl: v.optional(v.string()),
  parameters: v.optional(
    v.object({
      imageModelId: v.id('imageModels'),
      negativePrompt: v.string(),
      prompt: v.string(),
    }),
  ),
  permissions: v.optional(v.object({ private: v.boolean() })),
  sourceStorageId: v.optional(v.id('_storage')),
  sourceStorageUrl: v.optional(v.string()),
  sourceUrl: v.optional(v.string()),
  storageId: v.optional(v.id('_storage')),
  storageUrl: v.optional(v.string()),
  width: v.float64(),
}
const pimage = v.object(images)
export type ProdImage = Infer<typeof pimage>
// delete
// const imgp_test = {
//   ag: v.object({
//     browser: v.object({
//       major: v.string(),
//       name: v.string(),
//       version: v.string(),
//     }),
//     cpu: v.object({
//       architecture: v.optional(v.string()),
//     }),
//     device: v.object({
//       model: v.optional(v.string()),
//       type: v.optional(v.string()),
//       vendor: v.optional(v.string()),
//     }),
//     engine: v.object({
//       name: v.string(),
//       version: v.string(),
//     }),
//     isBot: v.boolean(),
//     os: v.object({
//       name: v.string(),
//       version: v.string(),
//     }),
//     ua: v.string(),
//   }),
//   geo: v.object({
//     city: v.optional(v.string()),
//     country: v.string(),
//     latitude: v.string(),
//     longitude: v.string(),
//     region: v.string(),
//   }),
//   height: v.float64(),
//   hl: v.array(v.array(v.string())),
//   imgP: v.string(),
//   ip: v.string(),
//   width: v.float64(),
// }

const messages = {
  content: v.optional(
    v.union(
      v.string(),
      v.array(
        v.object({
          imageId: v.id('images'),
          type: v.string(),
        }),
      ),
    ),
  ),
  deletionTime: v.optional(v.float64()),
  error: v.optional(v.object({ message: v.string() })),
  inference: v.optional(
    v.object({
      byline: v.string(),
      dimensions: v.array(
        v.object({
          height: v.float64(),
          n: v.float64(),
          width: v.float64(),
        }),
      ),
      jobId: v.array(v.id('_scheduled_functions')),
      parameters: v.object({
        model: v.string(),
        negativePrompt: v.optional(v.string()),
        prompt: v.string(),
      }),
      provider: v.string(),
      title: v.string(),
      type: v.string(),
    }),
  ),
  inferenceParameters: v.optional(
    v.object({
      max_tokens: v.float64(),
      model: v.string(),
      repetition_penalty: v.float64(),
      temperature: v.float64(),
      top_k: v.float64(),
      top_p: v.float64(),
    }),
  ),
  name: v.optional(v.string()),
  permissions: v.optional(v.object({ public: v.boolean() })),
  role: v.string(),
  slug: v.optional(v.string()),
  speechId: v.optional(v.id('speech')),
  threadId: v.id('threads'),
}
const pmessage = v.object(messages)
export type ProdMessage = Infer<typeof pmessage>

// skip
// const speech = {
//   jobId: v.optional(v.id('_scheduled_functions')),
//   parameters: v.object({
//     Engine: v.optional(v.string()),
//     VoiceId: v.optional(v.string()),
//     model_id: v.optional(v.string()),
//     provider: v.string(),
//     voice_id: v.optional(v.string()),
//     voice_settings: v.optional(
//       v.object({
//         similarity_boost: v.float64(),
//         stability: v.float64(),
//       }),
//     ),
//   }),
//   storageId: v.id('_storage'),
//   text: v.string(),
//   textHash: v.string(),
//   voiceRef: v.string(),
// }

// patch
const threads = v.object({
  parameters: v.optional(
    v.object({
      max_tokens: v.float64(),
      model: v.string(),
      repetition_penalty: v.float64(),
      temperature: v.float64(),
      top_k: v.float64(),
      top_p: v.float64(),
    }),
  ),
  permissions: v.object({ public: v.boolean() }),
  prompt: v.optional(v.string()),
  roles: v.optional(
    v.object({
      assistant: v.object({ voice: v.string() }),
      system: v.object({ voice: v.string() }),
      tool: v.optional(v.object({ voice: v.string() })),
      user: v.object({ voice: v.string() }),
    }),
  ),
  slug: v.string(),
  title: v.string(),
  userId: v.id('users'),
})

export type ProdThreads = Infer<typeof threads>
// mig
// const users = {
//   imageUrl: v.string(),
//   name: v.string(),
//   role: v.string(),
//   tokenIdentifier: v.string(),
// }

// ok
// const users_api_keys = {
//   secret: v.string(),
//   userId: v.id('users'),
//   valid: v.boolean(),
// }
