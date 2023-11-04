'use client'

import { ChatTab, Engine } from '@/lib/db'
import { useTransition } from 'react'
import { setChatTabEngine } from './actions'
import { EnginesDataTable } from './engines/data-table'

export function EngineBrowser({ engines = [], chatTab }: { engines: Engine[]; chatTab?: ChatTab }) {
  const [isPending, startTransition] = useTransition()

  const setActive = (engineId: string) => {
    if (!chatTab) return
    startTransition(() => {
      setChatTabEngine(chatTab.id, engineId)
    })
  }

  return (
    <>
      <h3 className="font-semibold leading-none tracking-tight">EngineBrowser</h3>
      <EnginesDataTable data={engines} active={chatTab?.engineId} setActive={setActive} />
    </>
  )
}
