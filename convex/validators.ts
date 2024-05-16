import z from 'zod'

import { textToSpeechProviders } from './constants'

export const zTruncate = (max: number, min = 0) =>
  z
    .string()
    .min(min)
    .transform((value) => value.slice(0, max))

export const zThreadTitle = zTruncate(256, 1)
export const zMessageName = zTruncate(64, 1)
export const zMessageTextContent = zTruncate(32767, 1)

export const voiceoverValidator = z.object({
  text: zMessageTextContent,
  provider: z.enum(textToSpeechProviders),
  parameters: z.union([
    z.object({
      elevenlabs: z.object({
        model_id: z.string(),
        voice_id: z.string(),
        voice_settings: z
          .object({
            similarity_boost: z.number(),
            stability: z.number(),
            style: z.number(),
            use_speaker_boost: z.boolean(),
          })
          .partial()
          .optional(),
      }),
    }),

    z.object({
      aws: z.object({
        VoiceId: z.string(),
        Engine: z.enum(['neural', 'standard', 'long-form']),
      }),
    }),
  ]),
})
