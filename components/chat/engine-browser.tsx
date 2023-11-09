'use client'

import { Engine } from '@/lib/db'
import { useTransition } from 'react'
import { EnginesDataTable } from './engines/data-table'

export function EngineBrowser({ engines = [] }: { engines: Engine[] }) {
  const [isPending, startTransition] = useTransition()

  const setActive = (engineId: string) => {
    // if (!chatTab) return
    // startTransition(() => {
    //   setChatTabEngine(chatTab.id, engineId)
    // })
  }

  return (
    <>
      <h3 className="font-semibold leading-none tracking-tight">EngineBrowser</h3>
      {/* <p>active: {chatTab?.engineId ?? 'none'}</p> */}
      <EnginesDataTable data={engines} active={''} setActive={setActive} />
    </>
  )
}
