import { env, logger, raise } from '@/lib/utils'
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { z } from 'zod'

const log = logger.child({ api: 'chat' }, { msgPrefix: '[API/CHAT] ' })

export async function POST(request: NextRequest) {
  log.info('POST chat')
  const { provider, ...params } = requestSchema.parse(await request.json())
  log.info(params, 'parameters')

  switch (provider) {
    case 'openai':
      return await openai(params)
    case 'openrouter':
      return await openrouter(params)
    default:
      throw new Error(`unsupported provider: ${provider}`)
  }
}

async function openai(params: ChatParams) {
  console.log('openai')
  const api = new OpenAI()
  const response = await api.chat.completions.create(params)
  const message = response.choices[0]?.message.content ?? raise('response missing expected data')
  return NextResponse.json(message)
}

async function openrouter(params: ChatParams) {
  console.log('openrouter')
  const api = new OpenAI({
    apiKey: env('OPENROUTER_API_KEY'),
    baseURL: 'https://openrouter.ai/api/v1/',
    defaultHeaders: {
      'HTTP-Referer': process.env.SITE_URL,
    },
  })
  const request = await api.chat.completions.create(params)
  const message = request.choices[0]?.message.content ?? raise('response missing expected data')
  return NextResponse.json(message)
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

type RequestSchema = z.infer<typeof requestSchema>
type ChatParams = Omit<RequestSchema, 'provider'>
