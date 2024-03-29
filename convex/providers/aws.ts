'use node'

import { DescribeVoicesCommand, PollyClient, SynthesizeSpeechCommand } from '@aws-sdk/client-polly'
import { fromEnv } from '@aws-sdk/credential-providers'
import { v } from 'convex/values'

import { internal } from '../_generated/api'
import { internalAction } from '../_generated/server'
import { assert } from '../util'

import type { SynthesizeSpeechCommandInput } from '@aws-sdk/client-polly'

const client = new PollyClient({ region: 'us-east-1', credentials: fromEnv() })

export const textToSpeech = internalAction({
  args: {
    speechId: v.id('speech'),
  },
  handler: async (ctx, { speechId }) => {
    const speech = await ctx.runQuery(internal.speech.get, { id: speechId })
    assert(speech, 'Invalid speech id')
    assert(speech.parameters.provider === 'aws', 'Invalid parameters')

    const client = new PollyClient({ region: 'us-east-1', credentials: fromEnv() })
    const { VoiceId, Engine } = speech.parameters
    const { text } = speech

    const response = await client.send(
      new SynthesizeSpeechCommand({
        OutputFormat: 'mp3',
        Text: text,
        TextType: 'text',
        VoiceId: VoiceId as SynthesizeSpeechCommandInput['VoiceId'],
        Engine,
      }),
    )

    assert(response.AudioStream, 'aws response missing AudioStream', { data: response.$metadata })
    const arrayBuffer = await response.AudioStream.transformToByteArray()
    const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' })
    const storageId = await ctx.storage.store(blob)

    await ctx.runMutation(internal.speech.updateStorageId, { id: speechId, storageId })
    return 0
  },
})

export const getVoicesList = internalAction(async () => {
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
})

export const voices = {
  aws_olivia: {
    Gender: 'Female',
    Id: 'Olivia',
    LanguageCode: 'en-AU',
    LanguageName: 'Australian English',
    Name: 'Olivia',
    SupportedEngines: ['neural'],
  },
  aws_emma: {
    Gender: 'Female',
    Id: 'Emma',
    LanguageCode: 'en-GB',
    LanguageName: 'British English',
    Name: 'Emma',
    SupportedEngines: ['neural', 'standard'],
  },
  aws_brian: {
    Gender: 'Male',
    Id: 'Brian',
    LanguageCode: 'en-GB',
    LanguageName: 'British English',
    Name: 'Brian',
    SupportedEngines: ['neural', 'standard'],
  },
  aws_niamh: {
    Gender: 'Female',
    Id: 'Niamh',
    LanguageCode: 'en-IE',
    LanguageName: 'Irish English',
    Name: 'Niamh',
    SupportedEngines: ['neural'],
  },
  aws_raveena: {
    Gender: 'Female',
    Id: 'Raveena',
    LanguageCode: 'en-IN',
    LanguageName: 'Indian English',
    Name: 'Raveena',
    SupportedEngines: ['standard'],
  },
  aws_gregory: {
    Gender: 'Male',
    Id: 'Gregory',
    LanguageCode: 'en-US',
    LanguageName: 'US English',
    Name: 'Gregory',
    SupportedEngines: ['long-form', 'neural'],
  },
  aws_justin: {
    Gender: 'Male',
    Id: 'Justin',
    LanguageCode: 'en-US',
    LanguageName: 'US English',
    Name: 'Justin',
    SupportedEngines: ['neural', 'standard'],
  },
  aws_ivy: {
    Gender: 'Female',
    Id: 'Ivy',
    LanguageCode: 'en-US',
    LanguageName: 'US English',
    Name: 'Ivy',
    SupportedEngines: ['neural', 'standard'],
  },
  aws_ayanda: {
    Gender: 'Female',
    Id: 'Ayanda',
    LanguageCode: 'en-ZA',
    LanguageName: 'South African English',
    Name: 'Ayanda',
    SupportedEngines: ['neural'],
  },
}
