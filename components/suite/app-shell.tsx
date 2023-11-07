'use client'

import { Session } from 'next-auth'
import { AgentDetailPanel } from './agent-detail-panel'
import { AgentFeed } from './agent-feed'
import { AppSidebarList } from './app-sidebar-list'
import { AppTabBar } from './app-tab-bar'
import { ParameterPanel } from './parameter-panel'

export function AppShell({
  session,
  className,
  children,
}: { session: Session } & React.ComponentProps<'div'>) {
  return (
    <div className="grid grid-cols-12 grid-rows-[3rem_9rem_auto] overflow-hidden">
      <AppSidebarList className="col-span-2 row-span-full " />
      <AppTabBar className="col-span-10 col-start-3" />
      <AgentDetailPanel className="col-span-10 col-start-3" />
      <AgentFeed className="col-span-6 col-start-3 overflow-hidden" />
      <ParameterPanel className="col-span-4 col-start-9" />
    </div>
  )
}
