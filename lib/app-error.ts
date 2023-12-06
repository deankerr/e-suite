const newAppErrorCodes = {
  unknown: {
    code: 'unknown',
    httpStatusCode: 500,
  },

  unauthorized: {
    code: 'unauthorized',
    httpStatusCode: 401,
  },

  validation_client_request: {
    code: 'validation_client_request',
    httpStatusCode: 400,
  },

  validation_vendor_request: {
    code: 'validation_vendor_request',
    httpStatusCode: 400,
  },

  validation_vendor_response: {
    code: 'validation_vendor_response',
    httpStatusCode: 502,
  },
} as const

type NewAppErrorCodes = keyof typeof newAppErrorCodes

export class NewAppError extends Error {
  readonly code: NewAppErrorCodes
  readonly httpStatusCode: number

  constructor(code: NewAppErrorCodes, options?: { description?: string; cause?: unknown }) {
    super(options?.description, { cause: options?.cause })
    Object.setPrototypeOf(this, new.target.prototype)

    this.code = code
    this.httpStatusCode = newAppErrorCodes[code].httpStatusCode

    Error.captureStackTrace(this)
  }
}
