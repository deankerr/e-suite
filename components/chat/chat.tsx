'use client'

import { EngineTable } from '@/components/chat/engine-table'
import { EngineInputControls } from '@/components/chat/form/engine-input-controls'
import { ChatSession } from '@/components/chat/types'
import { chatsConfig } from '@/config/chats'
import { Engine } from '@prisma/client'
import { useImmer } from 'use-immer'
import { TabTop } from './_tab-top'
import { EngineBrowser } from './engine-browser'
import { MessageFeed } from './message-feed'
import { TabButton } from './tab-button'
import { TabContent } from './tab-content'

const panesConfig = {
  engineInfo: false,
  messages: false,
  controls: false,
  browser: false,
}

export function Chat({ chatSession, engine }: { chatSession: ChatSession; engine: Engine }) {
  const [panes, setPanes] = useImmer({ ...panesConfig, engineInfo: true })

  const togglePane = (key: keyof typeof panes) => setPanes({ ...panesConfig, [key]: true })

  return (
    <>
      <main className="bg-grid-grey/0 grid grid-rows-[2.75rem_minmax(5rem,auto)_1fr] overflow-hidden border-x sm:col-start-2">
        {/* Tab Bar */}
        <div className="flex w-full max-w-4xl justify-self-center overflow-x-auto border-x bg-muted">
          {chatsConfig.map((c) => (
            <TabTop key={c.id} title={c.name} />
          ))}
        </div>

        {/* Top Panel */}
        <div className="flex w-full max-w-4xl flex-col items-center justify-end gap-2 justify-self-center border-x border-b bg-background">
          <div className="text-sm text-muted-foreground">
            <p className="h-full">{engine.displayName}</p>
          </div>
          <div className="flex w-full overflow-x-auto">
            <TabButton
              text="Details"
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
            <TabButton
              text="Browser"
              isActive={panes.browser}
              onClick={() => togglePane('browser')}
            />
          </div>
        </div>

        {/* content area */}
        <div className="col-start-1 row-start-3 w-full max-w-4xl justify-self-center overflow-y-auto overflow-x-hidden border-x bg-background shadow-inner">
          {panes.engineInfo && (
            <TabContent className="">
              <EngineTable engine={engine} />
            </TabContent>
          )}

          {panes.messages && (
            <TabContent>
              <MessageFeed session={chatSession} engine={engine} />
            </TabContent>
          )}

          {panes.controls && (
            <TabContent>
              <EngineInputControls chatSession={chatSession} engine={engine} />
            </TabContent>
          )}

          {panes.browser && (
            <TabContent title="Engine Browser">
              {/* <EngineBrowser current={engine} /> */}
              {/* <EngineBrowser  /> */}
            </TabContent>
          )}
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
}
