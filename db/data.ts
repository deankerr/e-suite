import { prisma, Prisma } from '@/lib/prisma'

//* Engines
export async function getEnginesList() {
  return await prisma.engine.findMany({ include: { provider: true } })
}

export async function getEngineById({ id }: { id: string }) {
  return await prisma.engine.findUniqueOrThrow({ where: { id }, include: { provider: true } })
}
