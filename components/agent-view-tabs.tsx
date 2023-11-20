'use client'

import { cn } from '@/lib/utils'
import { Tabs } from '@ark-ui/react/tabs'
import Link from 'next/link'
import { usePathname, useSelectedLayoutSegment, useSelectedLayoutSegments } from 'next/navigation'
import { Button } from './ui/button'

export function AgentViewTabs({ className, children }: React.ComponentProps<'div'>) {
  const segments = useSelectedLayoutSegments()
  const rootPath = `/agent/${segments[0]}`
  const activeTab = segments[1] ?? 'detail'

  const tabs = [
    { value: 'detail', label: 'Detail' },
    { value: 'parameters', label: 'Parameters' },
    { value: 'messages', label: 'Messages' },
  ]

  return (
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
  )
}
