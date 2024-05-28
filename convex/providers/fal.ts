import * as falClient from '@fal-ai/serverless-client'
import { ConvexError } from 'convex/values'

import * as FastLightningSdxl from './fal/fast_lightning_sdxl'
import * as HyperSdxl from './fal/hyper_sdxl'
import * as SDLora from './fal/lora'
import * as PixartSigma from './fal/pixart_sigma'

import type { ETextToImageInference } from '../shared/structures'
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
  'fal-ai/lora': {
    body: SDLora.textToImagePostBody,
    response: SDLora.textToImagePostResponse,
  },
} as const

falClient.config({
  credentials: process.env.FAL_API_KEY!,
})

export const textToImage: TextToImageHandler = async ({
  parameters,
  n,
}: {
  parameters: ETextToImageInference['parameters']
  n: number
}) => {
  try {
    const { model, width, height, prompt } = parameters
    if (!(model in textToImageModels))
      throw new ConvexError({ message: 'unsupported model', model })

    const parsers = textToImageModels[model as keyof typeof textToImageModels]

    // const mapped = Object.fromEntries(entries)

    const image_size = { width, height }

    //TODO temp - some schemas expect strings instead of numbers
    // const stepsI = entries.findIndex(([key]) => key === 'num_inference_steps')
    // if (stepsI >= 0 && (model === 'fal-ai/hyper-sdxl' || model === 'fal-ai/fast-lightning-sdxl')) {
    //   mapped['num_inference_steps'] = String(mapped['num_inference_steps'])
    // }

    //* explicitly set bools to false if not present
    // mapped.expand_prompt ??= false
    // mapped.enable_safety_checker ??= false

    const parsedInput = parsers.body.safeParse({
      prompt,
      image_size,
      num_images: n,
    })
    if (!parsedInput.success) {
      console.error(parsedInput.error.issues)
      return {
        error: {
          message: '(pre-request) input validation failed',
          noRetry: true,
          data: parsedInput.error.issues,
        },
        result: null,
      }
    }

    const input = parsedInput.data
    console.log('[fal/textToImage] >>>', model, input)

    const response = await falClient.subscribe(model, {
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
