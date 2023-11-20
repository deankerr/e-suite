'use client'

import { Session } from '@/lib/server'
import { cn } from '@/lib/utils'
import theSun from '/assets/icons/sun-white.svg'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { InferenceBuffer } from '../inference-buffer/inference-buffer'
import { Loading } from '../ui/loading'
import { ThemeToggle } from '../ui/theme-toggle'
import { UserMenuButton } from '../user-menu-button'
import { AgentDetailPanel } from './agent-detail-panel'
import { InferenceParameterPanel } from './inference-parameter-panel'
import { LoadingShapes } from './loading-shapes'
import { NavTree } from './nav-tree'
import { useActiveAgent, usePathnameFocusedAgentId } from './queries-reloaded'
import { SubMenuTabBar } from './submenu-tab-bar'
import { SuiteAppTitle } from './suite-app-title'

export function SuiteShell({
  session,
  className,
  children,
}: { session: Session } & React.ComponentProps<'div'>) {
  const agentId = usePathnameFocusedAgentId()
  const params = useParams()
  const tab = params.id ? params.id[1] : undefined
  const agent = useActiveAgent()
  return (
    <div
      className={cn(
        'grid h-full grid-flow-col grid-cols-[auto_1fr] grid-rows-[84px_1fr_54px]',
        className,
      )}
    >
      {/* navbar title */}
      <div className="flex items-center justify-center border-r bg-muted pr-5">
        <SuiteAppTitle className="" />
      </div>
      {/* nav tree */}
      <div className="flex flex-col border-r bg-muted">
        <NavTree className="w-60" />
        <div className="grid grow place-content-center">
          {/* eslint-disable-next-line @next/next/no-img-element, react/jsx-no-undef */}
          <Image src={theSun} alt="sun" className="w-52 max-w-[13rem] opacity-10" priority />
        </div>
      </div>
      {/* navbar end */}
      <div className="flex items-center justify-between border-r border-t bg-muted px-8 pb-4">
        <UserMenuButton session={session} />
        <ThemeToggle />
      </div>

      {/* main */}
      {/* header bar */}
      <div className="flex items-center gap-6 px-4">
        {agent.isLoading && <Loading />}
        {agent.error && `Error: ${agent.error.message}`}
        {agent.data && (
          <>
            <h2 className="text-lg font-semibold leading-none">{agent.data.name}</h2>
            <SubMenuTabBar className="self-end" />
          </>
        )}
      </div>

      {/* content */}
      <div className="grid">
        {tab === 'detail' ? (
          <AgentDetailPanel />
        ) : tab === 'parameters' ? (
          <InferenceParameterPanel />
        ) : tab === 'buffer' ? (
          <InferenceBuffer />
        ) : (
          <LoadingShapes />
        )}
      </div>

      {/* status bar */}
      <div className="flex items-center border-t px-4">
        {agentId && <p className="font-mono text-sm">{agentId}</p>}
      </div>
    </div>
  )
}
