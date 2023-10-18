import { nanoid } from 'nanoid/non-secure'

export function createErrorResponse(message: string, status = 400) {
  return new Response(message, { status, statusText: message })
}

const models: ChatModelOption[] = [
  {
    id: 'openai::gpt-3.5-turbo',
    provider: 'openai',
    model: 'gpt-3.5-turbo',
    label: 'OpenAI: GPT-3.5 Turbo',
  },
  {
    id: 'openai::gpt-4',
    provider: 'openai',
    model: 'gpt-4',
    label: 'OpenAI: GPT-4',
  },
  {
    id: 'openrouter::meta-llama/llama-2-70b-chat',
    provider: 'openrouter',
    model: 'meta-llama/llama-2-70b-chat',
    label: 'Meta: Llama v2 70B Chat',
  },
  {
    id: 'openrouter::jondurbin/airoboros-l2-70b',
    provider: 'openrouter',
    model: 'jondurbin/airoboros-l2-70b',
    label: 'Airoboros L2 70B',
  },
  {
    id: 'openrouter::migtissera/synthia-70b',
    provider: 'openrouter',
    model: 'migtissera/synthia-70b',
    label: 'Synthia 70B',
  },
  {
    id: 'openrouter::xwin-lm/xwin-lm-70b',
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
