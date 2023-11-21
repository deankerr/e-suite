'use server'

import { db } from '@/lib/db'
import { AppError } from '@/lib/error'
import { schemaAgent } from '@/lib/schemas'
import { getSession, Session } from '@/lib/server'
import { Return } from '@prisma/client/runtime/library'
import z from 'zod'
import { errorMap } from 'zod-validation-error'

z.setErrorMap(errorMap)

// type WrappedActionInput = (user: Session) => Promise<any>
type AsyncFunc<T extends any[], U> = (user: Session, id: string) => Promise<U>

function wrapAction<T extends any[], U>(action: AsyncFunc<T, U>): (...args: any[]) => Promise<U> {
  return async (id = '') => {
    try {
      const user = await getSession()
      if (!user) throw new AppError('You are not logged in.')
      return action(user, id)
    } catch (err) {
      if (err instanceof Error) {
        console.error(err)
      } else {
        console.error(err)
      }
      throw err
    }
  }
}

export const getAgents = wrapAction(async (user) => {
  const agents = await db.getAgentsOwnedBy(user.id)
  return agents
})

export const getAgent = wrapAction(async (user, id) => {
  console.log('getAgent', user, id)
  const agent = await db.getAgentOwnedBy(id, user.id)
  return agent
})
