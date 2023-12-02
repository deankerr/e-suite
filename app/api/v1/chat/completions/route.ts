import { getUserSession, UserSession } from '@/data/auth'
import { AppError, AppErrorCode } from '@/lib/error'
import { openaiPlugin } from '@/plugins/openai.plugin'
import { openrouterPlugin } from '@/plugins/openrouter.plugin'
import { togetheraiPlugin } from '@/plugins/togetherai.plugin'
import { messageSchema, roleSchema } from '@/schema/message'
import { createChatApiSchema } from '@/schema/v1/chat'
import { vendorIdSchema } from '@/schema/vendor'
import z, { ZodError } from 'zod'
import { fromZodError } from 'zod-validation-error'

export async function POVST(request: Request) {
  try {
    const user = await getUserSession()
    const reqJSON = await request.json()
    console.log('reqJSON', reqJSON)

    const requestData = createChatApiSchema.parse(reqJSON)

    if (requestData.vendorId === 'openai') return await openaiPlugin.chat(requestData)
    if (requestData.vendorId === 'openrouter') return await openrouterPlugin.chat(requestData)
    if (requestData.vendorId === 'togetherai') return await togetheraiPlugin.chat(requestData)
    return getErrorResponse.badRequest()
  } catch (err) {
    if (err instanceof AppError) {
      if (err.code === 'unauthorized') return getErrorResponse.unauthorized(err)
    }

    if (err instanceof ZodError) {
      const { message, name, details } = fromZodError(err)
      console.error(fromZodError(err))
      return getErrorResponse.badRequest({
        code: 'invalid_client_request',
        name,
        message,
        debug: details,
      })
    }

    return getErrorResponse.unknown()
  }
}

//* Request
const chatRouteRequestSchema = z
  .object({
    vendorId: vendorIdSchema,
    engineId: z.string().min(1), // temp
    model: z.string().min(1), // to be sent to vendor api
    messages: messageSchema.array().min(1),
  })
  .passthrough()

//* Response
//^ non-streaming non-web ui only?
const choicesSchema = z.array(
  z.object({
    index: z.number(),
    message: z.object({
      content: z.string(),
      role: roleSchema,
      tool_calls: z.unknown(), // TODO
      function_call: z.unknown(), // TODO
    }),
    finish_reason: z.string(),
  }),
)

const usageSchema = z.object({
  prompt_tokens: z.number(),
  completion_tokens: z.number(),
  total_tokens: z.number(),
})

export const chatCompletionApiResponseSchema = z.object({
  id: z.string(),
  object: z.string(),
  created: z.number(),
  model: z.string(),
  system_fingerprint: z.string(),
  choices: choicesSchema,
  usage: usageSchema,
})

type ProtectedRoute<ZReq extends z.ZodTypeAny, ZRes extends z.ZodTypeAny> = (
  input: z.infer<ZReq>,
  user: UserSession,
) => Promise<z.infer<ZRes>>

function createProtectedRoute<ZReq extends z.ZodTypeAny, ZRes extends z.ZodTypeAny>({
  inputSchema,
  handler,
  outputSchema,
}: {
  inputSchema: ZReq
  handler: (input: z.infer<ZReq>, user: UserSession) => Promise<z.infer<ZRes>>
  outputSchema: ZRes
}): ProtectedRoute<ZReq, ZRes> {
  return async function protectedRoute(request) {
    try {
      const user = await getUserSession()
      const parsedInput = inputSchema.parse(await request.json())
      const result = await handler(parsedInput, user)
      return outputSchema.parse(result)
    } catch (err) {
      console.error(err)
      if (err instanceof AppError) {
        if (err.code === 'unauthorized') return getErrorResponse.unauthorized(err)
      }

      if (err instanceof ZodError) {
        const { message, name, details } = fromZodError(err)

        return getErrorResponse.badRequest({
          code: 'invalid_client_request',
          name,
          message,
          debug: details,
        })
      }

      return getErrorResponse.unknown()
    }
  }
}

export const POST = createProtectedRoute({
  inputSchema: chatRouteRequestSchema,
  handler: async (input, user) => {
    if (input.vendorId === 'openai') return await openaiPlugin.chat(input)
    if (input.vendorId === 'openrouter') return await openrouterPlugin.chat(input)
    if (input.vendorId === 'togetherai') return await togetheraiPlugin.chat(input)
    return getErrorResponse.badRequest()
  },
  outputSchema: z.any(), // StreamingTextResponse / chat completion?
})

//* Errors
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
