'use node'

import ky from 'ky'

import { insist } from '../util'

export const getElevenlabsApiKey = () => {
  const apiKey = process.env.ELEVENLABS_API_KEY
  insist(apiKey, 'ELEVENLABS_API_KEY is undefined')
  return apiKey
}

export const tts = async () => {
  const text = 'I am speaking.'
  const voiceId = 'abcdefg'
  const modelId = 'abcdefg'

  const blob = await ky
    .post(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      headers: {
        Accept: 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': getElevenlabsApiKey(),
      },
      json: {
        text,
        model_id: modelId,
      },
      timeout: 2 * 60 * 1000,
    })
    .blob()
  blob
  // const storageId = await ctx.storage.store(blob)
}
