import { env, logger } from '@/lib/utils'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const log = logger.child({ api: 'image/illusion' }, { msgPrefix: '[API/ILLUSION] ' })

export async function POST(request: NextRequest) {
  log.info('POST image/illusion')
  const params = requestSchema.parse(await request.json())
  log.info(params, 'parameters')

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
  const result = responseSchema.parse(data)
  log.info(result, 'result')

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
