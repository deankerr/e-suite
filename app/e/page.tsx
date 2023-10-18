import { ChatApp } from '@/components/chat/chat-app'
import { ShowTailwindBreakpoint } from '@/components/show-tailwind-breakpoint'
import { getChatModels } from '@/lib/api'

export const metadata = {
  title: 'e/suite',
  description: 'e/suite',
}

export default function eSuitePage() {
  const models = getChatModels()
  return (
    <>
      <ShowTailwindBreakpoint />
      <ChatApp modelsAvailable={models} />
    </>
  )
}
