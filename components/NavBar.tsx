'use client'

import { Logo } from '@/app/components/ui/Logo'
import { RailUserButton } from '@/app/components/UserButton'
import { cn } from '@/lib/utils'
import { ImageIcon, MessagesSquareIcon } from 'lucide-react'
import NextLink from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import { forwardRef } from 'react'

type NavBarProps = {} & React.ComponentProps<'div'>

export const NavBar = forwardRef<HTMLDivElement, NavBarProps>(function NavBar(
  { className, ...props },
  forwardedRef,
) {
  const segment = useSelectedLayoutSegment()

  return (
    <div
      {...props}
      className={cn('grid grid-cols-3 items-center justify-between border-b bg-gray-1', className)}
      ref={forwardedRef}
    >
      <div>
        <NextLink
          href="/"
          className="flex h-full w-fit items-center gap-1 pl-2 text-xl font-medium tracking-tighter"
        >
          <Logo className="size-7" />
          e/suite
        </NextLink>
      </div>

      <div className="flex justify-center gap-2">
        <NavLink href="/thread" isActive={segment === 'thread'}>
          <MessagesSquareIcon className="size-5" /> Chat
        </NavLink>
        <NavLink href="/generations" isActive={segment === 'generations'}>
          <ImageIcon className="size-5" /> Generate
        </NavLink>
      </div>

      <div className="flex justify-end pr-2">
        <RailUserButton />
      </div>
    </div>
  )
})

type NavLinkProps = { isActive: boolean; href: string } & Partial<
  React.ComponentProps<typeof NextLink>
>

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(function NavLink(
  { isActive, href, children, className, ...props },
  forwardedRef,
) {
  return (
    <NextLink
      {...props}
      href={href}
      className={cn(
        'flex min-w-24 items-center justify-center gap-1.5 rounded border bg-gray-2 px-3 py-1 font-medium tracking-tight text-gray-10',
        isActive ? 'bg-gray-3 text-accent-11' : 'hover:bg-gray-2 hover:text-gray-11',
        className,
      )}
      ref={forwardedRef}
    >
      {children}
    </NextLink>
  )
})
