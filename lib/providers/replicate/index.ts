import { createErrorResponse } from '@/lib/api'
import { env, raise } from '@/lib/utils'
import Replicate from 'replicate'
import { z } from 'zod'

const api = new Replicate({ auth: env('REPLICATE_API_KEY') })

export const replicate = {
  async image(input: object) {
    try {
      const { prompt, model } = imageRequestSchema.parse(input)
      const data = await api.run(model as `${string}/${string}:${string}`, { input: { prompt } })
      const response = imageResponseSchema.parse(data)
      const item = { url: response[0] ?? raise('replicate response missing data') }
      return { response, item }
    } catch (error) {
      if (error instanceof Error) {
        const { message } = error
        return createErrorResponse(message)
      } else {
        throw error
      }
    }
  },
}

const imageRequestSchema = z.object({
  prompt: z.string(),
  model: z.string(),
})

const imageResponseSchema = z.string().url().array()
