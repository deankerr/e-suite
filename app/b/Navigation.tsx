'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Button } from '@radix-ui/themes'
import { useSetAtom } from 'jotai'
import Link from 'next/link'

import { ChatNavList } from '@/app/b/_components/ChatNavList'
import { appConfig } from '@/app/b/config'
import { shellOpenAtom, shellStackAtom } from '@/components/command-shell/atoms'
import { UserButtons } from '@/components/layout/UserButtons'
import { AppLogoName } from '@/components/ui/AppLogoName'
import { cn } from '@/lib/utils'

export const Navigation = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const setShellOpen = useSetAtom(shellOpenAtom)
  const setShellStack = useSetAtom(shellStackAtom)

  return (
    <div {...props} className={cn('fixed inset-y-0 hidden w-60 md:block md:p-1.5', className)}>
      <nav className="flex h-full flex-col rounded-md border border-gray-5 bg-gray-1">
        {/* * logo / menu button * */}
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-transparent px-1.5 pl-2.5">
          <Link href={appConfig.baseUrl}>
            <AppLogoName />
          </Link>
        </div>

        {/* * compose * */}
        <div className="flex shrink-0 flex-col gap-2 px-2 py-3">
          <Button
            variant="soft"
            color="gray"
            size="2"
            onClick={() => {
              setShellStack(['ThreadComposer'])
              setShellOpen(true)
            }}
          >
            <Icons.Chats className="phosphor -ml-3" />
            New Chat
          </Button>
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
