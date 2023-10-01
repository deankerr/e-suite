import { env } from '@/lib/utils'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  console.log('POST image/illusion')
  const params = requestSchema.parse(await request.json())
  console.log(params)

  const url = 'https://54285744-illusion-diffusion.gateway.alpha.fal.ai/'
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Key ${env('FALAI_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  }

  const response = await fetch(url, options)
  const data = await response.json()
  console.log(data)
  const result = responseSchema.parse(data)

  return NextResponse.json({
    url: result.image.url,
  })
}

const requestSchema = z.object({
  image_url: z.string().url(),
  prompt: z.string(),
  negative_prompt: z.string().optional(),
})

const responseSchema = z.object({
  image: z.object({
    url: z.string().url(),
  }),
})
