'use client'

import { Logo } from '@/app/components/ui/Logo'
import { cn } from '@/lib/utils'
import * as Tabs from '@radix-ui/react-tabs'
import { Heading } from '@radix-ui/themes'
import { ImageIcon, MessagesSquareIcon } from 'lucide-react'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import { useAppStore } from '../providers/AppStoreProvider'
import { Sidebar2 } from '../ui/Sidebar2'
import { ThemeToggle } from '../util/ThemeToggle'
import { ChatList } from './ChatList'
import { GenerationsList } from './GenerationsList'

type NavigationSidebarProps = {} & Partial<React.ComponentProps<typeof Sidebar2>>

export const NavigationSidebar = ({ className, children, ...props }: NavigationSidebarProps) => {
  const navigationSidebarOpen = useAppStore((state) => state.navigationSidebarOpen)
  const updateNavigationSidebarOpen = useAppStore((state) => state.updateNavigationSidebarOpen)

  const menuTabs = [
    ['Chat', <MessagesSquareIcon key="Chat" className="size-6" />],
    ['Generate', <ImageIcon key="Generate" className="size-6" />],
  ] as const

  const pathname = usePathname()
  const defaultTab = pathname.startsWith('/generate') ? 'Generate' : 'Chat'
  return (
    <Sidebar2
      id="navigation-sidebar"
      open={navigationSidebarOpen}
      onOpenChange={updateNavigationSidebarOpen}
      left
      {...props}
    >
      {/* site logo/title */}
      <div className={cn('h-full bg-gray-1', className)}>
        {/* top */}
        <div className="flex-between h-[--e-top-h] shrink-0 border-b border-gold-5 px-3.5">
          <NextLink href="/" className="flex h-full items-center gap-1.5">
            <Logo className="size-7 min-w-7" />
            <Heading size="5" className="">
              e/suite
            </Heading>
          </NextLink>
        </div>

        {/* tabs */}
        <Tabs.Root
          defaultValue={defaultTab}
          className="flex h-[calc(100%-var(--e-top-h)-var(--e-bottom-h))] grow flex-col @container"
        >
          <Tabs.List className={cn('flex h-14 shrink-0 items-center border-b')}>
            {menuTabs.map((t) => {
              const [title, icon] = t
              return (
                <Tabs.Trigger
                  key={title}
                  value={title}
                  className={cn(
                    'h-full w-full items-center justify-center gap-2 border-b-2 border-b-transparent text-gray-10',
                    'hover:bg-gray-2 hover:text-gray-11 data-[state=active]:border-b-accent data-[state=active]:text-gray-12 data-[state=active]:hover:text-gray-12',
                    'hidden data-[state=active]:flex @2xs:flex',
                  )}
                >
                  {icon}
                  <span className="hidden @2xs:inline">{title}</span>
                </Tabs.Trigger>
              )
            })}
          </Tabs.List>

          {/* chat */}
          <Tabs.Content value="Chat" asChild>
            <ChatList />
          </Tabs.Content>

          {/* generate */}
          <Tabs.Content value="Generate" asChild>
            <GenerationsList />
          </Tabs.Content>
        </Tabs.Root>

        <div className="flex-between h-16 w-full shrink-0 border-t p-3 @container sm:w-80">
          <div className="grow">{children}</div>
          <ThemeToggle />
        </div>
      </div>
    </Sidebar2>
  )
}
