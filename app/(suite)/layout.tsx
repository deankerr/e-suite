import { ChatNav } from '@/components/chat/chat-nav'
import { MainHeader } from '@/components/main-header'
import { serverSession } from '@/lib/auth'

export default async function SuiteLayout({ children }: { children: React.ReactNode }) {
  const session = await serverSession()

  return (
    <div className="grid h-full grid-rows-[3rem_2.75rem_1fr_2.75rem]">
      <MainHeader className="" />
      <ChatNav />
      {children}
    </div>
  )
}
