'use client'

import { IconButton } from '@/app/components/ui/IconButton'
import { Logo } from '@/app/components/ui/Logo'
import { UserButton } from '@/app/components/UserButton'
import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'
import * as Tabs from '@radix-ui/react-tabs'
import { Heading } from '@radix-ui/themes'
import { useQuery } from 'convex/react'
import { useAtom } from 'jotai'
import { ImageIcon, MessagesSquareIcon, PanelLeftCloseIcon, PanelLeftOpenIcon } from 'lucide-react'
import NextLink from 'next/link'
import { forwardRef } from 'react'
import { navOpenAtom } from './atoms'
import { ChatMenuBarList } from './threads/ChatMenuBarList'

type NavBarProps = {} & React.ComponentProps<'div'>

export const NavBar = forwardRef<HTMLDivElement, NavBarProps>(function NavBar(
  { className, ...props },
  forwardedRef,
) {
  const threads = useQuery(api.threads.threads.list)

  const [isOpen, toggle] = useAtom(navOpenAtom)

  const menuTabs = [
    ['Chat', <MessagesSquareIcon key="Chat" className="size-6" />],
    ['Generate', <ImageIcon key="Generate" className="size-6" />],
  ] as const

  return (
    <div
      {...props}
      className={cn(
        'flex h-full w-14 shrink-0 flex-col border-r bg-gray-1',
        isOpen && 'w-80',
        className,
      )}
      ref={forwardedRef}
    >
      {/* site title */}
      <div className={cn('flex h-14 shrink-0 items-center justify-between border-b px-3')}>
        <NextLink href="/" className="flex h-full items-center gap-1.5">
          <Logo className="size-7 min-w-7" />
          <Heading size="5" className={cn(!isOpen && 'hidden')}>
            e/suite
          </Heading>
        </NextLink>

        <IconButton
          lucideIcon={isOpen ? PanelLeftCloseIcon : PanelLeftOpenIcon}
          variant="ghost"
          color="gray"
          className={cn('size-8', !isOpen && 'absolute -right-2/3 z-20')}
          onClick={() => toggle()}
        />
      </div>

      {/* tabs */}
      <Tabs.Root defaultValue="Chat" className="flex flex-col overflow-hidden">
        <Tabs.List className={cn('flex h-12 shrink-0 items-center border-b')}>
          {menuTabs.map((t) => {
            const [title, icon] = t
            return (
              <Tabs.Trigger
                key={title}
                value={title}
                className={cn(
                  'flex h-full w-full items-center justify-center gap-2 border-b border-b-transparent text-gray-10',
                  'hover:bg-gray-2 hover:text-gray-11 data-[state=active]:border-b-accent data-[state=active]:text-gray-12 data-[state=active]:hover:text-gray-12',
                  !isOpen && 'hidden data-[state=active]:flex',
                )}
              >
                {icon}
                {isOpen && title}
              </Tabs.Trigger>
            )
          })}
        </Tabs.List>

        {/* chat */}
        <Tabs.Content value="Chat" className="overflow-hidden">
          <ChatMenuBarList threads={threads} />
        </Tabs.Content>

        {/* generate */}
        <Tabs.Content value="Generate">generate</Tabs.Content>
      </Tabs.Root>

      <div className="flex h-fit shrink-0 grow items-end p-3">
        <UserButton />
      </div>
    </div>
  )
})
