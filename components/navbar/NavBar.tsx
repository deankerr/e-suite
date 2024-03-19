'use client'

import { Logo } from '@/app/components/ui/Logo'
import { cn } from '@/lib/utils'
import * as Tabs from '@radix-ui/react-tabs'
import { Heading } from '@radix-ui/themes'
import { useAtom } from 'jotai'
import { ImageIcon, MessagesSquareIcon, PanelLeftCloseIcon, PinIcon } from 'lucide-react'
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
      className={cn('h-full w-16 shrink-0', navbarIsOpen ? 'w-80' : 'w-14', className)}
      ref={forwardedRef}
    >
      <div
        className={cn(
          '@container z-10 flex h-full w-80 shrink-0 flex-col border-r bg-gray-1',
          !navbarIsOpen && 'w-14 has-[:hover]:absolute has-[:hover]:w-80',
          className,
        )}
      >
        {/* site title */}
        <div className={cn('flex-between h-14 shrink-0 border-b px-3.5')}>
          <NextLink href="/" className="flex h-full items-center gap-1.5">
            <Logo className="size-7 min-w-7" />
            <Heading size="5" className="@2xs:block hidden">
              e/suite
            </Heading>
          </NextLink>

          <UIIconButton
            label="collapse navigation bar"
            color="gray"
            className="@2xs:flex hidden"
            onClick={() => setNavbarOpen(!navbarIsOpen)}
          >
            {navbarIsOpen ? <PanelLeftCloseIcon /> : <PinIcon className="size-5" />}
          </UIIconButton>
        </div>

        {/* tabs */}
        <Tabs.Root defaultValue="Chat" className="flex grow flex-col overflow-hidden">
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
                    '@2xs:flex hidden data-[state=active]:flex',
                  )}
                >
                  {icon}
                  <span className="@2xs:inline hidden">{title}</span>
                </Tabs.Trigger>
              )
            })}
          </Tabs.List>

          {/* chat */}
          <Tabs.Content value="Chat" asChild>
            {chatList}
          </Tabs.Content>

          {/* generate */}
          <Tabs.Content value="Generate" asChild>
            <div className="flex-col-center h-full text-gray-9">implement me</div>
          </Tabs.Content>
        </Tabs.Root>

        <div className="flex h-16 shrink-0 items-center justify-center border-t p-3">
          {children}
        </div>
      </div>
    </div>
  )
})
