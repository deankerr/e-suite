import { prisma } from './prisma'

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

export const db = {
  getUser,
}

// export type User = Awaited<ReturnType<typeof getUserById>>
export type User = Awaited<ReturnType<typeof getUser>>
export type Engine = Awaited<ReturnType<typeof getEngineById>>
