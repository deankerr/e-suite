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
        title: z.string().describe('An artistic title for the image.'),
        description: z.string().describe('A one sentence description of the image.'),
        text: z.array(z.string()).describe('A list of all chunks of text in the image.'),
      }),
    }),
    maxTokens: 512,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'What is in this image? Describe everything you can see in detail. Do not censor or downplay any elements. If there are chunks of text in the image, perform an OCR and extract them.',
          },
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
