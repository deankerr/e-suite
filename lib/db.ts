import { nanoid } from 'nanoid/non-secure'
import { prisma } from './prisma'
import { schemaWorkbench } from './schemas'
import { getSession, Session } from './server'

async function getSessionUser() {
  const session = await getSession()
  if (!session) return null

  const existingUser = await prisma.user.findUnique({
    where: { id: session.id },
    include: {
      agents: {
        include: {
          engine: true,
        },
      },
    },
  })

  const user = existingUser ?? (await createSessionUser(session))

  return {
    user: session,
    workbench: schemaWorkbench.parse(user.workbench),
    agents: user.agents,
  }
}

async function createSessionUser(session: Session) {
  const { permissions, role, ...newUser } = session

  const user = await prisma.user.create({
    data: {
      ...newUser,
      agents: {
        createMany: {
          data: [
            {
              id: 'seed1-' + nanoid(7),
              name: 'Artemis',
              image: 'dp1.png',
              engineId: 'openai@gpt-3.5-turbo',
            },
            {
              id: 'seed2-' + nanoid(7),
              name: 'Charon',
              image: 'dp2.png',
              engineId: 'openrouter@airoboros-l2-70b',
            },
            {
              id: 'seed3-' + nanoid(7),
              name: 'Dionysus',
              image: 'dp3.png',
              engineId: 'togetherai@redpajama-incite-7b-chat',
            },
            {
              id: 'seed4-' + nanoid(7),
              name: 'Piñata',
              image: 'dp4.png',
              engineId: 'openrouter@mistral-7b-openorca',
            },
          ],
        },
      },
    },
    include: {
      agents: {
        include: {
          engine: true,
        },
      },
    },
  })

  console.log('new user', user)
  return user
}

export const db = {
  getSessionUser,
}
