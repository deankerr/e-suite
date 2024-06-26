import { makeActionRetrier } from 'convex-helpers/server/retries'
import { customAlphabet } from 'nanoid/non-secure'
import { z } from 'zod'

import type { MutationCtx } from './types'

export const { runWithRetries, retry } = makeActionRetrier('utils:retry')

export const generateSlug = async (ctx: MutationCtx) => {
  const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789')

  async function getAvailableSlug(): Promise<string> {
    const slug = nanoid(8)
    const existing = await ctx.table('threads', 'slug', (q) => q.eq('slug', slug)).first()
    return existing ? await getAvailableSlug() : slug
  }

  return await getAvailableSlug()
}

export const generateRandomString = (length: number) => {
  const generate = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
  return generate(length)
}

export const generateSha256Hash = async (input: string) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

export type ZPaginationOptValidator = z.infer<typeof zPaginationOptValidator>
export const zPaginationOptValidator = z.object({
  numItems: z.number(),
  cursor: z.union([z.string(), z.null()]),
  endCursor: z.optional(z.union([z.string(), z.null()])),
  id: z.optional(z.number()),
  maximumRowsRead: z.optional(z.number()),
  maximumBytesRead: z.optional(z.number()),
})

// see https://github.com/xixixao/saas-starter/blob/main/convex/utils.ts
// permanent loading state for a paginated query until a different result is returned
export function emptyPage() {
  return {
    page: [],
    isDone: false,
    continueCursor: '',
    pageStatus: 'SplitRequired' as const,
  }
}
