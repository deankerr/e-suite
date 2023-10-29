import z from 'zod'

const eChatRequestSchema = z.object({
  engineId: z.string(),
  parameters: z.record(z.string(), z.unknown()),
})

const eChatEngine = z.object({
  id: z.string(), // our id
  type: z.enum(['chat', 'completion', 'image', 'tts']),
  platform: z.string(),
  model: z.string(),
  chatFormat: z.enum(['messages', 'prompt']), // Chat specific (could determine from schema?)
  suggestedPromptFormat: z.string(), // suggested from togetherAI
  suggestedStopToken: z.string(), // - can be wrong?
  parametersSchema: z.record(z.string(), z.unknown()), // ?
  metadata: z.object({
    label: z.string(), // human friendly name
    description: z.string(),
    license: z.string(),
  }),
})
