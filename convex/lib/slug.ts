import { slugLength } from '../constants'
import { MutationCtx } from '../types'
import { generateRandomString } from './utils'

export const getSlug = async (
  ctx: MutationCtx,
  tableName: 'messages' | 'threads',
): Promise<string> => {
  const slug = generateRandomString(slugLength)

  if (tableName === 'messages') {
    const match = await ctx.skipRules.table('messages', 'slug', (q) => q.eq('slug', slug)).first()
    return match ? await getSlug(ctx, tableName) : slug
  }

  // threads
  const match = await ctx.skipRules.table('threads', 'slug', (q) => q.eq('slug', slug)).first()
  return match ? await getSlug(ctx, tableName) : slug
}
