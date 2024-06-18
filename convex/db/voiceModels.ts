import * as OpenAi from '../endpoints/openai'
import { query } from '../functions'

export const getVoiceModelsHelper = () => {
  const models = OpenAi.getNormalizedVoiceModelData()
  return models
}

export const getModels = query({
  args: {},
  handler: async () => {
    return getVoiceModelsHelper()
  },
})
