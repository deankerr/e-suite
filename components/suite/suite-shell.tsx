'use client'

import { cn } from '@/lib/utils'
import { ChatBubbleIcon, HamburgerMenuIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { useState } from 'react'
import { InferenceBuffer } from '../inference-buffer/inference-buffer'
import { Button } from '../ui/button'
import { ThemeToggle } from '../ui/theme-toggle'
import { AgentDetailPanel } from './agent-detail-panel'
import { InferenceParameterPanel } from './inference-parameter-panel'
import { useAgentQuery, useTabs } from './queries'
import { SubMenuTabBar } from './submenu-tab-bar'
import { SuiteRailList } from './suite-rail-list'
import { SuiteStatusBar } from './suite-status-bar'
import { SuiteTabBar } from './suite-tab-bar'

export const tabsEnum = {
  detail: 'detail',
  parameters: 'parameters',
  buffer: 'buffer',
} as const

export function SuiteShell({}: {} & React.ComponentProps<'div'>) {
  const { focusedTab } = useTabs()
  const { data: agent } = useAgentQuery(focusedTab?.agentId)

  const [tab, setTab] = useState<keyof typeof tabsEnum>('detail')
  const [showNav, setShowNav] = useState(true)

  return (
    <div className="grid h-full grid-cols-[auto_1fr] grid-rows-[auto_2.75rem]">
      {/* SuiteRail */}
      {!showNav && <div />}
      <div className={cn(showNav ? 'flex' : 'hidden', 'flex-col border-r')}>
        <SuiteAppTitle className="h-12 border-b" />
        <div className="flex grow flex-col justify-between">
          <SuiteRailList className="px-2 py-4" />
          <div className="flex justify-around px-2 py-4">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* SuiteMain */}
      <div className="grid grid-rows-[auto_1fr] overflow-hidden xl:grid-cols-[auto_auto]">
        <div className="">
          <h2 className="p-6 text-lg font-semibold leading-none">
            <Button size="icon" variant="outline" onClick={() => setShowNav(!showNav)}>
              <HamburgerMenuIcon />
            </Button>{' '}
            {agent?.name}
          </h2>
          <SubMenuTabBar tab={tab} setTab={(v) => setTab(v)} className="" />
        </div>
        <AgentDetailPanel className={cn(tab !== 'detail' && 'hidden')} />
        <InferenceParameterPanel className={cn(tab !== 'parameters' && 'hidden')} />
        <InferenceBuffer className={cn(tab !== 'buffer' && 'hidden')} />
      </div>

      {/* SuiteStatusBar */}
      <SuiteStatusBar className="col-span-full col-start-1">
        <div>{/* Session: {session.user.role} {session.user.id} */}</div>
        {/* <div>{suite.userQuery.error?.message}</div> */}
        {/* <div>{suite.userQuery.isPending && <Loading size="xs" />}</div> */}
      </SuiteStatusBar>
    </div>
  )
}

function SuiteAppTitle({ className }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <Link
        className="inline-flex items-center justify-center gap-1.5 font-semibold tracking-tight"
        href="/"
      >
        <ChatBubbleIcon className="mb-0.5 h-5 w-5" />
        e/suite
      </Link>
    </div>
  )
}
