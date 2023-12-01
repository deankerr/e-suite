import { getEngine } from '@/data/engines'
import { adapters } from '@/lib/api/adapters'
import { authenticateGuest, createErrorResponse } from '@/lib/api/api'
import { eChatRequestSchema, PlatformKeys } from '@/lib/api/schemas'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import z from 'zod'
import { fromZodError } from 'zod-validation-error'

export async function POST(request: Request) {
  try {
    const authed = await getKindeServerSession().isAuthenticated()
    if (!authed) createErrorResponse('Not logged in.', 403)

    const chatRequest = eChatRequestSchema.parse(await request.json())
    console.log(chatRequest)

    const engine = await getEngine(chatRequest.engineId)
    const adapter = adapters[engine.vendorId as PlatformKeys]
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
