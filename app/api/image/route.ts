import { env, raise } from '@/lib/utils'
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import Replicate from 'replicate'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  console.log('image')
  const { provider, ...params } = requestSchema.parse(await request.json())
  console.log('params:', params)

  let result: { url: string } | { base64: string } | undefined
  if (provider === 'openai') result = await openai(params)
  if (provider === 'togetherai') result = await togetherai(params)
  if (provider === 'replicate') result = await replicate(params)
  if (!result) throw new Error('invalid provider/response')

  console.log('result:', result)
  return NextResponse.json(result)
}

async function openai(params: ImageParams) {
  const { prompt } = params
  const api = new OpenAI()
  const response = await api.images.generate({
    prompt,
  })
  const url = response.data[0].url
  if (!url) throw new Error('openai response missing url')
  return { url }
}

async function togetherai(params: ImageParams) {
  console.log('togetherai', params)
  const apiKey = process.env.TOGETHERAI_API_KEY ?? raise('TOGETHERAI_API_KEY not provided')

  const response = await fetch('https://api.together.xyz/inference', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(params),
  })

  if (!response.ok) throw new Error(`HTTP Error: ${response.status} ${response.statusText}`)
  const result = responseSchema.togetherai.parse(await response.json())
  const base64 = result.output.choices[0]?.image_base64
  if (!base64) throw new Error('togetherai: response missing expected data')
  return { base64 }
}

async function replicate(params: ImageParams) {
  console.log('replicate')
  const { prompt, model } = params
  const api = new Replicate({ auth: env('REPLICATE_API_KEY') })

  const input = { prompt }
  const response = await api.run(model as `${string}/${string}:${string}`, { input })
  const result = z.string().url().array().parse(response)
  const url = result[0] ?? raise('replicate response missing data')
  return { url }
}

const requestSchema = z.object({
  prompt: z.string(),
  negative_prompt: z.string().optional(),
  model: z.string().optional(),
  provider: z.string(),
})

const responseSchema = {
  togetherai: z.object({
    status: z.string(),
    prompt: z.string().array(),
    model: z.string(),
    model_owner: z.string(),
    tags: z.object({}).passthrough(), // ?
    num_returns: z.number(),
    args: z.object({}).passthrough(), // ? request params
    subjobs: z.unknown().array(), // ?
    output: z.object({
      choices: z.array(
        z.object({
          image_base64: z.string(),
        }),
      ),
      result_type: z.string(),
    }),
  }),
}

type RequestSchema = z.infer<typeof requestSchema>
type ImageParams = Omit<RequestSchema, 'provider'>
