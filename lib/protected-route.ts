import { getUserSession, UserSession } from '@/data/auth'
import { AppError, AppErrorCode } from '@/lib/error'
import z, { ZodError } from 'zod'
import { fromZodError } from 'zod-validation-error'

export type ProtectedRoute<ZReq extends z.ZodTypeAny, ZRes extends z.ZodTypeAny> = (
  input: z.infer<ZReq>,
  user: UserSession,
) => Promise<z.infer<ZRes>>

export function createProtectedRoute<ZReq extends z.ZodTypeAny, ZRes extends z.ZodTypeAny>({
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
