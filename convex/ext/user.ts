import { validators } from '../external'
import { query } from '../functions'

export const getSelf = query({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.viewer()
    if (!user) return null

    const apiKey = await user
      .edge('users_api_keys')
      .filter((q) => q.eq(q.field('valid'), true))
      .unique()

    return validators.self.parse({
      ...user,
      apiKey: apiKey?.secret,
    })
  },
})
