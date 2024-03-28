import z from 'zod'

import { textToSpeechProviders } from './constants'
import { query } from './functions'
import awsVoices from './providers/aws.voices.json'
import elabsVoices from './providers/elevenlabs.voices.json'
import { assert, createError } from './util'

import type { Collection } from './types'

export type Voice = {
  id: string
  name: string
  gender: string
  language: string
}

export const getVoiceRefParameters = (voiceRef: string) => {
  const [provider, voiceId] = z
    .tuple([z.enum(textToSpeechProviders), z.string().min(1)])
    .parse(voiceRef.split('/'))

  if (provider === 'aws') {
    const record = awsVoices.find((voice) => voice.Id === voiceId)
    assert(record, 'Invalid voice ref')

    return {
      provider,
      VoiceId: voiceId,
      Engine: record.SupportedEngines.includes('neural')
        ? ('neural' as const)
        : ('standard' as const),
    }
  }

  if (provider === 'elevenlabs') {
    const record = elabsVoices.voices.find((voice) => voice.voice_id === voiceId)
    assert(record, 'Invalid voice ref')

    return {
      provider,
      voice_id: voiceId,
      model_id: record.high_quality_base_model_ids[0] ?? ('eleven_multilingual_v2' as const),
    }
  }

  throw createError({ message: 'Invalid voice ref', isOperational: false })
}

export const list = query({
  args: {},
  handler: async (): Promise<Collection<Voice>> => {
    return [
      {
        id: 'aws',
        name: 'Amazon Polly',
        group: awsVoices
          .filter((voice) => voice.LanguageCode.startsWith('en-')) // english only for now
          .map((voice) => {
            return {
              id: `aws/${voice.Id}`,
              name: voice.Name,
              gender: voice.Gender.toLowerCase(),
              language: voice.LanguageName,
            }
          }),
      },
      {
        id: 'elevenlabs',
        name: 'ElevenLabs',
        group: elabsVoices.voices.map((voice) => ({
          id: `elevenlabs/${voice.voice_id}`,
          name: voice.name,
          gender: voice.labels.gender,
          language: voice.labels.accent,
        })),
      },
    ]
  },
})
