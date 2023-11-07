'use client'

import { cn } from '@/lib/utils'
import { ChatBubbleIcon } from '@radix-ui/react-icons'
import { Session } from 'next-auth'
import Link from 'next/link'
import { MainStatusBar } from '../main-status-bar'
import { SignInOutButton } from '../sign-in-out-button'
import { ThemeToggle } from '../ui/theme-toggle'
import { AgentDetailPanel } from './agent-detail-panel'
import { AgentFeed } from './agent-feed'
import { AgentTabBar } from './agent-tab-bar'
import { AppSidebarList } from './app-sidebar-list'
import { AppTabBar } from './app-tab-bar'
import { ParameterPanel } from './parameter-panel'

export function AppShell({ session }: { session: Session } & React.ComponentProps<'div'>) {
  return (
    <div className="grid h-full grid-cols-[auto_1fr] grid-rows-[auto_2.75rem]">
      {/* SuiteRail */}
      <div className="flex flex-col border-r p-3">
        <MainAppTitle />
        <AppSidebarList />
        <div className="flex justify-center gap-4">
          <SignInOutButton session={session} />
          <ThemeToggle />
        </div>
      </div>

      {/* SuiteMain */}
      <div className="grid grid-rows-[auto_1fr] overflow-hidden">
        <div className="">
          <AppTabBar className="h-12" />
          <AgentDetailPanel className="p-6" />
          <AgentTabBar className="" />
        </div>

        <div className="grid grid-flow-col overflow-hidden">
          <AgentFeed className="overflow-y-auto p-6" />
          <ParameterPanel className="border-l" />
        </div>
      </div>

      {/* SuiteStatus */}
      <MainStatusBar className="col-span-full col-start-1" session={session} />
    </div>
  )
}
{
}

function MainAppTitle({ className }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('', className)}>
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
