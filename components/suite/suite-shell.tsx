'use client'

import { useSuite } from '@/lib/use-suite'
import { cn } from '@/lib/utils'
import { ChatBubbleIcon } from '@radix-ui/react-icons'
import { Session } from 'next-auth'
import Link from 'next/link'
import { SignInOutButton } from '../sign-in-out-button'
import { Loading } from '../ui/loading'
import { ThemeToggle } from '../ui/theme-toggle'
import { AgentDetailPanel } from './agent-detail-panel'
import { AgentTabBar } from './agent-tab-bar'
import { InferenceBuffer } from './inference-buffer'
import { ParameterPanel } from './parameter-panel'
import { SuiteRailList } from './suite-rail-list'
import { SuiteStatusBar } from './suite-status-bar'
import { SuiteTabBar } from './suite-tab-bar'

export function SuiteShell({ session }: { session: Session } & React.ComponentProps<'div'>) {
  const suite = useSuite()

  return (
    <div className="grid h-full grid-cols-[auto_1fr] grid-rows-[auto_2.75rem]">
      {/* SuiteRail */}
      <div className="flex flex-col border-r">
        <SuiteAppTitle className="h-12 border-b" />
        <div className="flex grow flex-col justify-between">
          <SuiteRailList className=" px-2 py-4" />
          {/* debug info */}
          <div className="mx-2 border p-2">
            <div className="text-center font-mono text-sm">{suite.userQuery.data?.name}</div>
          </div>
          <div className="flex justify-around px-2 py-4">
            <ThemeToggle />
            <SignInOutButton session={session} />
          </div>
        </div>
      </div>

      {/* SuiteMain */}
      <div className="grid grid-rows-[auto_1fr] overflow-hidden">
        <div className="">
          <SuiteTabBar className="h-12" />
          <AgentDetailPanel className="p-6" />
          <AgentTabBar className="" />
        </div>

        <div className="grid grid-cols-[60%_auto] overflow-hidden">
          <InferenceBuffer />
          <ParameterPanel className="border-l" />
        </div>
      </div>

      {/* SuiteStatusBar */}
      <SuiteStatusBar className="col-span-full col-start-1">
        <div>
          Session: {session.user.role} {session.user.id}
        </div>
        <div>{suite.userQuery.error?.message}</div>
        <div>{suite.userQuery.isPending && <Loading size="xs" />}</div>
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
