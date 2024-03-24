'use client'

import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'
import { Heading } from '@radix-ui/themes'
import { useQuery } from 'convex/react'
import {
  FileImageIcon,
  MenuIcon,
  MessageSquareIcon,
  SlidersHorizontalIcon,
  XIcon,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import { forwardRef } from 'react'
import { useAppStore } from '../providers/AppStoreProvider'
import { UIIconButton } from './UIIconButton'

type TopBarProps = {
  extraTitle?: string
} & React.ComponentProps<'div'>

export const TopBar = forwardRef<HTMLDivElement, TopBarProps>(function TopBar(
  { extraTitle, className, ...props },
  forwardedRef,
) {
  const navigationSidebarOpen = useAppStore((state) => state.navigationSidebarOpen)
  const toggleNavigationSidebar = useAppStore((state) => state.toggleNavigationSidebar)

  const sidebarOpen = useAppStore((state) => state.sidebarOpen)
  const toggleSidebar = useAppStore((state) => state.toggleSidebar)

  const threadsList = useQuery(api.threads.threads.list, {})
  const generationsList = useQuery(api.generations.do.list, {})

  const pathname = usePathname()
  const [_, routePath, slug] = pathname.split('/')

  const route = {
    home: !routePath,
    chat: routePath === 'chat',
    generate: routePath === 'generate',
  }

  const getThreadTitle = () => {
    const title = threadsList?.find(({ _id }) => _id === slug)?.title
    return title ?? 'New Chat'
  }

  const getGenerationTitle = () => {
    const generation = generationsList?.find(({ _id }) => _id === slug)
    const title = generation?.images?.[0]?.parameters?.prompt
    return title ?? 'New Generation'
  }

  const title = route.chat ? getThreadTitle() : route.generate ? getGenerationTitle() : ''
  const Icon = route.chat ? MessageSquareIcon : route.generate ? FileImageIcon : null

  return (
    <div
      {...props}
      className={cn('flex-between h-[--e-top-h] shrink-0 border-b bg-gray-1 px-2', className)}
      ref={forwardedRef}
    >
      {/* start */}
      <div className="shrink-0">
        <UIIconButton label="toggle navigation bar" onClick={toggleNavigationSidebar}>
          {navigationSidebarOpen ? (
            <MenuIcon className="size-7" />
          ) : (
            <MenuIcon className="size-7" />
          )}
        </UIIconButton>
      </div>

      {/* start/middle */}
      <div className="flex-center grow gap-2.5">
        {extraTitle}
        {Icon && <Icon />}
        <Heading size="3">{title}</Heading>
      </div>

      {/* end */}
      <div className="shrink-0">
        {!route.home && (
          <UIIconButton label="toggle parameters sidebar" onClick={toggleSidebar}>
            {sidebarOpen ? <XIcon /> : <SlidersHorizontalIcon />}
          </UIIconButton>
        )}
      </div>
    </div>
  )
})
