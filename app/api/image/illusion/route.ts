import { illusion } from '@/lib/provider/fal/'
import { logger } from '@/lib/utils'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const log = logger.child({}, { msgPrefix: '[API/ILLUSION] ' })

export async function POST(request: NextRequest) {
  log.info('POST image/illusion')
  const params = requestSchema.parse(await request.json())
  log.info('%o', params)

  const result = await illusion(params)
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
