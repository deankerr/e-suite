import { ChatPanel } from '@/components/chat/chat-panel'
import { initialChatsConfig } from '@/components/chat/config'
import { getChatModels } from '@/lib/api'

type Props = {}

export default function ChatPage(props: Props) {
  const modelsAvailable = getChatModels()

  return (
    <>
      {initialChatsConfig.map((chat) => (
        <ChatPanel
          key={chat.id}
          session={chat}
          updateSession={dummyUpdateSession}
          modelsAvailable={modelsAvailable}
        />
      ))}
    </>
  )
}

async function dummyUpdateSession() {
  'use server'
}
