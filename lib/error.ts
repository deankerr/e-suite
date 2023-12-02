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
  invalid_client_request: 'invalid_client_request',
  invalid_vendor_response: 'invalid_vendor_response',
} as const

export type AppErrorCode = keyof typeof appErrorCodes
