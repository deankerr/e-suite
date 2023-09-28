import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  console.log('chat')
  const { provider, ...params } = requestSchema.parse(await request.json())
  console.log('params:', params)

  let message: string | undefined
  if (provider === 'openai') message = await openai(params)
  if (provider === 'openrouter') message = await openrouter(params)
  if (!message) throw new Error('provider/response error')

  return NextResponse.json(message)
}

async function openai(params: ChatParams) {
  const api = new OpenAI()
  const request = await api.chat.completions.create(params)
  const message = request.choices[0].message.content
  if (!message) throw new Error('openai response error')
  return message
}

async function openrouter(params: ChatParams) {
  const api = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1/',
    defaultHeaders: {
      'HTTP-Referer': process.env.SITE_URL,
    },
  })
  const request = await api.chat.completions.create(params)
  const message = request.choices[0].message.content
  if (!message) throw new Error('openrouter response error')
  return message
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
