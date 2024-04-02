'use node'

import OpenAI from 'openai'
import z from 'zod'

import { getEnv, insist } from '../lib/utils'

import type { completionParametersSchema } from '../schema'
import type { ChatMessage } from '../types'

const openAI = () =>
  new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: getEnv('OPENROUTER_API_KEY'),
  })

const chatCompletion = async (args: {
  messages: ChatMessage[]
  parameters: z.infer<typeof completionParametersSchema>
}) => {
  const client = openAI()

  const completion = await client.chat.completions.create({
    messages: args.messages,
    ...args.parameters,
    stream: false,
  })

  const result = completion?.choices?.[0]
  insist(result, 'Failed to get chat completion')
  return result
}

const completion = async (args: {
  prompt: string
  parameters: z.infer<typeof completionParametersSchema>
}) => {
  const client = openAI()

  const completion = await client.completions.create({
    prompt: args.prompt,
    ...args.parameters,
    stream: false,
  })

  console.log(completion?.choices?.[0]?.text)
}

export const openrouter = {
  chatCompletion,
  completion,
}
