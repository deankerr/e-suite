'use server'

import { auth } from '@/auth'
import {
  schemaAgent,
  schemaAgentParameters,
  schemaEngine,
  schemaSuiteUserAll,
  schemaUser,
  schemaWorkbench,
} from '@/lib/db-schemas'
import { AppError } from '@/lib/error'
import { prisma } from '@/lib/prisma'
import z from 'zod'

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

    const parsedUser = schemaUser.parse(suiteUser)
    return parsedUser
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
    const workbench = await prisma.user.findUniqueOrThrow({
      where: {
        id: user.id,
      },
      select: {
        workbench: true,
      },
    })

    const parsedWorkbench = schemaWorkbench.parse(workbench)
    return parsedWorkbench
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

function handleError(err: unknown) {
  if (err instanceof AppError) {
    console.error(err)
    throw err
  } else {
    console.error(err)
    throw new Error('An unknown error occurred.')
  }
}
