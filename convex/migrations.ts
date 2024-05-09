import { asyncMap } from 'convex-helpers'
import { z } from 'zod'

import { internalMutation } from './functions'

export const migrateGenerations = internalMutation({
  args: {
    limit: z.number().default(2000),
  },
  handler: async (ctx, { limit }) => {
    const gens = await ctx
      .table('generations')
      .filter((q) =>
        q.or(
          q.neq(q.field('negative_prompt'), undefined),
          q.neq(q.field('lcm'), undefined),
          q.neq(q.field('steps'), undefined),
          q.neq(q.field('use_default_neg'), undefined),
        ),
      )
      .take(limit)

    await asyncMap(gens, async (gen) => {
      await ctx.unsafeDb.patch(gen._id, {
        negative_prompt: undefined,
        lcm: undefined,
        steps: undefined,
      })
    })
    return gens.length
  },
})
