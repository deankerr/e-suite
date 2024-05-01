import * as falClient from '@fal-ai/serverless-client'
import { ConvexError } from 'convex/values'
import * as R from 'remeda'

import * as FastLightningSdxl from './fal/fast_lightning_sdxl'
import * as HyperSdxl from './fal/hyper_sdxl'
import * as PixartSigma from './fal/pixart_sigma'

import type { GenerationInputParams } from '../schema'
import type { TextToImageHandler } from './types'

//* Model config
const textToImageModels = {
  'fal-ai/hyper-sdxl': {
    body: HyperSdxl.textToImagePostBody,
    response: HyperSdxl.textToImagePostResponse,
  },
  'fal-ai/fast-lightning-sdxl': {
    body: FastLightningSdxl.textToImagePostBody,
    response: FastLightningSdxl.textToImagePostResponse,
  },
  'fal-ai/pixart-sigma': {
    body: PixartSigma.generateImagePostBody,
    response: PixartSigma.generateImagePostResponse,
  },
} as const

falClient.config({
  credentials: process.env.FAL_API_KEY!,
})

export const textToImage: TextToImageHandler = async ({
  parameters,
  n,
}: {
  parameters: GenerationInputParams
  n: number
}) => {
  try {
    const { model_id } = parameters
    if (!(model_id in textToImageModels))
      throw new ConvexError({ message: 'unsupported model', model_id })

    const parsers = textToImageModels[model_id as keyof typeof textToImageModels]
    const translated = R.swapProps(
      parameters as Record<string, any>,
      'steps',
      'num_inference_steps',
    )

    const parsedInput = parsers.body.safeParse(translated)
    if (!parsedInput.success) {
      return {
        error: {
          message: 'input validation failed',
          noRetry: true,
          data: parsedInput.error.issues,
        },
        result: null,
      }
    }

    const input = { ...parsedInput.data, num_images: n }
    console.log('[fal/textToImage] >>>', input)

    const response = await falClient.subscribe('fal-ai/hyper-sdxl', {
      input,
    })
    console.log('[fal/textToImage] <<<', response)

    const parsedResult = parsers.response.safeParse(response)
    if (!parsedResult.success) {
      return {
        error: {
          message: 'response validation failed',
          noRetry: true,
          data: parsedResult.error.issues,
        },
        result: null,
      }
    }

    const urls = parsedResult.data.images.map((image) => image.url)
    return {
      result: { ...parsedResult.data, urls },
      error: null,
    }
  } catch (err) {
    if (err instanceof falClient.ApiError) {
      console.error(err, err.body)
      const detail =
        typeof err.body?.detail === 'string'
          ? err.body?.detail
          : JSON.stringify(err.body?.detail ?? {})
      return {
        result: null,
        error: {
          message: `${err.name}: ${err.message} - ${detail}`,
          noRetry: true,
        },
      }
    }
    console.error(err)
    if (err instanceof Error) {
      return {
        result: null,
        error: {
          message: `${err.name}: ${err.message}`,
        },
      }
    }

    return {
      result: null,
      error: {
        message: 'Unknown error',
      },
    }
  }
}

export const fal = {
  textToImage,
}
