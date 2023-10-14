import { ChatApp } from '@/components/e-suite/chat/chat-app'
import { getChatModels } from '@/lib/api'
import { cn } from '@/lib/utils'

export const metadata = {
  title: 'e/suite',
  description: 'e/suite',
}

export default function eSuitePage() {
  const models = getChatModels()
  return (
    <>
      <TuiBreakpointIndicator />
      <ChatApp modelsAvailable={models} />
    </>
  )
}

export function TuiBreakpointIndicator() {
  const content =
    "after:content-['xs'] sm:after:content-['sm'] md:after:content-['md'] xl:after:content-['xl'] 2xl:after:content-['2xl']"
  return (
    <div
      className={cn('fixed right-0 z-50 flex h-6 w-5 place-items-center text-xs', content)}
    ></div>
  )
}
