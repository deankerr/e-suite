import * as falClient from '@fal-ai/serverless-client'
import { ConvexError } from 'convex/values'

import * as FastLightningSdxl from './fal/fast_lightning_sdxl'
import * as HyperSdxl from './fal/hyper_sdxl'
import * as SDLora from './fal/lora'
import * as PixartSigma from './fal/pixart_sigma'

import type { GenerationParameters } from '../threads/schema'
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
  parameters: GenerationParameters
  n: number
}) => {
  try {
    const { model_id, size, prompt, entries } = parameters
    if (!(model_id in textToImageModels))
      throw new ConvexError({ message: 'unsupported model', model_id })

    const parsers = textToImageModels[model_id as keyof typeof textToImageModels]

    const mapped = Object.fromEntries(entries)

    //TODO temp - some schemas expect strings instead of numbers
    const stepsI = entries.findIndex(([key]) => key === 'num_inference_steps')
    if (
      stepsI >= 0 &&
      (model_id === 'fal-ai/hyper-sdxl' || model_id === 'fal-ai/fast-lightning-sdxl')
    ) {
      mapped['num_inference_steps'] = String(mapped['num_inference_steps'])
    }

    //* sd with loras
    if (model_id === 'fal-ai/lora' && mapped._lora_path) {
      const loras = [{ path: mapped._lora_path, scale: mapped._lora_scale ?? 0.75 }]
      mapped.loras = loras as any
    }

    //* explicitly set bools to false if not present
    mapped.expand_prompt ??= false
    mapped.enable_safety_checker ??= false

    const parsedInput = parsers.body.safeParse({
      ...mapped,
      prompt,
      image_size: size,
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
    console.log('[fal/textToImage] >>>', model_id, input)

    const response = await falClient.subscribe(model_id, {
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
