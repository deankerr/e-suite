import { zid } from 'convex-helpers/server/zod'
import z from 'zod'

import { jobStatusEnum, jobTypesEnum } from '../jobs/schema'
import { filesListSchema, inferenceSchema, messageRolesEnum } from '../threads/schema'

export type EImage = z.infer<typeof zClient.image>
export type EMessage = z.infer<typeof zClient.message>
export type EThread = z.infer<typeof zClient.thread>
export type EUser = z.infer<typeof zClient.user>
export type ESelf = z.infer<typeof zClient.self>

export type EMessageContent = z.infer<typeof zClient.messageContent>
export type EThreadWithMessages = z.infer<typeof zClient.threadWithMessages>

export const imageFile = z.object({
  fileId: zid('_storage'),
  isOriginFile: z.boolean(),

  category: z.literal('image'),
  format: z.string(),

  width: z.number(),
  height: z.number(),

  imageId: zid('images'),
})

const image = z.object({
  _id: zid('images'),
  _creationTime: z.number(),
  deletionTime: z.undefined(),

  width: z.number(),
  height: z.number(),
  blurDataUrl: z.string(),
  color: z.string(),
})

const job = z
  .object({
    deletionTime: z.undefined(),

    type: jobTypesEnum,
    status: jobStatusEnum,

    metrics: z
      .object({
        startTime: z.number().optional(),
        endTime: z.number().optional(),
      })
      .optional(),
  })
  .transform(({ type, status, metrics }) => {
    const start = metrics?.startTime
    const end = metrics?.endTime
    const time = start && end ? end - start : 0
    return {
      type,
      status,
      time,
    }
  })

const model = z.object({
  model_id: z.string(),
  name: z.string(),
  endpoint: z.string(),
  type: z.string(),
})

const message = z.object({
  _id: zid('messages'),
  _creationTime: z.number(),
  deletionTime: z.undefined(),

  role: messageRolesEnum,
  name: z.string().optional(),
  content: z.string().optional(),

  inference: inferenceSchema.optional(),
  files: filesListSchema.optional(),

  series: z.number(),
})

const thread = z.object({
  _id: zid('threads'),
  _creationTime: z.number(),
  deletionTime: z.undefined(),

  title: z.string().optional(),

  slug: z.string(),
})

const user = z.object({
  _id: zid('users'),
  _creationTime: z.number(),
  deletionTime: z.undefined(),

  name: z.string(),
  imageUrl: z.string(),
  role: z.enum(['user', 'admin']),
})

const self = user.merge(z.object({ apiKey: z.string().optional() }))

//* composed
const messageContent = message.merge(
  z.object({
    images: image.array(),
    jobs: job.array(),
  }),
)

const threadWithMessages = thread.merge(z.object({ messages: messageContent.array() }))

export const zClient = {
  image,
  job,
  model,
  message,
  thread,
  user,
  self,
  messageContent,
  threadWithMessages,
}

// export const voiceoverValidator = z.object({
//   text: zMessageTextContent,
//   provider: z.enum(textToSpeechProviders),
//   parameters: z.union([
//     z.object({
//       elevenlabs: z.object({
//         model_id: z.string(),
//         voice_id: z.string(),
//         voice_settings: z
//           .object({
//             similarity_boost: z.number(),
//             stability: z.number(),
//             style: z.number(),
//             use_speaker_boost: z.boolean(),
//           })
//           .partial()
//           .optional(),
//       }),
//     }),

//     z.object({
//       aws: z.object({
//         VoiceId: z.string(),
//         Engine: z.enum(['neural', 'standard', 'long-form']),
//       }),
//     }),
//   ]),
// })