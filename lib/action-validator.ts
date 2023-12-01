import z, { ZodError } from 'zod'
import { fromZodError } from 'zod-validation-error'
import { _deprecated_AppError } from './error'
import { getSession, Session } from './server'

//* produced function with added session/input validation
type ProtectedAction<Z extends z.ZodTypeAny, R extends any> = (rawInput: z.infer<Z>) => Promise<R>

export function actionValidator<Z extends z.ZodTypeAny, R>(
  inputSchema: Z,
  serverAction: (parsedInput: { user: Session; data: z.infer<Z> }) => Promise<R>,
): ProtectedAction<Z, R> {
  return async function validateRequest(rawInput) {
    try {
      //* login/session check
      const user = await getSession()
      if (!user) throw new _deprecated_AppError('Not logged in.')

      //* validate input
      const parsedInput = inputSchema.parse(rawInput)

      //* execute action
      const result = await serverAction({ data: parsedInput, user })
      return result
    } catch (err) {
      console.error(err)
      if (err instanceof _deprecated_AppError) {
        throw err
      } else if (err instanceof ZodError) {
        throw new _deprecated_AppError(fromZodError(err).message)
      } else {
        if (process.env.NODE_ENV === 'development') throw err
        else throw new _deprecated_AppError('An unknown error occurred.')
      }
    }
  }
}
