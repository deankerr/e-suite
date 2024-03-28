import { query } from './functions'
import awsVoices from './providers/aws.voices.json'
import elabsVoices from './providers/elevenlabs.voices.json'
import { Collection } from './types'

export type Voice = {
  id: string
  name: string
  gender: string
  language: string
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
              id: voice.Id,
              name: voice.Name,
              gender: voice.Gender.toLowerCase(),
              language: voice.LanguageName,
            }
          }),
      },
      {
        id: 'elabs',
        name: 'ElevenLabs',
        group: elabsVoices.voices.map((voice) => ({
          id: voice.voice_id,
          name: voice.name,
          gender: voice.labels.gender,
          language: voice.labels.accent,
        })),
      },
    ]
  },
})
