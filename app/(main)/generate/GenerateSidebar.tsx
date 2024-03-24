import { GenerationForm } from '@/app/components/generations/GenerationForm'
import { useAppStore } from '@/components/providers/AppStoreProvider'
import { Sidebar2 } from '@/components/ui/Sidebar2'
import { Generation } from '@/convex/generations/do'
import { cn } from '@/lib/utils'
import { ScrollArea, Tabs } from '@radix-ui/themes'
import { forwardRef } from 'react'

type GenerateSidebarProps = {
  generation?: Generation
} & React.ComponentProps<'div'>

export const GenerateSidebar = forwardRef<HTMLDivElement, GenerateSidebarProps>(
  function GenerateSidebar({ className, ...props }, forwardedRef) {
    const sidebarOpen = useAppStore((state) => state.sidebarOpen)
    const updateSidebarOpen = useAppStore((state) => state.updateSidebarOpen)

    return (
      <Sidebar2
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
      </Sidebar2>
    )
  },
)
