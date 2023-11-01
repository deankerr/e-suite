import { Chat } from '@/components/chat/chat'
import { chatsConfig } from '@/config/chats'
import { prisma } from '@/lib/prisma'

function getChatConfig(name: string) {
  const chatConfig = chatsConfig.find((c) => c.name === decodeURI(name))
  if (!chatConfig) throw new Error(`Unable to find chat config for ${name}`)
  return chatConfig
}

export default async function ChatPage({ params }: { params: { name: string } }) {
  const chatConfig = getChatConfig(params.name)
  const currentEngine = await prisma.engine.findFirstOrThrow({ where: { id: chatConfig.engineId } })
  const engineList = await prisma.engine.findMany({ select: { id: true, displayName: true } })

  return <Chat sessionConfig={chatConfig} currentEngine={currentEngine} engineList={engineList} />
}
