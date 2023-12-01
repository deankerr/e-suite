export class AppCodeError extends Error {
  public readonly code: AppErrorCode
  public readonly debug: any
  constructor(code: AppErrorCode, message: string, debug?: any) {
    super(message)
    this.code = code
    this.debug = debug
  }
}

const appErrorCodes = {
  internal: 'internal',
  unauthorized: 'unauthorized',
  not_found: 'not_found',
  invalid_input: 'invalid_input',
} as const

export type AppErrorCode = keyof typeof appErrorCodes
