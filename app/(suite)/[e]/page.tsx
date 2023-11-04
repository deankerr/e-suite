import { Chat } from '@/components/chat/chat'
import { TabButton } from '@/components/chat/tab-button'
import { TabContent } from '@/components/chat/tab-content'
import { TabTop } from '@/components/chat/tab-top'
import { serverSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { nanoid } from 'nanoid/non-secure'

const panes = {
  engineInfo: false,
  messages: false,
  controls: false,
  browser: false,
}

export default async function IndexPage() {
  const session = await serverSession()

  // const chatSession = chatsConfig[1]!
  // const engine = await prisma.engine.findFirstOrThrow({ where: { id: chatSession.engineId } })

  if (!session || !session.user) {
    return (
      <div className="col-start-2">
        <p>Not logged in eh</p>
      </div>
    )
  }

  console.log('!!! getServerSession !!!', session)

  const user = await prisma.user.findFirstOrThrow({
    where: { id: session.user.id },
    include: { chatTabs: true },
  })
  console.log('user', user)

  if (user.chatTabs.length === 0) {
    const newTab = await prisma.chatTab.create({
      data: {
        id: nanoid(),
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    })
    console.log('newTab', newTab)
  }

  const togglePane = (pane: string) => {}

  return (
    <>
      <main className="bg-grid-grey/0 grid grid-rows-[2.75rem_minmax(5rem,auto)_1fr] overflow-hidden border-x sm:col-start-2">
        {/* Tab Bar */}
        <div className="flex w-full max-w-4xl justify-self-center overflow-x-auto border-x bg-muted">
          {user.chatTabs.map((c) => (
            <TabTop key={c.id} title={c.name} />
          ))}
        </div>

        {/* Top Panel */}
        <div className="flex w-full max-w-4xl flex-col items-center justify-end gap-2 justify-self-center border-x border-b bg-background">
          <div className="text-sm text-muted-foreground">
            {/* <p className="h-full">{engine?.displayName}</p> */}
          </div>
          <div className="flex w-full overflow-x-auto">
            <TabButton
              text="Details"
              isActive={panes.engineInfo}
              // onClick={() => togglePane('engineInfo')}
            />
            <TabButton
              text="Messages"
              isActive={panes.messages}
              // onClick={() => togglePane('messages')}
            />
            <TabButton
              text="Parameters"
              isActive={panes.controls}
              // onClick={() => togglePane('controls')}
            />
            <TabButton
              text="Browser"
              isActive={panes.browser}
              // onClick={() => togglePane('browser')}
            />
          </div>
        </div>

        {/* content area */}
        <div className="col-start-1 row-start-3 w-full max-w-4xl justify-self-center overflow-y-auto overflow-x-hidden border-x bg-background shadow-inner">
          <pre className="overflow-x-auto">{JSON.stringify(session, null, 2)}</pre>
        </div>
      </main>

      {/* bottom panel */}
      <div className="flex items-center justify-between border-t bg-background px-3 sm:col-span-3">
        <div></div>
        <span className="hidden text-sm text-muted-foreground sm:flex">
          Press Enter ⏎ for a new line / Press ⌘ + Enter to send
        </span>
        <div></div>
      </div>
    </>
  )

  // return <Chat chatSession={chatSession} engine={engine} />
}

/* 
  <p>Gday</p>
      <pre className="overflow-x-auto">{JSON.stringify(session, null, 2)}</pre>

*/
