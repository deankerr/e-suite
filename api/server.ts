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
