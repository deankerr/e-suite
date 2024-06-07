import ky from 'ky'

import { internal } from '../_generated/api'
import { action, internalMutation, query } from '../functions'
import { endpointDataCacheFields } from '../schema'

export const getLatestCacheData = query({
  args: {},
  handler: async (ctx) => {
    const data = await ctx.table('endpointDataCache').order('desc')
    const openrouter = data.find((d) => d.endpoint === 'openrouter')
    const together = data.find((d) => d.endpoint === 'together')
    return { openrouter, together }
  },
})

export const createCacheData = internalMutation({
  args: endpointDataCacheFields,
  handler: async (ctx, args) => {
    return await ctx.table('endpointDataCache').insert(args)
  },
})

export const fetchTogetherModels = action(async (ctx) => {
  try {
    console.log('https://api.together.xyz/models/info')
    const response = await ky
      .get('https://api.together.xyz/models/info', {
        headers: {
          Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
        },
      })
      .json()

    await ctx.runMutation(internal.db.chatModels.createCacheData, {
      endpoint: 'together',
      name: 'chat-models',
      data: JSON.stringify(response, null, 2),
    })
    return null
  } catch (err) {
    console.error(err)
    const message = err instanceof Error ? err.message : 'unknown error'
    return { error: message }
  }
})

export const fetchOpenRouterModels = action(async (ctx) => {
  try {
    console.log('https://openrouter.ai/api/v1/models')
    const response = await ky.get('https://openrouter.ai/api/v1/models').json()
    await ctx.runMutation(internal.db.chatModels.createCacheData, {
      endpoint: 'openrouter',
      name: 'chat-models',
      data: JSON.stringify(response, null, 2),
    })
    return null
  } catch (err) {
    console.error(err)
    const message = err instanceof Error ? err.message : 'unknown error'
    return { error: message }
  }
})
