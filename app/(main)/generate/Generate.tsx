'use client'

import { GenerationForm } from '@/app/components/generations/GenerationForm'
import { GenerationShell } from '@/app/components/generations/GenerationShell'
import { useAppStore } from '@/components/providers/AppStoreProvider'
import { LoaderBars } from '@/components/ui/LoaderBars'
import { Sidebar } from '@/components/ui/Sidebar'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { cn } from '@/lib/utils'
import { ScrollArea, Tabs } from '@radix-ui/themes'
import { useQuery } from 'convex/react'

type GenerateProps = {
  generationId?: Id<'generations'>
} & React.ComponentProps<'div'>

export const Generate = ({ generationId, className, ...props }: GenerateProps) => {
  const generationsList = useQuery(api.generations.do.list, {})
  const generation = generationsList?.find((g) => g._id === generationId)

  const sidebarOpen = useAppStore((state) => state.sidebarOpen)
  const updateSidebarOpen = useAppStore((state) => state.updateSidebarOpen)

  return (
    <div
      {...props}
      className={cn('flex grow flex-col overflow-y-auto overflow-x-hidden', className)}
    >
      {/* main */}
      <div className="flex h-full">
        {/* content */}
        <div className={cn('flex-center grow')}>
          {generation && <GenerationShell generation={generation} />}
          {generationId && !generation && <LoaderBars className="w-1/2" />}
        </div>

        {/* sidebar */}
        <Sidebar side="right" open={sidebarOpen} onOpenChange={updateSidebarOpen}>
          <Tabs.Root defaultValue="parameters" className="">
            <Tabs.List>
              <Tabs.Trigger value="parameters">Parameters</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="parameters" asChild>
              <ScrollArea scrollbars="vertical">
                <GenerationForm className="flex w-80 flex-col gap-4 px-2.5 pt-4" />
              </ScrollArea>
            </Tabs.Content>
          </Tabs.Root>
        </Sidebar>
      </div>
    </div>
  )
}
