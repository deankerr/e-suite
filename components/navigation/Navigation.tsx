'use client'

import { Authenticated } from 'convex/react'
import { useAtom } from 'jotai'
import Link from 'next/link'

import { sidebarOpenAtom } from '@/components/layout/atoms'
import { SidebarButton } from '@/components/layout/SidebarButton'
import { UserButtons } from '@/components/layout/UserButtons'
import { ThreadsList } from '@/components/navigation/ThreadsList'
import { useShellActions } from '@/components/shell/hooks'
import { AppTitle } from '@/components/ui/AppTitle'
import { appConfig } from '@/config/config'
import { cn } from '@/lib/utils'

export const Navigation = () => {
  const shell = useShellActions()
  const [isSidebarOpen, toggleSidebar] = useAtom(sidebarOpenAtom)

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-overlay md:hidden"
          onClick={() => toggleSidebar(false)}
        />
      )}

      <nav
        className={cn(
          'flex w-60 shrink-0 flex-col rounded-md border border-gray-5 bg-gray-1',
          'fixed left-1.5 top-1.5 z-10 h-[calc(100dvh-0.75rem)] transition-transform',
          isSidebarOpen
            ? '-translate-x-0'
            : 'pointer-events-none -translate-x-[calc(100%+1.5rem)] md:pointer-events-auto md:-translate-x-0',
          'md:static md:z-auto',
        )}
      >
        {/* * logo / menu button * */}
        <div className="flex-between h-12 w-full shrink-0 px-3">
          <Link href={appConfig.baseUrl}>
            <AppTitle />
          </Link>

          <SidebarButton />
        </div>

        <div className="flex shrink-0 flex-col items-center gap-1.5 px-2 pb-3 pt-1">
          <Authenticated>
            <button
              className="w-full max-w-40 rounded-md border border-grayA-3 bg-grayA-3 py-1 text-base font-medium text-gray-12 hover:bg-grayA-4"
              onClick={() => shell.open()}
            >
              Command
            </button>
          </Authenticated>
        </div>

        {/* * threads * */}
        <ThreadsList />

        <div className="grow" />
        {/* * footer * */}
        <div className="flex-center h-12 shrink-0 gap-2 border-t border-grayA-3 px-3">
          <UserButtons />
        </div>
      </nav>
    </>
  )
}
