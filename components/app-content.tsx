'use client'

import { Session } from '@/lib/server'
import { cn } from '@/lib/utils'
import { useParams } from 'next/navigation'
import { InferenceBuffer } from './inference-buffer/inference-buffer'
import { useActiveAgent, usePathnameFocusedAgentId } from './queries-reloaded'
import { AgentDetailPanel } from './suite/agent-detail-panel'
import { InferenceParameterPanel } from './suite/inference-parameter-panel'
import { LoadingShapes } from './suite/loading-shapes'
import { SubMenuTabBar } from './suite/submenu-tab-bar'

export async function AppContent({
  session,
  className,
  children,
}: { session: Session | null } & React.ComponentProps<'div'>) {
  // const agentId = usePathnameFocusedAgentId()
  // const params = useParams()0
  // const tab = params.id ? params.id[1] : undefined
  // const agent = useActiveAgent()

  // if (agent.isLoading) return <LoadingShapes />
  // 'AgentView'
  return (
    <div className={cn('grid grid-rows-[auto_1fr_54px]', className)}>
      {/* header bar */}
      <div>
        <h2 className="px-10 py-6 text-lg font-semibold leading-none">
          {/* {agent?.data?.name ?? 'Loading'} */}Heading
        </h2>
        {/* {agent.error && `Error: ${agent.error.message}`} */}
        <SubMenuTabBar className="" />
      </div>

      <div className="">
        {children}
        {/* {tab === 'detail' ? (
          <AgentDetailPanel />
        ) : tab === 'parameters' ? (
          <InferenceParameterPanel />
        ) : tab === 'buffer' ? (
          <InferenceBuffer />
        ) : (
          <LoadingShapes />
        )} */}
      </div>

      {/* status bar */}
      <div className="flex items-center gap-2 border-t px-4 font-mono text-sm">
        {!session && '?'}
        {session && <p className="">{session.id}</p>}
        {/* {agentId && <p className="">{agentId}</p>} */}
      </div>
    </div>
  )
}
