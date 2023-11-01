import { adapters } from '@/lib/api/adapters'
import { authenticateGuest, createErrorResponse } from '@/lib/api/api'
import { eChatRequestSchema, PlatformKeys } from '@/lib/api/schemas'
import { prisma } from '@/lib/prisma'
import z from 'zod'
import { fromZodError } from 'zod-validation-error'

export async function POST(request: Request) {
  try {
    const auth = authenticateGuest(request.headers.get('Authorization'))
    if (!auth.ok) return auth.response

    const chatRequest = eChatRequestSchema.parse(await request.json())

    const engine = await prisma.engine.findFirstOrThrow({ where: { id: chatRequest.engineId } })
    const adapter = adapters[engine.hostId as PlatformKeys]
    if (!('chat' in adapter)) throw new Error('Invalid engine: ' + chatRequest.engineId)
    return adapter.chat(chatRequest)
  } catch (err) {
    if (err instanceof z.ZodError) {
      const validationError = fromZodError(err)
      console.error(validationError)
      return createErrorResponse(validationError.message)
    }

    console.error(err)
    if (err instanceof Error) return createErrorResponse(err.message)
    return createErrorResponse('Unknown error')
  }
}
