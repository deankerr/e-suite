'use node'

import { ConvexError } from 'convex/values'
import ky from 'ky'
import { Doc } from '../_generated/dataModel'
import { assert } from '../util'

export const getElevenlabsApiKey = () => {
  const apiKey = process.env.ELEVENLABS_API_KEY
  assert(apiKey, 'ELEVENLABS_API_KEY is undefined')
  return apiKey
}

export const createTextToSpeechRequest = async ({
  text,
  parameters,
}: {
  text: string
  parameters: Doc<'voiceovers'>['parameters']
}) => {
  if (!('elevenlabs' in parameters)) throw new ConvexError('invalid parameters')
  const { voice_id, model_id, voice_settings } = parameters.elevenlabs

  return await ky
    .post(`https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`, {
      headers: {
        Accept: 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': getElevenlabsApiKey(),
      },
      json: {
        text,
        voice_settings,
        model_id,
      },
    })
    .blob()
}
