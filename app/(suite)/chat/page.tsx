'use client'

import { ChatPanelTab } from '@/components/chat/chat-panel-tab'
import { initialChatsConfig } from '@/components/chat/config'
import { getChatModels } from '@/lib/api'
import { cn } from '@/lib/utils'
import { DotFilledIcon } from '@radix-ui/react-icons'
import { useState } from 'react'

type Props = {}

export default function ChatPage(props: Props) {
  const modelsAvailable = getChatModels()

  const [currentTab, setCurrentTab] = useState(initialChatsConfig[1]!)

  return (
    <>
      <div className="flex h-10 w-full flex-none bg-muted">
        {initialChatsConfig.map((c) => (
          <Tab
            key={c.id}
            title={c.panel.title}
            active={c.id === currentTab.id}
            onClick={() => setCurrentTab(c)}
          />
        ))}
      </div>

      <ChatPanelTab session={currentTab} modelsAvailable={modelsAvailable} />
    </>
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
