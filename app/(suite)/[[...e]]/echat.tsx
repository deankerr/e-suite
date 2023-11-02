'use client'

import { EngineInfo } from '@/components/chat/engine-info'
import { EngineInputControls } from '@/components/chat/form/engine-input-controls'
import { ChatSession } from '@/components/chat/types'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { chatsConfig } from '@/config/chats'
import { cn } from '@/lib/utils'
import { Engine } from '@prisma/client'
import { ChatBubbleIcon } from '@radix-ui/react-icons'
import { useImmer } from 'use-immer'
import { MessageFeed } from './message-feed'
import { TabTop } from './tab-top'

export function Echat({ chatSession, engine }: { chatSession: ChatSession; engine: Engine }) {
  const [panes, setPanes] = useImmer({ engineInfo: false, messages: true, controls: false })
  const togglePane = (key: keyof typeof panes) =>
    setPanes({ engineInfo: false, messages: false, controls: false, [key]: true })

  return (
    <>
      <main className="bg-grid-grey grid grid-rows-[3rem_minmax(5rem,auto)_1fr] overflow-hidden border-x sm:col-start-2">
        {/* Tab Bar */}
        <div className="flex overflow-x-auto bg-muted">
          {chatsConfig.map((c) => (
            <TabTop key={c.id} title={c.name} />
          ))}
        </div>

        {/* Top Panel */}
        <div className="flex max-w-4xl flex-col items-center justify-end gap-2 border-b border-r bg-background">
          <div className="text-sm text-muted-foreground">
            <p className="h-full">{engine.displayName}</p>
          </div>
          <div className="">
            <TabButton
              text="Engine Info"
              isActive={panes.engineInfo}
              onClick={() => togglePane('engineInfo')}
            />
            <TabButton
              text="Messages"
              isActive={panes.messages}
              onClick={() => togglePane('messages')}
            />
            <TabButton
              text="Parameters"
              isActive={panes.controls}
              onClick={() => togglePane('controls')}
            />
          </div>
        </div>

        {/* content area */}
        <div className="max-w-4xl overflow-y-auto overflow-x-hidden border-r bg-background shadow-inner">
          {panes.engineInfo && (
            <EngineInfo
              engine={engine}
              className="mx-auto w-full max-w-3xl space-y-8 pt-3 sm:pt-6"
            />
          )}

          {panes.messages && (
            <MessageFeed
              session={chatSession}
              engine={engine}
              className="mx-auto w-full max-w-3xl space-y-4 overflow-x-hidden pt-5 sm:pt-6"
            />
          )}

          {panes.controls && (
            <EngineInputControls
              className={cn('mx-auto w-full max-w-3xl space-y-8 px-16 pt-8')}
              chatSession={chatSession}
              engine={engine}
            />
          )}
        </div>
      </main>

      {/* bottom panel */}
      <div className="col-start-1 flex items-center justify-between border-t bg-background px-3 sm:col-span-3">
        {/* <ChatBubbleIcon /> */}
        <div />
        <span className="text-sm text-muted-foreground">
          Press Enter ⏎ for a new line / Press ⌘ + Enter to send
        </span>
        <ThemeToggle />
      </div>
    </>
  )
}

function TabButton({
  text,
  isActive,
  onClick,
}: {
  text: string
  isActive: boolean
  onClick: () => void
}) {
  return (
    <Button
      variant="ghost"
      className={cn(
        'rounded-none py-2 text-sm text-foreground/60 hover:bg-inherit hover:text-foreground',
        isActive && 'border-b-2 border-primary text-foreground',
      )}
      onClick={onClick}
    >
      {text}
    </Button>
  )
}
