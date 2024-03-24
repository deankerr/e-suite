'use client'

import { Logo } from '@/app/components/ui/Logo'
import { cn } from '@/lib/utils'
import { Heading } from '@radix-ui/themes'
import NextLink from 'next/link'
import { useAppStore } from '../providers/AppStoreProvider'
import { Sidebar2 } from '../ui/Sidebar'

type NavigationSidebarProps = {} & Partial<React.ComponentProps<typeof Sidebar2>>

export const NavigationSidebar = ({ className, ...props }: NavigationSidebarProps) => {
  const navigationSidebarOpen = useAppStore((state) => state.navigationSidebarOpen)
  const updateNavigationSidebarOpen = useAppStore((state) => state.updateNavigationSidebarOpen)

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
        <div className="flex-between h-[--e-header-h] shrink-0 border-b border-gold-5 px-3.5">
          <NextLink href="/" className="flex h-full items-center gap-1.5">
            <Logo className="size-7 min-w-7" />
            <Heading size="5" className="">
              e/suite
            </Heading>
          </NextLink>
        </div>
      </div>
    </Sidebar2>
  )
}
