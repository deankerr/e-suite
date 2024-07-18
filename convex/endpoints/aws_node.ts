'use node'

import { PollyClient, SynthesizeSpeechCommand } from '@aws-sdk/client-polly'
import { fromEnv } from '@aws-sdk/credential-providers'

import { internalAction } from '../functions'
import AwsVoicesJson from './aws.voices.json'

import type { SynthesizeSpeechCommandInput } from '@aws-sdk/client-polly'

// const fallbackConfig = {VoiceId: 'Nicole', Engine: 'standard'} as const

export const textToSpeech = internalAction(
  async (ctx, { text, endpointModelId }: { text: string; endpointModelId: string }) => {
    const voiceId = endpointModelId
    const engine = AwsVoicesJson.find((v) => v.Id === endpointModelId)?.SupportedEngines.includes(
      'neural',
    )
      ? 'neural'
      : 'standard'

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
    const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' })
    const fileId = await ctx.storage.store(blob)
    return fileId
  },
)
