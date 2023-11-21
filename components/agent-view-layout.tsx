'use client'

import { cn } from '@/lib/utils'
import { Tabs } from '@ark-ui/react/tabs'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import { useAgentDetail } from './queries-reloaded'
import { LoadingShapes } from './suite/loading-shapes'
import { Button } from './ui/button'

export function AgentViewLayout({
  params,
  className,
  children,
}: { params: string } & React.ComponentProps<'div'>) {
  const agentSlug = params

  const tabSlug = useSelectedLayoutSegment()

  console.log('agentSlug', agentSlug)
  console.log('tabSlug', tabSlug)

  const rootPath = `/agent/${agentSlug}`
  const activeTab = tabSlug ?? 'detail'

  const tabs = [
    { value: 'detail', label: 'Detail' },
    { value: 'parameters', label: 'Parameters' },
    { value: 'messages', label: 'Messages' },
  ]

  const agent = useAgentDetail(agentSlug)

  if (agent.isLoading)
    return (
      <div className="grid place-content-center">
        <LoadingShapes />
      </div>
    )

  return (
    <div className={cn('grid grid-rows-[auto_auto_1fr]', className)}>
      <div>
        <h2 className="px-10 py-6 text-lg font-semibold leading-none">{agent.data?.name}</h2>
      </div>

      <div className="border-b pb-0.5">
        <Tabs.Root defaultValue={activeTab}>
          <Tabs.List className="">
            {tabs.map((t) => (
              <Tabs.Trigger key={t.value} value={t.value} asChild>
                <Button
                  variant="ghost"
                  className={cn('text-sm font-normal hover:bg-background')}
                  asChild
                >
                  <Link href={rootPath + '/' + t.value}>{t.label}</Link>
                </Button>
              </Tabs.Trigger>
            ))}
            <Tabs.Indicator className="h-0.5 bg-primary" />
          </Tabs.List>
        </Tabs.Root>
      </div>

      <div className="">
        {agent.error && <p className="">{agent.error.message}</p>}
        {children}
      </div>

      {/* status bar */}
      {/* <div className="flex items-center gap-2 border-t px-4 font-mono text-sm">
        {!session && '?'}
        {session && <p className="">{session.id}</p>}
        {agentId && <p className="">{agentId}</p>}
      </div> */}
    </div>
  )
}
