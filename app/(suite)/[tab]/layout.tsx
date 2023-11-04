import { auth } from '@/auth'
import { TabButton } from '@/components/chat/tab-button'
import { TabInfo } from '@/components/chat/tab-info'
import { getUser } from '@/lib/db'

export default async function ChatTabLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const user = await getUser(session?.user.id)

  return (
    <main className="grid grid-rows-[minmax(5rem,auto)_1fr] overflow-hidden">
      <div className="space-y-2 border-b px-2 pt-2">
        <TabInfo user={user} />
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
