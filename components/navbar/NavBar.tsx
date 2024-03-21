'use client'

import { Logo } from '@/app/components/ui/Logo'
import { cn } from '@/lib/utils'
import * as Tabs from '@radix-ui/react-tabs'
import { Heading } from '@radix-ui/themes'
import { useAtom } from 'jotai'
import { ImageIcon, MessagesSquareIcon, PanelLeftCloseIcon, PinIcon, XIcon } from 'lucide-react'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import { forwardRef, useEffect } from 'react'
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

  const pathname = usePathname()
  useEffect(() => {
    setNavbarOpen(false)
  }, [pathname, setNavbarOpen])

  const menuTabs = [
    ['Chat', <MessagesSquareIcon key="Chat" className="size-6" />],
    ['Generate', <ImageIcon key="Generate" className="size-6" />],
  ] as const

  return (
    <div
      {...props}
      className={cn(
        'h-full w-0 shrink-0 sm:block',
        navbarIsOpen ? 'sm:w-80' : 'sm:w-14',
        className,
      )}
      ref={forwardedRef}
    >
      <div
        className={cn(
          'z-10 hidden h-full w-screen shrink-0 flex-col overflow-hidden border-r bg-gray-1 @container sm:flex',
          navbarIsOpen ? 'flex sm:w-80' : 'w-14 has-[:hover]:absolute has-[:hover]:w-80',
          className,
        )}
      >
        {/* site title */}
        <div className={cn('flex-between h-14 shrink-0 border-b px-3.5')}>
          <NextLink
            href="/"
            className="flex h-full items-center gap-1.5"
            onClick={() => setNavbarOpen(false)}
          >
            <Logo className="size-7 min-w-7" />
            <Heading size="5" className="hidden @2xs:block">
              e/suite
            </Heading>
          </NextLink>

          <UIIconButton
            label="collapse navigation bar"
            className="hidden @2xs:flex"
            onClick={() => setNavbarOpen(!navbarIsOpen)}
          >
            {navbarIsOpen ? (
              <>
                <PanelLeftCloseIcon className="hidden sm:flex" />
                <XIcon className="sm:hidden" />
              </>
            ) : (
              <PinIcon className="size-5" />
            )}
          </UIIconButton>
        </div>

        {/* tabs */}
        <Tabs.Root
          defaultValue="Chat"
          className="flex max-h-[calc(100%-3.5rem-4rem)] grow flex-col overflow-hidden @container"
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
            {chatList}
          </Tabs.Content>

          {/* generate */}
          <Tabs.Content value="Generate" asChild>
            <div className="@2xs:flex-col-center hidden h-full text-gray-9">
              check back here later :)
            </div>
          </Tabs.Content>
        </Tabs.Root>

        <div className="flex h-16 shrink-0 items-center justify-center border-t p-3 @container">
          {children}
        </div>
      </div>
    </div>
  )
})
