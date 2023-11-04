import { auth } from '@/auth'
import { EngineBrowser } from '@/components/chat/engine-browser'
import { Button } from '@/components/ui/button'
import { getEngines, getUserAndChatTab } from '@/lib/db'

export default async function TabIndexPage({ params }: { params: { tab: string } }) {
  const session = await auth()

  const { user, chatTab } = await getUserAndChatTab(session?.user.id, params.tab)
  const engines = await getEngines()

  return (
    <>
      TabIndexPage
      <div className="space-y-2 p-6">
        <div className="w-fit rounded-md border p-2 text-sm">
          <p>
            Info: {chatTab?.id} {chatTab?.name}
          </p>
          <p>Current model: {chatTab?.engineId ?? 'not selected'}</p>
        </div>
        <EngineBrowser engines={engines} chatTab={chatTab} />
      </div>
      <pre className="overflow-x-auto text-xs">{JSON.stringify(session, null, 2)}</pre>
    </>
  )
}

/* <pre className="overflow-x-auto">{JSON.stringify(session, null, 2)}</pre> */
