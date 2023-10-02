import { openai } from '@/lib/provider/openai'
import { openrouter } from '@/lib/provider/openrouter'
import { logger } from '@/lib/utils'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const log = logger.child({}, { msgPrefix: '[API/CHAT] ' })

export async function POST(request: NextRequest) {
  log.info('POST chat')
  const { provider, ...params } = requestSchema.parse(await request.json())
  log.info(params, 'parameters')

  let result: string
  if (provider === 'openai') {
    const response = await openai.chat(params)
    result = response.item
  } else if (provider === 'openrouter') {
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
})
