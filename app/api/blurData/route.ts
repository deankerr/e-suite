import { Buffer } from 'node:buffer'
import { NextRequest, NextResponse } from 'next/server'
import { getPlaiceholder } from 'plaiceholder'
import z from 'zod'

export const POST = async (request: NextRequest) => {
  if (request.headers.get('Authorization') !== process.env.APP_BLURDATA_KEY) {
    return Response.json('Unauthorized', { status: 401 })
  }

  const json = await request.json()
  const { urls } = z.object({ urls: z.string().url().array() }).parse(json)

  const results = await Promise.all(
    urls.map(async (url) => {
      try {
        const blob = await fetch(url)
        const data = await getPlaiceholder(Buffer.from(await blob.arrayBuffer()))
        return { data }
      } catch (err) {
        console.error(err)
        return { error: err }
      }
    }),
  )

  return Response.json(results)
}
