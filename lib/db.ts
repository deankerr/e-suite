import { ChatTab as _ChatTab } from '@prisma/client'
import { prisma } from './prisma'

export async function getUser(id?: string) {
  if (!id) return undefined
  return (await prisma.user.findFirst({ where: { id }, include: { chatTabs: true } })) ?? undefined
}

export async function getUserAndChatTab(userId?: string, slug?: string) {
  const user = await getUser(userId)
  if (!user) return {}
  const chatTab = user.chatTabs.find((t) => t.slug === slug)
  return { user, chatTab }
}

export async function getEngines() {
  const engines = await prisma.engine.findMany({ include: { provider: true } })
  // return engines.map((e) => ({...e, createdAt: e.createdAt.toISOString(), updatedAt: e.updatedAt.toISOString() }))
  return engines.map((e) => ({
    ...e,
    stopTokens: JSON.parse(e.stopTokens) as string[],
    includeParameters: JSON.parse(e.includeParameters) as Record<string, unknown>,
  }))
}

export type User = Awaited<ReturnType<typeof getUser>>
export type ChatTab = Omit<_ChatTab, 'createdAt' | 'updatedAt'>
export type Engine = Awaited<ReturnType<typeof getEngines>>[number]
