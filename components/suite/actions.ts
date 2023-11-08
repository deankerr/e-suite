'use server'

import { auth } from '@/auth'
import { db } from '@/lib/db'
import { prisma } from '@/lib/prisma'

// TODO secure
//? only use secured db methods with baked in user/session check

export async function getUser(userId: string) {
  const user = await db.getUser(userId)
  return user
}

//* get agent id only if it is owned by session user
export async function getAgent(agentId: string) {
  console.log('<getAgent> id:', agentId)
  if (!agentId) return null // ! temp
  const session = await auth()
  if (!session) return null // TODO error

  const agent = await prisma.agent.findFirst({
    where: {
      id: agentId,
      ownerId: session.user.id,
    },
  })

  if (agent) {
    console.log('<getAgent> response', agent.name)
    return agent
  } else {
    return null // TODO error
  }
}
