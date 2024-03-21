'use client'

import { GenerationForm } from '@/app/components/generations/GenerationForm'
import { Sidebar } from '@/components/ui/Sidebar'
import { UIIconButton } from '@/components/ui/UIIconButton'
import { cn } from '@/lib/utils'
import { Heading, ScrollArea, Tabs } from '@radix-ui/themes'
import { SlidersHorizontalIcon, XIcon } from 'lucide-react'
import { useState } from 'react'

type GenerateProps = {} & React.ComponentProps<'div'>

export const Generate = ({ className, ...props }: GenerateProps) => {
  const [sidebarROpen, setSidebarROpen] = useState(true)

  return (
    <div {...props} className={cn('flex grow flex-col overflow-y-auto', className)}>
      {/* header */}
      <div className="flex-between h-[--e-header-h] shrink-0 border-b border-gold-7 px-3">
        {/* page title */}
        <div className="flex-between gap-2">
          <Heading size="3">Generate</Heading>
          <Heading size="4" className="text-accent-11">
            /
          </Heading>
          <Heading size="3">New</Heading>
        </div>

        {/* sidebar button */}
        <UIIconButton label="toggle sidebar" onClick={() => setSidebarROpen(!sidebarROpen)}>
          {sidebarROpen ? <XIcon /> : <SlidersHorizontalIcon />}
        </UIIconButton>
      </div>

      {/* main */}
      <div className="flex h-full">
        {/* content */}
        <div className="flex-center grow"></div>

        {/* sidebar */}
        <Sidebar side="right" open={sidebarROpen} onOpenChange={setSidebarROpen}>
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
