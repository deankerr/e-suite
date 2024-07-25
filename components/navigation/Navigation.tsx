'use client'

import { Heading } from '@radix-ui/themes'
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
        <div className="flex h-14 w-full shrink-0 items-center justify-center px-3">
          <Link href={appConfig.baseUrl} className="-ml-4 flex items-center gap-2">
            <LogoSvg className="-mb-0.5 w-6 text-accent-11" />
            <Heading size="5">e/suite</Heading>
          </Link>
        </div>

        <Authenticated>
          <div className="flex shrink-0 flex-col items-center gap-1.5 px-2 pb-3 pt-1">
            <button
              className="w-full max-w-44 rounded-md border border-grayA-3 bg-grayA-3 py-1.5 text-base font-medium text-gray-12 hover:bg-grayA-4"
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
