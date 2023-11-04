import { ChatTab as _ChatTab } from '@prisma/client'
import { prisma } from './prisma'

export async function getUser(id?: string) {
  if (!id) return undefined
  return await prisma.user.findFirstOrThrow({ where: { id }, include: { chatTabs: true } })
}

export type User = Awaited<ReturnType<typeof getUser>>
export type ChatTab = _ChatTab
