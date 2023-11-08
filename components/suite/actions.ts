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

// TODO remove this
export async function getUser(userId: string) {
  const user = await db.getUser(userId)
  return user
}

export async function getUserAgents() {
  try {
    const user = await getUserSession()

    const userAgents = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        agents: true,
      },
    })

    if (!userAgents) throw new Error('You are not logged in.')

    return userAgents.agents
  } catch (err) {
    if (err instanceof Error) {
      // TODO handle error
      console.error(err)
    } else {
      console.error(err)
    }
    throw err
  }
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
