import { auth } from '@/auth'
import { ChatTab as _ChatTab } from '@prisma/client'
import { Session } from 'next-auth/types'
import { redirect } from 'next/navigation'
import { prisma } from './prisma'

export async function authServerPublic() {
  const session = await auth()
  if (!session) {
    return {}
  }

  const user = await prisma.user.findFirst({
    where: { id: session.user.id },
    include: { chatTabs: true },
  })

  return { session, user: user ?? undefined }
}

type AuthProtectedOptions = {
  chatTabSlug: string
}

export async function authServerProtected(options?: Partial<AuthProtectedOptions>) {
  const session = await auth()
  if (!session) {
    console.warn('not logged in - session is null')
    redirect('/?not-logged-in=true')
  }

  const user = await prisma.user.findFirst({
    where: { id: session.user.id },
    include: { chatTabs: true },
  })

  if (!user) {
    console.warn('not logged in - user is null')
    redirect('/?not-logged-in=true')
  }

  if (options?.chatTabSlug) {
    const chatTab = user.chatTabs.find((t) => t.slug === options.chatTabSlug)
    return { session, user, chatTab }
  }

  return { session, user }
}

export async function getUserSession(session: Session) {
  const userId = session.user.id
  const user = await prisma.user.findFirstOrThrow({
    where: { id: userId },
    include: { chatTabs: true },
  })
  return user
}

export async function getEngines() {
  console.log('get all engines')
  const engines = await prisma.engine.findMany({ include: { provider: true } })
  return engines
}

export async function getUserById(userId: string) {
  return await prisma.user.findFirstOrThrow({ where: { id: userId }, include: { chatTabs: true } })
}

export async function getEngineById(engineId: string) {
  return await prisma.engine.findFirstOrThrow({ where: { id: engineId } })
}

export type User = Awaited<ReturnType<typeof getUserById>>
export type ChatTab = _ChatTab
export type Engine = Awaited<ReturnType<typeof getEngineById>>
