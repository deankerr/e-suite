import type { TextToImageConfig } from '../shared/types'

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
  parameters: TextToImageConfig
}) => Promise<TextToImageHandlerResult | TextToImageHandlerError>
