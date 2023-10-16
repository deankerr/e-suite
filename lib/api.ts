import { nanoid } from 'nanoid/non-secure'

export function createErrorResponse(message: string, status = 400) {
  return new Response(message, { status, statusText: message })
}

const models: ChatModelOption[] = [
  {
    id: nanoid(),
    provider: 'openai',
    model: 'gpt-3.5-turbo',
    label: 'OpenAI: GPT-3.5 Turbo',
  },
  {
    id: nanoid(),
    provider: 'openai',
    model: 'gpt-4',
    label: 'OpenAI: GPT-4',
  },
  {
    id: nanoid(),
    provider: 'openrouter',
    model: 'meta-llama/llama-2-70b-chat',
    label: 'Meta: Llama v2 70B Chat',
  },
  {
    id: nanoid(),
    provider: 'openrouter',
    model: 'jondurbin/airoboros-l2-70b',
    label: 'Airoboros L2 70B',
  },
  {
    id: nanoid(),
    provider: 'openrouter',
    model: 'migtissera/synthia-70b',
    label: 'Synthia 70B',
  },
  {
    id: nanoid(),
    provider: 'openrouter',
    model: 'xwin-lm/xwin-lm-70b',
    label: 'Xwin 70B',
  },
]

export function getChatModels() {
  return models
}

export type ChatModelOption = {
  id: string
  provider: string
  model: string
  label: string
}
