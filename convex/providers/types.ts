import type { GenerationParameters } from '../threads/schema'

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
  parameters: GenerationParameters
  n: number
}) => Promise<TextToImageHandlerResult | TextToImageHandlerError>
