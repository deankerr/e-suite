import z from 'zod'

export const messageValidator = z.object({
  role: z.enum(['system', 'user', 'assistant', 'tool']),
  name: z
    .string()
    .optional()
    .transform((value) => (value ? value.slice(0, 32) : undefined)),
  content: z.string().transform((value) => value.slice(0, 32767)),
})

export const voiceoverRequestValidator = z.object({
  text: z.string().transform((value) => value.slice(0, 1024)),
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
})
