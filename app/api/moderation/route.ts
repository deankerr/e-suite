import { authenticateGuest } from '@/lib/api'
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  console.log('moderation')

  const auth = authenticateGuest(request.headers.get('Authorization'))
  if (!auth.ok) return auth.response

  const params = requestSchema.parse(await request.json())

  const api = new OpenAI()
  const response = await api.moderations.create(params)
  return NextResponse.json(response)
}

const requestSchema = z.object({
  input: z.string().or(z.string().array()),
  model: z.optional(z.enum(['text-moderation-stable', 'text-moderation-latest'])),
})
