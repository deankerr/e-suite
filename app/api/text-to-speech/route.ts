import { writeFile } from 'node:fs/promises'
import { raise } from '@/lib/utils'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  console.log('text-to-speech')
  const params = requestSchema.parse(await request.json())
  console.log('params:', params)

  const body = {
    ...params,
    model_id: 'eleven_multilingual_v1',
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.5,
    },
  }
  const url = new URL('text-to-speech/21m00Tcm4TlvDq8ikWAM', elevenLabsBaseUrl)
  console.log('url', url)

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg',
      'xi-api-key': process.env.ELEVENLABS_API_KEY ?? raise('ELEVENLABS_API_KEY not provided'),
    },
    body: JSON.stringify(body),
  })
  console.log(response)

  if (!response.ok) throw new Error(`HTTP Error: ${response.status} ${response.statusText}`)
  const buffer = Buffer.from(await response.arrayBuffer())
  await writeFile('test.mp3', buffer)

  return NextResponse.json('yay?')
}

const elevenLabsBaseUrl = 'https://api.elevenlabs.io/v1/'
const elevenLabsModels = [
  'eleven_multilingual_v2',
  'eleven_multilingual_v1',
  'eleven_monolingual_v1',
]

const requestSchema = z.object({
  text: z.string(),
})
