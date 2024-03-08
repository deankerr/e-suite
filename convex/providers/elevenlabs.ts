import { assert } from '../util'

export const getElevenlabsApiKey = () => {
  const apiKey = process.env.ELEVENLABS_API_KEY
  assert(apiKey, 'ELEVENLABS_API_KEY is undefined')
  return apiKey
}
