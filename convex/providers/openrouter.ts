'use node'

import OpenAI from 'openai'
import z from 'zod'

import { getEnv } from '../utils'

import type { completionParametersSchema } from '../schema'

const openAI = () =>
  new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: getEnv('OPENROUTER_API_KEY'),
  })

const chatCompletion = async (args: {
  messages: any[] // TODO type
  parameters: z.infer<typeof completionParametersSchema>
}) => {
  const client = openAI()

  const completion = await client.chat.completions.create({
    messages: args.messages,
    ...args.parameters,
    stream: false,
  })

  return completion
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
