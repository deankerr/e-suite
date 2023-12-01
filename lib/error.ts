export class _deprecated_AppError extends Error {
  constructor(message: string) {
    super(message)
  }
}

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
  unauthorized: 'unauthorized',
  not_found: 'not_found',
} as const

export type AppErrorCode = keyof typeof appErrorCodes
