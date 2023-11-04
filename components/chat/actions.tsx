'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createChatTab(uid: string, name: string) {
  await prisma.chatTab.create({
    data: {
      name,
      user: {
        connect: {
          id: uid,
        },
      },
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
  revalidatePath('/[tab]')
}
