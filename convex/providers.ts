import { v } from 'convex/values'
import { api, internal } from './_generated/api'
import { internalMutation, internalQuery, mutation, query } from './_generated/server'

const providers = [
  { name: 'sinkin', url: 'https://sinkin.ai' },
  { name: 'OpenAI', url: 'https://openai.com' },
]

export const list = internalQuery(async (ctx) => {
  const providers = await ctx.db.query('image_providers').collect()
  return providers
})

export const getByName = internalQuery({
  args: { name: v.string() },
  handler: async (ctx, { name }) => {
    return await ctx.db
      .query('image_providers')
      .filter((q) => q.eq(q.field('name'), name))
      .unique()
  },
})

export const seedProviders = internalMutation(async (ctx) => {
  const current = await ctx.db.query('image_providers').collect()
  console.log(
    'current providers:',
    current.map((c) => c.name),
  )

  for (const provider of providers) {
    if (current.find((p) => p.name === provider.name)) continue
    await ctx.db.insert('image_providers', {
      name: provider.name,
      url: provider.url,
      models_data: null,
    })
    console.log(`created provider: ${provider.name}`)
  }
})

export const updateProviderModelsData = internalMutation({
  args: { name: v.string(), data: v.any() },

  handler: async (ctx, { name, data }) => {
    const provider = await getByName(ctx, { name })
    if (!provider) return `failed: provider not found "${name}"`

    await ctx.db.patch(provider._id, {
      models_data: { cache: data, cache_time: new Date().toISOString() },
    })
    return 'success'
  },
})
