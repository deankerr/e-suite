import { prisma, Prisma } from '@/lib/prisma'
import { getSession, Session } from '@/lib/server'
import { nanoid } from 'nanoid/non-secure'
import 'server-only'

export async function initializeUserSession() {
  const session = await getSession()
  if (!session) return null

  const existingUser = await prisma.user.findUnique({
    where: { id: session.id },
    include: {
      agents: {
        include: {
          engine: {
            include: {
              provider: true,
            },
          },
        },
      },
    },
  })

  const user = existingUser ?? (await createSessionUser(session))

  return {
    user: session,
    agents: user.agents,
  }
}

async function createSessionUser(session: Session) {
  const { role, ...newUser } = session

  const user = await prisma.user.create({
    data: {
      ...newUser,
      agents: {
        createMany: {
          data: createDemoAgents(),
        },
      },
    },
    include: {
      agents: {
        include: {
          engine: {
            include: {
              provider: true,
            },
          },
        },
      },
    },
  })

  console.log('new user', user)
  return user
}

export async function addTestAgents() {
  const user = await getSession()
  if (user) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        agents: {
          createMany: {
            data: createDemoAgents(),
          },
        },
      },
    })
  }
}

function createDemoAgents() {
  return [
    {
      id: nanoid(7),
      name: 'Artemis',
      image: 'dp1.png',
      engineId: 'openai@gpt-3.5-turbo',
    },
    {
      id: nanoid(7),
      name: 'Charon',
      image: 'dp2.png',
      engineId: 'openrouter@airoboros-l2-70b',
    },
    {
      id: nanoid(7),
      name: 'Dionysus',
      image: 'dp3.png',
      engineId: 'togetherai@redpajama-incite-7b-chat',
    },
    {
      id: nanoid(7),
      name: 'Piñata',
      image: 'dp4.png',
      engineId: 'openrouter@mistral-7b-openorca',
    },
  ]
}
