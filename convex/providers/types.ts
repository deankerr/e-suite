import type { ETextToImageInference } from '../shared/structures'

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
  parameters: ETextToImageInference
}) => Promise<TextToImageHandlerResult | TextToImageHandlerError>
