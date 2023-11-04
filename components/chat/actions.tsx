'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getEngines() {
  console.log('getEnginesData')
  return await prisma.engine.findMany()
}

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
