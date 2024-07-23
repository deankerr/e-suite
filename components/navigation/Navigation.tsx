'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Button } from '@radix-ui/themes'
import Link from 'next/link'

import { UserButtons } from '@/components/layout/UserButtons'
import { ChatNavList } from '@/components/navigation/ChatNavList'
import { useShellActions } from '@/components/shell/hooks'
import { AppLogoName } from '@/components/ui/AppLogoName'
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
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-transparent px-1.5 pl-2.5">
          <Link href={appConfig.baseUrl}>
            <AppLogoName />
          </Link>
        </div>

        {/* * create * */}
        <div className="divide-y divide-grayA-3 py-2">
          <div className="px-3 text-sm font-semibold text-gray-10">Create</div>
          <div className="grid grid-cols-2 gap-2 px-2 py-1.5">
            <Button
              variant="soft"
              size="2"
              onClick={() => {
                shell.createChat()
              }}
              className="grow"
            >
              <Icons.Chats className="phosphor" />
              Chat
            </Button>
            <Button
              variant="soft"
              size="2"
              onClick={() => {
                shell.createImage()
              }}
              className="grow"
            >
              <Icons.ImagesSquare className="phosphor" />
              Images
            </Button>
          </div>
        </div>

        {/* * chats * */}
        <ChatNavList />

        {/* * footer * */}
        <div className="flex-center h-12 shrink-0 gap-2 px-3">
          <UserButtons />
        </div>
      </nav>
    </div>
  )
}
