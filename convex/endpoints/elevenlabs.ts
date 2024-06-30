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
  return [
    ...ElevenLabsVoicesJson.voices.map((voice) => ({
      resourceKey: `elevenlabs::${voice.voice_id}`,
      endpointModelId: voice.voice_id,
      name: voice.name,
      creatorName: 'ElevenLabs',
      endpoint: 'elevenlabs',
      accent: voice.labels.accent,
      gender: voice.labels.gender,
    })),
    ...customVoices,
  ]
}

const customVoices = [
  {
    resourceKey: 'elevenlabs::93mdWNEl4OgOfPEIGf9G',
    endpointModelId: '93mdWNEl4OgOfPEIGf9G',
    name: 'Russell Brand',
    creatorName: 'ElevenLabs',
    endpoint: 'elevenlabs',
    accent: 'British',
    gender: 'Male',
  },
  {
    resourceKey: 'elevenlabs::LOXLsai008fkodRE9NJ9',
    endpointModelId: 'LOXLsai008fkodRE9NJ9',
    name: 'JC Denton',
    creatorName: 'ElevenLabs',
    endpoint: 'elevenlabs',
    accent: 'American',
    gender: 'Male',
  },
  {
    resourceKey: 'elevenlabs::QtNaZ74f9KgOviNdPqgJ',
    endpointModelId: 'QtNaZ74f9KgOviNdPqgJ',
    name: 'Roger The Alien',
    creatorName: 'ElevenLabs',
    endpoint: 'elevenlabs',
    accent: 'American',
    gender: 'Male',
  },
  {
    resourceKey: 'elevenlabs::WJ59VcEA1rqrPDvjJQ23',
    endpointModelId: 'WJ59VcEA1rqrPDvjJQ23',
    name: 'Hank Hill',
    creatorName: 'ElevenLabs',
    endpoint: 'elevenlabs',
    accent: 'American',
    gender: 'Male',
  },
  {
    resourceKey: 'elevenlabs::iWkxbWX4HfF4h5W74WhN',
    endpointModelId: 'iWkxbWX4HfF4h5W74WhN',
    name: 'Lois Griffin',
    creatorName: 'ElevenLabs',
    endpoint: 'elevenlabs',
    accent: 'American',
    gender: 'Female',
  },
]

export const soundGeneration = async (ctx: ActionCtx, { text }: { text: string }) => {
  try {
    const apiKey = getElevenlabsApiKey()
    const blob = await ky
      .post(`https://api.elevenlabs.io/v1/sound-generation`, {
        headers: {
          'xi-api-key': apiKey,
        },
        json: {
          text,
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
