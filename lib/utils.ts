import { clsx } from 'clsx'
import { atom, WritableAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
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

export function getConvexSiteUrl() {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
  if (!convexUrl) throw new Error('NEXT_PUBLIC_CONVEX_URL is undefined')
  return convexUrl.replace('.cloud', '.site')
}

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

export function atomWithToggleAndStorage(
  key: string,
  initialValue?: boolean,
  storage?: any,
): WritableAtom<boolean, [boolean?], void> {
  const anAtom = atomWithStorage(key, initialValue, storage)
  const derivedAtom = atom(
    (get) => get(anAtom),
    (get, set, nextValue?: boolean) => {
      const update = nextValue ?? !get(anAtom)
      void set(anAtom, update)
    },
  )

  return derivedAtom as WritableAtom<boolean, [boolean?], void>
}

export const sleep = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms))

export const getWidthHeightForEndpoint = (size: string, endpoint: string) => {
  const big = endpoint.includes('fal')
  switch (size) {
    case 'portrait':
      return big ? { width: 832, height: 1216 } : { width: 512, height: 768 }
    case 'landscape':
      return big ? { width: 1216, height: 832 } : { width: 768, height: 512 }
    default:
      return big ? { width: 1024, height: 1024 } : { width: 512, height: 512 }
  }
}

export function stringToHex(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  let color = '#'
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff
    color += ('00' + value.toString(16)).slice(-2)
  }

  return color
}

export function endpointCode(endpoint: string) {
  switch (endpoint) {
    case 'openai':
      return 'OA'
    case 'openrouter':
      return 'OR'
    case 'together':
      return 'TA'
    default:
      return endpoint.slice(0, 2).toUpperCase()
  }
}
