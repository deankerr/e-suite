import z, { ZodError } from 'zod'
import { fromZodError } from 'zod-validation-error'
import { AppError } from '../../lib/error'
import { createAdminDao } from '../data/admin'
import type { AdminDao, UserDao } from '../data/types'
import { createUserDao } from '../data/user'

type ActionUserContext<Z extends z.ZodTypeAny> = {
  userDao: UserDao
  input: z.infer<Z>
}

type ActionAdminContext<Z extends z.ZodTypeAny> = {
  adminDao: AdminDao
  input: z.infer<Z>
}

export function action<Z extends z.ZodTypeAny, R>(config: {
  input: Z
  user?: (context: ActionUserContext<Z>) => Promise<R>
  admin?: (context: ActionAdminContext<Z>) => Promise<R>
}): (actionInput?: unknown) => Promise<R> {
  return async (actionInput) => {
    try {
      if (config.admin) {
        return await config.admin({
          adminDao: await createAdminDao(),
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          input: config.input.parse(actionInput),
        })
      }

      if (config.user) {
        return await config.user({
          userDao: await createUserDao(),
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          input: config.input.parse(actionInput),
        })
      }

      throw new AppError('unknown', { description: 'server action missing handler' })
    } catch (err) {
      console.error(err)

      if (err instanceof ZodError) {
        const zodError = fromZodError(err)
        const validationError = new AppError('validation_client_request', { cause: zodError })
        throw validationError
      }

      const unknownError = new AppError('unknown', { cause: err })
      throw unknownError
    }
  }
}
