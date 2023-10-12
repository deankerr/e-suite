'use client'

import { ChatPanel } from '@/components/e-suite/chat/chat-panel'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Toggle } from '@/components/ui/toggle'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import * as R from 'remeda'

const chatsConfig = [
  { chatSessionId: 'P1', title: 'Piñata', active: true },
  { chatSessionId: 'G2', title: 'Gretchen', active: false },
  { chatSessionId: 'H3', title: 'Hideko', active: false },
  { chatSessionId: 'E4', title: 'Ernest', active: false },
]

type Props = {}

export function ChatApp(props: Props) {
  const [hStyle] = useState(() => randomText())
  const [chats, setChats] = useState(chatsConfig)
  // const activeCount = chats.

  return (
    <div className="bg-grid-grey grid h-[100svh] grid-rows-[auto_minmax(0,_1fr)]">
      {/* Header Bar */}
      <div
        id="ui-header"
        className="flex w-screen flex-row items-center justify-between bg-background px-8 py-1 text-foreground"
      >
        <div className="w-[50%]">
          <h1 className={cn('text-xl', hStyle)} title={hStyle} suppressHydrationWarning>
            e/suite
          </h1>
        </div>

        <div className="flex gap-1">
          {/* Active Chat Toggles */}
          {chats.map((chat) => (
            <Toggle
              variant="outline"
              pressed={chat.active}
              onPressedChange={(pressed) => {
                const newChats = chats.map((c) =>
                  c.chatSessionId === chat.chatSessionId ? { ...chat, active: pressed } : c,
                )
                setChats(newChats)
              }}
              key={chat.chatSessionId}
            >
              {chat.title}
            </Toggle>
          ))}
        </div>

        <div className="flex w-[50%] justify-end">
          <ThemeToggle />
        </div>
      </div>

      {/* Chat Panels */}
      <main className="flex h-full justify-center">
        {chats.map((chat) =>
          chat.active ? <ChatPanel {...chat} key={chat.chatSessionId} /> : null,
        )}
      </main>
    </div>
  )
}

function randomText() {
  const fnt = R.shuffle(['font-mono', 'font-serif', 'font-sans'])[0]
  const wgt = R.shuffle([
    'font-thin',
    'font-extralight',
    'font-light',
    'font-normal',
    'font-medium',
    'font-semibold',
    'font-bold',
    'font-extrabold',
    'font-black',
  ])[0]
  const trk = R.shuffle([
    'tracking-tighter',
    'tracking-tight',
    'tracking-normal',
    'tracking-wide',
    'tracking-wider',
    'tracking-widest',
  ])[0]
  const it = Math.random() > 0.9 ? 'italic' : ''
  return cn(fnt, wgt, trk, it)
}
