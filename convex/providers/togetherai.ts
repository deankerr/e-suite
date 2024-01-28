import { v } from 'convex/values'
import { internalAction } from '../_generated/server'
import { assert } from '../util'

const getApiKey = {
  togetherai: () => {
    const apiKey = process.env.TOGETHERAI_API_KEY
    assert(apiKey, 'TOGETHERAI_API_KEY is undefined')
    return apiKey
  },
}

type ChatMessage = { role: 'system' | 'user' | 'assistant'; name?: string; content: string }

type ChatOptions = {
  model: string
  max_tokens: number
  stop: string[]
  temperature: number
  top_p: number
  top_k: number
  repetition_penalty: number
  n: number
  messages: ChatMessage[]
}

const togetherai = async (options?: Partial<ChatOptions>) => {
  const body = {
    model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
    max_tokens: 512,
    stop: ['</s>', '[/INST]'],
    temperature: 0.7,
    top_p: 0.7,
    top_k: 50,
    repetition_penalty: 1,
    n: 1,
    messages: [
      { role: 'user', content: 'This is a systems test, response with a full self-diagnostic.' },
    ],
    ...options,
  }

  const fetchOptions = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      Authorization: `Bearer ${getApiKey.togetherai()}`,
    },
    body: JSON.stringify(body),
  }

  const response = await fetch('https://api.together.xyz/v1/chat/completions', fetchOptions)
  const json = await response.json()

  return json
}

export const runChat = internalAction({
  args: {
    endpoint: v.string(),
  },
  handler: async (ctx, args) => {
    const json = (await togetherai()) as { choices: Array<{ message: { content: string } }> }
    const msg = json.choices[0]?.message

    return msg
  },
})
