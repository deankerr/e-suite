import { v } from 'convex/values'
import z from 'zod'
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
    model: v.string(),
    prompt: v.string(),
    negative_prompt: v.string(),
    size: v.string(),
  },
  handler: async (ctx, { prompt, negative_prompt, size, model }) => {
    const id = await ctx.db.insert('generations', {
      prompt,
      negative_prompt,
      size,
      model,
      results: [],
    })

    if (model === 'dall-e-3' || model === 'dall-e-2')
      await ctx.scheduler.runAfter(0, api.image.openai.create, { id, model, prompt })
    else await ctx.scheduler.runAfter(0, api.image.sinkin.send, { id, model, prompt })
  },
})

export const update = mutation({
  args: { id: v.id('generations'), patch: v.object({ results: v.array(v.string()) }) },
  handler: async (ctx, { id, patch }) => {
    await ctx.db.patch(id, patch)
  },
})

export const listModels = query(async (ctx) => {
  const data = await ctx.db.query('models_sinkin').first()
  console.log('data', data)
  const parsed = z
    .object({
      // error_code: z.number(),
      models: z
        .object({
          civitai_model_id: z.number().optional(),
          cover_img: z.string(),
          id: z.string(),
          link: z.string(),
          name: z.string(),
          tags: z.string().array().optional(),
        })
        .array(),
      // loras: z
      //   .object({
      //     cover_img: z.string(),
      //     id: z.string(),
      //     link: z.string(),
      //     name: z.string(),
      //   })
      //   .array(),
    })
    .parse(data)

  return parsed.models
})
