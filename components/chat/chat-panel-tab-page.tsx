'use client'

//# layout mockup implementation
import { ChatPanelTab } from '@/components/chat/chat-panel-tab'
import { initialChat1Config } from '@/components/chat/chat1-config'
import { getChatModels } from '@/lib/api'
import { cn } from '@/lib/utils'
import { DotFilledIcon } from '@radix-ui/react-icons'
import { useState } from 'react'

type Props = {}

export default function ChatPanelTabPage(props: Props) {
  const modelsAvailable = getChatModels()

  const [currentTab, setCurrentTab] = useState(initialChat1Config[1]!)

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-10 w-full flex-none bg-muted">
        {initialChat1Config.map((c) => (
          <Tab
            key={c.id}
            title={c.panel.title}
            active={c.id === currentTab.id}
            onClick={() => setCurrentTab(c)}
          />
        ))}
      </div>

      <ChatPanelTab session={currentTab} modelsAvailable={modelsAvailable} />
    </div>
  )
}

function Tab(props: { title: string; active: boolean } & React.ComponentProps<'div'>) {
  const { title, active, ...rest } = props
  return (
    <div
      className={cn(
        'flex h-full items-center justify-between border-primary px-3 text-sm font-medium',
        active ? 'border-t-2 bg-background' : 'bg-muted',
      )}
      {...rest}
    >
      <div className="px-1"></div>
      {title}
      <DotFilledIcon />
    </div>
  )
}
