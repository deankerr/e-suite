const newAppErrorCodes = {
  unknown: {
    code: 'unknown',
    httpStatusCode: 500,
  },

  unauthenticated: {
    httpStatusCode: 401,
  },

  unauthorized: {
    httpStatusCode: 403,
  },

  request_json_malformed: {
    code: 'request_json_malformed',
    httpStatusCode: 400,
  },

  vendor_method_not_supported: {
    code: 'vendor_method_not_supported',
    httpStatusCode: 400,
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

  vendor_response_error: {
    code: 'vendor_response_error',
    httpStatusCode: 502,
  },

  vendor_content_rejection: {
    httpStatusCode: 400,
  },
} as const

type NewAppErrorCodes = keyof typeof newAppErrorCodes

export class NewAppError extends Error {
  readonly code: NewAppErrorCodes
  readonly httpStatusCode: number
  readonly context: Record<string, unknown> | undefined

  constructor(code: NewAppErrorCodes, options?: { description?: string; cause?: unknown }) {
    super(options?.description, { cause: options?.cause })
    Object.setPrototypeOf(this, new.target.prototype)

    this.code = code
    this.httpStatusCode = newAppErrorCodes[code].httpStatusCode
    this.context = options

    Error.captureStackTrace(this)
  }
}
