import { adapters } from '@/lib/api/adapters'
import { authenticateGuest, createErrorResponse } from '@/lib/api/api'
import { getEngineById } from '@/lib/api/engines'
import { eChatRequestSchema } from '@/lib/api/schemas'
import { logger } from '@/lib/utils'
import z from 'zod'
import { fromZodError } from 'zod-validation-error'

const log = logger.child({}, { msgPrefix: '[api/chat] ' })

export async function POST(request: Request) {
  try {
    const auth = authenticateGuest(request.headers.get('Authorization'))
    if (!auth.ok) return auth.response

    const chatRequest = eChatRequestSchema.parse(await request.json())

    const engine = getEngineById(chatRequest.engineId)
    const adapter = adapters[engine.platform]
    if (!('chat' in adapter)) throw new Error('Invalid engine: ' + chatRequest.engineId)
    return adapter.chat(chatRequest)
  } catch (err) {
    if (err instanceof z.ZodError) {
      const validationError = fromZodError(err)
      log.error(validationError)
      return createErrorResponse(validationError.message)
    }

    log.error(err)
    if (err instanceof Error) return createErrorResponse(err.message)
    return createErrorResponse('Unknown error')
  }
}
