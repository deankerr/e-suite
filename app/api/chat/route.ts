import { openai } from '@/lib/providers/openai'
import { openrouter } from '@/lib/providers/openrouter'
import { isFriendly, logger } from '@/lib/utils'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const log = logger.child({}, { msgPrefix: '[api/chat] ' })

export async function POST(request: Request) {
  log.info('POST chat')
  if (!isFriendly(request.headers.get('pirce'))) return NextResponse.json({ no: true })

  const { provider, ...params } = requestSchema.parse(await request.json())
  log.info(params, 'parameters')

  let result: string
  if (provider === 'openai') {
    if (params.stream) return await openai.chatStream(params)
    const response = await openai.chat(params)
    result = response.item
  } else if (provider === 'openrouter') {
    if (params.stream) return await openrouter.chatStream(params)
    const response = await openrouter.chat(params)
    result = response.item
  } else {
    throw new Error(`unsupported provider: ${provider}`)
  }

  log.info(result, 'result')
  return NextResponse.json(result)
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
