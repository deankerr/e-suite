import { prisma } from './prisma'

export async function getEngines() {
  console.log('get all engines')
  const engines = await prisma.engine.findMany({ include: { provider: true } })
  return engines
}

export async function getUserById(userId: string) {
  return await prisma.user.findFirstOrThrow({ where: { id: userId } })
}

export async function getEngineById(engineId: string) {
  return await prisma.engine.findFirstOrThrow({ where: { id: engineId } })
}

export type User = Awaited<ReturnType<typeof getUserById>>
export type Engine = Awaited<ReturnType<typeof getEngineById>>
