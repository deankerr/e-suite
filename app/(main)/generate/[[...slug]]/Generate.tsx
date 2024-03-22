'use client'

import { GenerationForm } from '@/app/components/generations/GenerationForm'
import { GenerationShell } from '@/app/components/generations/GenerationShell'
import { navbarOpenAtom } from '@/components/atoms'
import { LoaderBars } from '@/components/ui/LoaderBars'
import { Sidebar } from '@/components/ui/Sidebar'
import { UIIconButton } from '@/components/ui/UIIconButton'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { cn } from '@/lib/utils'
import { Heading, ScrollArea, Tabs } from '@radix-ui/themes'
import { useQuery } from 'convex/react'
import { useAtom } from 'jotai'
import { MenuIcon, SlidersHorizontalIcon, XIcon } from 'lucide-react'
import { useState } from 'react'

type GenerateProps = {
  generationId?: Id<'generations'>
} & React.ComponentProps<'div'>

export const Generate = ({ generationId, className, ...props }: GenerateProps) => {
  const [navbarIsOpen, setNavbarOpen] = useAtom(navbarOpenAtom)
  const [sidebarROpen, setSidebarROpen] = useState(true)

  const generation = useQuery(api.generations.do.get, generationId ? { id: generationId } : 'skip')
  const isLoading = generationId && !generation

  const title = generation?.images?.[0]?.parameters?.prompt

  return (
    <div {...props} className={cn('flex grow flex-col overflow-y-auto', className)}>
      {/* header */}
      <div className="flex-between z-40 h-[--e-header-h] shrink-0 border-b border-gold-7 px-3">
        {/* open navbar button */}
        {!navbarIsOpen && (
          <UIIconButton
            label="open navigation bar"
            className="sm:hidden"
            onClick={() => setNavbarOpen(!navbarIsOpen)}
          >
            <MenuIcon className="size-7" />
          </UIIconButton>
        )}

        {/* page title */}
        <div className="flex-between gap-2">
          <Heading size="4" className="text-accent-11">
            /
          </Heading>
          <Heading size="3">generate</Heading>
          <Heading size="4" className="text-accent-11">
            /
          </Heading>
          <Heading size="3">{title}</Heading>
          {isLoading && <LoaderBars />}
        </div>

        {/* sidebar button */}
        <UIIconButton label="toggle sidebar" onClick={() => setSidebarROpen(!sidebarROpen)}>
          {sidebarROpen ? <XIcon /> : <SlidersHorizontalIcon />}
        </UIIconButton>
      </div>

      {/* main */}
      <div className="flex h-full">
        {/* content */}
        <div className="flex-center grow">
          {generation && <GenerationShell generation={generation} />}
          {generationId && !generation && <LoaderBars className="w-1/2" />}
        </div>

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
