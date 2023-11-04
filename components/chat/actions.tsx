'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createChatTab(userId: string) {
  console.log('create tab')
  const tabs = await prisma.chatTab.findMany({ where: { userId: userId } })
  // find next available Untitled slug
  let n = 1
  while (n++) if (tabs.every((t) => t.slug !== `Untitled-${n}`)) break

  await prisma.chatTab.create({
    data: {
      slug: `Untitled-${n}`,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  })
  revalidatePath('/')
}

export async function deleteChatTab(chatTabId: string) {
  console.log('delete tab:', chatTabId)
  await prisma.chatTab.delete({
    where: {
      id: chatTabId,
    },
  })
  revalidatePath('/')
}

export async function setChatTabEngine(chatTabId: string, engineId: string) {
  await prisma.chatTab.update({
    where: {
      id: chatTabId,
    },
    data: {
      engine: {
        connect: {
          id: engineId,
        },
      },
    },
  })
  revalidatePath('/')
}
