import { NextRequest, NextResponse } from "next/server";
import OpenAI from 'openai'
import {z} from 'zod'

export async function POST(request: NextRequest) {
  const params = requestSchema.parse(await request.json())
  console.log('req:', params)
  const message = await openai(params)
  return NextResponse.json(message)
}

async function openai(params: RequestSchema) {
  const api = new OpenAI()
  const request = await api.chat.completions.create(params)
  const message = request.choices[0].message.content
  if (!message) throw new Error('openai response error')
  return message
}

const requestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['system', 'user', 'assistant']),
    name: z.optional(z.string()),
    content: z.string()
  })),
  model: z.string()
})

type RequestSchema = z.infer<typeof requestSchema>