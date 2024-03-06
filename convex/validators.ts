import z from 'zod'

export const messageValidator = z.object({
  role: z.enum(['system', 'user', 'assistant', 'tool']),
  name: z
    .string()
    .optional()
    .transform((v) => (v ? v.slice(0, 32) : undefined)),
  content: z.string().transform((v) => v.slice(0, 32767)),
})
