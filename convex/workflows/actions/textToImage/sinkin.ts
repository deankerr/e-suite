import { ConvexError } from 'convex/values'
import ky from 'ky'
import * as vb from 'valibot'

import { env } from '../../../shared/utils'

import type { EImageModel } from '../../../types'
import type { TextToImagePipelineInput } from '../../pipelines/textToImage'

const SuccessResponse = vb.object({
  inf_id: vb.string(),
  credit_cost: vb.number(),
  images: vb.array(vb.string()),
  error_code: vb.number(),
})

const ErrorResponse = vb.object({
  error_code: vb.number(),
  message: vb.string(),
})

const Response = vb.union([SuccessResponse, ErrorResponse])

const api = ky.extend({
  prefixUrl: 'https://sinkin.ai/m',
  timeout: 1000 * 60,
  retry: 0,
})

export const textToImage = async (
  args: TextToImagePipelineInput & { model: EImageModel | null },
) => {
  try {
    const { prompt, width = 512, height = 512, n = 1, model } = args

    if (!model) throw new Error('model not found')

    const body = new URLSearchParams()
    body.set('model_id', model.endpointModelId)
    body.set('prompt', prompt)
    body.set('width', String(width))
    body.set('height', String(height))
    body.set('num_images', String(n))
    body.set('access_token', env('SINKIN_API_KEY'))

    console.log('textToImage.sinkin.input', body)
    const response = await api
      .post('inference', {
        body,
      })
      .json()
    console.log('textToImage.sinkin.output', response)

    const result = vb.parse(Response, response)

    if ('images' in result) {
      return {
        imageUrls: result.images,
        output: result,
      }
    }

    // # content rejection error
    if (result.error_code === 41) {
      throw new ConvexError({
        message: result.message,
        code: 'endpoint_refused',
        fatal: true,
      })
    }

    throw new Error(result.message)
  } catch (err) {
    throw err
  }
}
