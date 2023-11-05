'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createChatTab(userId: string) {
  console.log('create tab')
  const tabs = await prisma.chatTab.findMany({ where: { userId: userId } })
  // find next available Untitled slug
  let n = 1
  while (n++) if (tabs.every((t) => t.slug !== `Untitled-${n}`)) break

  const newTab = await prisma.chatTab.create({
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
  return newTab
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

export async function renameChatTab(id: string, title: string) {
  console.log('rename tab', id, title)
  const targetChatTab = await prisma.chatTab.findFirstOrThrow({
    where: {
      id: id,
    },
    include: {
      user: {
        include: {
          chatTabs: true,
        },
      },
    },
  })

  const userChatTabs = targetChatTab.user.chatTabs.filter((t) => t.id !== targetChatTab.id)
  const slug = encodeURI(title.replaceAll(' ', '-'))

  let newSlug = slug
  if (userChatTabs.some((t) => t.slug === slug)) {
    let n = 1
    while (n++) if (userChatTabs.every((t) => t.slug !== `${slug}-${n}`)) break
    newSlug = `${slug}-${n}`
  }

  await prisma.chatTab.update({
    where: {
      id: targetChatTab.id,
    },
    data: {
      title,
      slug: newSlug,
    },
  })
  console.log('newSlug', newSlug)
  revalidatePath('/(suite)/[tab]', 'layout')
  return newSlug
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
