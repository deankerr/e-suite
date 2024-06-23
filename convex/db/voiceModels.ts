import AwsVoicesJson from '../endpoints/aws.voices.json'
import * as ElevenLabs from '../endpoints/elevenlabs'
import * as OpenAi from '../endpoints/openai'
import { query } from '../functions'

export const getVoiceModels = () => {
  const models = [
    OpenAi.getNormalizedVoiceModelData(),
    AwsVoicesJson.filter((data) => data.LanguageCode.startsWith('en-')).map((data) => ({
      resourceKey: `aws::${data.Id}`,
      endpoint: 'aws',
      endpointModelId: data.Id,
      name: data.Name,
      creatorName: 'AWS Polly',
      accent: data.LanguageName,
      gender: data.Gender,
    })),
    ElevenLabs.getVoiceModelData(),
  ].flat()
  return models
}

export const list = query({
  args: {},
  handler: async () => {
    return getVoiceModels()
  },
})
