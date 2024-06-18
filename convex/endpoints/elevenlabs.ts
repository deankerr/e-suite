import ky from 'ky'

import { ActionCtx } from '../_generated/server'
import { insist } from '../shared/utils'
import ElevenLabsVoicesJson from './elevenlabs.voices.json'

export const getElevenlabsApiKey = () => {
  const apiKey = process.env.ELEVENLABS_API_KEY
  insist(apiKey, 'ELEVENLABS_API_KEY is undefined')
  return apiKey
}

export const textToSpeech = async (
  ctx: ActionCtx,
  { text, endpointModelId: voice_id }: { text: string; endpointModelId: string },
) => {
  try {
    const apiKey = getElevenlabsApiKey()
    const blob = await ky
      .post(`https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`, {
        headers: {
          'xi-api-key': apiKey,
        },
        json: {
          text,
          model_id: 'eleven_turbo_v2',
        },
        timeout: 2 * 60 * 1000,
      })
      .blob()

    const fileId = await ctx.storage.store(blob)
    return fileId
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message)
      console.log(err.stack, err.cause, err.name)
    }

    console.error(err)
    throw err
  }
}

export const getVoiceModelData = () => {
  return ElevenLabsVoicesJson.voices.map((voice) => ({
    resourceKey: `elevenlabs::${voice.voice_id}`,
    endpointModelId: voice.voice_id,
    name: voice.name,
    creatorName: 'ElevenLabs',
    endpoint: 'elevenlabs',
  }))
}
