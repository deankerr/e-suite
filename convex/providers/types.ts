import type { GenerationInputParams } from '../schema'

export type TextToImageHandlerResult = {
  result: { urls: string[] } & Record<string, any>
  error: null
}

export type TextToImageHandlerError = {
  error: {
    message: string
    noRetry?: boolean
    data?: any
  }
  result: null
}

export type TextToImageHandler = (args: {
  parameters: GenerationInputParams
  n: number
}) => Promise<TextToImageHandlerResult | TextToImageHandlerError>
