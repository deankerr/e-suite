import z from 'zod'

export const roleSchema = z.enum(['user', 'assistant', 'system', 'tool', 'function'])
export type Role = z.infer<typeof roleSchema>
export type Message = z.infer<typeof messageSchema>

export const messageSchema = z.object({
  role: roleSchema,
  name: z.string().optional(),
  content: z.string(),
})

const messageSchemaOTT = z.discriminatedUnion('role', [
  z.object({
    role: z.literal('system'),
    content: z.string().nullable(),
    name: z.string().optional(),
  }),
  z.object({
    role: z.literal('user'),
    content: z
      .string()
      .or(
        z.discriminatedUnion('type', [
          z.object({ type: z.literal('text'), text: z.string() }),
          z.object({ type: z.literal('image'), image_url: z.string() }),
        ]),
      ),
    name: z.string().optional(),
  }),
  z.object({
    role: z.literal('assistant'),
    content: z.string().nullable(),
    name: z.string().optional(),
    tool_calls: z
      .object({
        id: z.string(),
        type: z.string(),
        function: z.object({
          name: z.string(),
          arguments: z.string(), // TODO JSON
        }),
      })
      .array()
      .optional(),
    function_call: z
      .object({
        name: z.string(),
        arguments: z.string(), // TODO JSON
      })
      .optional(),
  }),
  z.object({
    role: z.literal('tool'),
    content: z.string().nullable(),
    tool_call_id: z.string(),
    name: z.string().optional(),
  }),
  z.object({
    role: z.literal('function'),
    content: z.string(),
    name: z.string(),
  }),
])
