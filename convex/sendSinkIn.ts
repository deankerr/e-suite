'use node'

import z from 'zod'
import { api } from './_generated/api'
import type { Id } from './_generated/dataModel'
import { action } from './_generated/server'

export const send = action(async (ctx, { id, prompt, negative_prompt, size, model }) => {
  try {
    const body = new URLSearchParams()
    body.set('access_token', process.env.SINKIN_API_KEY as string)
    body.set('prompt', prompt as string)
    body.set('negative_prompt', negative_prompt as string)
    body.set('model_id', '4zdwGOB')

    const response = await fetch('https://sinkin.ai/m/inference', {
      method: 'POST',
      body,
    })
    const data = await response.json()

    const parsed = z
      .object({
        images: z.string().array(),
      })
      .parse(data)

    const imageIds: Id<'_storage'>[] = await Promise.all(
      parsed.images.map(async (url) => {
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`failed to download: ${response.statusText}`)
        }

        const buffer = await response.arrayBuffer()
        const blob = new Blob([buffer], { type: 'image/png' })
        return await ctx.storage.store(blob)
      }),
    )
    await ctx.runMutation(api.generations.update, {
      id: id as Id<'generations'>,
      patch: { results: imageIds },
    })
  } catch (err) {
    console.error(err)
  }
})
