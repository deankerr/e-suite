import { chatsConfig } from '@/config/chats'
import { prisma } from '@/lib/prisma'
import { Echat } from './echat'

export default async function IndexPage() {
  const chatSession = chatsConfig[1]!
  const engine = await prisma.engine.findFirstOrThrow({ where: { id: chatSession.engineId } })

  return <Echat chatSession={chatSession} engine={engine} />
}
