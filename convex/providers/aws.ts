'use node'

import {
  DescribeVoicesCommand,
  ListLexiconsCommand,
  PollyClient,
  SynthesizeSpeechCommand,
} from '@aws-sdk/client-polly'
import { fromEnv } from '@aws-sdk/credential-providers'
import { internalAction } from '../_generated/server'

const client = new PollyClient({ region: 'us-east-1', credentials: fromEnv() })

export const listLexicons = internalAction(async () => {
  const lexicons = await client.send(new ListLexiconsCommand({}))
  console.log('lexicons')
  console.log(lexicons)
})

export const demoSpeech = internalAction(async () => {
  const data = await client.send(
    new SynthesizeSpeechCommand({
      OutputFormat: 'mp3',
      Text: 'Hi there, my name is Olivia. I will read any text you type here.',
      TextType: 'text',
      VoiceId: 'Olivia',
      Engine: 'neural',
    }),
  )
  console.log(data)
})

export const describeVoices = internalAction(async () => {
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
