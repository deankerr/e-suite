import { auth } from '@/auth'
import { TabButton } from '@/components/chat/tab-button'
import { TabInfo } from '@/components/chat/tab-info'
import { getUserAndChatTab } from '@/lib/db'

export default async function ChatTabLayout({
  params,
  children,
}: {
  params: { tab: string }
  children: React.ReactNode
}) {
  const session = await auth()

  const { user, chatTab } = await getUserAndChatTab(session?.user.id, params.tab)

  return (
    <main className="grid grid-rows-[minmax(5rem,auto)_1fr] overflow-hidden">
      <div className="space-y-2 border-b px-2 pt-2">
        <TabInfo chatTab={chatTab} />
        <div className="flex w-full overflow-x-auto">
          <TabButton
            text="Details"
            isActive={false}
            // onClick={() => togglePane('engineInfo')}
          />
          <TabButton
            text="Messages"
            isActive={false}
            // onClick={() => togglePane('messages')}
          />
          <TabButton
            text="Parameters"
            isActive={false}
            // onClick={() => togglePane('controls')}
          />
          <TabButton
            text="Browser"
            isActive={false}
            // onClick={() => togglePane('browser')}
          />
        </div>
      </div>
      <div className="overflow-y-auto overflow-x-hidden">{children}</div>
    </main>
  )
}
