import ky from 'ky'
import * as vb from 'valibot'

import { ENV } from '../../../lib/env'
import { env } from '../../../shared/utils'
import { WorkflowError } from '../../helpers'

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
  const { prompt, width = 512, height = 512, n = 1, model } = args

  if (!model) throw new WorkflowError('model data required', 'model_data_required', true)

  const body = new URLSearchParams()
  body.set('model_id', model.endpointModelId)
  body.set('prompt', prompt)
  body.set('width', String(width))
  body.set('height', String(height))
  body.set('num_images', String(n))
  body.set('access_token', ENV.SINKIN_API_KEY)

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

  // # content rejection error, abort
  if (result.error_code === 41) {
    throw new WorkflowError(result.message, 'endpoint_refused', true)
  }

  throw new WorkflowError(result.message, 'endpoint_error', false)
}
