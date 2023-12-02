export class AppError extends Error {
  public readonly code: AppErrorCode
  public readonly debug: any
  constructor(code: AppErrorCode, message: string, debug?: any) {
    super(message)
    this.code = code
    this.debug = debug
  }
}

export const appErrorCodes = {
  internal: 'internal',
  unauthorized: 'unauthorized',
  not_found: 'not_found',
  invalid_input: 'invalid_input',
  unknown_vender_response: 'unknown_vender_response',
} as const

export type AppErrorCode = keyof typeof appErrorCodes
