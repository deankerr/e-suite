import { prisma } from '@/lib/prisma'

//* Engines
export async function getEnginesList() {
  return await prisma.engine.findMany({
    where: { NOT: { type: 'image' } },
    include: { provider: true },
    orderBy: { displayName: 'asc' },
  })
}

export async function getEngineById({ id }: { id: string }) {
  return await prisma.engine.findUniqueOrThrow({ where: { id }, include: { provider: true } })
}
