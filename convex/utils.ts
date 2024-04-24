import { makeActionRetrier } from 'convex-helpers/server/retries'
import { ConvexError } from 'convex/values'
import { customAlphabet } from 'nanoid/non-secure'
import { z } from 'zod'

import { ridLength } from './constants'

import type { MutationCtx } from './types'
import type { Value } from 'convex/values'

export const { runWithRetries, retry } = makeActionRetrier('utils:retry')

export const generateRandomString = (length: number) => {
  const generate = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
  return generate(length)
}

//* rid
type RidTables = 'messages' | 'generated_images' | 'threads' | 'users'

export const generateRid = async (ctx: MutationCtx, table: RidTables): Promise<string> => {
  const rid = generateRandomString(ridLength)
  const existing = await ctx.table(table, 'rid', (q) => q.eq('rid', rid))
  return existing ? generateRid(ctx, table) : rid
}

export const getEnv = (env: string) => {
  const value = process.env[env]
  insist(value, `Unable to get ${env}`)
  return value
}

export function insist<T>(condition: T, message: string, data?: Value): asserts condition {
  if (!condition) throw new ConvexError(data ? { message: `insist: ${message}`, data } : message)
}

export const generateSha256Hash = async (input: string) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

export const zPaginationOptValidator = z.object({
  numItems: z.number(),
  cursor: z.union([z.string(), z.null()]),
  endCursor: z.optional(z.union([z.string(), z.null()])),
  id: z.optional(z.number()),
  maximumRowsRead: z.optional(z.number()),
  maximumBytesRead: z.optional(z.number()),
})

// https://github.com/xixixao/saas-starter/blob/main/convex/utils.ts
export function emptyPage() {
  return {
    page: [],
    isDone: false,
    continueCursor: '',
    // This is a little hack around usePaginatedQuery,
    // which will lead to permanent loading state,
    // until a different result is returned
    pageStatus: 'SplitRequired' as const,
  }
}
