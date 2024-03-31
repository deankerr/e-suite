'use node'

import { DescribeVoicesCommand, PollyClient, SynthesizeSpeechCommand } from '@aws-sdk/client-polly'
import { fromEnv } from '@aws-sdk/credential-providers'

import type { SynthesizeSpeechCommandInput } from '@aws-sdk/client-polly'

export const tts = async () => {
  const text = 'I am speaking.'
  const voiceId = 'Nicole'
  const engine = 'neural'

  const client = new PollyClient({ region: 'us-east-1', credentials: fromEnv() })

  const response = await client.send(
    new SynthesizeSpeechCommand({
      OutputFormat: 'mp3',
      Text: text,
      TextType: 'text',
      VoiceId: voiceId as SynthesizeSpeechCommandInput['VoiceId'],
      Engine: engine,
    }),
  )

  if (!response.AudioStream) throw new Error('aws response missing AudioStream')
  const arrayBuffer = await response.AudioStream.transformToByteArray()
  new Blob([arrayBuffer], { type: 'audio/mpeg' })
  // const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' })
  // const storageId = await ctx.storage.store(blob)
}

export const getVoicesList = async () => {
  const client = new PollyClient({ region: 'us-east-1', credentials: fromEnv() })

  const { Voices } = await client.send(new DescribeVoicesCommand({}))
  if (Voices) {
    console.log(
      JSON.stringify(
        Voices.sort((a, b) =>
          a.LanguageCode && b.LanguageCode ? (a.LanguageCode < b.LanguageCode ? -1 : 1) : 0,
        ),
      ),
    )
  }
}
