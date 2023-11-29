import { prisma, Prisma } from '@/lib/prisma'
import { getRandomAgentAvatar } from '@/lib/utils'
import { AgentUpdateInputData, schemaAgentParametersRecord } from '@/schema/user'
import { shuffle } from 'remeda'

//* Agents
const withEngineProvider = Prisma.validator<Prisma.AgentDefaultArgs>()({
  include: {
    engine: {
      include: {
        provider: true,
      },
    },
  },
})
export type AgentWithEngineProvider = Prisma.AgentGetPayload<typeof withEngineProvider>

function validateAgentParameters(parameters: Prisma.JsonValue) {
  const parsed = schemaAgentParametersRecord.safeParse(parameters)
  if (parsed.success) {
    return parsed.data
  }

  return {}
}

export async function getAgentOwnedByUserById({ ownerId, id }: { ownerId: string; id: string }) {
  const agent = await prisma.agent.findUniqueOrThrow({
    where: {
      ownerId,
      id,
    },
    include: withEngineProvider.include,
  })
  const parsed = { ...agent, parameters: validateAgentParameters(agent.parameters) }
  return parsed
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

export async function createAgentOwnedByUser({ ownerId, name }: { ownerId: string; name: string }) {
  const engine = await prisma.engine.findFirstOrThrow({})

  const agent = await prisma.agent.create({
    data: {
      name,
      image: getRandomAgentAvatar(),
      owner: {
        connect: {
          id: ownerId,
        },
      },
      engine: {
        connect: {
          id: engine.id,
        },
      },
    },
  })

  return agent.id
}

export async function deleteAgentOwnedByUser({ ownerId, id }: { ownerId: string; id: string }) {
  await prisma.agent.delete({
    where: {
      ownerId,
      id,
    },
  })
}
