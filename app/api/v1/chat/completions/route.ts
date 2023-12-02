import { getUserSession } from '@/data/auth'
import { AppError, AppErrorCode, appErrorCodes } from '@/lib/error'
import { openaiPlugin } from '@/plugins/openai.plugin'
import { openrouterPlugin } from '@/plugins/openrouter.plugin'
import { createChatApiSchema } from '@/schema/v1/chat'
import { ZodError } from 'zod'
import { fromZodError } from 'zod-validation-error'

export async function POST(request: Request) {
  try {
    const user = await getUserSession()
    const reqJSON = await request.json()
    console.log('reqJSON', reqJSON)

    const requestData = createChatApiSchema.parse(reqJSON)

    if (requestData.vendorId === 'openai') return await openaiPlugin.chat(requestData)
    if (requestData.vendorId === 'openrouter') return await openrouterPlugin.chat(requestData)
    return getErrorResponse.badRequest()
  } catch (err) {
    if (err instanceof AppError) {
      if (err.code === 'unauthorized') return getErrorResponse.unauthorized(err)
    }

    if (err instanceof ZodError) {
      const { message, name, details } = fromZodError(err)
      console.error(fromZodError(err))
      return getErrorResponse.badRequest({
        code: 'invalid_input',
        name,
        message,
        debug: details,
      })
    }

    return getErrorResponse.unknown()
  }
}

type createErrorData = {
  code?: AppErrorCode
  name?: string
  message?: string
  debug?: unknown
}

const getErrorResponse = {
  badRequest: (err?: createErrorData) => Response.json({ ...err }, { status: 400 }),
  unauthorized: (err?: createErrorData) => Response.json({ ...err }, { status: 401 }),
  unknown: (err?: createErrorData) =>
    Response.json({ ...err, message: 'An unknown/unhandled error occurred.' }, { status: 500 }),
}
