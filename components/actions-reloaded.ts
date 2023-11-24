'use server'

import { db } from '@/lib/db'
import { AppError } from '@/lib/error'
import { getSession, Session } from '@/lib/server'
import z, { ZodError } from 'zod'
import { errorMap, fromZodError } from 'zod-validation-error'

z.setErrorMap(errorMap)

// type WrappedActionInput = (user: Session) => Promise<any>
type AsyncFunc<T extends any[], U> = (user: Session, id: string, data?: unknown) => Promise<U>

function wrapAction<T extends any[], U>(action: AsyncFunc<T, U>): (...args: any[]) => Promise<U> {
  return async (id = '', data?: unknown) => {
    try {
      const user = await getSession()
      if (!user) throw new AppError('You are not logged in.')
      const result = action(user, id, data)
      return result
    } catch (err) {
      console.error('err', err)

      if (err instanceof AppError) {
        throw err
      }

      if (err instanceof ZodError) {
        throw new AppError('Validation error ' + fromZodError(err).message)
      }

      throw new AppError('An unknown error occurred.')
    }
  }
}

export const getAgents = wrapAction(async (user) => {
  const agents = await db.getAgentsOwnedBy(user.id)
  return agents
})

export const getAgent = wrapAction(async (user, id) => {
  const agent = await db.getAgentOwnedBy(id, user.id)
  return agent
})

const updateAgentDataSchema = z
  .object({
    name: z.string(),
    image: z.string(),
    engineId: z.string(),
    parameters: z.record(z.any()),
  })
  .partial()
export type UpdateAgentDataSchema = z.infer<typeof updateAgentDataSchema>

export const updateAgent = wrapAction(async (user, id, data) => {
  console.log('updateAgent')
  const parsed = updateAgentDataSchema.parse(data)
  const agent = await db.updateAgentOwnedBy(id, user.id, parsed)
  return agent
})

export const getEngines = wrapAction(async () => {
  return await db.getAllEngines()
})

export const getEngine = wrapAction(async (user, id) => {
  return await db.getEngineById(id)
})
