import { writeFile } from 'node:fs/promises'
import { env, raise } from '@/lib/utils'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  console.log('POST text-to-speech')
  const { provider, ...params } = requestSchema.parse(await request.json())

  switch (provider) {
    case 'elevenlabs':
      return await elevenlabs(params)
    default:
      throw new Error(`unsupported provider: ${provider}`)
  }
}

async function elevenlabs(params: TtsParams) {
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
      'xi-api-key': env('ELEVENLABS_API_KEY'),
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
  provider: z.string(),
  text: z.string(),
})
type RequestSchema = z.infer<typeof requestSchema>
type TtsParams = Omit<RequestSchema, 'provider'>
