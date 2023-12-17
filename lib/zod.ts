import z from 'zod'

export const zString32 = z
  .string()
  .transform((n) => n.trim())
  .refine((n) => n.length > 0)
  .transform((n) => (n.length > 32 ? n.slice(0, 32) : n))

// zod_utilz
// https://github.com/JacobWeisenburger/zod_utilz
const jsonLiteralSchema = z.union([z.string(), z.number(), z.boolean(), z.null()])
type JsonLiteral = z.infer<typeof jsonLiteralSchema>
type Json = JsonLiteral | { [key: string]: Json } | Json[]
const jsonParseSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([jsonLiteralSchema, z.array(jsonParseSchema), z.record(jsonParseSchema)]),
)

export const stringToJsonSchema = z
  .string()
  .transform((str, ctx): z.infer<typeof jsonParseSchema> => {
    try {
      return JSON.parse(str) as Json
    } catch (e) {
      ctx.addIssue({ code: 'custom', message: 'Invalid JSON' })
      return z.NEVER
    }
  })
