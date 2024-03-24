'use client'

import { cn } from '@/lib/utils'
import { Heading } from '@radix-ui/themes'
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

type TopBarProps = {} & React.ComponentProps<'div'>

export const TopBar = forwardRef<HTMLDivElement, TopBarProps>(function TopBar(
  { className, ...props },
  forwardedRef,
) {
  const navigationSidebarOpen = useAppStore((state) => state.navigationSidebarOpen)
  const toggleNavigationSidebar = useAppStore((state) => state.toggleNavigationSidebar)

  const sidebarOpen = useAppStore((state) => state.sidebarOpen)
  const toggleSidebar = useAppStore((state) => state.toggleSidebar)

  // title
  const pathname = usePathname()
  const [_, route, slug] = pathname.split('/')

  const threadsList = useAppStore((state) => state.threadsList)

  const getThreadTitle = () => {
    const title = threadsList?.find(({ _id }) => _id === slug)?.title
    return title ?? 'New Chat'
  }

  const title = route === 'chat' ? getThreadTitle() : 'Generation?'
  const Icon = route === 'chat' ? MessageSquareIcon : route === 'generation' ? FileImageIcon : null

  return (
    <div
      {...props}
      className={cn('flex-between h-[--e-top-h] shrink-0 border-b bg-gray-1 sm:px-4', className)}
      ref={forwardedRef}
    >
      {/* start */}
      <div className="shrink-0">
        <UIIconButton label="toggle navigation bar" className="" onClick={toggleNavigationSidebar}>
          {navigationSidebarOpen ? (
            <MenuIcon className="size-7" />
          ) : (
            <MenuIcon className="size-7" />
          )}
        </UIIconButton>
      </div>

      {/* start/middle */}
      <div className="flex-center grow gap-2">
        {Icon && <Icon />}
        <Heading size="3" className="">
          {title}
        </Heading>
      </div>

      {/* end */}
      <div className="shrink-0">
        <UIIconButton label="toggle parameters sidebar" onClick={toggleSidebar}>
          {sidebarOpen ? <XIcon /> : <SlidersHorizontalIcon />}
        </UIIconButton>
      </div>
    </div>
  )
})
