import { authenticateApiRequest, UserSession } from '@/data/auth'
import { AppError } from '@/lib/error'
import z, { ZodError } from 'zod'
import { fromZodError } from 'zod-validation-error'

type ApiAuth =
  | {
      token: true
    }
  | { user: UserSession }

export type ProtectedRoute<ZReq extends z.ZodTypeAny, ZRes extends z.ZodTypeAny> = (
  request: Request,
  session: ApiAuth,
) => Promise<z.infer<ZRes>>

export function createProtectedRoute<ZReq extends z.ZodTypeAny, ZRes extends z.ZodTypeAny>({
  inputSchema,
  handler,
  outputSchema,
}: {
  inputSchema: ZReq
  handler: (input: z.infer<ZReq>, session: ApiAuth) => Promise<z.infer<ZRes>>
  outputSchema: ZRes
}): ProtectedRoute<ZReq, ZRes> {
  return async function protectedRoute(request) {
    try {
      const session = await authenticateApiRequest(request.headers)
      const parsedInput = inputSchema.parse(await request.json())

      if (isStreamingRequest(parsedInput)) return await handler(parsedInput, session)

      const result = await handler(parsedInput, session)
      const parsedOutput = outputSchema.parse(result)
      return Response.json(parsedOutput)
    } catch (err) {
      console.error(err)
      if (err instanceof AppError) {
        if (err.code === 'unauthorized') return Response.json(err, { status: 401 })
      }

      if (err instanceof ZodError) {
        const { message, details } = fromZodError(err)
        return Response.json(new AppError('invalid_client_request', message, details), {
          status: 400,
        })
      }

      return Response.json(new AppError('internal', 'An unknown/unhandled error occurred.'), {
        status: 500,
      })
    }
  }
}

function isStreamingRequest(input: unknown) {
  return z.object({ stream: z.literal(true) }).safeParse(input).success
}
