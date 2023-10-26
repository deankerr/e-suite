import { env } from './utils'

export function createErrorResponse(message: string, status = 400) {
  return new Response(message, { status, statusText: message })
}

export function authenticateGuest(token: string | null) {
  console.log('authorize token:', token)
  const match = getGuestAuthKeys().findIndex((k) => k === token)

  if (match >= 0) {
    console.log('guest key:', match + 1)
    return { ok: true, response: new Response('Welcome friend', { status: 200 }) }
  }
  console.log('invalid guest token')
  return { ok: false, response: createErrorResponse('Invalid credentials', 403) }
}

export function getGuestAuthKeys() {
  return [
    env('GUEST_AUTH_KEY_1'),
    env('GUEST_AUTH_KEY_2'),
    env('GUEST_AUTH_KEY_3'),
    env('GUEST_AUTH_KEY_4'),
    env('GUEST_AUTH_KEY_5'),
    env('GUEST_AUTH_KEY_6'),
  ]
}

export function getAvailableChatModels() {
  return chatModels
}

export function getModelById(id: string) {
  const model = chatModels.find((m) => m.id === id)
  if (!model) throw new Error(`Unable to find model id ${id}`)
  return model
}

const chatModels = [
  {
    id: 'openai::gpt-3.5-turbo',
    provider: 'openai',
    label: 'OpenAI: GPT-3.5 Turbo',
    parameters: { model: 'gpt-3.5-turbo' },
  },
  {
    id: 'openai::gpt-4',
    provider: 'openai',
    label: 'OpenAI: GPT-4',
    parameters: { model: 'gpt-4' },
  },
  {
    id: 'openrouter::meta-llama/llama-2-70b-chat',
    provider: 'openrouter',
    label: 'Meta: Llama v2 70B Chat',
    parameters: { model: 'meta-llama/llama-2-70b-chat' },
  },
  {
    id: 'openrouter::jondurbin/airoboros-l2-70b',
    provider: 'openrouter',
    label: 'Airoboros L2 70B',
    parameters: { model: 'jondurbin/airoboros-l2-70b' },
  },
  {
    id: 'openrouter::migtissera/synthia-70b',
    provider: 'openrouter',
    label: 'Synthia 70B',
    parameters: { model: 'migtissera/synthia-70b' },
  },
  {
    id: 'openrouter::xwin-lm/xwin-lm-70b',
    provider: 'openrouter',
    label: 'Xwin 70B',
    parameters: { model: 'xwin-lm/xwin-lm-70b' },
  },
] as const
