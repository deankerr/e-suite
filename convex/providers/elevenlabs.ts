'use node'

import { v } from 'convex/values'
import ky from 'ky'

import { internal } from '../_generated/api'
import { internalAction } from '../_generated/server'
import { assert } from '../util'

export const getElevenlabsApiKey = () => {
  const apiKey = process.env.ELEVENLABS_API_KEY
  assert(apiKey, 'ELEVENLABS_API_KEY is undefined')
  return apiKey
}

export const textToSpeech = internalAction({
  args: {
    speechId: v.id('speech'),
  },
  handler: async (ctx, { speechId }) => {
    const speech = await ctx.runQuery(internal.speech.get, { id: speechId })
    assert(speech, 'Invalid speech id')
    assert(speech.parameters.provider === 'elevenlabs', 'Invalid parameters')

    const { voice_id, model_id } = speech.parameters
    const { text } = speech

    const blob = await ky
      .post(`https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`, {
        headers: {
          Accept: 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': getElevenlabsApiKey(),
        },
        json: {
          text,
          model_id,
        },
        timeout: 2 * 60 * 1000,
      })
      .blob()
    const storageId = await ctx.storage.store(blob)

    await ctx.runMutation(internal.speech.updateStorageId, { id: speechId, storageId })
    return 0
  },
})
