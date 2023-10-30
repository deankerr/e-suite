import { env } from '../utils'
import { getEngineById } from './engines'
import { platforms } from './platforms'
import { EChatRequestSchema, Messages } from './schema'

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

export function convertMessagesToPromptFormat(messages: Messages) {
  let prompt = ''
  for (const m of messages) {
    if (m.role === 'system') prompt = prompt.concat(m.content + '\n')
    if (m.role === 'user') prompt = prompt.concat('<human>: ' + m.content + '\n')
    if (m.role === 'assistant') prompt = prompt.concat('<bot>: ' + m.content + '\n')
  }
  prompt = prompt.concat('<bot>:')

  return prompt
}

export function runChatEngine(chatRequest: EChatRequestSchema) {
  const engine = getEngineById(chatRequest.engineId)
  const adapter = platforms[engine.platform].adapters
  if (!('chat' in adapter)) throw new Error('Invalid engine: ' + chatRequest.engineId)
  return adapter.chat(chatRequest)
}
