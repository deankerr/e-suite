'use server'

import { auth } from '@/auth'
import { db } from '@/lib/db'
import { prisma } from '@/lib/prisma'

// TODO secure
// TODO distinct unknown errors from our errors, handle
//? only use secured db methods with baked in user/session check

async function getUserSession() {
  const session = await auth()
  if (!session) throw new Error('You are not logged in.')
  return session.user
}

export async function getUser(userId: string) {
  const user = await db.getUser(userId)
  return user
}

export async function getAgent(agentId: string) {
  console.log('<getAgent> id:', agentId)
  const user = await getUserSession()

  //* get agent only as a relation of the current user
  const userAgents = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      agents: {
        where: {
          id: agentId,
        },
      },
    },
  })

  if (!userAgents) {
    throw new Error('Invalid Agent.')
  } else {
    const [agent] = userAgents.agents
    if (!agent) throw new Error('Invalid Agent.')
    return agent
  }
}
