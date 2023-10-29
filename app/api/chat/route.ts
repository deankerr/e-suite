import { authenticateGuest, createErrorResponse } from '@/lib/api/api'
import { getEngineById } from '@/lib/api/engines'
import { eChatRequestSchema } from '@/lib/api/schema'
import { adapters } from '@/lib/platform/platforms'
import { logger } from '@/lib/utils'

const log = logger.child({}, { msgPrefix: '[api/chat] ' })

export async function POST(request: Request) {
  log.info('POST chat')

  const auth = authenticateGuest(request.headers.get('Authorization'))
  if (!auth.ok) return auth.response

  const chatRequest = eChatRequestSchema.parse(await request.json())
  log.info(chatRequest, 'parameters')

  const engine = getEngineById(chatRequest.engineId)
  if (!engine) return createErrorResponse('invalid engine id')

  const adapter = adapters[engine.platform]
  if ('chat' in adapter) {
    return adapter.chat(chatRequest)
  } else {
    return createErrorResponse('invalid platform for adapter')
  }
}
