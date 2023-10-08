import { openai } from '@/lib/providers/openai'
import { openrouter } from '@/lib/providers/openrouter'
import { createErrorResponse, isFriendly, logger } from '@/lib/utils'
import { z } from 'zod'

const log = logger.child({}, { msgPrefix: '[api/chat] ' })

export async function POST(request: Request) {
  log.info('POST chat')
  if (!isFriendly(request.headers.get('pirce'))) {
    const error = createErrorResponse({ message: 'wrong parameter' })
    return Response.json(error)
  }

  const { provider, ...params } = requestSchema.parse(await request.json())
  log.info(params, 'parameters')

  if (provider === 'openai') {
    return openai.chat(params)
  } else if (provider === 'openrouter') {
    return openrouter.chat(params)
  } else {
    throw new Error(`unsupported provider: ${provider}`)
  }
}

const requestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['system', 'user', 'assistant']),
      name: z.optional(z.string()),
      content: z.string(),
    }),
  ),
  model: z.string(),
  provider: z.string(),
  stream: z.boolean().optional(),
})
