'use client'

import { useAutoAnimate } from '@formkit/auto-animate/react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { ScrollArea } from '@radix-ui/themes'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { AppLogo } from '@/components/icons/AppLogo'
import { UserButtons } from '@/components/layout/UserButtons'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/Sheet'
import { AdminOnlyUi } from '@/components/util/AdminOnlyUi'
import { useThreads } from '@/lib/api'
import { getThreadPath } from '@/lib/helpers'
import { cn } from '@/lib/utils'

const ThreadIcon = ({ type = '' }: { type?: string }) => {
  switch (type) {
    case 'chat':
      return <Icons.Chat size={20} className="text-accentA-11" />
    case 'textToImage':
      return <Icons.Images size={20} className="text-accentA-11" />
    default:
      return <Icons.NotePencil size={20} className="text-accentA-11" />
  }
}

export const NavRail = () => {
  return (
    <div className={cn('z-10 hidden w-11 shrink-0 md:block')}>
      <Nav />
    </div>
  )
}

const Nav = ({ className }: { className?: string }) => {
  const threads = useThreads()
  const pathname = usePathname()
  const [containerRef] = useAutoAnimate()

  return (
    <div
      className={cn(
        'group flex h-full w-11 flex-col items-start gap-1 overflow-hidden rounded-md border border-gray-5 bg-gray-1 transition-all hover:w-64',
        className,
      )}
    >
      <Link
        href="/"
        aria-label="Go to home page"
        className="mb-0.5 grid h-10 min-w-40 shrink-0 grid-cols-[2.75rem_auto]"
      >
        <div className="flex-col-center">
          <AppLogo className="size-6 text-accent-11" />
        </div>

        <div className="flex items-center text-xl font-semibold leading-none tracking-tight">
          e<span className="text-lg leading-none">⋆</span>suite
        </div>
      </Link>

      <Link
        href={'/chat/new'}
        aria-current={pathname === '/chat/new' ? 'page' : undefined}
        className="mx-1 grid h-12 w-full min-w-56 grid-cols-[2.75rem_auto] items-center rounded font-medium opacity-90 transition-all hover:bg-grayA-2 aria-[current=page]:opacity-100 group-hover:aria-[current=page]:bg-grayA-3 [&>svg]:-translate-x-1 [&>svg]:place-self-center"
      >
        <Icons.NotePencil size={20} className="text-accentA-11" />
        <div className="line-clamp-2 select-none overflow-hidden text-sm">New</div>
      </Link>

      <Link
        href={'/images'}
        aria-current={pathname === '/images' ? 'page' : undefined}
        className="mx-1 grid h-12 w-full min-w-56 grid-cols-[2.75rem_auto] items-center rounded font-medium opacity-90 transition-all hover:bg-grayA-2 aria-[current=page]:opacity-100 group-hover:aria-[current=page]:bg-grayA-3 [&>svg]:-translate-x-1 [&>svg]:place-self-center"
      >
        <Icons.Images size={20} className="text-accentA-11" />
        <div className="line-clamp-2 select-none overflow-hidden text-sm">Generate</div>
      </Link>

      <ScrollArea scrollbars="vertical">
        <div ref={containerRef} className="flex flex-col px-1">
          {threads
            ?.filter((thread) => thread.slug !== 'new')
            .map((thread) => (
              <Link
                key={thread._id}
                href={getThreadPath({ slug: thread.slug, type: thread.latestRunConfig?.type })}
                aria-current={
                  pathname ===
                  getThreadPath({ slug: thread.slug, type: thread.latestRunConfig?.type })
                    ? 'page'
                    : undefined
                }
                className="grid h-12 min-w-56 grid-cols-[2.75rem_auto] items-center rounded font-medium opacity-90 transition-all hover:bg-grayA-2 aria-[current=page]:opacity-100 group-hover:aria-[current=page]:bg-grayA-3 [&>svg]:-translate-x-1 [&>svg]:place-self-center"
              >
                <ThreadIcon type={thread.latestRunConfig?.type} />

                <div className="line-clamp-2 select-none overflow-hidden text-sm">
                  {thread.title ?? 'Untitled'}
                </div>
              </Link>
            ))}
        </div>
      </ScrollArea>

      <div className="grow" />

      <div className="flex-col-center h-10 w-11 shrink-0 border-b border-gray-3">
        <UserButtons />{' '}
        <AdminOnlyUi>
          <Link href="/admin" className="text-xs text-gray-10 hover:text-gray-12">
            Admin
          </Link>
        </AdminOnlyUi>
      </div>
    </div>
  )
}

export const NavSheet = ({ children }: { children: React.ReactNode }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="left" aria-describedby={undefined} className="w-64 p-1">
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <Nav className="w-full border-none hover:w-full" />
      </SheetContent>
    </Sheet>
  )
}
