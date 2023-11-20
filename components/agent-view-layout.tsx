'use client'

import { cn } from '@/lib/utils'
import { AgentViewTabs } from './agent-view-tabs'

export function AgentViewLayout({ className, children }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('grid grid-rows-[auto_auto_1fr]', className)}>
      {/* header bar */}
      <div>
        <h2 className="px-10 py-6 text-lg font-semibold leading-none">
          {/* {agent?.data?.name ?? 'Loading'} */}Agent Name Here
        </h2>
        {/* {agent.error && `Error: ${agent.error.message}`} */}
      </div>

      <AgentViewTabs />

      <div className="">{children}</div>

      {/* status bar */}
      {/* <div className="flex items-center gap-2 border-t px-4 font-mono text-sm">
        {!session && '?'}
        {session && <p className="">{session.id}</p>}
        {agentId && <p className="">{agentId}</p>}
      </div> */}
    </div>
  )
}
