'use client'

import { GenerationForm } from '@/app/components/generations/GenerationForm'
import { GenerationShell } from '@/app/components/generations/GenerationShell'
import { navbarOpenAtom } from '@/components/atoms'
import { useAppStore } from '@/components/providers/AppStoreProvider'
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

type GenerateProps = {
  generationId?: Id<'generations'>
} & React.ComponentProps<'div'>

export const Generate = ({ generationId, className, ...props }: GenerateProps) => {
  const [navbarIsOpen, setNavbarOpen] = useAtom(navbarOpenAtom)

  const generation = useQuery(api.generations.do.get, generationId ? { id: generationId } : 'skip')
  const isLoading = generationId && !generation

  const title = generationId ? generation?.images?.[0]?.parameters?.prompt : 'new'

  const sidebarOpen = useAppStore((state) => state.sidebarOpen)
  const toggleSidebar = useAppStore((state) => state.toggleSidebar)
  const updateSidebarOpen = useAppStore((state) => state.updateSidebarOpen)

  return (
    <div
      {...props}
      className={cn('flex grow flex-col overflow-y-auto overflow-x-hidden', className)}
    >
      {/* header */}
      <div className="flex-between z-40 h-[--e-header-h] shrink-0 border-b border-gold-5 bg-gray-1 sm:px-4">
        {/* open navbar button */}
        <div className="shrink-0">
          {!navbarIsOpen && (
            <UIIconButton
              label="open navigation bar"
              className="sm:hidden"
              onClick={() => setNavbarOpen(!navbarIsOpen)}
            >
              <MenuIcon className="size-7" />
            </UIIconButton>
          )}
        </div>

        {/* page title */}
        <div className="flex-center sm:flex-start grow gap-1">
          <Heading size="3" className="hidden sm:block">
            generate
          </Heading>
          <Heading size="4" className="hidden font-normal text-accent-11 sm:block">
            /
          </Heading>
          <Heading size="3" className="truncate">
            {title}
          </Heading>
          {isLoading && <LoaderBars />}
        </div>

        <div className="shrink-0">
          {/* sidebar button */}
          <UIIconButton label="toggle sidebar" onClick={toggleSidebar}>
            {sidebarOpen ? <XIcon /> : <SlidersHorizontalIcon />}
          </UIIconButton>
        </div>
      </div>

      {/* main */}
      <div className="flex h-full">
        {/* content */}
        <div className={cn('flex-center grow', sidebarOpen ? 'md:mr-80' : '')}>
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
