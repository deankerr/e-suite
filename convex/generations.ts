import { v } from 'convex/values'
import { api } from './_generated/api'
import type { Id } from './_generated/dataModel'
import { mutation, query } from './_generated/server'

export const list = query(async (ctx) => {
  const items = await ctx.db.query('generations').collect()
  for (const item of items) {
    if (item.results) {
      const urls: string[] = []
      for (const result of item.results as Id<'_storage'>[]) {
        const url = await ctx.storage.getUrl(result)
        if (url) urls.push(url)
      }
      item.results = urls
    }
  }

  return items
})

export const send = mutation({
  args: {
    prompt: v.string(),
    negative_prompt: v.string(),
    size: v.string(),
    model: v.string(),
  },
  handler: async (ctx, { prompt, negative_prompt, size, model }) => {
    const id = await ctx.db.insert('generations', {
      prompt,
      negative_prompt,
      size,
      model,
      results: [],
    })

    await ctx.scheduler.runAfter(0, api.sendSinkIn.send, { id, prompt })
  },
})

export const update = mutation({
  args: { id: v.id('generations'), patch: v.object({ results: v.array(v.string()) }) },
  handler: async (ctx, { id, patch }) => {
    await ctx.db.patch(id, patch)
  },
})
