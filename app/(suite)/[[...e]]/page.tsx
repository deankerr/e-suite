import { Chat } from '@/components/chat/chat'
import { chatsConfig } from '@/config/chats'
import { prisma } from '@/lib/prisma'

export default async function IndexPage() {
  const chatSession = chatsConfig[1]!
  const engine = await prisma.engine.findFirstOrThrow({ where: { id: chatSession.engineId } })

  return <Chat chatSession={chatSession} engine={engine} />
}
