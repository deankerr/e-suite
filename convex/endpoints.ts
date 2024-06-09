import { internalMutation } from './functions'
import { endpointDataCacheFields } from './schema'

export const createCacheData = internalMutation({
  args: endpointDataCacheFields,
  handler: async (ctx, args) => {
    return await ctx.table('endpoint_data_cache').insert(args)
  },
})
