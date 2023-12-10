import 'server-only'
import type { Message } from '@/data/schemas'
import { NewAppError } from '@/lib/app-error'
import { ENV } from '@/lib/env'
import { RouteContext } from '@/lib/route'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'
import models from './openai.models.json'
import { openaiSchema } from './openai.schema'

const api = new OpenAI({
  apiKey: ENV.OPENAI_API_KEY,
})

export const openaiPlugin = {
  chat: {
    completions: async ({ input, log }: RouteContext) => {
      const body = openaiSchema.chat.completions.request.parse(input)
      log.add('vendorRequestBody', body)

      const flagged = await getModerations(body.messages)
      if (flagged.length > 0) {
        throw new NewAppError('vendor_content_rejection', { cause: flagged })
      }

      //* streaming response
      if (body.stream) {
        const response = await api.chat.completions.create(
          body as OpenAI.ChatCompletionCreateParamsStreaming,
        )
        const stream = OpenAIStream(response)
        log.add('vendorResponseBody', 'is_streaming')
        return new StreamingTextResponse(stream)
      }

      //* json response
      const response = await api.chat.completions.create(
        body as OpenAI.ChatCompletionCreateParamsNonStreaming,
      )
      log.add('vendorResponseBody', response)
      return Response.json(response)
    },
  },

  moderations: async ({ input }: { input: unknown }) => {
    const body = openaiSchema.moderations.request.parse(input)
    const response = await api.moderations.create(body)
    return Response.json(response)
  },

  images: {
    generations: async ({ input }: { input: unknown }) => {
      console.log('openai image generation')
      const body = openaiSchema.image.generations.request.parse(input)
      const response = await api.images.generate(body)
      return Response.json(response)
    },
  },

  models: {
    list: () => {
      return models
    },
  },
}

export async function getAvailableModels() {
  const { data } = await api.models.list()
  return data
}

async function getModerations(messages: Message[]) {
  const messageStrings = messages.map(({ name, content }) => (name ? `${name} ` : '') + content)
  const input = openaiSchema.moderations.request.parse({ input: messageStrings })
  const { results } = await api.moderations.create(input)

  const flagged = results.reduce<{ content: string; reasons: string[] }[]>(
    (acc, { flagged, categories }, i) => {
      if (!flagged) return acc
      const keys = Object.keys(categories) as Array<keyof typeof categories>
      const reasons = keys.filter((key) => categories[key])
      return [...acc, { content: messageStrings[i] ?? '', reasons }]
    },
    [],
  )

  return flagged
}
