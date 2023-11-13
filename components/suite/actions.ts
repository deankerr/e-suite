'use server'

import { auth } from '@/auth'
import { AppError } from '@/lib/error'
import { prisma } from '@/lib/prisma'
import {
  schemaAgent,
  schemaAgentParameters,
  schemaEngine,
  schemaSuiteUserAll,
  schemaUser,
  schemaWorkbench,
} from '@/lib/schemas'
import z, { ZodError } from 'zod'
import { fromZodError } from 'zod-validation-error'

async function getUserAuth() {
  const session = await auth()
  if (!session) throw new AppError('You are not logged in.')
  return session.user
}

//* "Private" / client requests / session`
// Get the user + all relevant relations
export async function getSuiteUserAll() {
  try {
    const user = await getUserAuth()
    const suiteUser = await prisma.user.findUniqueOrThrow({
      where: {
        id: user.id,
      },
      include: {
        agents: {
          include: {
            engine: true,
          },
        },
      },
    })

    const parsed = schemaSuiteUserAll.parse(suiteUser)
    return parsed
  } catch (err) {
    return handleError(err)
  }
}

// return User with agentId[] only
export async function getUser() {
  try {
    const user = await getUserAuth()
    const suiteUser = await prisma.user.findUniqueOrThrow({
      where: {
        id: user.id,
      },
      include: {
        agents: {
          select: {
            id: true,
          },
        },
      },
    })
    return { ...suiteUser, agentIds: suiteUser.agents.map((agent) => agent.id) }
  } catch (err) {
    return handleError(err)
  }
}

export async function getAgent(agentId: string) {
  try {
    const user = await getUserAuth()
    const agent = await prisma.agent.findUniqueOrThrow({
      where: {
        id: agentId,
        ownerId: user.id,
      },
    })

    const parsedAgent = schemaAgent.parse(agent)
    return parsedAgent
  } catch (err) {
    return handleError(err)
  }
}

export async function getWorkbench() {
  try {
    const user = await getUserAuth()
    const { workbench } = await prisma.user.findUniqueOrThrow({
      where: {
        id: user.id,
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
  } catch (err) {
    return handleError(err)
  }
}

export type WorkbenchMerge = Partial<z.infer<typeof schemaWorkbench>>
export async function updateWorkbench(merge: WorkbenchMerge) {
  try {
    const user = await getUserAuth()

    const parsedMerge = schemaWorkbench.partial().safeParse(merge)
    if (!parsedMerge.success) {
      throw new AppError(fromZodError(parsedMerge.error).message)
    }

    const { workbench } = await prisma.user.findUniqueOrThrow({
      where: {
        id: user.id,
      },
      select: {
        workbench: true,
      },
    })

    const parsedWorkbench = schemaWorkbench.parse(workbench)

    const newWorkbench = {
      ...parsedWorkbench,
      ...merge,
    }
    console.log('newWorkbench', newWorkbench)

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        workbench: newWorkbench,
      },
    })
  } catch (err) {
    return handleError(err)
  }
}

export async function getEngines() {
  try {
    await getUserAuth()
    const engines = await prisma.engine.findMany({})
    const parsedEngines = z.array(schemaEngine).nonempty().parse(engines)
    return parsedEngines
  } catch (err) {
    return handleError(err)
  }
}

export async function getEngine(engineId: string) {
  try {
    await getUserAuth()
    const engine = await prisma.engine.findUniqueOrThrow({ where: { id: engineId } })
    return engine
  } catch (err) {
    return handleError(err)
  }
}

function handleError(err: unknown): never {
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
