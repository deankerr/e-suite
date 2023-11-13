'use server'

import { auth } from '@/auth'
import { AppError } from '@/lib/error'
import { prisma } from '@/lib/prisma'
import {
  schemaAgent,
  schemaAgentMerge,
  schemaAgentParameters,
  schemaEngine,
  schemaSuiteUserAll,
  schemaUser,
  schemaWorkbench,
} from '@/lib/schemas'
import { Session } from 'next-auth'
import z, { ZodError } from 'zod'
import { fromZodError } from 'zod-validation-error'

type AuthorizedAction<InputSchema extends z.ZodTypeAny, Result extends any> = (
  input: z.infer<InputSchema>,
) => Promise<Result>

type ActionFunction<InputSchema extends z.ZodTypeAny, Result> = (
  session: Session,
  parsedInput: z.infer<InputSchema>,
) => Result

function action<InputSchema extends z.ZodTypeAny, Result extends any>(
  inputSchema: InputSchema,
  actionFunc: ActionFunction<InputSchema, Result>,
): AuthorizedAction<InputSchema, Result> {
  return async (actualInputObj) => {
    try {
      const session = await auth()
      if (!session) throw new AppError('You are not logged in.')

      const parsedInput = inputSchema.parse(actualInputObj)

      const result = await actionFunc(session, parsedInput)
      return result
    } catch (err) {
      if (err instanceof AppError) {
        console.error(err)
        throw err
      }

      if (err instanceof ZodError) {
        console.error(fromZodError(err))
        throw new Error(fromZodError(err).message)
      }

      console.error(err)
      throw new Error('An unknown error occurred.')
    }
  }
}

// return User with agentId[] only
export const getUser = action(z.void(), async (session) => {
  const { agents, ...user } = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
    include: { agents: { select: { id: true } } },
  })
  return { ...user, agentIds: agents.map((agent) => agent.id) }
})

export const getAgent = action(z.string(), async (session, agentId) => {
  const agent = await prisma.agent.findUniqueOrThrow({
    where: {
      id: agentId,
      ownerId: session.user.id,
    },
  })

  const parsedAgent = schemaAgent.parse(agent)
  return parsedAgent
})

export const getWorkbench = action(z.void(), async (session) => {
  const { workbench } = await prisma.user.findUniqueOrThrow({
    where: {
      id: session.user.id,
    },
    select: {
      workbench: true,
    },
  })

  const parsedWorkbench = schemaWorkbench
    .catch({
      tabs: [],
      focusedTabId: '',
    })
    .parse(workbench)
  return parsedWorkbench
})

export type WorkbenchMerge = Partial<z.infer<typeof schemaWorkbench>>
const schemaWorkbenchMerge = z.object({ merge: schemaWorkbench.partial() })
export const updateWorkbench = action(schemaWorkbenchMerge, async (session, { merge }) => {
  const { workbench } = await prisma.user.findUniqueOrThrow({
    where: {
      id: session.user.id,
    },
    select: {
      workbench: true,
    },
  })

  const parsedWorkbench = schemaWorkbench
    .catch({
      tabs: [],
      focusedTabId: '',
    })
    .parse(workbench)

  const newWorkbench = {
    ...parsedWorkbench,
    ...merge,
  }

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      workbench: newWorkbench,
    },
  })
})

export const getEngines = action(z.void(), async () => {
  return await prisma.engine.findMany({})
})

export const getEngine = action(z.string(), async (session, engineId) => {
  return await prisma.engine.findUniqueOrThrow({ where: { id: engineId } })
})
