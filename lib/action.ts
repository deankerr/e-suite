import { createAdminDao } from '@/data/admin'
import type { AdminDao, UserDao } from '@/data/types'
import { createUserDao } from '@/data/user'
import z, { ZodError } from 'zod'
import { NewAppError } from './app-error'

type ActionUserContext<Z extends z.ZodTypeAny> = {
  userDao: UserDao
  input: z.infer<Z>
}

type ActionAdminContext<Z extends z.ZodTypeAny> = {
  adminDao: AdminDao
  input: z.infer<Z>
}

export function action<Z extends z.ZodTypeAny, R extends any>(config: {
  input: Z
  user?: (context: ActionUserContext<Z>) => Promise<R>
  admin?: (context: ActionAdminContext<Z>) => Promise<R>
}): (actionInput?: unknown) => Promise<R> {
  return async (actionInput) => {
    try {
      if (config.admin) {
        return await config.admin({
          adminDao: await createAdminDao(),
          input: config.input.parse(actionInput),
        })
      }

      if (config.user) {
        console.log('arf')
        return await config.user({
          userDao: await createUserDao(),
          input: config.input.parse(actionInput),
        })
      }

      throw new NewAppError('unknown', { description: 'server action missing handler' })
    } catch (error) {
      if (error instanceof ZodError) {
        throw new Error('Invalid input')
      }
      throw error
    }
  }
}
