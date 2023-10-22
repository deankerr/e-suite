import { ChatApp } from '@/components/chat/chat-app'
import { getChatModels } from '@/lib/api'

export default function eSuitePage() {
  const models = getChatModels()
  return (
    <>
      <ChatApp modelsAvailable={models} />
    </>
  )
}
