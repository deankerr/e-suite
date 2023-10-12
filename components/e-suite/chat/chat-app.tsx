'use client'

import { ChatPanel } from '@/components/e-suite/chat/chat-panel'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Toggle } from '@/components/ui/toggle'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import * as R from 'remeda'

type Props = {}

export function ChatApp(props: Props) {
  const [hStyle] = useState(() => randomText())
  const [panelsActive, setPanelsActive] = useState({ p1: true, p2: false, p3: false })

  return (
    <div className="bg-grid-grey grid h-[100svh] grid-rows-[auto_minmax(0,_1fr)]">
      {/* Header Bar */}
      <div
        id="ui-header"
        className="flex w-screen flex-row items-center justify-between bg-background px-8 py-1 text-foreground"
      >
        <div className="w-[50%]">
          <h1 className={cn('text-xl', hStyle)} title={hStyle}>
            e/suite
          </h1>
        </div>

        <div className="flex gap-1">
          <Toggle
            variant="outline"
            pressed={panelsActive.p1}
            onPressedChange={(pressed) => setPanelsActive({ ...panelsActive, p1: pressed })}
          >
            P
          </Toggle>
          <Toggle
            variant="outline"
            pressed={panelsActive.p2}
            onPressedChange={(pressed) => setPanelsActive({ ...panelsActive, p2: pressed })}
          >
            G
          </Toggle>
          <Toggle
            variant="outline"
            pressed={panelsActive.p3}
            onPressedChange={(pressed) => setPanelsActive({ ...panelsActive, p3: pressed })}
          >
            H
          </Toggle>
        </div>

        <div className="flex w-[50%] justify-end">
          <ThemeToggle />
        </div>
      </div>

      {/* Main */}
      <main className="flex h-full bg-red-300">
        {panelsActive.p1 && <ChatPanel chatSessionId="P1" title="Piñata" />}
        {panelsActive.p2 && <ChatPanel chatSessionId="G2" title="Gretchen" />}
        {panelsActive.p3 && <ChatPanel chatSessionId="H3" title="Hideko" />}
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
