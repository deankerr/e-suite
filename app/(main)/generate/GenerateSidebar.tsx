import { forwardRef } from 'react'
import { ScrollArea, Tabs } from '@radix-ui/themes'

import { GenerationForm } from '@/components/generations/GenerationForm'
import { useAppStore } from '@/components/providers/AppStoreProvider'
import { Sidebar } from '@/components/ui/Sidebar'
import { Generation } from '@/convex/generations/do'
import { cn } from '@/lib/utils'

type GenerateSidebarProps = {
  generation?: Generation
} & React.ComponentProps<'div'>

export const GenerateSidebar = forwardRef<HTMLDivElement, GenerateSidebarProps>(
  function GenerateSidebar({ className, ...props }, forwardedRef) {
    const sidebarOpen = useAppStore((state) => state.sidebarOpen)
    const updateSidebarOpen = useAppStore((state) => state.updateSidebarOpen)

    return (
      <Sidebar
        {...props}
        right
        open={sidebarOpen}
        onOpenChange={updateSidebarOpen}
        className={cn('bg-gray-1', className)}
        ref={forwardedRef}
      >
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
    )
  },
)
