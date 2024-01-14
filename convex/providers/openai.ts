'use node'

import { v } from 'convex/values'
import OpenAI from 'openai'
import { api } from '../_generated/api'
import { action } from '../_generated/server'

export const create = action({
  args: {
    id: v.id('xgenerations'),
    model: v.string(),
    prompt: v.string(),
  },
  handler: async (ctx, { id, model, prompt }) => {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error(
        'Add your OPENAI_API_KEY as an env variable in the ' +
          '[dashboard](https://dasboard.convex.dev)',
      )
    }
    const openai = new OpenAI({ apiKey })

    const response = await openai.images.generate({
      model,
      prompt,
      size: '1024x1024',
    })
    const result = response.data[0]
    if (!result) throw new Error('no result')
    const dallEImageUrl = result.url!

    const imageResponse = await fetch(dallEImageUrl)
    if (!imageResponse.ok) {
      throw new Error(`failed to download: ${imageResponse.statusText}`)
    }

    const image = await imageResponse.blob()
    const storageId = await ctx.storage.store(image)

    // await ctx.runMutation(api.xgenerations.update, { id, patch: { results: [storageId] } })
  },
})
