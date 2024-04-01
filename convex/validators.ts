import z from 'zod'

import { maxInputStringLength, textToSpeechProviders } from './constants'

export const voiceoverValidator = z.object({
  text: z.string().transform((value) => value.slice(0, maxInputStringLength)),
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
