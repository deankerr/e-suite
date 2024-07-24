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
        <div className="flex shrink-0 items-center justify-center border-b border-transparent px-1.5 pb-1 pt-5">
          <Link href={appConfig.baseUrl} className="-ml-1.5 flex items-center gap-2">
            <LogoSvg className="w-6 text-accent-11" />
            <Heading size="5">e/suite</Heading>
          </Link>
        </div>

        <Authenticated>
          {/* * create * */}
          <div className="flex shrink-0 flex-col gap-1.5 py-4">
            <div className="shrink-0 border-b border-grayA-5 px-3 text-sm font-semibold text-gray-11">
              Create
            </div>

            <div className="grid grid-cols-2 gap-4 px-2">
              <Button
                color="orange"
                variant="ghost"
                size="3"
                className="m-0 py-2"
                onClick={() => shell.createChat()}
              >
                <Icons.Chats className="phosphor -ml-1 shrink-0" />
                Chat
              </Button>
              <Button
                color="orange"
                variant="ghost"
                size="3"
                className="m-0 py-2"
                onClick={() => shell.createImage()}
              >
                <Icons.ImagesSquare className="phosphor -ml-1 shrink-0" />
                Images
              </Button>
            </div>
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
