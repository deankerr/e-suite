import { ConvexError } from 'convex/values'
import OpenAI from 'openai'

import { env } from '../shared/utils'

export const createOpenAiClient = (endpoint: string) => {
  switch (endpoint) {
    case 'together':
      return new OpenAI({
        apiKey: env('TOGETHER_API_KEY'),
        baseURL: 'https://api.together.xyz/v1',
      })

    case 'openai':
      return new OpenAI({
        apiKey: env('OPENAI_API_KEY'),
        baseURL: 'https://api.openai.com/v1',
      })
  }

  throw new ConvexError('invalid endpoint') // todo no retry
}
