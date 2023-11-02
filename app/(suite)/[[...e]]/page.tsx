import { EngineInfo } from '@/components/chat/engine-info'
import { EngineInputControls } from '@/components/chat/form/engine-input-controls'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { chatsConfig } from '@/config/chats'
import { prisma } from '@/lib/prisma'
import { cn } from '@/lib/utils'
import { ChatBubbleIcon } from '@radix-ui/react-icons'
import { MessageFeed } from './message-feed'
import { TabTop } from './tab-top'

export default async function IndexPage() {
  const chatSession = chatsConfig[0]!
  const engine = await prisma.engine.findFirstOrThrow({ where: { id: chatSession.engineId } })

  return (
    <main className="grid grid-cols-[2.5rem_auto] grid-rows-[3rem_minmax(5rem,auto)_1fr_3rem] overflow-hidden">
      {/* Left Bar */}
      <div className="row-span-3 border-r"></div>
      {/* Tab Bar */}
      <div className="flex bg-muted">
        {chatsConfig.map((c) => (
          <TabTop key={c.id} title={c.name} />
        ))}
      </div>

      {/* Top Panel */}
      <div className="flex flex-col place-items-center border-b ">
        Model | Messages | Parameters
      </div>

      {/* content area */}
      <div className="flex">
        <EngineInfo engine={engine} />

        <MessageFeed session={chatSession} engine={engine} />

        <EngineInputControls
          className={cn('w-full max-w-2xl space-y-8 px-4 py-4')}
          chatSession={chatSession}
          engine={engine}
        />
      </div>

      {/* bottom panel */}
      <div className="col-span-2 flex items-center justify-between border-t px-3">
        <ChatBubbleIcon />
        <span className="text-sm text-muted-foreground">
          Press Enter ⏎ for a new line / Press ⌘ + Enter to send
        </span>
        <ThemeToggle />
      </div>
    </main>
  )
}
