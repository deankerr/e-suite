import { fal } from '@/lib/providers'
import { logger } from '@/lib/utils'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const log = logger.child({}, { msgPrefix: '[api/image/illusion] ' })

export async function POST(request: NextRequest) {
  log.info('POST image/illusion')
  const params = requestSchema.parse(await request.json())
  log.info(params, 'params')

  const result = await fal.illusion(params)
  log.info(result, 'result')

  return NextResponse.json(result)
}

const requestSchema = z.object({
  image_url: z.string().url(),
  prompt: z.string(),
  negative_prompt: z.string().optional(),
})
