import { query } from './functions'
import awsVoices from './providers/aws.voices.json'
import elabsVoices from './providers/elevenlabs.voices.json'

export const list = query({
  args: {},
  handler: async () => {
    return {
      aws: awsVoices
        .filter((voice) => voice.LanguageCode.startsWith('en-')) // english only for now
        .map((voice) => {
          return {
            id: voice.Id,
            name: voice.Name,
            gender: voice.Gender.toLowerCase(),
            language: voice.LanguageName,
          }
        }),
      elevenlabs: elabsVoices.voices.map((voice) => ({
        id: voice.voice_id,
        name: voice.name,
        gender: voice.labels.gender,
        language: voice.labels.accent,
      })),
    }
  },
})
