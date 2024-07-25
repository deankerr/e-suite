'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Button, Heading } from '@radix-ui/themes'
import { Authenticated } from 'convex/react'
import Link from 'next/link'

import { UserButtons } from '@/components/layout/UserButtons'
import { ChatNavList } from '@/components/navigation/ChatNavList'
import { useShellActions } from '@/components/shell/hooks'
import { LogoSvg } from '@/components/ui/LogoSvg'
import { appConfig } from '@/config/config'
import { cn } from '@/lib/utils'

export const Navigation = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const shell = useShellActions()

  return (
    <div
      {...props}
      className={cn('fixed inset-y-0 hidden w-60 md:block md:py-1.5 md:pr-1.5', className)}
    >
      <nav className="flex h-full flex-col rounded-md border border-gray-5 bg-gray-1">
        {/* * logo / menu button * */}
        <div className="flex h-14 shrink-0 px-3">
          <Link href={appConfig.baseUrl} className="my-auto flex items-center gap-1.5">
            <LogoSvg className="-mb-0.5 w-[1.7rem] text-accent-11" />
            <Heading size="5">e/suite</Heading>
          </Link>
        </div>

        <Authenticated>
          {/* * create * */}
          <div className="flex shrink-0 flex-col items-center gap-1.5 px-2 py-2">
            <button
              className="w-full rounded-lg border border-grayA-3 bg-grayA-3 px-4 py-2 text-base font-semibold text-gray-12 hover:bg-grayA-4"
              onClick={() => shell.open()}
            >
              Command
            </button>
          </div>

          {/* * chats * */}
          <ChatNavList />
        </Authenticated>

        <div className="grow" />
        {/* * footer * */}
        <div className="flex-center h-12 shrink-0 gap-2 border-t border-grayA-3 px-3">
          <UserButtons />
        </div>
      </nav>
    </div>
  )
}
