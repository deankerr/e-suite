import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import z from 'zod'

import type { ClassValue } from 'clsx'

export type { ClassNameValue } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function getEnvironment() {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production') return 'prod'
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview') return 'prev'
  if (process.env.NODE_ENV === 'development') return 'dev'
  return 'prod'
}
export const environment = getEnvironment()

// see https://github.com/JacobWeisenburger/zod_utilz
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
