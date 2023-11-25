import { prisma, Prisma } from '@/lib/prisma'
import { AgentUpdateInputData } from '@/schema/user'

//* Agents
export async function getAgentOwnedByUserById({ ownerId, id }: { ownerId: string; id: string }) {
  return await prisma.agent.findUniqueOrThrow({
    where: {
      ownerId,
      id,
    },
    include: {
      engine: {
        include: {
          provider: true,
        },
      },
    },
  })
}

export async function getAgentsOwnedByUserById({
  ownerId,
  ids,
}: {
  ownerId: string
  ids: string[]
}) {
  return await prisma.agent.findMany({
    where: {
      ownerId,
      id: {
        in: ids,
      },
    },
    include: {
      engine: {
        include: {
          provider: true,
        },
      },
    },
  })
}

export async function getAgentsOwnedByUserList({ ownerId }: { ownerId: string }) {
  return await prisma.agent.findMany({
    where: {
      ownerId,
    },
  })
}

export async function updateAgentOwnedByUser({
  ownerId,
  id,
  data,
}: {
  ownerId: string
  id: string
  data: AgentUpdateInputData
}) {
  const { engineId, ...inputData } = data

  if (engineId) {
    await prisma.agent.update({
      where: {
        ownerId,
        id,
      },
      data: {
        ...inputData,
        engine: {
          connect: {
            id: data.engineId,
          },
        },
      },
    })
  } else {
    await prisma.agent.update({
      where: {
        ownerId,
        id,
      },
      data,
    })
  }
}
