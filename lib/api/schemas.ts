import { messageSchema } from '@/schema/message'
import z from 'zod'
import { openai } from './platforms/openai.schema'
import { openrouter } from './platforms/openrouter.schema'
import { togetherai } from './platforms/togetherai.schema'

export const platformKeys = ['openai', 'openrouter', 'togetherai'] as const
export type PlatformKeys = (typeof platformKeys)[number]

export const adapterKeys = ['chat', 'image', 'illusion', 'tts'] as const

export const schemas = {
  openai,
  openrouter,
  togetherai,
}

const messages = z.array(
  z.object({
    role: z.enum(['user', 'assistant', 'system', 'function']),
    name: z.string().optional(),
    content: z.string(),
  }),
)
export type Messages = z.infer<typeof messages>

export const eChatRequestSchema = z
  .object({
    engineId: z.string(),
    messages: messageSchema.array().min(1),
    prompt: z.string().optional(),
  })
  .passthrough()
export type EChatRequestSchema = z.infer<typeof eChatRequestSchema>

// const eChatEngine = z.object({
//   id: z.string(), // our id
//   type: z.enum(adapterKeys),
//   platform: z.enum(platformKeys),
//   model: z.string(), // "our" canonical name string
//   contextLength: z.number(),
//   messages: z.boolean(),
//   prompt: z.boolean(),
//   suggestedPromptFormat: z.string().optional(), // suggested from togetherAI
//   suggestedStopToken: z.string().optional(), // - can be wrong?
//   input: z.record(z.string(), z.unknown()),
//   metadata: z.object({
//     label: z.string(), // human friendly name
//     creator: z.string(),
//     description: z.string(),
//     licence: z.string(),
//   }),
//   //? isModerated
// })
// export type EChatEngine = z.infer<typeof eChatEngine>
