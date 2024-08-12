import { openai } from '@ai-sdk/openai'
import { generateObject } from 'ai'
import { omit } from 'convex-helpers'
import { z } from 'zod'

export const generateImageMetadata = async (args: { url: string }) => {
  const model = openai('gpt-4o-mini')

  const result = await generateObject({
    model,
    schema: z.object({
      image: z.object({
        title: z.string().describe('an artistic title for the image'),
        description: z.string().describe('A one sentence description of the image'),
      }),
    }),
    maxTokens: 512,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: 'Describe the image in detail.' },
          {
            type: 'image',
            image: args.url,
          },
        ],
      },
    ],
  })

  return omit(result, ['rawResponse', 'toJsonResponse'])
}
