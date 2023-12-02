import { getUserSession, UserSession } from '@/data/auth'
import z, { ZodError } from 'zod'
import { fromZodError } from 'zod-validation-error'
import { AppError } from './error'

//* produced function with added session/input validation
type ProtectedAction<Z extends z.ZodTypeAny, R extends any> = (rawInput: z.infer<Z>) => Promise<R>

export function actionValidator<Z extends z.ZodTypeAny, R>(
  inputSchema: Z,
  serverAction: (parsedInput: { user: UserSession; data: z.infer<Z> }) => Promise<R>,
): ProtectedAction<Z, R> {
  return async function validateRequest(rawInput) {
    try {
      //* login/session check
      const user = await getUserSession()

      //* validate input
      const parsedInput = inputSchema.parse(rawInput)

      //* execute action
      const result = await serverAction({ data: parsedInput, user })
      return result
    } catch (err) {
      console.error(err)
      if (err instanceof AppError) {
        throw err
      } else if (err instanceof ZodError) {
        throw new AppError('invalid_client_request', fromZodError(err).message)
      } else {
        if (process.env.NODE_ENV === 'development') throw err
        else throw new AppError('internal', 'An unknown error occurred.')
      }
    }
  }
}
