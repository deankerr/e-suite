'use client'

import { ChatPanel } from '@/components/e-suite/chat/chat-panel'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Toggle } from '@/components/ui/toggle'
import { cn, raise } from '@/lib/utils'
import { useEffect, useState } from 'react'
import * as R from 'remeda'
import { DraftFunction, useImmer } from 'use-immer'
import { initialChatsConfig } from './config'
import { ChatSession } from './types'

type Props = {}

export function ChatApp(props: Props) {
  const [hStyle] = useState(() => randomText())

  const [chatSessions, setChatSessions] = useImmer(() => {
    const chats: Record<ChatSession['id'], ChatSession> = {}
    for (const chat of initialChatsConfig) {
      chats[chat.id] = chat
    }
    return chats
  })

  const getChatById = (id: string) => chatSessions[id] ?? raise('no chat session with this id')

  const updateChatById = (id: string) => {
    return (fn: DraftFunction<ChatSession>) => {
      setChatSessions((chats) => {
        const chat = chats[id] ?? raise('no chat session with this id')
        fn(chat)
      })
    }
  }

  const [panels, setPanels] = useState(() => initialChatsConfig.map((c) => c.id))

  useEffect(() => {
    console.log(chatSessions)
  }, [chatSessions])

  return (
    <div className="bg-grid-grey grid h-[100svh] grid-rows-[auto_minmax(0,_1fr)]">
      {/* //* Header Bar */}
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
          {/* //* Active Chat Toggles */}
          {panels.map((id) => (
            <Toggle
              variant="outline"
              pressed={chatSessions[id]?.panel.active}
              onPressedChange={(pressed) => {
                updateChatById(id)((chat) => {
                  chat.panel.active = pressed
                })
              }}
              key={id}
            >
              {chatSessions[id]?.panel.title}
            </Toggle>
          ))}
        </div>

        <div className="flex w-[50%] justify-end">
          <ThemeToggle />
        </div>
      </div>

      {/* //* Chat Panels */}
      <main className="flex h-full justify-center">
        {panels.map((id) => {
          const session = getChatById(id)
          return session.panel.active ? (
            <ChatPanel session={session} updateSession={updateChatById(id)} key={id} />
          ) : null
        })}
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
