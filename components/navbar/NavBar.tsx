'use client'

import { Logo } from '@/app/components/ui/Logo'
import { cn } from '@/lib/utils'
import * as Tabs from '@radix-ui/react-tabs'
import { Heading } from '@radix-ui/themes'
import { useAtom } from 'jotai'
import { ImageIcon, MessagesSquareIcon, PanelLeftCloseIcon } from 'lucide-react'
import NextLink from 'next/link'
import { forwardRef } from 'react'
import { navbarOpenAtom } from '../atoms'
import { UIIconButton } from '../ui/UIIconButton'

type NavBarProps = {
  chatList?: JSX.Element
} & React.ComponentProps<'div'>

export const NavBar = forwardRef<HTMLDivElement, NavBarProps>(function NavBar(
  { className, chatList, children, ...props },
  forwardedRef,
) {
  const [navbarIsOpen, setNavbarOpen] = useAtom(navbarOpenAtom)

  const menuTabs = [
    ['Chat', <MessagesSquareIcon key="Chat" className="size-6" />],
    ['Generate', <ImageIcon key="Generate" className="size-6" />],
  ] as const

  return (
    <div
      {...props}
      className={cn(
        'flex h-full shrink-0 flex-col border-r bg-gray-1',
        navbarIsOpen ? 'w-80' : 'w-14',
        className,
      )}
      ref={forwardedRef}
    >
      {/* site title */}
      <div className={cn('h-14 shrink-0 border-b')}>
        <div
          className={cn(
            'flex h-full items-center',
            navbarIsOpen ? 'justify-between px-3' : 'justify-center',
          )}
        >
          <NextLink href="/" className="flex h-full items-center gap-1.5">
            <Logo className="size-7 min-w-7" />
            <Heading size="5" className={cn(!navbarIsOpen && 'hidden')}>
              e/suite
            </Heading>
          </NextLink>

          {navbarIsOpen && (
            <UIIconButton
              label="collapse navigation bar"
              color="gray"
              onClick={() => setNavbarOpen(!navbarIsOpen)}
            >
              <PanelLeftCloseIcon />
            </UIIconButton>
          )}
        </div>
      </div>

      {/* tabs */}
      <Tabs.Root defaultValue="Chat" className="flex grow flex-col overflow-hidden">
        <Tabs.List className={cn('flex h-12 shrink-0 items-center border-b')}>
          {menuTabs.map((t) => {
            const [title, icon] = t
            return (
              <Tabs.Trigger
                key={title}
                value={title}
                className={cn(
                  'flex h-full w-full items-center justify-center gap-2 border-b-2 border-b-transparent text-gray-10',
                  'hover:bg-gray-2 hover:text-gray-11 data-[state=active]:border-b-accent data-[state=active]:text-gray-12 data-[state=active]:hover:text-gray-12',
                  !navbarIsOpen && 'hidden data-[state=active]:flex',
                )}
              >
                {icon}
                {navbarIsOpen && title}
              </Tabs.Trigger>
            )
          })}
        </Tabs.List>

        {/* chat */}
        <Tabs.Content value="Chat" asChild>
          {chatList}
        </Tabs.Content>

        {/* generate */}
        <Tabs.Content value="Generate" className="grid grow place-content-center">
          <div className="text-gray-8">implement me</div>
        </Tabs.Content>
      </Tabs.Root>

      <div className="flex h-14 shrink-0 items-center justify-center border-t p-3">{children}</div>
    </div>
  )
})
