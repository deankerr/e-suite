import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Button, IconButton } from '@radix-ui/themes'

import { ChatNavList } from '@/app/dev/lo36/_components/ChatNavList'
import { UserButtons } from '@/components/layout/UserButtons'
import { Logo } from '@/components/ui/Logo'
import { cn } from '@/lib/utils'

export const metadata = {
  title: 'LO36',
}

export default function Lo36Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-svh">
      {/* * main side nav * */}
      <div
        className={cn(
          'fixed flex h-full w-56 shrink-0 flex-col overflow-hidden bg-gray-2',
          'hidden sm:flex',
        )}
      >
        {/* * logotype / menu button * */}
        <div className="flex h-11 shrink-0 items-center justify-between px-2.5 py-1">
          <div className="flex items-center gap-0.5 text-lg font-semibold tracking-tight">
            <Logo className="size-6 translate-y-[0.05rem]" />
            e/suite
          </div>

          <IconButton variant="ghost" size="1" className="shrink-0">
            <Icons.List className="size-6" />
          </IconButton>
        </div>

        {/* * main nav * */}
        <div className="flex grow flex-col gap-2 overflow-hidden">
          <div className="flex justify-center py-2">
            <Button variant="surface">
              <Icons.Feather weight="light" className="size-6" />
              Compose
            </Button>
          </div>

          <ChatNavList />
        </div>

        {/* * footer * */}
        <div className="flex h-10 shrink-0 items-center justify-center border-t px-3">
          <UserButtons />
        </div>
      </div>

      <div className={cn('h-full w-full sm:ml-56')}>{children}</div>
    </div>
  )
}
