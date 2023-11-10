import { prisma } from './prisma'
import {
  jsonRecord,
  SuiteAgentUpdateMergeObject,
  SuiteWorkbenchUpdateMergeObject,
  validateWorkbench,
} from './schemas'

// TODO check whos using these, move into db{}
export async function getEngines() {
  const engines = await prisma.engine.findMany({ include: { provider: true } })
  return engines
}

export async function getUser(userId: string) {
  return await prisma.user.findFirstOrThrow({ where: { id: userId }, include: { agents: true } })
}

export async function getUserById(userId: string) {
  return await prisma.user.findFirstOrThrow({ where: { id: userId } })
}

export async function getEngineById(engineId: string) {
  return await prisma.engine.findFirstOrThrow({ where: { id: engineId } })
}

async function getSuiteUser(userId: string) {
  const suiteUser = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    include: {
      agents: {
        include: {
          engine: true,
        },
      },
    },
  })

  return {
    ...suiteUser,
    workbench: validateWorkbench(suiteUser.workbench),
  }
}

async function updateWorkbench(userId: string, merge: SuiteWorkbenchUpdateMergeObject) {
  const current = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { workbench: true },
  })
  const parsed = jsonRecord.parse(current.workbench)
  await prisma.user.update({ where: { id: userId }, data: { workbench: { ...parsed, ...merge } } })
}

async function updateUserAgent(
  userId: string,
  agentId: string,
  merge: SuiteAgentUpdateMergeObject,
) {
  await prisma.agent.update({
    where: {
      id: agentId,
      ownerId: userId,
    },
    data: {
      ...merge,
    },
  })
}

export const db = {
  getUser,
  getSuiteUser,
  updateWorkbench,
  updateUserAgent,
  getEngines,
}

export type SuiteUser = Awaited<ReturnType<typeof getSuiteUser>>
export type User = Awaited<ReturnType<typeof getUser>>
export type Engine = Awaited<ReturnType<typeof getEngineById>>
