import { prisma } from './prisma'

// TODO check whos using these, move into db{}
export async function getEngines() {
  console.log('get all engines')
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
  return await prisma.user.findUniqueOrThrow({
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
}

export const db = {
  getUser,
  getSuiteUser,
}

export type SuiteUser = Awaited<ReturnType<typeof getSuiteUser>>
export type User = Awaited<ReturnType<typeof getUser>>
export type Engine = Awaited<ReturnType<typeof getEngineById>>
